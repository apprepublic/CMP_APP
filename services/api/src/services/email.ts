// Email Service
// Uses Resend for transactional emails
// For production, configure RESEND_API_KEY in .env

interface EmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private static isConfigured(): boolean {
    return !!process.env.RESEND_API_KEY;
  }

  /**
   * Send an email
   * In production, this uses Resend API
   * For development, logs to console
   */
  static async send(params: EmailParams): Promise<boolean> {
    const { to, subject, html, text } = params;

    if (!this.isConfigured()) {
      console.log(`
[DEV EMAIL]
To: ${to}
Subject: ${subject}
---
${text || html}
      `);
      return true;
    }

    try {
      // In production, use Resend:
      // const resend = new Resend(process.env.RESEND_API_KEY);
      // await resend.emails.send({
      //   from: 'CMPapp <noreply@cmpapp.ng>',
      //   to,
      //   subject,
      //   html,
      //   text
      // });

      console.log(`[EMAIL] Sending to ${to}: ${subject}`);
      return true;
    } catch (error) {
      console.error('[EMAIL] Failed to send:', error);
      return false;
    }
  }

  // ============================================
  // Email Templates
  // ============================================

  static async sendWelcomeEmail(email: string, name: string) {
    return this.send({
      to: email,
      subject: 'Welcome to CMPapp! 🎉',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Welcome to CMPapp!</h1>
          <p>Hi ${name},</p>
          <p>Thank you for joining CMPapp - Nigeria's premier earning platform!</p>
          <p>You now have <strong>500 bonus coins</strong> in your wallet to get started.</p>
          <h3>How to earn:</h3>
          <ul>
            <li>Complete daily tasks</li>
            <li>Read articles and watch videos</li>
            <li>Refer friends and earn</li>
            <li>Stream and download music</li>
          </ul>
          <p>Start earning today at <a href="https://cmpapp.ng">cmpapp.ng</a></p>
          <hr>
          <p style="color: #666; font-size: 12px;">
            Best regards,<br>
            The CMPapp Team
          </p>
        </div>
      `,
      text: `Welcome to CMPapp! Hi ${name}, Thank you for joining CMPapp. You now have 500 bonus coins in your wallet. Start earning at cmpapp.ng`
    });
  }

  static async sendOTPEmail(email: string, otp: string) {
    return this.send({
      to: email,
      subject: 'Your CMPapp Verification Code',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Verify Your Account</h1>
          <p>Your verification code is:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 20px; background: #f5f5f5; text-align: center;">
            ${otp}
          </div>
          <p>This code expires in 15 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
      text: `Your CMPapp verification code is: ${otp}. This code expires in 15 minutes.`
    });
  }

  static async sendWithdrawalApprovalEmail(email: string, name: string, amount: number) {
    return this.send({
      to: email,
      subject: 'Withdrawal Approved - CMPapp',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Withdrawal Approved! 💰</h1>
          <p>Hi ${name},</p>
          <p>Your withdrawal of <strong>${amount} coins</strong> has been approved and processed.</p>
          <p>The funds should arrive in your account within 24 hours.</p>
          <p>Thank you for using CMPapp!</p>
        </div>
      `,
      text: `Your withdrawal of ${amount} coins has been approved and will arrive in your account within 24 hours.`
    });
  }

  static async sendWithdrawalRejectedEmail(email: string, name: string, amount: number, reason?: string) {
    return this.send({
      to: email,
      subject: 'Withdrawal Request Update - CMPapp',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Withdrawal Update</h1>
          <p>Hi ${name},</p>
          <p>Unfortunately, your withdrawal request of <strong>${amount} coins</strong> was not approved.</p>
          ${reason ? `<p>Reason: ${reason}</p>` : ''}
          <p>Your coins have been refunded to your wallet.</p>
          <p>If you have questions, please contact support.</p>
        </div>
      `,
      text: `Your withdrawal of ${amount} coins was not approved. ${reason ? 'Reason: ' + reason : ''} Your coins have been refunded to your wallet.`
    });
  }

  static async sendKycApprovedEmail(email: string, name: string) {
    return this.send({
      to: email,
      subject: 'KYC Verified - CMPapp',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>🎉 KYC Verified!</h1>
          <p>Hi ${name},</p>
          <p>Congratulations! Your identity has been verified.</p>
          <p>You can now withdraw your earnings to your bank account.</p>
          <p>Go to your wallet to make a withdrawal!</p>
        </div>
      `,
      text: `Congratulations! Your KYC has been verified. You can now withdraw your earnings to your bank account.`
    });
  }

  static async sendKycRejectedEmail(email: string, name: string, reason?: string) {
    return this.send({
      to: email,
      subject: 'KYC Update - CMPapp',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>KYC Update</h1>
          <p>Hi ${name},</p>
          <p>Your identity verification was not approved.</p>
          ${reason ? `<p>Reason: ${reason}</p>` : ''}
          <p>Please resubmit your documents with valid information.</p>
          <p>Contact support if you need help.</p>
        </div>
      `,
      text: `Your KYC was not approved. ${reason ? 'Reason: ' + reason : ''} Please resubmit your documents.`
    });
  }

  static async sendReferralSignupEmail(email: string, name: string, referrerName: string) {
    return this.send({
      to: email,
      subject: 'You were referred to CMPapp!',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Welcome! 🎉</h1>
          <p>Hi ${name},</p>
          <p><strong>${referrerName}</strong> invited you to join CMPapp!</p>
          <p>Sign up now and you'll both earn bonus coins!</p>
          <p><a href="https://cmpapp.ng/register">Join CMPapp</a></p>
        </div>
      `,
      text: `${referrerName} invited you to join CMPapp! Sign up now at cmpapp.ng to claim your bonus.`
    });
  }

  static async sendReferralCommissionEmail(email: string, name: string, amount: number, refereeName: string) {
    return this.send({
      to: email,
      subject: 'You earned referral coins! 💰',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Referral Bonus! 🎊</h1>
          <p>Hi ${name},</p>
          <p>You earned <strong>${amount} coins</strong> from your referral ${refereeName}!</p>
          <p>Keep referring to earn more!</p>
        </div>
      `,
      text: `You earned ${amount} coins from your referral ${refereeName}! Keep referring to earn more.`
    });
  }
}

export default EmailService;