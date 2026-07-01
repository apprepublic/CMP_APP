'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, CheckCircle, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';
import { useUserStore } from '@/stores/userStore';
import { AuthLayout } from '@/components/auth/AuthLayout';

export default function VerifyEmailPage() {
  const router = useRouter();
  const { user } = useUserStore();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState<string>('');
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlOtp = params.get('otp');
    const urlEmail = params.get('email');
    if (urlOtp) setOtp(urlOtp);
    if (urlEmail) setEmail(urlEmail);
    else if (user?.email) setEmail(user.email);
  }, [user]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(0, 1);
    if (value && !/^\d$/.test(value)) return;

    const newOtp = otp.split('');
    newOtp[index] = value;
    const combined = newOtp.join('');
    setOtp(combined);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted) {
      setOtp(pasted);
      const nextIndex = Math.min(pasted.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError('Please enter a 6-digit verification code');
      return;
    }

    setIsLoading(true);

    try {
      if (!email) throw new Error('Email not found. Please login again.');
      await api.verifyEmail(otp, email);
      setSuccess(true);
      setTimeout(() => router.push('/dashboard'), 2000);
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
      if (!email) throw new Error('Email not found. Please login again.');
      await api.resendVerification(email);
      setError('VERIFICATION_SENT');
      setCountdown(60);
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification email');
    } finally {
      setIsResending(false);
    }
  };

  if (success) {
    return (
      <>
        {/* Mobile success */}
        <div className="block md:hidden bg-background min-h-screen flex flex-col items-center justify-center px-margin-mobile">
          <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center mb-stack-md border-2 border-success/20 shadow-[0_0_40px_rgba(46,125,50,0.25)]">
            <CheckCircle className="w-12 h-12 text-success" />
          </div>
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-stack-xs">Email Verified!</h2>
          <p className="font-body-md text-body-md text-on-surface-variant text-center">Your email has been successfully verified. Redirecting to dashboard...</p>
        </div>
        {/* Desktop success */}
        <div className="hidden md:block">
          <AuthLayout>
            <div className="w-full max-w-md bg-surface-container-lowest rounded-xl p-8 md:p-10 relative shadow-[0px_4px_20px_rgba(0,0,0,0.04)] text-center">
              <div className="w-20 h-20 bg-success-verified/10 rounded-full flex items-center justify-center mb-6 mx-auto border border-success-verified/20">
                <CheckCircle className="w-10 h-10 text-success-verified" />
              </div>
              <h2 className="font-h3 text-h3 text-primary-container mb-4">Email Verified!</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6">Your email has been successfully verified. Redirecting to dashboard...</p>
            </div>
          </AuthLayout>
        </div>
      </>
    );
  }

  return (
    <>
      {/* ==================== MOBILE LAYOUT ==================== */}
      <div className="block md:hidden bg-background min-h-screen flex flex-col">
        <header className="fixed top-0 w-full z-50 bg-primary-container h-16 flex items-center px-margin-mobile shadow shadow-black/15">
          <button className="p-2 -ml-2 active:scale-95 transition-transform" onClick={() => window.history.back()}>
            <span className="material-symbols-outlined text-gold-metallic">arrow_back</span>
          </button>
          <h1 className="ml-4 font-headline-md text-headline-md-mobile text-on-primary-fixed">Verify Email</h1>
        </header>

        <main className="flex-grow pt-24 pb-8 px-margin-mobile w-full mx-auto flex flex-col justify-center min-h-screen">
          <div className="text-center mb-stack-lg">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-[8px_8px_16px_rgba(13,27,53,0.05),-4px_-4px_12px_rgba(255,255,255,0.9)] mb-stack-md border-t-2 border-gold-metallic">
              <Mail className="w-10 h-10 text-gold-metallic" />
            </div>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-stack-xs">Verify Your Email</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Enter the 6-digit code sent to your email</p>
          </div>

          <div className="bg-white shadow-[8px_8px_16px_rgba(13,27,53,0.05),-4px_-4px_12px_rgba(255,255,255,0.9)] rounded-xl p-stack-lg mb-stack-lg">
            <form onSubmit={handleSubmit} className="space-y-stack-lg">
              {error && error !== 'VERIFICATION_SENT' && (
                <div className="p-3 rounded-lg bg-error/10 border border-error/30 text-error text-sm font-body-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {error === 'VERIFICATION_SENT' && (
                <div className="p-3 rounded-lg bg-success/10 border border-success/30 text-success text-sm font-body-sm flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Verification email sent! Please check your inbox.</span>
                </div>
              )}

              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-muted mb-3 uppercase text-center">Verification Code</label>
                <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <input
                      key={i}
                      ref={(el) => { inputRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={otp[i] || ''}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className={`w-12 h-14 text-center font-numeric-display text-numeric-display bg-white shadow-[inset_4px_4px_8px_rgba(13,27,53,0.06),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] rounded-xl text-on-surface outline-none transition-all duration-200 ${
                        otp[i] ? 'ring-2 ring-gold-metallic/40 border border-gold-metallic/20' : 'border border-transparent focus:ring-2 focus:ring-gold-metallic/40'
                      }`}
                      disabled={isLoading}
                      autoFocus={i === 0}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="w-full py-4 bg-primary-container text-on-primary font-bold rounded-xl shadow-lg shadow-primary-container/20 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                ) : (
                  <span className="font-headline-md text-headline-md">Verify Email</span>
                )}
              </button>
            </form>
          </div>

          <div className="text-center">
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">Didn&apos;t receive the code?</p>
            {countdown > 0 ? (
              <p className="font-body-sm text-body-sm text-gold-metallic">Resend in {countdown}s</p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-gold-metallic hover:text-gold-deep font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isResending ? (
                  <><Loader2 className="inline w-4 h-4 animate-spin mr-2" />Sending...</>
                ) : (
                  'Resend Verification Email'
                )}
              </button>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-outline-variant/30">
            <Link href="/dashboard" className="flex items-center justify-center gap-2 text-on-surface-variant hover:text-gold-metallic font-body-sm transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
        </main>
      </div>

      {/* ==================== DESKTOP/TABLET LAYOUT ==================== */}
      <div className="hidden md:block">
        <AuthLayout>
          <div className="w-full max-w-md bg-surface-container-lowest rounded-xl p-8 md:p-10 relative shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-[#B8860B]/30 mb-4">
                <Mail className="text-[#B8860B] w-8 h-8" />
              </div>
              <h2 className="font-h3 text-h3 text-primary-container mb-2">Verify Your Email</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Enter the 6-digit code sent to your email</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && error !== 'VERIFICATION_SENT' && (
                <div className="p-3 rounded-lg bg-error/10 border border-error/30 text-error text-sm font-body-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {error === 'VERIFICATION_SENT' && (
                <div className="p-3 rounded-lg bg-success-verified/10 border border-success-verified/30 text-success-verified text-sm font-body-sm flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Verification email sent! Please check your inbox.</span>
                </div>
              )}

              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase" htmlFor="otp">Verification Code</label>
                <div className="relative rounded-lg transition-shadow duration-200">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                  <input
                    className="block w-full pl-10 pr-3 py-3 bg-surface-alt border border-outline-variant rounded-lg text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-colors text-center font-data-lg text-data-lg tracking-widest"
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

              <button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="w-full h-12 bg-[#B8860B] hover:bg-[#8B6914] text-primary-container font-bold font-body-md text-body-md rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
              >
                {isLoading ? (
                  <><Loader2 className="w-5 h-5 animate-spin mr-2" />Verifying...</>
                ) : (
                  'Verify Email'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">Didn&apos;t receive the code?</p>
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="w-full text-on-surface-variant hover:text-primary-container disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isResending ? (
                  <><Loader2 className="inline w-4 h-4 animate-spin mr-2" />Sending...</>
                ) : (
                  'Resend Verification Email'
                )}
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-outline-variant/30">
              <Link href="/dashboard" className="flex items-center justify-center gap-2 text-primary-container hover:underline font-body-sm">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
            </div>
          </div>
        </AuthLayout>
      </div>
    </>
  );
}
