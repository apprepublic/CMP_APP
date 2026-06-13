import { resend } from '@/lib/resend';

interface PaymentConfirmationEmailOptions {
  to: string;
  name: string;
  amount: string;
  transactionId: string;
  currency: string;
}

export async function sendPaymentConfirmationEmail({
  to,
  name,
  amount,
  transactionId,
  currency,
}: PaymentConfirmationEmailOptions) {
  const { data, error } = await resend.emails.send({
    from: process.env.NEXT_PUBLIC_APP_URL
      ? `CMP App <noreply@${process.env.NEXT_PUBLIC_APP_URL.replace('https://', '').replace('http://', '')}>`
      : 'CMP App <onboarding@resend.dev>',
    to,
    subject: `Payment Confirmation - ${transactionId}`,
    html: `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 16px;">Payment Confirmed ✅</h1>
        
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
          Hi ${name}, your payment has been successfully processed.
        </p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 24px 0;">
          <table style="width: 100%;">
            <tr>
              <td style="color: #666; font-size: 14px; padding: 8px 0;">Amount:</td>
              <td style="color: #1a1a1a; font-size: 16px; font-weight: 600; text-align: right;">${amount} ${currency}</td>
            </tr>
            <tr>
              <td style="color: #666; font-size: 14px; padding: 8px 0;">Transaction ID:</td>
              <td style="color: #1a1a1a; font-size: 14px; text-align: right; font-family: monospace;">${transactionId}</td>
            </tr>
            <tr>
              <td style="color: #666; font-size: 14px; padding: 8px 0;">Status:</td>
              <td style="color: #10b981; font-size: 14px; font-weight: 600; text-align: right;">Completed</td>
            </tr>
          </table>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-top: 24px;">
          The funds have been added to your wallet. You can now use them for purchases and transactions on the platform.
        </p>
        
        <div style="margin: 24px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/wallet" 
             style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600;">
            View Wallet
          </a>
        </div>
        
        <p style="color: #999; font-size: 12px; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e5e5;">
          Thank you for using CMP App!<br />
          If you have any questions, please contact our support team.
        </p>
      </div>
    `,
  });

  if (error) {
    throw error;
  }

  return data;
}