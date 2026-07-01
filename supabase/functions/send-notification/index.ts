import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.0";
import { handleCors, errorResponse, successResponse } from "../_shared/cors.ts";

interface NotificationPayload {
  type: "email" | "push";
  to: string;
  subject?: string;
  body: string;
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
    } = await supabase.auth.getUser();
    if (!user) return errorResponse("Unauthorized", 401);

    const payload: NotificationPayload = await req.json();

    if (!payload.type || !payload.to || !payload.body) {
      return errorResponse("Missing required fields: type, to, body");
    }

    if (payload.type === "email") {
      const resendApiKey = Deno.env.get("RESEND_API_KEY");

      if (resendApiKey) {
        // Send real email via Resend
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "noreply@example.com",
            to: payload.to,
            subject: payload.subject ?? "Notification",
            text: payload.body,
          }),
        });

        if (!res.ok) {
          const err = await res.text();
          return errorResponse(`Email send failed: ${err}`, 500);
        }

        return successResponse({ sent: true, channel: "email", provider: "resend" });
      }

      // Fallback: log to console (useful in development)
      console.log(`[EMAIL] To: ${payload.to}, Subject: ${payload.subject}, Body: ${payload.body}`);
      return successResponse({ sent: true, channel: "email", provider: "log" });
    }

    if (payload.type === "push") {
      // Placeholder for push notification integration (e.g., Expo Push Notifications)
      console.log(`[PUSH] To: ${payload.to}, Body: ${payload.body}`);
      return successResponse({ sent: true, channel: "push", provider: "log" });
    }

    return errorResponse(`Unsupported notification type: ${payload.type}`);
  } catch (err) {
    return errorResponse(`Internal error: ${err.message}`, 500);
  }
});
