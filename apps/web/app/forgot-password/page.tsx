'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/ui/page-transition';
import { Input } from '@/components/ui/input';
import { AuthHeader } from '@/components/auth-header';
import { Mail, ArrowRight, Lock } from 'lucide-react';

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
    <div className="min-h-screen bg-primary-container relative overflow-hidden bg-pattern">
      <AuthHeader />
      {/* Abstract 3D Shapes (Decorative) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-[#B8860B]/20 to-transparent blur-[100px]"></div>
        <div className="absolute bottom-[10%] -right-[5%] w-[30%] h-[50%] rounded-full bg-gradient-to-tl from-primary to-[#B8860B]/10 blur-[80px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-margin-mobile md:px-0 pt-20">
        <StaggerContainer stagger={0.1}>
          <StaggerItem>
            {/* Logo/Brand */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-secondary-container mb-4">
                <Lock className="text-secondary-container w-8 h-8" />
              </div>
              <h1 className="font-h2 text-h1-mobile md:text-h2 text-white mb-2">Recover Access</h1>
              <p className="font-body-md text-body-md text-white/70">
                Enter your email address to receive a secure recovery link.
              </p>
            </div>
          </StaggerItem>

          <StaggerItem>
            {/* Recovery Form Card */}
            {success ? (
              <div className="glass-card rounded-xl p-6 md:p-8 w-full text-center">
                <div className="w-20 h-20 bg-success-verified/20 rounded-full flex items-center justify-center mb-6 mx-auto border border-success-verified/30">
                  <Mail className="w-10 h-10 text-success-verified" />
                </div>
                <h2 className="font-h3 text-h3 text-white mb-4">Check Your Email</h2>
                <p className="font-body-md text-body-md text-white/70 mb-6">
                  We've sent a password reset link to <span className="font-semibold text-secondary-fixed">{email}</span>
                </p>
                <Link href="/login">
                  <button className="w-full h-12 bg-[#B8860B] hover:bg-[#8B6914] text-primary-container font-bold font-body-md text-body-md rounded-lg transition-colors duration-200">
                    Back to Login
                  </button>
                </Link>
              </div>
            ) : (
              <div className="glass-card rounded-xl p-6 md:p-8 w-full">
                {/* Decorative Gold Accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-secondary-container"></div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-3 rounded-lg bg-error-alert/20 border border-error-alert/30 text-error text-sm font-body-sm">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block font-label-caps text-label-caps text-white/70 mb-2 uppercase" htmlFor="email">
                      Email Address
                    </label>
                    <div className="relative gold-glow rounded-lg transition-shadow duration-200">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="w-5 h-5 text-white/50" />
                      </div>
                      <input
                        className="block w-full pl-10 pr-3 py-3 bg-[#0a1529] border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-0 focus:border-transparent transition-colors"
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

                <div className="mt-6 text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center font-body-sm text-body-sm text-white/70 hover:text-secondary-fixed transition-colors group"
                  >
                    <ArrowRight className="mr-1 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Login
                  </Link>
                </div>
              </div>
            )}
          </StaggerItem>

          <StaggerItem>
            {/* Support Note */}
            <p className="mt-8 text-center font-body-sm text-body-sm text-white/70">
              Need further assistance?{' '}
              <Link href="/support" className="text-secondary-container hover:underline">
                Contact Support
              </Link>
            </p>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </div>
  );
}