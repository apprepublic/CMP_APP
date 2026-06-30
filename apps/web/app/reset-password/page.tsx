'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Lock, Eye, EyeOff, ArrowRight, AlertTriangle } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';

type PageState = 'checking' | 'invalid' | 'ready';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [pageState, setPageState] = useState<PageState>('checking');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Validate recovery session on mount
  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        if (!cancelled) setPageState('ready');
      }
    });

    const init = async () => {
      const { data, error: sessionError } = await supabase.auth.getSession();

      if (cancelled) return;

      if (!sessionError && data.session?.user) {
        setPageState('ready');
        return;
      }

      // No session yet — give the hash parser 3 seconds
      timeoutId = setTimeout(() => {
        if (!cancelled) setPageState('invalid');
      }, 3000);
    };

    init();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      router.push('/reset-password-success');
    } catch (err: any) {
      const msg = err?.message || '';
      setError(
        msg.includes('session') || msg.includes('not authenticated')
          ? 'Your recovery link has expired. Please request a new one.'
          : msg || 'Failed to update password'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md bg-surface-container-lowest rounded-xl p-8 md:p-10 relative shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
        {pageState === 'checking' && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#B8860B] mb-6" />
            <p className="font-body-md text-body-md text-on-surface-variant">Verifying your recovery link...</p>
          </div>
        )}

        {pageState === 'invalid' && (
          <div className="flex flex-col items-center text-center py-6">
            <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mb-6 border border-error/30">
              <AlertTriangle className="text-error w-8 h-8" />
            </div>
            <h1 className="font-h3 text-h3 text-primary-container mb-3">Invalid or Expired Link</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mb-8">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <Link href="/forgot-password">
              <button className="w-full h-12 bg-[#B8860B] hover:bg-[#8B6914] text-primary-container font-bold font-body-md text-body-md rounded-lg transition-colors px-8">
                Request New Link
              </button>
            </Link>
          </div>
        )}

        {pageState === 'ready' && (
          <>
            {/* Icon Header */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center border-2 border-[#B8860B]/30">
                <Lock className="text-[#B8860B] w-8 h-8" />
              </div>
            </div>

            {/* Text Content */}
            <div className="text-center mb-8">
              <h1 className="font-h2 text-h2 text-primary-container mb-2">Set New Password</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">Please enter your new secure password.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 rounded-lg bg-error/10 border border-error/30 text-error text-sm font-body-sm">
                  {error}
                </div>
              )}

              {/* New Password Input */}
              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase" htmlFor="new-password">
                  New Password
                </label>
                <div className="relative rounded-lg transition-shadow duration-200">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                  <input
                    className="block w-full pl-10 pr-10 py-3 bg-surface-alt border border-outline-variant rounded-lg text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-colors"
                    id="new-password"
                    placeholder="••••••••"
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase" htmlFor="confirm-password">
                  Confirm New Password
                </label>
                <div className="relative rounded-lg transition-shadow duration-200">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                  <input
                    className="block w-full pl-10 pr-4 py-3 bg-surface-alt border border-outline-variant rounded-lg text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-colors"
                    id="confirm-password"
                    placeholder="••••••••"
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !newPassword || !confirmPassword}
                className="w-full h-12 bg-[#B8860B] hover:bg-[#8B6914] text-primary-container font-bold font-body-md text-body-md rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isLoading ? 'Updating...' : 'Update Password'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </>
        )}
      </div>
    </AuthLayout>
  );
}