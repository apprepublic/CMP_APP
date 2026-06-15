'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { AuthHeader } from '@/components/auth-header';
import { Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function VerifyPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'loading' | 'code' | 'password'>('loading');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [referralCode, setReferralCode] = useState('');
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

    if (urlEmail) setEmail(urlEmail);

    if (token) {
      verifyWithToken(token);
    } else {
      setMode('code');
    }
  }, []);

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
        setEmail(data.email);
        setFullName(data.fullName);
        setReferralCode(data.referralCode || '');
        setMode('password');
      } else if (data?.success) {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 2000);
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed');
      setMode('code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (code.length !== 6) {
      setError('Please enter a 6-digit verification code');
      return;
    }

    if (!email) {
      setError('Email not found. Please register again.');
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
        setEmail(data.email);
        setFullName(data.fullName);
        setReferralCode(data.referralCode || '');
        setMode('password');
      } else if (data?.success) {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 2000);
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

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
      const { data, error: funcError } = await supabase.functions.invoke('verify-registration', {
        body: { code, email, password },
      });

      if (funcError) throw new Error(funcError.message || 'Failed to create account');
      if (data?.error) throw new Error(data.error);

      if (data?.success) {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 2000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-primary-container relative overflow-hidden">
        <AuthHeader />
        <div className="relative z-10 w-full max-w-md px-4 md:px-0 pt-20">
          <div className="glass-card rounded-xl p-8 w-full text-center">
            <div className="w-20 h-20 bg-success-verified/20 rounded-full flex items-center justify-center mb-6 mx-auto border border-success-verified/30">
              <CheckCircle className="w-10 h-10 text-success-verified" />
            </div>
            <h2 className="font-h3 text-h3 text-white mb-4">Account Created!</h2>
            <p className="font-body-md text-body-md text-white/70 mb-6">
              Your account has been successfully created. Redirecting to login...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-container relative overflow-hidden">
      <AuthHeader />
      
      {/* Decorative gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-[#B8860B]/20 to-transparent blur-[100px]"></div>
        <div className="absolute bottom-[10%] -right-[5%] w-[30%] h-[50%] rounded-full bg-gradient-to-tl from-primary to-[#B8860B]/10 blur-[80px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-4 md:px-0 pt-20">
        <div className="glass-card rounded-xl p-6 md:p-8 w-full">
          {mode === 'loading' ? (
            <div className="text-center py-12">
              <Loader2 className="w-10 h-10 animate-spin text-[#B8860B] mx-auto mb-4" />
              <p className="text-white/70">Verifying...</p>
            </div>
          ) : mode === 'code' ? (
            <form onSubmit={handleCodeSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-secondary-container mb-4">
                  <Mail className="text-secondary-container w-8 h-8" />
                </div>
                <h2 className="font-h3 text-h3 text-white mb-2">Verify Your Email</h2>
                <p className="font-body-md text-body-md text-white/70">
                  Enter the 6-digit code sent to {email || 'your email'}
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-error-alert/20 border border-error-alert/30 text-error text-sm font-body-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block font-label-caps text-label-caps text-white/70 mb-2 uppercase" htmlFor="code">
                  Verification Code
                </label>
                <div className="relative gold-glow rounded-lg transition-shadow duration-200">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    className="block w-full pl-10 pr-3 py-3 bg-[#0a1529] border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-0 focus:border-transparent transition-colors text-center font-data-lg text-data-lg tracking-widest"
                    id="code"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    disabled={isLoading}
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
                <Link href="/register" className="text-white/70 hover:text-secondary-fixed text-sm">
                  ← Back to registration
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-secondary-container mb-4">
                  <Lock className="text-secondary-container w-8 h-8" />
                </div>
                <h2 className="font-h3 text-h3 text-white mb-2">Create Password</h2>
                <p className="font-body-md text-body-md text-white/70">
                  Almost done! Create a password for your account
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-error-alert/20 border border-error-alert/30 text-error text-sm font-body-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block font-label-caps text-label-caps text-white/70 mb-2 uppercase" htmlFor="password">
                  Password
                </label>
                <div className="relative gold-glow rounded-lg transition-shadow duration-200">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    className="block w-full pl-10 pr-10 py-3 bg-[#0a1529] border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-0 focus:border-transparent transition-colors"
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="font-body-sm text-body-sm text-white/50 mt-1 text-xs">Must be at least 8 characters long.</p>
              </div>

              <div>
                <label className="block font-label-caps text-label-caps text-white/70 mb-2 uppercase" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <div className="relative gold-glow rounded-lg transition-shadow duration-200">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    className="block w-full pl-10 pr-4 py-3 bg-[#0a1529] border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-0 focus:border-transparent transition-colors"
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={isLoading}
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
      </div>
    </div>
  );
}