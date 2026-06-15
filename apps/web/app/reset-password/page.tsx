'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/ui/page-transition';
import { Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
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
      setError(err.message || 'Failed to update password');
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
      </div>

      <div className="relative z-10 w-full max-w-md px-margin-mobile md:px-0">
        <StaggerContainer stagger={0.1}>
          <StaggerItem>
            {/* Icon Header */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center">
                <Lock className="text-primary-container w-8 h-8" />
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            {/* Text Content */}
            <div className="text-center mb-8">
              <h1 className="font-h2 text-h2 text-white mb-2">Set New Password</h1>
              <p className="font-body-md text-body-md text-white/70">Please enter your new secure password.</p>
            </div>
          </StaggerItem>

          <StaggerItem>
            {/* Form */}
            <div className="glass-card rounded-xl p-6 md:p-8 w-full">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-3 rounded-lg bg-error-alert/20 border border-error-alert/30 text-error text-sm font-body-sm">
                    {error}
                  </div>
                )}

                {/* New Password Input */}
                <div>
                  <label className="block font-label-caps text-label-caps text-white/70 mb-2 uppercase" htmlFor="new-password">
                    New Password
                  </label>
                  <div className="relative gold-glow rounded-lg transition-shadow duration-200">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                    <input
                      className="block w-full pl-10 pr-10 py-3 bg-[#0a1529] border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-0 focus:border-transparent transition-colors"
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
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label className="block font-label-caps text-label-caps text-white/70 mb-2 uppercase" htmlFor="confirm-password">
                    Confirm New Password
                  </label>
                  <div className="relative gold-glow rounded-lg transition-shadow duration-200">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                    <input
                      className="block w-full pl-10 pr-4 py-3 bg-[#0a1529] border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-0 focus:border-transparent transition-colors"
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
                  className="w-full bg-[#B8860B] hover:bg-[#8B6914] text-primary-container font-bold font-body-md text-body-md py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </PageTransition>
  );
}