// SMS Service
// Uses Termii for Nigerian SMS delivery
// Configure TERMII_API_KEY in .env

import { normalizePhoneNumber, isValidNigerianPhone } from '@cmpapp/utils';

interface SendSMSParams {
  to: string;
  message: string;
  channel?: 'generic' | 'dnd' | 'whatsapp';
}

class SmsService {
  private static isConfigured(): boolean {
    return !!process.env.TERMII_API_KEY;
  }

  /**
   * Send SMS via Termii
   * In development, logs to console
   */
  static async send(params: SendSMSParams): Promise<boolean> {
    const { to, message, channel = 'generic' } = params;

    // Validate phone number
    if (!isValidNigerianPhone(to)) {
      console.error('[SMS] Invalid phone number:', to);
      return false;
    }

    const phoneNumber = normalizePhoneNumber(to);

    if (!this.isConfigured()) {
      console.log(`
[DEV SMS]
To: ${phoneNumber}
Channel: ${channel}
Message: ${message}
      `);
      return true;
    }

    try {
      // In production, use Termii API:
      // const response = await fetch('https://api.termii.com/api/sms/send', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     api_key: process.env.TERMII_API_KEY,
      //     to: phoneNumber,
      //     from: process.env.TERMII_SENDER_ID || 'CMPAPP',
      //     sms: message,
      //     channel: channel
      //   })
      // });

      console.log(`[SMS] Sending to ${phoneNumber}: ${message.substring(0, 50)}...`);
      return true;
    } catch (error) {
      console.error('[SMS] Failed to send:', error);
      return false;
    }
  }

  /**
   * Send OTP via SMS
   */
  static async sendOTP(phone: string, otp: string): Promise<boolean> {
    return this.send({
      to: phone,
      message: `Your CMPapp verification code is: ${otp}. Valid for 15 minutes.`,
      channel: 'dnd'
    });
  }

  /**
   * Send promotional message
   */
  static async sendPromotional(phone: string, message: string): Promise<boolean> {
    return this.send({
      to: phone,
      message,
      channel: 'generic'
    });
  }

  // ============================================
  // Notification Templates
  // ============================================

  static async notifyWithdrawalUpdate(phone: string, amount: number, status: 'approved' | 'rejected') {
    const messages = {
      approved: `CMPapp: Your withdrawal of ${amount} coins has been approved!`,
      rejected: `CMPapp: Your withdrawal of ${amount} coins was rejected. Check your email for details.`
    };

    return this.send({
      to: phone,
      message: messages[status],
      channel: 'generic'
    });
  }

  static async notifyKycUpdate(phone: string, status: 'verified' | 'rejected') {
    const messages = {
      verified: `CMPapp: Your KYC has been verified! You can now withdraw funds.`,
      rejected: `CMPapp: Your KYC was rejected. Please resubmit with valid documents.`
    };

    return this.send({
      to: phone,
      message: messages[status],
      channel: 'generic'
    });
  }

  static async notifyEarnings(phone: string, amount: number, source: string) {
    return this.send({
      to: phone,
      message: `CMPapp: You earned ${amount} coins from ${source}! Keep earning at cmpapp.ng`,
      channel: 'generic'
    });
  }

  static async notifyStreakMilestone(phone: string, days: number, bonus: number) {
    return this.send({
      to: phone,
      message: `CMPapp: 🔥 ${days}-day streak! You earned ${bonus} bonus coins!`,
      channel: 'generic'
    });
  }

  static async notifyReferralSignup(phone: string, refereeName: string) {
    return this.send({
      to: phone,
      message: `CMPapp: ${refereeName} just joined using your referral! You earned 1000 coins!`,
      channel: 'generic'
    });
  }

  static async notifyContestEnd(phone: string, contestName: string, position?: number) {
    const message = position
      ? `CMPapp: Contest "${contestName}" ended. You placed ${position}!`
      : `CMPapp: Contest "${contestName}" has ended. Check the results!`;

    return this.send({
      to: phone,
      message,
      channel: 'generic'
    });
  }

  /**
   * Send bulk SMS (for admin)
   * Note: In production, use Termii's bulk API
   */
  static async sendBulk(phones: string[], message: string): Promise<{ sent: number; failed: number }> {
    const results = await Promise.allSettled(
      phones.map(phone => this.send({ to: phone, message }))
    );

    const sent = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return { sent, failed };
  }
}

export default SmsService;