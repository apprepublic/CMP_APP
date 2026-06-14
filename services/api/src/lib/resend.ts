import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendVerificationEmail(to: string, otp: string, username: string) {
  if (!resend) {
    console.warn('Resend not configured - verification email would have been sent to', to);
    console.log('OTP:', otp);
    return { success: true, mock: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'CMPapp <noreply@cmpapp.ng>',
      to,
      subject: 'Verify Your Email - CMPapp',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Email</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 40px 20px;">
                  <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">CMPapp</h1>
                        <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">Creative Economy Platform</p>
                      </td>
                    </tr>
                    
                    <!-- Body -->
                    <tr>
                      <td style="padding: 40px 30px;">
                        <h2 style="margin: 0 0 16px 0; color: #1a202c; font-size: 24px; font-weight: 600;">Verify Your Email</h2>
                        <p style="margin: 0 0 16px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                          Hi ${username}!
                        </p>
                        <p style="margin: 0 0 24px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                          Thanks for signing up for CMPapp. To complete your registration, please enter the following verification code:
                        </p>
                        
                        <!-- OTP Code -->
                        <table role="presentation" style="margin: 30px 0; width: 100%;">
                          <tr>
                            <td style="text-align: center;">
                              <div style="display: inline-block; background-color: #f7fafc; border: 2px dashed #cbd5e0; border-radius: 8px; padding: 20px 40px;">
                                <span style="font-size: 36px; font-weight: 700; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</span>
                              </div>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="margin: 0 0 24px 0; color: #4a5568; font-size: 14px; line-height: 1.6;">
                          This code will expire in <strong>10 minutes</strong>. Do not share this code with anyone.
                        </p>
                        
                        <p style="margin: 0 0 16px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                          Or verify by clicking the button below:
                        </p>
                        
                        <!-- CTA Button -->
                        <table role="presentation" style="margin: 30px 0; width: 100%;">
                          <tr>
                            <td style="text-align: center;">
                              <a href="${process.env.APP_URL || 'https://cmpapp.ng'}/verify-email?otp=${otp}" 
                                 style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">
                                Verify Email
                              </a>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="margin: 0 0 16px 0; color: #718096; font-size: 14px; line-height: 1.6;">
                          If you didn't create an account on CMPapp, you can safely ignore this email.
                        </p>
                        
                        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
                        
                        <p style="margin: 0; color: #a0aec0; font-size: 12px; line-height: 1.6;">
                          © ${new Date().getFullYear()} CMPapp. All rights reserved.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Failed to send verification email:', error);
      throw new Error(error.message);
    }

    console.log('Verification email sent successfully:', data?.id);
    return { success: true, data };
  } catch (error: any) {
    console.error('Error sending verification email:', error);
    return { success: false, error: error.message };
  }
}

export async function sendWelcomeEmail(to: string, username: string) {
  if (!resend) {
    console.warn('Resend not configured - welcome email would have been sent to', to);
    return { success: true, mock: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'CMPapp <noreply@cmpapp.ng>',
      to,
      subject: 'Welcome to CMPapp! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Welcome to CMPapp</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 40px 20px;">
                  <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">🎉 Welcome!</h1>
                      </td>
                    </tr>
                    
                    <!-- Body -->
                    <tr>
                      <td style="padding: 40px 30px;">
                        <h2 style="margin: 0 0 16px 0; color: #1a202c; font-size: 24px; font-weight: 600;">
                          Hi ${username}!
                        </h2>
                        <p style="margin: 0 0 16px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                          Welcome to <strong>CMPapp</strong> - your gateway to the creative economy!
                        </p>
                        <p style="margin: 0 0 16px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                          You've received <strong>500 FREE Coins</strong> to get started. Here's what you can do:
                        </p>
                        
                        <!-- Features -->
                        <table role="presentation" style="width: 100%; margin: 24px 0;">
                          <tr>
                            <td style="padding: 16px; background-color: #f7fafc; border-radius: 8px; margin-bottom: 12px;">
                              <h3 style="margin: 0 0 8px 0; color: #667eea; font-size: 18px;">🎵 Stream Music & Earn</h3>
                              <p style="margin: 0; color: #718096; font-size: 14px;">Listen to your favorite tracks and earn coins for every song</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 16px; background-color: #f7fafc; border-radius: 8px; margin-bottom: 12px;">
                              <h3 style="margin: 0 0 8px 0; color: #667eea; font-size: 18px;">📚 Read Articles</h3>
                              <p style="margin: 0; color: #718096; font-size: 14px;">Learn and earn coins by reading educational content</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 16px; background-color: #f7fafc; border-radius: 8px;">
                              <h3 style="margin: 0 0 8px 0; color: #667eea; font-size: 18px;">👥 Refer Friends</h3>
                              <p style="margin: 0; color: #718096; font-size: 14px;">Earn up to 10% on your referrals' activities</p>
                            </td>
                          </tr>
                        </table>
                        
                        <!-- CTA Button -->
                        <table role="presentation" style="margin: 30px 0; width: 100%;">
                          <tr>
                            <td style="text-align: center;">
                              <a href="${process.env.APP_URL || 'https://cmpapp.ng'}/dashboard" 
                                 style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">
                                Go to Dashboard
                              </a>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="margin: 0 0 16px 0; color: #4a5568; font-size: 14px; line-height: 1.6;">
                          Need help? Reply to this email or visit our <a href="${process.env.APP_URL || 'https://cmpapp.ng'}/help" style="color: #667eea; text-decoration: none;">Help Center</a>.
                        </p>
                        
                        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
                        
                        <p style="margin: 0; color: #a0aec0; font-size: 12px; line-height: 1.6;">
                          © ${new Date().getFullYear()} CMPapp. All rights reserved.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Failed to send welcome email:', error);
      throw new Error(error.message);
    }

    console.log('Welcome email sent successfully:', data?.id);
    return { success: true, data };
  } catch (error: any) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
}