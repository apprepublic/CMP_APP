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
import { Mail, Lock, Eye, EyeOff, User, Smartphone, CheckCircle, ArrowRight, Coins } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useUserStore();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!acceptTerms) {
      setError('You must accept the terms of service');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const { data: authData, error: supabaseError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: `${formData.firstName} ${formData.lastName}`.trim(),
            phone: formData.phone || undefined,
          },
        },
      });

      if (supabaseError) {
        console.error('Supabase signup error:', supabaseError);
        throw supabaseError;
      }

      console.log('Supabase auth successful:', authData.user?.id);

      // Try to register with API, but don't fail if it's down
      try {
        await api.register({
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          displayName: `${formData.firstName} ${formData.lastName}`.trim(),
          username: formData.email.split('@')[0],
          referralCode: formData.referralCode || undefined,
        });
        console.log('API registration successful');
      } catch (apiError: any) {
        console.warn('API registration failed (this is OK):', apiError.message);
      }

      await register({
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        displayName: `${formData.firstName} ${formData.lastName}`.trim(),
        username: formData.email.split('@')[0],
        referralCode: formData.referralCode || undefined,
      });

      console.log('Registration complete, redirecting to dashboard...');
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition className="min-h-screen flex flex-col lg:flex-row bg-surface">
      {/* Left Side: Graphic / Branding (Desktop Only) */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 bg-primary-container relative overflow-hidden items-center justify-center p-12"
      >
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-secondary-container via-transparent to-transparent"></div>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        
        <div className="relative z-10 max-w-lg text-on-tertiary">
          <h2 className="font-h1 text-h1 mb-6 text-on-tertiary">Fuel Your Creative Enterprise.</h2>
          <p className="font-body-lg text-body-lg text-on-primary-container mb-12">
            Join a global network of creators. Secure banking, powerful growth tools, and an exclusive community await.
          </p>
          
          {/* Premium Image */}
          <div className="relative rounded-xl overflow-hidden shadow-2xl aspect-[4/3]">
            <img
              alt="Abstract rendering of digital growth"
              className="object-cover w-full h-full"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUHyZ25whfdxqOv6NL62l2V6HP8hhOYcfx42xAxv3dPw51w3smkjJOn2Q01Nt9zCBGqdBHuMvXacC3npJNQPGCHL0-0TsU7S4WIXgPJly-j1rAHD6sNADHa_fGospvd4s-TGSdDqQycSjVfzh8S3oAVo1fQo64mVjGa4EW05Hm4ywzRLd-x9jFFwHYSNFOubC1LzP-ujOy8Vf_UxfydQfUecSUxN1iN-0314FpnErMXzbCsjMgsqwrBKHzJFi_E07_21u-uYpiczQ"
            />
            <div className="absolute inset-0 bg-navy-glass mix-blend-multiply opacity-40"></div>
          </div>
        </div>
      </motion.div>

      {/* Right Side: Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full max-w-md bg-surface-container-lowest rounded-xl p-8 md:p-10 relative shadow-[0px_4px_20px_rgba(0,0,0,0.04)]"
        >
          {/* Incentive Badge */}
          <div className="absolute -top-4 -right-4 md:-right-6 bg-surface-container-lowest border-[1.5px] border-[#B8860B] rounded-full py-2 px-4 shadow-lg flex items-center gap-2 transform rotate-2 hover:rotate-0 transition-transform cursor-default z-20">
            <Coins className="text-[#B8860B] w-5 h-5" />
            <span className="font-data-md text-data-md text-[#B8860B]">500 Bonus Coins</span>
          </div>

          <StaggerContainer stagger={0.08}>
            <StaggerItem>
              {/* Header */}
              <div className="mb-8">
                <h1 className="font-h2 text-h1-mobile md:text-h2 text-primary-container mb-2">Create Account</h1>
                <p className="font-body-md text-body-md text-on-surface-variant">Start building your secure financial future.</p>
              </div>
            </StaggerItem>

            <StaggerItem>
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-3 rounded-lg bg-error/10 border border-error/30 text-error text-sm font-body-sm">
                    {error}
                  </div>
                )}

                {/* Full Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase" htmlFor="firstName">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                      <input
                        className="w-full pl-10 pr-4 py-3 bg-surface-alt border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-container focus:border-primary-container font-body-md text-body-md text-on-surface transition-colors placeholder:text-outline"
                        id="firstName"
                        name="firstName"
                        placeholder="Alex"
                        required
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase" htmlFor="lastName">
                      Last Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                      <input
                        className="w-full pl-10 pr-4 py-3 bg-surface-alt border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-container focus:border-primary-container font-body-md text-body-md text-on-surface transition-colors placeholder:text-outline"
                        id="lastName"
                        name="lastName"
                        placeholder="Carter"
                        required
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                    <input
                      className="w-full pl-10 pr-4 py-3 bg-surface-alt border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-container focus:border-primary-container font-body-md text-body-md text-on-surface transition-colors placeholder:text-outline"
                      id="email"
                      name="email"
                      placeholder="alex@creativehub.com"
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase" htmlFor="phone">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                    <input
                      className="w-full pl-10 pr-4 py-3 bg-surface-alt border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-container focus:border-primary-container font-body-md text-body-md text-on-surface transition-colors placeholder:text-outline"
                      id="phone"
                      name="phone"
                      placeholder="+2348012345678"
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                    <input
                      className="w-full pl-10 pr-10 py-3 bg-surface-alt border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-container focus:border-primary-container font-body-md text-body-md text-on-surface transition-colors placeholder:text-outline"
                      id="password"
                      name="password"
                      placeholder="••••••••"
                      required
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="font-body-sm text-body-sm text-outline mt-1 text-xs">Must be at least 6 characters long.</p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                    <input
                      className="w-full pl-10 pr-4 py-3 bg-surface-alt border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-container focus:border-primary-container font-body-md text-body-md text-on-surface transition-colors placeholder:text-outline"
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="••••••••"
                      required
                      type={showPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Referral Code */}
                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase" htmlFor="referralCode">
                    Referral Code (Optional)
                  </label>
                  <div className="relative">
                    <Coins className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                    <input
                      className="w-full pl-10 pr-4 py-3 bg-surface-alt border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-container focus:border-primary-container font-body-md text-body-md text-on-surface transition-colors placeholder:text-outline"
                      id="referralCode"
                      name="referralCode"
                      placeholder="Enter code"
                      type="text"
                      value={formData.referralCode}
                      onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* TOS Checkbox */}
                <div className="flex items-start gap-3 pt-2">
                  <div className="flex items-center h-5">
                    <input
                      className="w-4 h-4 rounded border-outline-variant text-primary-container focus:ring-primary-container focus:ring-2 bg-surface-alt"
                      id="terms"
                      name="terms"
                      required
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      disabled={isLoading}
                    />
                  </div>
                  <label className="font-body-sm text-body-sm text-on-surface-variant leading-tight" htmlFor="terms">
                    I agree to the{' '}
                    <Link href="/terms" className="text-primary-container hover:underline font-medium">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-primary-container hover:underline font-medium">
                      Privacy Policy
                    </Link>
                    .
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={!acceptTerms || isLoading}
                  className="w-full bg-[#B8860B] hover:bg-[#8B6914] text-primary-container font-bold font-body-md text-body-md py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mt-4 shadow-sm group"
                >
                  Join the Economy
                  <ArrowRight className="group-hover:translate-x-1 transition-transform w-5 h-5" />
                </Button>
              </form>
            </StaggerItem>

            <StaggerItem>
              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-outline-variant"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-surface-container-lowest text-outline font-label-caps text-label-caps">OR CONTINUE WITH</span>
                </div>
              </div>

              {/* Social Logins */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="flex items-center justify-center w-full bg-surface-alt border border-outline-variant rounded-lg px-4 py-2.5 font-body-sm text-body-sm font-medium text-on-surface hover:bg-surface-variant transition-colors"
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
                  className="flex items-center justify-center w-full bg-surface-alt border border-outline-variant rounded-lg px-4 py-2.5 font-body-sm text-body-sm font-medium text-on-surface hover:bg-surface-variant transition-colors"
                  disabled
                >
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.89-1.99 1.57-3.117 1.57-.12 0-.255-.008-.396-.037.03-.306.04-.42.04-.555 0-1.11-.476-2.184-1.12-2.955-.78-.916-2.064-1.577-3.187-1.577-.11 0-.222.008-.344.025C7.034 1.258 7.02 1.39 7.02 1.52c0 1.05.448 2.13 1.096 2.887.755.877 1.954 1.53 3.058 1.53.11 0 .23-.008.358-.026-.03.284-.04.407-.04.53 0 1.14.49 2.26 1.175 3.07.75.89 2.002 1.57 3.125 1.57.11 0 .243-.007.382-.03-.023-.274-.034-.397-.034-.523zm-11.43 14.5c-2.316 0-4.14 1.777-4.14 3.96 0 2.186 1.83 3.966 4.15 3.966 2.324 0 4.145-1.782 4.145-3.967 0-2.182-1.823-3.96-4.155-3.96zM18.736 9.4c-2.32 0-4.15 1.776-4.15 3.96 0 2.184 1.832 3.964 4.155 3.964 2.32 0 4.145-1.78 4.145-3.965 0-2.18-1.824-3.96-4.15-3.96z"></path>
                  </svg>
                  Apple
                </Button>
              </div>
            </StaggerItem>

            <StaggerItem>
              {/* Footer Link */}
              <p className="text-center font-body-sm text-body-sm text-on-surface-variant mt-8">
                Already have an account?{' '}
                <Link href="/login" className="text-primary-container font-medium hover:underline">
                  Sign In
                </Link>
              </p>
            </StaggerItem>
          </StaggerContainer>
        </motion.div>
      </div>
    </PageTransition>
  );
}