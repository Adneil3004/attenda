import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables.");
    }

    // Create a Supabase client with the admin service role key to bypass RLS and invite users
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Get the request body
    const { email, name, role, ownerId } = await req.json();

    if (!email || !name || !role || !ownerId) {
      throw new Error("Missing required fields: email, name, role, or ownerId.");
    }

    console.log(`Inviting ${email} as ${role} for owner ${ownerId}...`);

    // 1. Invite the user via Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: { full_name: name },
      // Important: this will point them to your reset password component to set their password
      // The frontend base URL must be handled. For now, since it relies on the URL, we'll try to pass redirectTo from frontend or use a default.
    });

    if (authError) {
      console.error("Auth Invite Error:", authError);
      throw authError;
    }

    // 2. Insert the user into the team_members table
    const { error: insertError } = await supabaseAdmin
      .from('team_members')
      .insert({
        owner_id: ownerId, // the user who invited them
        member_email: email,
        member_name: name,
        role: role
      });

    if (insertError) {
      // If we fail to insert them into DB, maybe log it, but the invite was sent.
      // Usually, it's fine. We throw to let frontend know.
      console.error("DB Insert Error:", insertError);
      throw insertError;
    }

    return new Response(JSON.stringify({ success: true, user: authData.user }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
