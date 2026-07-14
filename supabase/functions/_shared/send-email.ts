// Shared email sending utility with Postal + Resend fallback

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

interface EmailProvider {
  name: 'postal' | 'resend';
  success: boolean;
  error?: string;
}

/**
 * Send email via Postal with Resend as fallback
 * @returns Which provider was used and whether it succeeded
 */
export async function sendEmail(options: SendEmailOptions): Promise<EmailProvider> {
  const { to, subject, html, from = "HomeTutors <noreply@hometutors.pro>" } = options;

  const recipients = Array.isArray(to) ? to : [to];
  const postalUrl = Deno.env.get("POSTAL_URL");
  const postalApiKey = Deno.env.get("POSTAL_API_KEY");
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  const resendFromEmail = Deno.env.get("RESEND_FROM_EMAIL") || "HomeTutors <onboarding@resend.dev>";

  // Try Postal first if configured
  if (postalUrl && postalApiKey) {
    try {
      const postalResponse = await fetch(`${postalUrl}/api/v1/send`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${postalApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: recipients,
          subject,
          html_body: html,
        }),
      });

      if (postalResponse.ok) {
        console.log(`✅ Email sent via Postal to: ${recipients.join(", ")}`);
        return { name: 'postal', success: true };
      }

      const postalError = await postalResponse.text();
      console.log(`⚠️ Postal failed: ${postalError}`);
    } catch (err: any) {
      console.log(`⚠️ Postal error: ${err.message}`);
    }
  }

  // Fallback to Resend if available
  if (resendApiKey) {
    try {
      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: resendFromEmail,
          to: recipients,
          subject,
          html,
        }),
      });

      if (resendResponse.ok) {
        console.log(`✅ Email sent via Resend fallback to: ${recipients.join(", ")}`);
        return { name: 'resend', success: true };
      }

      const resendError = await resendResponse.text();
      console.log(`❌ Resend failed: ${resendError}`);
      return { name: 'resend', success: false, error: resendError };
    } catch (err: any) {
      console.log(`❌ Resend error: ${err.message}`);
      return { name: 'resend', success: false, error: err.message };
    }
  }

  // No email provider configured
  const error = "No email provider configured (POSTAL_URL + POSTAL_API_KEY or RESEND_API_KEY)";
  console.log(`❌ ${error}`);
  return { name: 'postal', success: false, error };
}