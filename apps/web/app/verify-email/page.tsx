'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/ui/page-transition';
import { NeuCard } from '@/components/ui/neu-card';
import { NeuIconBadge } from '@/components/ui/neu-icon-badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';
import { useUserStore } from '@/stores/userStore';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUserStore();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const prefillOtp = searchParams.get('otp');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError('Please enter a 6-digit verification code');
      return;
    }

    setIsLoading(true);

    try {
      const email = user?.email || searchParams.get('email');
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
      const email = user?.email || searchParams.get('email');
      if (!email) {
        throw new Error('Email not found. Please login again.');
      }

      await api.resendVerification(email);
      // Show success message via error state (green)
      setError('VERIFICATION_SENT');
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification email');
    } finally {
      setIsResending(false);
    }
  };

  if (success) {
    return (
      <PageTransition className="min-h-screen bg-neu-bg flex items-center justify-center p-8">
        <NeuCard padding="lg" className="w-full max-w-md text-center">
          <StaggerContainer stagger={0.1}>
            <StaggerItem>
              <NeuIconBadge size="lg" active className="mx-auto mb-6 bg-neo-success/20">
                <CheckCircle className="w-12 h-12 text-neo-success" />
              </NeuIconBadge>
              <h2 className="font-h3 text-h3 text-neo-text-primary mb-4">Email Verified!</h2>
              <p className="font-body-md text-body-md text-neo-text-secondary mb-6">
                Your email has been successfully verified. Redirecting to dashboard...
              </p>
            </StaggerItem>
          </StaggerContainer>
        </NeuCard>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="min-h-screen bg-neu-bg flex items-center justify-center p-8">
      <NeuCard padding="lg" className="w-full max-w-md">
        <StaggerContainer stagger={0.1}>
          <StaggerItem>
            <div className="text-center mb-8">
              <NeuIconBadge size="lg" active className="mx-auto mb-4" style={{ background: 'var(--neo-secondary)' }}>
                <Mail className="w-8 h-8 text-neo-primary" />
              </NeuIconBadge>
              <h2 className="font-h3 text-h3 text-neo-text-primary mb-2">Verify Your Email</h2>
              <p className="font-body-md text-body-md text-neo-text-secondary">
                Enter the 6-digit code sent to your email
              </p>
            </div>
          </StaggerItem>

          <StaggerItem>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && error !== 'VERIFICATION_SENT' && (
                <div className="p-3 rounded-lg bg-neo-error/10 text-neo-error text-sm font-body-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
              
              {error === 'VERIFICATION_SENT' && (
                <div className="p-3 rounded-lg bg-neo-success/10 text-neo-success text-sm font-body-sm flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Verification email sent! Please check your inbox.</span>
                </div>
              )}

              <Input
                label="Verification Code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={otp || prefillOtp || ''}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                disabled={isLoading}
                icon={<Mail className="w-5 h-5" />}
              />

              <Button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="w-full"
                size="lg"
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
          </StaggerItem>

          <StaggerItem>
            <div className="mt-6 text-center">
              <p className="font-body-sm text-body-sm text-neo-text-secondary mb-3">
                Didn't receive the code?
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResend}
                disabled={isResending}
                className="w-full"
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
          </StaggerItem>

          <StaggerItem>
            <div className="mt-6 pt-6 border-t border-neo-bg-dark">
              <Link
                href="/dashboard"
                className="flex items-center justify-center gap-2 text-neo-primary hover:underline font-body-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </NeuCard>
    </PageTransition>
  );
}