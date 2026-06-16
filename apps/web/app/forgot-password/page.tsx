'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Mail, ArrowRight, Lock } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send recovery email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md bg-surface-container-lowest rounded-xl p-8 md:p-10 relative shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
        {success ? (
          <div className="text-center">
            <div className="w-20 h-20 bg-success-verified/10 rounded-full flex items-center justify-center mb-6 mx-auto border border-success-verified/30">
              <Mail className="w-10 h-10 text-success-verified" />
            </div>
            <h2 className="font-h3 text-h3 text-primary-container mb-4">Check Your Email</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              We've sent a password reset link to <span className="font-semibold text-[#B8860B]">{email}</span>
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
  );
}