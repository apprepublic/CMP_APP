'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { api } from '@/lib/api';
import { useUserStore } from '@/stores/userStore';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/ui/page-transition';
import { Button } from '@/components/ui/button';
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
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm font-body-md text-body-md font-medium text-primary-container bg-[#B8860B] hover:bg-[#8B6914] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B8860B] transition-colors duration-200"
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-on-primary-container font-label-caps text-label-caps">OR CONTINUE WITH</span>
                </div>
              </div>

              {/* Social Logins */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="w-full bg-surface-alt border border-outline-variant rounded-lg px-4 py-2.5 font-body-sm text-body-sm font-medium text-on-surface hover:bg-surface-variant transition-colors"
                  disabled
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                  </svg>
                  Google
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-surface-alt border border-outline-variant rounded-lg px-4 py-2.5 font-body-sm text-body-sm font-medium text-on-surface hover:bg-surface-variant transition-colors"
                  disabled
                >
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.89-1.99 1.57-3.117 1.57-.12 0-.255-.008-.396-.037.03-.306.04-.42.04-.555 0-1.11-.476-2.184-1.12-2.955-.78-.916-2.064-1.577-3.187-1.577-.11 0-.222.008-.344.025C7.034 1.258 7.02 1.39 7.02 1.52c0 1.05.448 2.13 1.096 2.887.755.877 1.954 1.53 3.058 1.53.11 0 .23-.008.358-.026-.03.284-.04.407-.04.53 0 1.14.49 2.26 1.175 3.07.75.89 2.002 1.57 3.125 1.57.11 0 .243-.007.382-.03-.023-.274-.034-.397-.034-.523zm-11.43 14.5c-2.316 0-4.14 1.777-4.14 3.96 0 2.186 1.83 3.966 4.15 3.966 2.324 0 4.145-1.782 4.145-3.967 0-2.182-1.823-3.96-4.155-3.96zM18.736 9.4c-2.32 0-4.15 1.776-4.15 3.96 0 2.184 1.832 3.964 4.155 3.964 2.32 0 4.145-1.78 4.145-3.965 0-2.18-1.824-3.96-4.15-3.96z"></path>
                  </svg>
                  Apple
                </Button>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            {/* Footer Link */}
            <p className="mt-8 text-center font-body-sm text-body-sm text-on-primary-container">
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