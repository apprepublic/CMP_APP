import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";
import React from "npm:react@18.3.1";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import { VerificationOtpEmail } from "./_templates/verification-otp.tsx";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const EMAIL_RE = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
const NAME_RE = /^[a-zA-ZÀ-ÿ\s'\-\.]+$/;

function sanitizeString(s: string): string {
  return s.replace(/[<>"'&]/g, "").trim();
}

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
      return new Response(JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const resend = new Resend(resendApiKey);
    const body = await req.json();

    const email = typeof body.email === "string" ? body.email.trim() : "";
    const fullName = typeof body.fullName === "string" ? sanitizeString(body.fullName) : "";
    const referralCode = typeof body.referralCode === "string" ? body.referralCode.trim().slice(0, 20) : null;

    if (!email || email.length > 255 || !EMAIL_RE.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (!fullName || fullName.length < 2 || fullName.length > 100 || !NAME_RE.test(fullName)) {
      return new Response(JSON.stringify({ error: "Invalid name" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { data: existingProfile } = await supabase
      .from("users").select("id").eq("email", email.toLowerCase()).maybeSingle();

    if (existingProfile) {
      return new Response(JSON.stringify({ error: "An account with this email already exists" }),
        { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const verificationToken = crypto.randomUUID();
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await supabase.from("pending_registrations").delete().eq("email", email.toLowerCase());

    const { error: insertError } = await supabase.from("pending_registrations").insert({
      email: email.toLowerCase(),
      full_name: fullName,
      verification_token: verificationToken,
      verification_code: verificationCode,
      referral_code: referralCode || null,
      expires_at: expiresAt.toISOString(),
    });

    if (insertError) {
      return new Response(JSON.stringify({ error: "Failed to create registration" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const verificationLink = `${appUrl}/verify?token=${verificationToken}`;
    try {
      const html = await renderAsync(
        React.createElement(VerificationOtpEmail, { fullName, verificationCode, verificationLink, appUrl })
      );
      await resend.emails.send({
        from: "CMPapp <onboarding@resend.dev>",
        to: [email],
        subject: "Verify your account",
        html,
      });
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
    }

    return new Response(JSON.stringify({ success: true, message: "Verification email sent", email: email.toLowerCase() }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Registration error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
};

serve(handler);