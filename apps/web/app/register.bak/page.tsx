'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Register:', formData);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Visual */}
      <div className="hidden lg:flex flex-1 bg-primary-container items-center justify-center p-12">
        <div className="max-w-lg text-center">
          <div className="w-32 h-32 rounded-full bg-secondary flex items-center justify-center mx-auto mb-8">
            <span className="material-symbols-outlined text-primary text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
          </div>
          <h2 className="font-h1 text-h1 text-on-primary mb-4">Join the Revolution</h2>
          <p className="font-body-lg text-body-lg text-on-primary-container mb-8">
            Start your journey with <span className="text-secondary font-bold">500 Bonus Coins</span> when you sign up today!
          </p>
          <div className="flex flex-col gap-4 text-left mx-auto max-w-xs">
            <div className="flex items-center gap-3 text-on-primary">
              <span className="material-symbols-outlined text-secondary">check_circle</span>
              <span className="font-body-md">Earn coins from day one</span>
            </div>
            <div className="flex items-center gap-3 text-on-primary">
              <span className="material-symbols-outlined text-secondary">check_circle</span>
              <span className="font-body-md">Stream music and earn</span>
            </div>
            <div className="flex items-center gap-3 text-on-primary">
              <span className="material-symbols-outlined text-secondary">check_circle</span>
              <span className="font-body-md">3-tier referral program</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          {/* Logo */}
          <div>
            <Link href="/" className="font-h2 text-h2 text-primary">CMPapp</Link>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">Create your account and start earning.</p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-body-sm text-body-sm text-on-surface block mb-2">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full bg-surface-container-lowest border-2 border-outline-variant/30 text-on-surface rounded-xl px-4 py-3 font-body-md focus:border-secondary focus:ring-0 transition-all"
                  placeholder="First name"
                />
              </div>
              <div>
                <label className="font-body-sm text-body-sm text-on-surface block mb-2">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full bg-surface-container-lowest border-2 border-outline-variant/30 text-on-surface rounded-xl px-4 py-3 font-body-md focus:border-secondary focus:ring-0 transition-all"
                  placeholder="Last name"
                />
              </div>
            </div>

            <div>
              <label className="font-body-sm text-body-sm text-on-surface block mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-surface-container-lowest border-2 border-outline-variant/30 text-on-surface rounded-xl px-4 py-3 font-body-md focus:border-secondary focus:ring-0 transition-all"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="font-body-sm text-body-sm text-on-surface block mb-2">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-surface-container-lowest border-2 border-outline-variant/30 text-on-surface rounded-xl px-4 py-3 font-body-md focus:border-secondary focus:ring-0 transition-all"
                placeholder="+2348012345678"
              />
            </div>

            <div>
              <label className="font-body-sm text-body-sm text-on-surface block mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-surface-container-lowest border-2 border-outline-variant/30 text-on-surface rounded-xl px-4 py-3 font-body-md focus:border-secondary focus:ring-0 transition-all pr-12"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div>
              <label className="font-body-sm text-body-sm text-on-surface block mb-2">Referral Code (Optional)</label>
              <input
                type="text"
                value={formData.referralCode}
                onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
                className="w-full bg-surface-container-lowest border-2 border-outline-variant/30 text-on-surface rounded-xl px-4 py-3 font-body-md focus:border-secondary focus:ring-0 transition-all"
                placeholder="Enter referral code"
              />
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="w-4 h-4 mt-1 rounded border-outline text-secondary focus:ring-secondary"
              />
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                I agree to the{' '}
                <Link href="/terms" className="text-secondary hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-secondary hover:underline">Privacy Policy</Link>
              </span>
            </label>

            <button
              type="submit"
              disabled={!acceptTerms}
              className="w-full bg-secondary hover:bg-secondary-fixed disabled:bg-surface-variant disabled:text-on-surface-variant text-primary font-h3 text-h3 py-4 rounded-xl transition-colors shadow-lg"
            >
              Create Account
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-background text-on-surface-variant font-body-sm">Or sign up with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 hover:bg-surface-alt transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="font-body-md text-body-md">Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 hover:bg-surface-alt transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
                <span className="font-body-md text-body-md">Phone</span>
              </button>
            </div>
          </form>

          <p className="text-center font-body-md text-body-md text-on-surface-variant">
            Already have an account?{' '}
            <Link href="/login" className="text-secondary font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}