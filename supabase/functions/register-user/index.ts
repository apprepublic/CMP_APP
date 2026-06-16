import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const appUrl = (Deno.env.get("APP_URL") || "https://cmpapp.ng").replace(/\/+$/, "");

    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    const resend = new Resend(resendApiKey);
    const body = await req.json();

    const email = body.email?.trim() || "";
    const fullName = body.fullName?.trim() || "";
    const referralCode = body.referralCode?.trim().slice(0, 20) || null;

    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: "Invalid email" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (!fullName || fullName.length < 2) {
      return new Response(JSON.stringify({ error: "Invalid name" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Check existing user
    const { data: existing } = await supabase
      .from("User")
      .select("id")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    if (existing) {
      return new Response(JSON.stringify({ error: "Email already exists" }),
        { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Create pending registration
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await supabase.from("pending_registrations").delete().eq("email", email.toLowerCase());
    
    const { error: insertError } = await supabase.from("pending_registrations").insert({
      email: email.toLowerCase(),
      full_name: fullName,
      verification_code: verificationCode,
      verification_token: verificationToken,
      referral_code: referralCode,
      expires_at: expiresAt.toISOString(),
    });

    if (insertError) {
      console.error("DB insert error:", insertError);
      return new Response(JSON.stringify({ error: "Failed to create registration" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Send verification email
    const verificationLink = `${appUrl}/verify?token=${verificationToken}`;
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
            <p style="font-size: 14px; color: #666666; border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 30px;">This code expires in 24 hours.</p>
            <p style="font-size: 14px; color: #999999; margin: 0;">© CMPapp. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;

    try {
      const { data: emailData, error: emailError } = await resend.emails.send({
        from: "CMPapp <noreply@cmpapp.ng>",
        to: [email],
        subject: "Verify your account",
        html: emailHtml,
      });

      if (emailError) {
        console.error("Resend error:", emailError);
      } else {
        console.log("Email sent successfully:", emailData?.id);
      }
    } catch (emailError) {
      console.error("Email send exception:", emailError);
    }

    // Return success (don't include code in production)
    return new Response(JSON.stringify({ 
      success: true, 
      message: "Verification email sent",
      email: email.toLowerCase(),
    }), { 
      status: 200, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  } catch (err) {
    console.error("Function error:", err);
    return new Response(JSON.stringify({ error: err.message || "Server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
};

serve(handler);