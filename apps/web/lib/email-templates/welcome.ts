import { resend } from '@/lib/resend';

interface WelcomeEmailOptions {
  to: string;
  name: string;
}

export async function sendWelcomeEmail({ to, name }: WelcomeEmailOptions) {
  const { data, error } = await resend.emails.send({
    from: process.env.NEXT_PUBLIC_APP_URL
      ? `CMP App <noreply@${process.env.NEXT_PUBLIC_APP_URL.replace('https://', '').replace('http://', '')}>`
      : 'CMP App <onboarding@resend.dev>',
    to,
    subject: 'Welcome to CMP App!',
    html: `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 16px;">Welcome to CMP App, ${name}! 🎉</h1>
        
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
          We're excited to have you on board. Start exploring our platform to earn rewards, discover music, and shop from amazing stores.
        </p>
        
        <div style="margin: 24px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" 
             style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600;">
            Go to Dashboard
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e5e5;">
          If you have any questions, feel free to reach out to our support team.
        </p>
        
        <p style="color: #999; font-size: 12px; margin-top: 16px;">
          Best regards,<br />
          The CMP App Team
        </p>
      </div>
    `,
  });

  if (error) {
    throw error;
  }

  return data;
}