'use client';

import { useState, useEffect } from 'react';
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
      <AuthLayout>
        <div className="w-full max-w-md bg-surface-container-lowest rounded-xl p-8 md:p-10 relative shadow-[0px_4px_20px_rgba(0,0,0,0.04)] text-center">
          <div className="w-20 h-20 bg-success-verified/10 rounded-full flex items-center justify-center mb-6 mx-auto border border-success-verified/20">
            <CheckCircle className="w-10 h-10 text-success-verified" />
          </div>
          <h2 className="font-h3 text-h3 text-primary-container mb-4">Email Verified!</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">
            Your email has been successfully verified. Redirecting to dashboard...
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-md bg-surface-container-lowest rounded-xl p-8 md:p-10 relative shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-[#B8860B]/30 mb-4">
            <Mail className="text-[#B8860B] w-8 h-8" />
          </div>
          <h2 className="font-h3 text-h3 text-primary-container mb-2">Verify Your Email</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Enter the 6-digit code sent to your email
          </p>
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
            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase" htmlFor="otp">
              Verification Code
            </label>
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
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Verifying...
              </>
            ) : (
              'Verify Email'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">
            Didn't receive the code?
          </p>
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="w-full text-on-surface-variant hover:text-primary-container disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isResending ? (
              <>
                <Loader2 className="inline w-4 h-4 animate-spin mr-2" />
                Sending...
              </>
            ) : (
              'Resend Verification Email'
            )}
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-outline-variant/30">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 text-primary-container hover:underline font-body-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}