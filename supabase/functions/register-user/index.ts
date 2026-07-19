import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const EMAIL_RE = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

/** Escape HTML special chars to prevent XSS in email body */
function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/** All responses use 200 so supabase.functions.invoke() always delivers data to the caller */
const jsonResponse = (body: Record<string, any>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const appUrl = (Deno.env.get("APP_URL") || "https://cmpapp.ng").replace(/\/+$/, "");

    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return jsonResponse({ error: "Email service not configured" });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const resend = new Resend(resendApiKey);
    const body = await req.json();

    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const fullName = typeof body.fullName === "string" ? body.fullName.trim().slice(0, 100) : "";
    const referralCode = typeof body.referralCode === "string" ? body.referralCode.trim().slice(0, 20) : null;

    // Validate inputs
    if (!email || email.length > 255 || !EMAIL_RE.test(email)) {
      return jsonResponse({ error: "Invalid email address" });
    }

    if (!fullName || fullName.length < 2) {
      return jsonResponse({ error: "Please enter your full name (at least 2 characters)" });
    }

    // Check existing user in auth.users using helper RPC (source of truth for registered emails)
    const { data: emailExists, error: rpcError } = await supabase.rpc("check_email_exists", {
      email_to_check: email,
    });
    if (rpcError) {
      console.error("RPC check_email_exists error:", rpcError);
      return jsonResponse({ error: "Database error. Please try again." });
    }
    if (emailExists) {
      return jsonResponse({ error: "An account with this email already exists. Please sign in." });
    }

    // Generate verification credentials (cryptographically secure RNG)
    const randBuf = new Uint32Array(1);
    crypto.getRandomValues(randBuf);
    const verificationCode = String(100000 + (randBuf[0] % 900000));
    const verificationToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Upsert pending registration (delete old if exists, then insert fresh)
    await supabase.from("pending_registrations").delete().eq("email", email);

    const { error: insertError } = await supabase.from("pending_registrations").insert({
      email,
      full_name: fullName,
      verification_code: verificationCode,
      verification_token: verificationToken,
      referral_code: referralCode || null,
      expires_at: expiresAt.toISOString(),
    });

    if (insertError) {
      console.error("DB insert error:", insertError);
      return jsonResponse({ error: "Failed to create registration. Please try again." });
    }

    // Build and send verification email — escape fullName to prevent HTML injection
    const safeFullName = escapeHtml(fullName);
    const verificationLink = `${appUrl}/verify?token=${verificationToken}`;
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px;">
            <h1 style="color: #B8860B; text-align: center;">Verify your email</h1>
            <p style="font-size: 16px; color: #333333;">Hi ${safeFullName},</p>
            <p style="font-size: 16px; color: #333333;">Your verification code is:</p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="font-size: 36px; font-weight: bold; color: #B8860B; letter-spacing: 8px; padding: 20px; background-color: #f9f9f9; border-radius: 8px; display: inline-block;">${verificationCode}</span>
            </div>
            <p style="font-size: 16px; color: #333333; text-align: center;">Or click the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationLink}" style="display: inline-block; padding: 14px 40px; background-color: #B8860B; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold;">Verify Email &#8594;</a>
            </div>
            <p style="font-size: 14px; color: #666666; border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 30px;">This code expires in 24 hours. If you didn't request this, you can safely ignore this email.</p>
            <p style="font-size: 14px; color: #999999; margin: 0;">&copy; CMPapp. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;

    try {
      const { data: emailData, error: emailError } = await resend.emails.send({
        from: "CMPapp <noreply@cmpapp.ng>",
        to: [email],
        subject: "Verify your CMPapp account",
        html: emailHtml,
      });

      if (emailError) {
        console.error("Resend error:", emailError);
        return jsonResponse({ error: "Failed to send verification email. Please try again." });
      }
      console.log("Verification email sent:", emailData?.id);
    } catch (emailError) {
      console.error("Email send exception:", emailError);
      return jsonResponse({ error: "Failed to send verification email. Please try again." });
    }

    return jsonResponse({
      success: true,
      message: "Verification email sent",
      email,
    });
  } catch (err: any) {
    console.error("register-user error:", err);
    const msg = err?.message || err?.toString() || "Unknown error";
    return jsonResponse({ error: "Internal server error: " + msg });
  }
};

serve(handler);