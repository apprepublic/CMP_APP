'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Mail, ArrowRight, Lock, CheckCircle, ArrowLeft } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateEmail = (value: string) => {
    if (!value.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Please enter a valid email address';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) throw resetError;
      
      setSuccess(true);
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('rate_limit') || msg.includes('429') || msg.includes('too many')) {
        setError('Too many requests. Please wait a few minutes before trying again.');
      } else if (msg.includes('Email not found') || msg.includes('user_not_found')) {
        setSuccess(true);
      } else {
        setError(msg || 'Failed to send recovery email. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* ==================== MOBILE LAYOUT ==================== */}
      <div className="block md:hidden bg-background min-h-screen flex flex-col">
        <header className="fixed top-0 w-full z-50 bg-primary-container h-16 flex items-center px-margin-mobile shadow shadow-black/15">
          <button className="p-2 -ml-2 active:scale-95 transition-transform" onClick={() => window.history.back()}>
            <span className="material-symbols-outlined text-gold-metallic">arrow_back</span>
          </button>
          <h1 className="ml-4 font-headline-md text-headline-md-mobile text-on-primary-fixed">Recover Access</h1>
        </header>

        <main className="flex-grow pt-24 pb-36 px-margin-mobile w-full mx-auto">
          {success ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center mb-stack-md border-2 border-success/20 shadow-[0_0_40px_rgba(46,125,50,0.25)]">
                <CheckCircle className="w-12 h-12 text-success" />
              </div>
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-stack-xs">Check Your Email</h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-[300px] mb-stack-lg">
                We&apos;ve sent a password reset link to <span className="font-semibold text-gold-metallic">{email}</span>
              </p>
              <Link href="/login" className="w-full max-w-xs bg-primary-container text-on-primary font-bold py-4 rounded-xl shadow-lg hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2">
                <span className="font-body-md text-body-md">Back to Login</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          ) : (
            <div className="flex flex-col justify-center min-h-[70vh]">
              <div className="mb-stack-lg text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-[8px_8px_16px_rgba(13,27,53,0.05),-4px_-4px_12px_rgba(255,255,255,0.9)] mb-stack-md border-t-2 border-gold-metallic">
                  <Lock className="w-10 h-10 text-gold-metallic" />
                </div>
                <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-stack-xs">Forgot Password?</h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-[320px] mx-auto">
                  Enter your email address to receive a secure recovery link.
                </p>
              </div>

              <div className="bg-white shadow-[8px_8px_16px_rgba(13,27,53,0.05),-4px_-4px_12px_rgba(255,255,255,0.9)] rounded-xl p-stack-lg mb-stack-lg">
                <form onSubmit={handleSubmit} className="space-y-stack-lg">
                  {error && (
                    <div className="p-3 rounded-lg bg-error/10 border border-error/30 text-error text-sm font-body-sm">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block font-label-caps text-label-caps text-on-surface-muted mb-2 uppercase" htmlFor="email-mobile">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="w-5 h-5 text-gold-metallic" />
                      </div>
                      <input
                        className="block w-full pl-12 pr-4 py-4 bg-white shadow-[inset_4px_4px_8px_rgba(13,27,53,0.06),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] rounded-xl text-on-surface placeholder:text-on-surface-muted/50 focus:outline-none focus:ring-2 focus:ring-gold-metallic/40 transition-all font-body-md"
                        id="email-mobile"
                        name="email"
                        type="email"
                        placeholder="you@company.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !email}
                    className="w-full py-4 bg-primary-container text-on-primary font-bold rounded-xl shadow-lg shadow-primary-container/20 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    ) : (
                      <>
                        <span className="font-headline-md text-headline-md">Send Recovery Link</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              </div>

              <div className="text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center font-body-sm text-body-sm text-on-surface-variant hover:text-primary-container transition-colors group"
                >
                  <ArrowRight className="mr-1 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Back to Login
                </Link>
              </div>

              <p className="mt-8 text-center font-body-sm text-body-sm text-on-surface-variant">
                Need further assistance?{' '}
                <Link href="/support" className="text-gold-metallic hover:underline font-medium">
                  Contact Support
                </Link>
              </p>
            </div>
          )}
        </main>
      </div>

      {/* ==================== DESKTOP/TABLET LAYOUT ==================== */}
      <div className="hidden md:block">
        <AuthLayout>
          <div className="w-full max-w-md bg-surface-container-lowest rounded-xl p-8 md:p-10 relative shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
            {success ? (
              <div className="text-center">
                <div className="w-20 h-20 bg-success-verified/10 rounded-full flex items-center justify-center mb-6 mx-auto border border-success-verified/30">
                  <Mail className="w-10 h-10 text-success-verified" />
                </div>
                <h2 className="font-h3 text-h3 text-primary-container mb-4">Check Your Email</h2>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                  We&apos;ve sent a password reset link to <span className="font-semibold text-[#B8860B]">{email}</span>
                </p>
                <Link href="/login">
                  <button className="w-full h-12 bg-[#B8860B] hover:bg-[#8B6914] text-primary-container font-bold font-body-md text-body-md rounded-lg transition-colors duration-200">
                    Back to Login
                  </button>
                </Link>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-[#B8860B]/30 mb-4">
                    <Lock className="text-[#B8860B] w-8 h-8" />
                  </div>
                  <h1 className="font-h2 text-h1-mobile md:text-h2 text-primary-container mb-2">Recover Access</h1>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Enter your email address to receive a secure recovery link.
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-3 rounded-lg bg-error/10 border border-error/30 text-error text-sm font-body-sm">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase" htmlFor="email">
                      Email Address
                    </label>
                    <div className="relative rounded-lg transition-shadow duration-200">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="w-5 h-5 text-outline" />
                      </div>
                      <input
                        className="block w-full pl-10 pr-3 py-3 bg-surface-alt border border-outline-variant rounded-lg text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-colors"
                        id="email"
                        name="email"
                        placeholder="you@company.com"
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !email}
                    className="w-full h-12 bg-[#B8860B] hover:bg-[#8B6914] text-primary-container font-bold font-body-md text-body-md rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                  >
                    {isLoading ? 'Sending...' : 'Send Recovery Link'}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center font-body-sm text-body-sm text-on-surface-variant hover:text-primary-container transition-colors group"
                  >
                    <ArrowRight className="mr-1 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Login
                  </Link>
                </div>
              </>
            )}
            
            {/* Support Note */}
            <p className="mt-8 text-center font-body-sm text-body-sm text-on-surface-variant">
              Need further assistance?{' '}
              <Link href="/support" className="text-primary-container hover:underline font-medium">
                Contact Support
              </Link>
            </p>
          </div>
        </AuthLayout>
      </div>
    </>
  );
}
