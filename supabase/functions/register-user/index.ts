import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

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
      console.error("RESEND_API_KEY not configured");
      return new Response(JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const resend = new Resend(resendApiKey);
    const body = await req.json();

    console.log("Received registration request:", JSON.stringify({ email: body.email, fullName: body.fullName }));

    const email = typeof body.email === "string" ? body.email.trim() : "";
    const fullName = typeof body.fullName === "string" ? sanitizeString(body.fullName) : "";
    const referralCode = typeof body.referralCode === "string" ? body.referralCode.trim().slice(0, 20) : null;

    if (!email || email.length > 255 || !EMAIL_RE.test(email)) {
      console.error("Invalid email:", email);
      return new Response(JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (!fullName || fullName.length < 2 || fullName.length > 100 || !NAME_RE.test(fullName)) {
      console.error("Invalid name:", fullName);
      return new Response(JSON.stringify({ error: "Invalid name" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { data: existingProfile, error: existingError } = await supabase
      .from("users").select("id").eq("email", email.toLowerCase()).maybeSingle();

    if (existingError) {
      console.error("Error checking existing user:", existingError);
    }

    if (existingProfile) {
      console.log("Email already exists:", email);
      return new Response(JSON.stringify({ error: "An account with this email already exists" }),
        { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const verificationToken = crypto.randomUUID();
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    console.log("Creating pending registration:", { email, verificationCode, verificationToken });

    await supabase.from("pending_registrations").delete().eq("email", email.toLowerCase());

    const { data: insertData, error: insertError } = await supabase.from("pending_registrations").insert({
      email: email.toLowerCase(),
      full_name: fullName,
      verification_token: verificationToken,
      verification_code: verificationCode,
      referral_code: referralCode || null,
      expires_at: expiresAt.toISOString(),
    }).select();

    if (insertError) {
      console.error("Failed to create pending registration:", insertError);
      return new Response(JSON.stringify({ error: "Failed to create registration" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    console.log("Pending registration created:", insertData);

    const verificationLink = `${appUrl}/verify?token=${verificationToken}`;
    
    // Simple HTML email without React
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px;">
            <h1 style="color: #B8860B; text-align: center;">Verify your email</h1>
            <p style="font-size: 16px; color: #333333;">Hi ${fullName},</p>
            <p style="font-size: 16px; color: #333333;">Your verification code is:</p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="font-size: 36px; font-weight: bold; color: #B8860B; letter-spacing: 8px; padding: 20px; background-color: #f9f9f9; border-radius: 8px; display: inline-block;">${verificationCode}</span>
            </div>
            <p style="font-size: 16px; color: #333333; text-align: center;">Or click the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationLink}" style="display: inline-block; padding: 14px 40px; background-color: #B8860B; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold;">Verify Email →</a>
            </div>
            <p style="font-size: 14px; color: #666666; border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 30px;">This code expires in 24 hours. If you didn't request this, ignore this email.</p>
            <p style="font-size: 14px; color: #999999; margin: 0;">© CMPapp. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;

    try {
      console.log("Sending email to:", email);
      const { data: emailData, error: emailError } = await resend.emails.send({
        from: "CMPapp <onboarding@resend.dev>",
        to: [email],
        subject: "Verify your account",
        html: emailHtml,
      });

      if (emailError) {
        console.error("Resend API error:", emailError);
      } else {
        console.log("Email sent successfully:", emailData);
      }
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
    }

    console.log("Registration successful, returning response");
    return new Response(JSON.stringify({ success: true, message: "Verification email sent", email: email.toLowerCase() }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Registration error:", error);
    console.error("Error details:", JSON.stringify(error));
    return new Response(JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
};

serve(handler);