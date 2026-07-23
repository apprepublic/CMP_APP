import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const EMAIL_RE = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

const jsonResponse = (body: Record<string, any>) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const appUrl = (Deno.env.get("APP_URL") || "https://cmpapp.ng").replace(/\/+$/, "");

    if (!resendApiKey) return jsonResponse({ error: "Email service not configured" });

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const resend = new Resend(resendApiKey);
    const body = await req.json();

    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email || !EMAIL_RE.test(email)) return jsonResponse({ error: "Invalid email address" });

    // Check if email exists in auth.users
    const { data: emailExists, error: rpcError } = await supabase.rpc("check_email_exists", {
      email_to_check: email,
    });
    if (rpcError) return jsonResponse({ error: "Database error. Please try again." });

    // Always return success to prevent email enumeration
    if (!emailExists) return jsonResponse({ success: true });

    // Delete any existing unused tokens for this email
    await supabase.from("password_reset_tokens").delete().eq("email", email).is("used_at", null);

    // Create reset token
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    const { error: insertError } = await supabase.from("password_reset_tokens").insert({
      email,
      token,
      expires_at: expiresAt.toISOString(),
    });

    if (insertError) return jsonResponse({ error: "Failed to create reset token" });

    const resetLink = `${appUrl}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
    const safeEmail = escapeHtml(email);

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px;">
            <h1 style="color: #B8860B; text-align: center;">Reset your password</h1>
            <p style="font-size: 16px; color: #333333;">Hi there,</p>
            <p style="font-size: 16px; color: #333333;">We received a request to reset the password for your CMPapp account associated with <strong>${safeEmail}</strong>.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="display: inline-block; padding: 14px 40px; background-color: #B8860B; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Reset Password &#8594;</a>
            </div>
            <p style="font-size: 14px; color: #666666;">Or copy this link into your browser:</p>
            <p style="font-size: 12px; color: #999999; word-break: break-all; background: #f9f9f9; padding: 10px; border-radius: 4px;">${resetLink}</p>
            <p style="font-size: 14px; color: #666666; border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 30px;">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
            <p style="font-size: 14px; color: #999999; margin: 0;">&copy; CMPapp. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;

    try {
      const { error: emailError } = await resend.emails.send({
        from: "CMPapp <noreply@cmpapp.ng>",
        to: [email],
        subject: "Reset your CMPapp password",
        html: emailHtml,
      });
      if (emailError) return jsonResponse({ error: "Failed to send email. Please try again." });
    } catch (_emailError) {
      return jsonResponse({ error: "Failed to send email. Please try again." });
    }

    return jsonResponse({ success: true });
  } catch (err: any) {
    return jsonResponse({ error: err?.message || "Internal server error" });
  }
};

serve(handler);
