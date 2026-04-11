import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables.");
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Validate caller
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error("No Authorization header provided.");

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      console.error("User Validation Error:", userError);
      throw new Error("Invalid or expired session. Please log in again.");
    }

    console.log(`User ${user.id} initiated account deactivation.`);

    // Helper to scramble a user's password
    const scrambleUserPassword = async (uid: string) => {
      const randomPassword = crypto.randomUUID() + crypto.randomUUID(); // Extran long random string
      const { error } = await supabaseAdmin.auth.admin.updateUserById(uid, { password: randomPassword });
      if (error) {
        console.error(`Failed to scramble password for ${uid}`, error);
      }
    };

    // 1. Get all members belonging to this user
    const { data: members, error: fetchError } = await supabaseAdmin
      .from('team_members')
      .select('auth_user_id')
      .eq('owner_id', user.id);

    if (fetchError) {
      console.error("Error fetching team members:", fetchError);
      throw new Error("Failed to retrieve team members for deactivation.");
    }

    // 2. Scramble all invited members' passwords
    if (members && members.length > 0) {
      for (const member of members) {
        if (member.auth_user_id) {
          await scrambleUserPassword(member.auth_user_id);
        }
      }
    }

    // 3. Scramble the owner's own password
    await scrambleUserPassword(user.id);

    // Note: To be extremely thorough, you would normally call supabaseAdmin.auth.admin.signOut(uid) here
    // But changing the password automatically invalidates their active refresh tokens. 
    // The frontend should call signOut() locally to destroy the frontend session.

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Account deactivated safely." 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Function Execution Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
