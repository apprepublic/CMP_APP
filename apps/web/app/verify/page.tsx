'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';

export default function VerifyPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'loading' | 'code' | 'password'>('loading');
  const [email, setEmail] = useState('');
  // verificationToken is preserved from the URL link so the password step can re-use it
  const [verificationToken, setVerificationToken] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const urlEmail = params.get('email');

    if (urlEmail) setEmail(decodeURIComponent(urlEmail));

    if (token) {
      // Token from email link — verify it immediately; password is then collected in mode='password'
      setVerificationToken(token);
      verifyWithToken(token);
    } else {
      setMode('code');
    }
  }, []);

  /** Step 1a: Verify via email-link token. Returns requiresPassword — we then collect the password. */
  const verifyWithToken = async (token: string) => {
    setIsLoading(true);
    setError('');

    try {
      const { data, error: funcError } = await supabase.functions.invoke('verify-registration', {
        body: { token },
      });

      if (funcError) throw new Error(funcError.message || 'Verification failed');
      if (data?.error) throw new Error(data.error);

      if (data?.requiresPassword) {
        setEmail(data.email || '');
        setMode('password');
      } else if (data?.success) {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 2000);
      }
    } catch (err: any) {
      setError(err?.message || 'Verification failed. Please try entering the code manually.');
      setMode('code');
    } finally {
      setIsLoading(false);
    }
  };

  /** Step 1b: Verify via 6-digit code entered manually. Returns requiresPassword. */
  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (code.length !== 6) {
      setError('Please enter the 6-digit verification code');
      return;
    }

    if (!email) {
      setError('Email address is required. Please go back to registration.');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error: funcError } = await supabase.functions.invoke('verify-registration', {
        body: { code, email },
      });

      if (funcError) throw new Error(funcError.message || 'Verification failed');
      if (data?.error) throw new Error(data.error);

      if (data?.requiresPassword) {
        setEmail(data.email || email);
        setMode('password');
      } else if (data?.success) {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 2000);
      }
    } catch (err: any) {
      const msg = err?.message || '';
      setError(msg.includes('Invalid code') ? 'The verification code is invalid or has expired. Please try registering again.' : msg || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Step 2: Set password and create the account.
   *
   * CRITICAL: The edge function needs to look up the pending_registrations row.
   * - If the user came via EMAIL LINK → we have `verificationToken`, send { token, email, password }
   * - If the user came via CODE ENTRY → we have `code` + `email`, send { code, email, password }
   *
   * Without this, token-flow users send { code: "", email, password } which fails the
   * CODE_RE test in the edge function and returns "Token or code+email required".
   */
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!email) {
      setError('Email not found. Please register again.');
      return;
    }

    setIsLoading(true);

    try {
      // Build the lookup payload — prefer token if available (came via email link)
      const lookupPayload = verificationToken
        ? { token: verificationToken, email, password }
        : { code, email, password };

      const { data, error: funcError } = await supabase.functions.invoke('verify-registration', {
        body: lookupPayload,
      });

      if (funcError) throw new Error(funcError.message || 'Failed to create account');
      if (data?.error) {
        const errMsg = data.error;
        if (errMsg.includes('duplicate key') || errMsg.includes('already exists')) {
          throw new Error('An account with this email already exists. Please sign in instead.');
        }
        throw new Error(errMsg);
      }

      if (data?.success) {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 2000);
      } else {
        throw new Error('Account creation failed. Please try again.');
      }
    } catch (err: any) {
      const msg = err?.message || '';
      setError(
        msg.includes('duplicate key') || msg.includes('already exists')
          ? 'An account with this email already exists. Please sign in instead.'
          : msg || 'Failed to create account'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout>
        <div className="w-full max-w-md bg-surface-container-lowest rounded-xl p-8 md:p-10 relative shadow-[0px_4px_20px_rgba(0,0,0,0.04)] text-center">
          <div className="w-20 h-20 bg-success-verified/10 rounded-full flex items-center justify-center mb-6 mx-auto border border-success-verified/20">
            <CheckCircle className="w-10 h-10 text-success-verified" />
          </div>
          <h2 className="font-h3 text-h3 text-primary-container mb-4">Account Created!</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">
            Your account has been successfully created. Redirecting to login...
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-md bg-surface-container-lowest rounded-xl p-8 md:p-10 relative shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
        {mode === 'loading' ? (
          <div className="text-center py-12">
            <Loader2 className="w-10 h-10 animate-spin text-[#B8860B] mx-auto mb-4" />
            <p className="text-on-surface-variant">Verifying your email...</p>
          </div>
        ) : mode === 'code' ? (
          <form onSubmit={handleCodeSubmit} className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-[#B8860B]/30 mb-4">
                <Mail className="text-[#B8860B] w-8 h-8" />
              </div>
              <h2 className="font-h3 text-h3 text-primary-container mb-2">Verify Your Email</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Enter the 6-digit code sent to{' '}
                <span className="text-[#B8860B] font-semibold">{email || 'your email'}</span>
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-error/10 border border-error/30 text-error text-sm font-body-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Email field — shown when email is missing from URL params */}
            {!email && (
              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase" htmlFor="email-field">
                  Email Address
                </label>
                <div className="relative rounded-lg">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                  <input
                    className="block w-full pl-10 pr-3 py-3 bg-surface-alt border border-outline-variant rounded-lg text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-colors"
                    id="email-field"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.trim().toLowerCase())}
                    placeholder="your@email.com"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase" htmlFor="code">
                Verification Code
              </label>
              <div className="relative rounded-lg transition-shadow duration-200">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                <input
                  className="block w-full pl-10 pr-3 py-3 bg-surface-alt border border-outline-variant rounded-lg text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-colors text-center font-data-lg text-data-lg tracking-widest"
                  id="code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  disabled={isLoading}
                  autoComplete="one-time-code"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || code.length !== 6}
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

            <div className="text-center mt-4">
              <Link href="/register" className="text-on-surface-variant hover:text-primary-container text-sm transition-colors">
                ← Back to registration
              </Link>
            </div>
          </form>
        ) : (
          /* mode === 'password' */
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-[#B8860B]/30 mb-4">
                <Lock className="text-[#B8860B] w-8 h-8" />
              </div>
              <h2 className="font-h3 text-h3 text-primary-container mb-2">Create Password</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Almost done! Create a secure password for{' '}
                <span className="text-[#B8860B] font-semibold">{email}</span>
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-error/10 border border-error/30 text-error text-sm font-body-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase" htmlFor="password">
                Password
              </label>
              <div className="relative rounded-lg transition-shadow duration-200">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                <input
                  className="block w-full pl-10 pr-10 py-3 bg-surface-alt border border-outline-variant rounded-lg text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-colors"
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  autoComplete="new-password"
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
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 text-xs">Must be at least 8 characters long.</p>
            </div>

            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="relative rounded-lg transition-shadow duration-200">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                <input
                  className="block w-full pl-10 pr-4 py-3 bg-surface-alt border border-outline-variant rounded-lg text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-colors"
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !password || !confirmPassword}
              className="w-full h-12 bg-[#B8860B] hover:bg-[#8B6914] text-primary-container font-bold font-body-md text-body-md rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}