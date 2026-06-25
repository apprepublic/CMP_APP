'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { api } from '@/lib/api';
import { useUserStore } from '@/stores/userStore';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useUserStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect already-authenticated users away from the login page
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const returnTo = searchParams?.get('returnTo');
        router.replace(returnTo ? decodeURIComponent(returnTo) : '/dashboard');
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (supabaseError) throw supabaseError;

      if (data.user) {
        try {
          const { user: userProfile, accessToken, refreshToken } = await api.login({ email, password });
          api.setToken(accessToken);
          if (typeof window !== 'undefined') {
            localStorage.setItem('refreshToken', refreshToken);
          }
        } catch {
          // API server may be down — Supabase auth is the source of truth
        }

        await login({ email, password });

        // Redirect to the page the user was trying to access, or dashboard
        const returnTo = searchParams?.get('returnTo');
        router.push(returnTo ? decodeURIComponent(returnTo) : '/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-surface-container-lowest rounded-xl p-8 md:p-10 relative shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="font-h2 text-h1-mobile md:text-h2 text-primary-container mb-2">Welcome Back</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Secure access to your creative enterprise.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 rounded-lg bg-error/10 border border-error/30 text-error text-sm font-body-sm">
            {error}
          </div>
        )}

        {/* Email Input */}
        <div>
          <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase" htmlFor="email">
            Email Address
          </label>
          <div className="relative rounded-lg transition-shadow duration-200">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-outline">
              <Mail className="w-5 h-5" />
            </span>
            <input
              className="block w-full pl-10 pr-3 py-3 bg-surface-alt border border-outline-variant rounded-lg text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-colors"
              id="email"
              name="email"
              placeholder="name@company.com"
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase" htmlFor="password">
            Password
          </label>
          <div className="relative rounded-lg transition-shadow duration-200">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-outline">
              <Lock className="w-5 h-5" />
            </span>
            <input
              className="block w-full pl-10 pr-10 py-3 bg-surface-alt border border-outline-variant rounded-lg text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-colors"
              id="password"
              name="password"
              placeholder="••••••••"
              required
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <button
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-outline hover:text-on-surface transition-colors"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Options Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              className="h-4 w-4 rounded border-outline-variant bg-surface-alt text-primary-container focus:ring-2 focus:ring-primary-container"
              id="remember-me"
              name="remember-me"
              type="checkbox"
            />
            <label className="ml-2 block font-body-sm text-body-sm text-on-surface-variant" htmlFor="remember-me">
              Remember Me
            </label>
          </div>
          <div className="text-sm">
            <Link href="/forgot-password" className="font-body-sm text-body-sm text-[#B8860B] hover:text-[#8B6914] font-medium transition-colors">
              Forgot Password?
            </Link>
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-[#B8860B] hover:bg-[#8B6914] text-primary-container font-bold font-body-md text-body-md rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* Footer Link */}
      <p className="mt-8 text-center font-body-sm text-body-sm text-on-surface-variant">
        Don't have an account?{' '}
        <Link href="/register" className="font-medium text-primary-container hover:underline transition-colors">
          Create an Account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthLayout>
      <Suspense fallback={
        <div className="w-full max-w-md bg-surface-container-lowest rounded-xl p-8 md:p-10 relative shadow-[0px_4px_20px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#B8860B]"></div>
          <p className="mt-4 text-on-surface-variant text-sm font-body-sm">Loading...</p>
        </div>
      }>
        <LoginPageContent />
      </Suspense>
    </AuthLayout>
  );
}