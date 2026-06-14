'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/ui/page-transition';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';
import { useUserStore } from '@/stores/userStore';

export default function VerifyEmailPage() {
  const router = useRouter();
  const { user } = useUserStore();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlOtp = params.get('otp');
    const urlEmail = params.get('email');
    if (urlOtp) setOtp(urlOtp);
    if (urlEmail) setEmail(urlEmail);
    else if (user?.email) setEmail(user.email);
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError('Please enter a 6-digit verification code');
      return;
    }

    setIsLoading(true);

    try {
      if (!email) {
        throw new Error('Email not found. Please login again.');
      }

      await api.verifyEmail(otp, email);
      setSuccess(true);
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setIsResending(true);

    try {
      if (!email) {
        throw new Error('Email not found. Please login again.');
      }

      await api.resendVerification(email);
      setError('VERIFICATION_SENT');
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification email');
    } finally {
      setIsResending(false);
    }
  };

  if (success) {
    return (
      <PageTransition className="min-h-screen bg-primary-container flex items-center justify-center relative overflow-hidden bg-pattern">
        <div className="relative z-10 w-full max-w-md px-margin-mobile md:px-0">
          <StaggerContainer stagger={0.1}>
            <StaggerItem>
              <div className="glass-card rounded-xl p-8 w-full text-center">
                <div className="w-20 h-20 bg-success-verified/20 rounded-full flex items-center justify-center mb-6 mx-auto border border-success-verified/30">
                  <CheckCircle className="w-10 h-10 text-success-verified" />
                </div>
                <h2 className="font-h3 text-h3 text-white mb-4">Email Verified!</h2>
                <p className="font-body-md text-body-md text-white/70 mb-6">
                  Your email has been successfully verified. Redirecting to dashboard...
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="min-h-screen bg-primary-container flex items-center justify-center relative overflow-hidden bg-pattern">
      {/* Abstract 3D Shapes (Decorative) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-[#B8860B]/20 to-transparent blur-[100px]"></div>
        <div className="absolute bottom-[10%] -right-[5%] w-[30%] h-[50%] rounded-full bg-gradient-to-tl from-primary to-[#B8860B]/10 blur-[80px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-margin-mobile md:px-0">
        <StaggerContainer stagger={0.1}>
          <StaggerItem>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-secondary-container mb-4">
                <Mail className="text-secondary-container w-8 h-8" />
              </div>
              <h2 className="font-h3 text-h3 text-white mb-2">Verify Your Email</h2>
              <p className="font-body-md text-body-md text-white/70">
                Enter the 6-digit code sent to your email
              </p>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="glass-card rounded-xl p-6 md:p-8 w-full">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && error !== 'VERIFICATION_SENT' && (
                  <div className="p-3 rounded-lg bg-error-alert/20 border border-error-alert/30 text-error text-sm font-body-sm flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}
                
                {error === 'VERIFICATION_SENT' && (
                  <div className="p-3 rounded-lg bg-success-verified/20 border border-success-verified/30 text-success-verified text-sm font-body-sm flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Verification email sent! Please check your inbox.</span>
                  </div>
                )}

                <div>
                  <label className="block font-label-caps text-label-caps text-white/70 mb-2 uppercase" htmlFor="otp">
                    Verification Code
                  </label>
                  <div className="relative gold-glow rounded-lg transition-shadow duration-200">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                    <input
                      className="block w-full pl-10 pr-3 py-3 bg-[#0a1529] border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-0 focus:border-transparent transition-colors text-center font-data-lg text-data-lg tracking-widest"
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="000000"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm font-body-lg text-body-lg text-primary-container bg-secondary-container hover:bg-[#8B6914] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-container transition-colors"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Verifying...
                    </>
                  ) : (
                    'Verify Email'
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="font-body-sm text-body-sm text-white/70 mb-3">
                  Didn't receive the code?
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleResend}
                  disabled={isResending}
                  className="w-full text-white/70 hover:text-secondary-fixed"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    'Resend Verification Email'
                  )}
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <Link
                  href="/dashboard"
                  className="flex items-center justify-center gap-2 text-secondary-fixed hover:underline font-body-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </PageTransition>
  );
}