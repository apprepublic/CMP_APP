'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { NeuCard } from '@/components/ui/neu-card';
import { NeuIconBadge } from '@/components/ui/neu-icon-badge';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/ui/page-transition';
import { Mail, Lock, Eye, EyeOff, Smartphone } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { api } from '@/lib/api';
import { useUserStore } from '@/stores/userStore';

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
    <PageTransition className="min-h-screen bg-neu-bg flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <NeuCard padding="lg" className="w-full max-w-md">
          <StaggerContainer stagger={0.1}>
            <StaggerItem>
              <div className="text-center mb-8">
                <Link href="/" className="font-h2 text-h2 text-neo-text-primary">CMPapp</Link>
                <p className="font-body-md text-body-md text-neo-text-secondary mt-2">Welcome back! Sign in to continue.</p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-3 rounded-lg bg-neo-error/10 text-neo-error text-sm font-body-sm">
                    {error}
                  </div>
                )}
                <Input
                  label="Email or Phone"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email or phone number"
                  icon={<Mail className="w-5 h-5" />}
                  disabled={isLoading}
                />

                <div>
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    icon={<Lock className="w-5 h-5" />}
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-neo-bg-dark text-neo-primary focus:ring-neo-primary" />
                    <span className="font-body-sm text-body-sm text-neo-text-secondary">Remember me</span>
                  </label>
                  <Link href="/forgot-password" className="font-body-sm text-body-sm text-neo-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  variant="default"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neo-bg-dark"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-neu-bg text-neo-text-secondary font-body-sm">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" size="default" className="gap-2 h-12" disabled>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="font-body-md text-body-md">Google</span>
                  </Button>
                  <Button variant="outline" size="default" className="gap-2 h-12" disabled>
                    <Smartphone className="w-5 h-5" />
                    <span className="font-body-md text-body-md">Phone</span>
                  </Button>
                </div>
              </form>
            </StaggerItem>
          </StaggerContainer>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="text-center font-body-md text-body-md text-neo-text-secondary mt-6"
          >
            Don't have an account?{' '}
            <Link href="/register" className="text-neo-primary font-semibold hover:underline">
              Sign up
            </Link>
          </motion.p>
        </NeuCard>
      </div>

      {/* Right Panel - Visual */}
      <div className="hidden lg:flex flex-1 bg-neo-bg-dark items-center justify-center p-12 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-lg text-center"
        >
          <NeuIconBadge size="lg" className="mx-auto mb-8" style={{ background: 'var(--neo-secondary)' }}>
            <span className="material-symbols-outlined text-neo-text-primary text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
          </NeuIconBadge>
          <h2 className="font-h1 text-h1 text-neo-text-primary mb-4">Start Earning Today</h2>
          <p className="font-body-lg text-body-lg text-neo-text-secondary">
            Join thousands of creators in the Lagos digital revolution. Complete tasks, stream music, and grow your wealth.
          </p>
        </motion.div>
      </div>
    </PageTransition>
  );
}
