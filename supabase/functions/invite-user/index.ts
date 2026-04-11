import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // CORS Handles
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing environment variables on Supabase.");
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Manual JWT verification to get better error messages
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error("No Authorization header provided.");

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      console.error("User Validation Error:", userError);
      throw new Error("Invalid or expired session. Please log in again.");
    }

    const { email, name, role, redirectTo } = await req.json();

    if (!email || !name || !role) {
      throw new Error("Parameters missing: email, name, or role.");
    }

    // Capture the owner who is initiating this request
    const ownerId = user.id;

    console.log(`Owner ${ownerId} inviting ${email} as ${role}...`);

    // 1. Send Invitation
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: { full_name: name },
      redirectTo: redirectTo,
    });

    if (authError) {
      // Common error: "Email invitations are not enabled" or invalid redirect URL
      console.error("Supabase Auth Error:", authError);
      throw authError;
    }

    // 2. Insert into DB (including the auth_user_id)
    const { error: insertError } = await supabaseAdmin
      .from('team_members')
      .insert({
        owner_id: ownerId,
        member_email: email,
        member_name: name,
        role: role,
        auth_user_id: authData.user.id
      });

    if (insertError) {
      console.error("Database Error:", insertError);
      throw insertError;
    }

    return new Response(JSON.stringify({ success: true, user: authData.user }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Function Execution Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400, // Returning 400 instead of 401 for easier debugging from client
    });
  }
});
