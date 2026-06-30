'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Mail, User, Smartphone, ArrowRight, Coins } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    referralCode: '',
  });
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

    setIsLoading(true);

    try {
      const { data, error: funcError } = await supabase.functions.invoke('register-user', {
        body: {
          email: formData.email,
          fullName: `${formData.firstName} ${formData.lastName}`.trim(),
          referralCode: formData.referralCode || undefined,
        },
      });

      if (funcError) {
        throw new Error(funcError.message || 'Failed to register');
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Registration failed');
      }

      router.push(`/verify?email=${encodeURIComponent(formData.email)}`);
    } catch (err: any) {
      console.error('Registration error:', err);
      const msg = err?.message || '';
      if (msg.includes('duplicate key') && msg.includes('users_email_key')) {
        setError('An account with this email already exists. Please sign in instead.');
      } else if (msg.includes('already registered') || msg.includes('already exists')) {
        setError('An account with this email already exists. Please sign in instead.');
      } else if (msg.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please try again.');
      } else if (msg.includes('Email not confirmed')) {
        setError('Please check your inbox and confirm your email address before signing in.');
      } else {
        setError(msg || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md bg-surface-container-lowest rounded-xl p-8 md:p-10 relative shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
        {/* Incentive Badge */}
        <div className="absolute -top-4 -right-4 md:-right-6 bg-surface-container-lowest border-[1.5px] border-[#B8860B] rounded-full py-2 px-4 shadow-lg flex items-center gap-2 transform rotate-2 hover:rotate-0 transition-transform cursor-default z-20">
          <Coins className="text-[#B8860B] w-5 h-5" />
          <span className="font-data-md text-data-md text-[#B8860B]">500 Bonus Coins</span>
        </div>

        <div className="space-y-5">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-h2 text-h1-mobile md:text-h2 text-primary-container mb-2">Create Account</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Start building your secure financial future.</p>
          </div>

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
            <button
              type="submit"
              disabled={!acceptTerms || isLoading}
              className="w-full h-12 bg-[#B8860B] hover:bg-[#8B6914] text-primary-container font-bold font-body-md text-body-md rounded-lg transition-colors flex items-center justify-center gap-2 mt-4 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              Join the Economy
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Footer Link */}
          <p className="text-center font-body-sm text-body-sm text-on-surface-variant mt-8">
            Already have an account?{' '}
            <Link href="/login" className="text-primary-container font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}