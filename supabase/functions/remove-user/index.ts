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

    const { memberId } = await req.json();

    if (!memberId) {
      throw new Error("Parameters missing: memberId.");
    }

    // 1. Verify the member row exists and belongs to this owner
    // We only allow the owner themselves to remove a member
    const { data: memberRows, error: fetchError } = await supabaseAdmin
      .from('team_members')
      .select('owner_id, auth_user_id')
      .eq('id', memberId);

    if (fetchError || !memberRows || memberRows.length === 0) {
      console.error("Fetch Member Error:", fetchError);
      throw new Error("Member not found or database error.");
    }

    const member = memberRows[0];
    
    if (member.owner_id !== user.id) {
      throw new Error("Unauthorized to remove this member.");
    }

    console.log(`Owner ${user.id} removing member ${memberId}...`);

    let deleteAuthUserError = null;
    
    // 2. Delete the user from Supabase Auth completely (if they have an auth_user_id)
    if (member.auth_user_id) {
        console.log(`Deleting Auth user ${member.auth_user_id}...`);
        const { error } = await supabaseAdmin.auth.admin.deleteUser(member.auth_user_id);
        if (error) {
            console.error("Failed to delete from Auth (ignoring if they were already deleted):", error);
            deleteAuthUserError = error;
        }
    }

    // 3. Delete the row from team_members (ON DELETE CASCADE might have handled it, but let's be safe)
    const { error: deleteRowError } = await supabaseAdmin
      .from('team_members')
      .delete()
      .eq('id', memberId);

    if (deleteRowError) {
      console.error("Failed to delete team_members row:", deleteRowError);
      throw deleteRowError;
    }

    return new Response(JSON.stringify({ success: true, warning: deleteAuthUserError?.message }), {
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
