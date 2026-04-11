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

    console.log(`User ${user.id} initiated full account deletion.`);

    // 1. Get all members belonging to this user
    // (If the caller is an invited guest, they won't have rows where owner_id = their id, so this does nothing to other teams)
    const { data: members, error: fetchError } = await supabaseAdmin
      .from('team_members')
      .select('auth_user_id')
      .eq('owner_id', user.id);

    if (fetchError) {
      console.error("Error fetching team members:", fetchError);
      throw new Error("Failed to retrieve team members for deletion.");
    }

    // 2. Erase all invited members from auth.users
    let membersDeleted = 0;
    if (members && members.length > 0) {
      for (const member of members) {
        if (member.auth_user_id) {
          const { error: delError } = await supabaseAdmin.auth.admin.deleteUser(member.auth_user_id);
          if (delError) {
            console.error(`Failed to delete member ${member.auth_user_id}:`, delError);
          } else {
            membersDeleted++;
          }
        }
      }
    }

    // 3. Delete the owner's own auth account
    // This will trigger ON DELETE CASCADE for profiles, team_members, etc.
    const { error: selfDeleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
    if (selfDeleteError) {
      throw selfDeleteError;
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Account completely deleted.",
      membersDeleted
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
