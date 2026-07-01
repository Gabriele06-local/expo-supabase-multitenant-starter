import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.0";
import { handleCors, errorResponse, successResponse } from "../_shared/cors.ts";

interface InvitePayload {
  organization_id: string;
  email: string;
  role: "owner" | "admin" | "staff" | "customer";
  location_id?: string;
}

Deno.serve(async (req: Request) => {
  const cors = handleCors(req);
  if (cors) return cors;

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return errorResponse("Missing Authorization header", 401);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) return errorResponse("Unauthorized", 401);

    const payload: InvitePayload = await req.json();

    if (!payload.organization_id || !payload.email || !payload.role) {
      return errorResponse("Missing required fields: organization_id, email, role");
    }

    // Verify caller has owner/admin role in the org (bypass RLS with service role)
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: membership } = await serviceClient
      .from("memberships")
      .select("role")
      .eq("user_id", user.id)
      .eq("organization_id", payload.organization_id)
      .is("location_id", null)
      .single();

    if (!membership || (membership.role !== "owner" && membership.role !== "admin")) {
      return errorResponse("Only owners and admins can invite users", 403);
    }

    // Generate invite token
    const token = crypto.randomUUID();

    const { data: invite, error: insertError } = await serviceClient
      .from("invites")
      .insert({
        organization_id: payload.organization_id,
        location_id: payload.location_id ?? null,
        email: payload.email,
        role: payload.role,
        invited_by: user.id,
        token,
      })
      .select()
      .single();

    if (insertError) {
      return errorResponse(`Failed to create invite: ${insertError.message}`, 500);
    }

    return successResponse({
      invite_id: invite.id,
      token: invite.token,
      message: "Invite created successfully",
    }, 201);
  } catch (err) {
    return errorResponse(`Internal error: ${err.message}`, 500);
  }
});
