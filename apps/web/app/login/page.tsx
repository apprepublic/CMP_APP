'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { api } from '@/lib/api';
import { useUserStore } from '@/stores/userStore';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/ui/page-transition';
import { Input } from '@/components/ui/input';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useUserStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition className="min-h-screen bg-primary-container flex items-center justify-center relative overflow-hidden bg-pattern">
      {/* Abstract 3D Shapes (Decorative) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-[#B8860B]/20 to-transparent blur-[100px]"></div>
        <div className="absolute bottom-[10%] -right-[5%] w-[30%] h-[50%] rounded-full bg-gradient-to-tl from-primary to-[#B8860B]/10 blur-[80px]"></div>
        <img
          alt="3D Abstract Accent"
          className="absolute top-10 right-10 w-64 h-64 object-cover rounded-full opacity-20 mix-blend-screen blur-sm hidden lg:block"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuARkhJ0_qaj1c-fdtPkq1fKtOjFcYZYa08nBw8127tlAgqHTdRh9Clrpu_KFwjfZeAy2BXxMUo1wj_STzX0SETGOoN5L7fu7zbI-LqwLMkSxe_VXyg1N_dI_6-1kiJx_meGJaFZ-L11cgnpID3Yh4U8tS8Mrpou4L9OUPMqCt4VrzGmtuxK0-gnjQ5Wli8u4E-8qMajkzuwV2TfTNN4Hi5X9UBvF-XRwz4m_E3VsJ7XsgkLeU8ZpiHrna4cY2vVqOfLqLUjbn0A0-g"
        />
      </div>

      {/* Login Container */}
      <div className="relative z-10 w-full max-w-md px-margin-mobile md:px-0">
        <StaggerContainer stagger={0.1}>
          <StaggerItem>
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="font-h2 text-h1-mobile md:text-h2 text-on-primary mb-2">CMPapp</h1>
              <p className="font-body-sm text-body-sm text-on-primary-container">Secure access to your creative enterprise.</p>
            </div>
          </StaggerItem>

          <StaggerItem>
            {/* Glassmorphism Card */}
            <div className="glass-card rounded-xl p-6 md:p-8 w-full">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-3 rounded-lg bg-error-alert/20 border border-error-alert/30 text-error text-sm font-body-sm">
                    {error}
                  </div>
                )}

                {/* Email Input */}
                <div>
                  <label className="block font-label-caps text-label-caps text-on-primary-container mb-2 uppercase" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative gold-glow rounded-lg transition-shadow duration-200">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-on-primary-container">
                      <Mail className="w-5 h-5" />
                    </span>
                    <input
                      className="block w-full pl-10 pr-3 py-3 bg-[#0a1529] border border-white/10 rounded-lg text-on-primary placeholder-on-primary-container focus:outline-none focus:ring-0 focus:border-transparent transition-colors"
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
                  <label className="block font-label-caps text-label-caps text-on-primary-container mb-2 uppercase" htmlFor="password">
                    Password
                  </label>
                  <div className="relative gold-glow rounded-lg transition-shadow duration-200">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-on-primary-container">
                      <Lock className="w-5 h-5" />
                    </span>
                    <input
                      className="block w-full pl-10 pr-10 py-3 bg-[#0a1529] border border-white/10 rounded-lg text-on-primary placeholder-on-primary-container focus:outline-none focus:ring-0 focus:border-transparent transition-colors"
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
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-on-primary-container hover:text-white transition-colors"
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
                      className="h-4 w-4 rounded border-white/20 bg-[#0a1529] text-[#B8860B] focus:ring-[#B8860B] focus:ring-offset-primary-container"
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                    />
                    <label className="ml-2 block font-body-sm text-body-sm text-on-primary-container" htmlFor="remember-me">
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
            </div>
          </StaggerItem>

          <StaggerItem>
            {/* Footer Link */}
            <p className="mt-6 text-center font-body-sm text-body-sm text-on-primary-container">
              Don't have an account?{' '}
              <Link href="/register" className="font-medium text-[#B8860B] hover:text-[#8B6914] transition-colors">
                Create an Account
              </Link>
            </p>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </PageTransition>
  );
}