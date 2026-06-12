'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { NeuCard } from '@/components/ui/neu-card';
import { NeuIconBadge } from '@/components/ui/neu-icon-badge';
import { NeuToggle } from '@/components/ui/neu-toggle';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/ui/page-transition';
import { Mail, Lock, Eye, EyeOff, Smartphone, CheckCircle, Rocket } from 'lucide-react';

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
    <PageTransition className="min-h-screen bg-neu-bg flex">
      {/* Left Panel - Visual */}
      <div className="hidden lg:flex flex-1 bg-neo-bg-dark items-center justify-center p-12">
        <div className="max-w-lg text-center">
          <NeuIconBadge size="lg" active className="mx-auto mb-8" style={{ background: 'var(--neo-secondary)' }}>
            <Rocket className="w-10 h-10 text-neo-primary" />
          </NeuIconBadge>
          <h2 className="font-h1 text-h1 text-neo-text-primary mb-4">Join the Revolution</h2>
          <p className="font-body-lg text-body-lg text-neo-text-secondary mb-8">
            Start your journey with <span className="text-neo-secondary font-bold">500 Bonus Coins</span> when you sign up today!
          </p>
          <div className="flex flex-col gap-4 text-left mx-auto max-w-xs">
            <div className="flex items-center gap-3 text-neo-text-primary">
              <NeuIconBadge size="sm" active>
                <CheckCircle className="w-4 h-4 text-neo-secondary" />
              </NeuIconBadge>
              <span className="font-body-md">Earn coins from day one</span>
            </div>
            <div className="flex items-center gap-3 text-neo-text-primary">
              <NeuIconBadge size="sm" active>
                <CheckCircle className="w-4 h-4 text-neo-secondary" />
              </NeuIconBadge>
              <span className="font-body-md">Stream music and earn</span>
            </div>
            <div className="flex items-center gap-3 text-neo-text-primary">
              <NeuIconBadge size="sm" active>
                <CheckCircle className="w-4 h-4 text-neo-secondary" />
              </NeuIconBadge>
              <span className="font-body-md">3-tier referral program</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <NeuCard padding="lg" className="w-full max-w-md">
          <StaggerContainer stagger={0.08}>
            <StaggerItem>
              <div className="mb-6">
                <Link href="/" className="font-h2 text-h2 text-neo-text-primary">CMPapp</Link>
                <p className="font-body-md text-body-md text-neo-text-secondary mt-2">Create your account and start earning.</p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="First name"
                  />
                  <Input
                    label="Last Name"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Last name"
                  />
                </div>

                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  icon={<Mail className="w-5 h-5" />}
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+2348012345678"
                  icon={<Smartphone className="w-5 h-5" />}
                />

                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Create a password"
                    icon={<Lock className="w-5 h-5" />}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-[38px] text-neo-text-muted hover:text-neo-text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <Input
                  label="Referral Code (Optional)"
                  type="text"
                  value={formData.referralCode}
                  onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
                  placeholder="Enter referral code"
                />

                <label className="flex items-start gap-3 cursor-pointer">
                  <NeuToggle
                    size="md"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                  />
                  <span className="font-body-sm text-body-sm text-neo-text-secondary">
                    I agree to the{' '}
                    <Link href="/terms" className="text-neo-primary hover:underline">Terms of Service</Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-neo-primary hover:underline">Privacy Policy</Link>
                  </span>
                </label>

                <Button
                  type="submit"
                  disabled={!acceptTerms}
                  className="w-full"
                  size="lg"
                  variant="default"
                >
                  Create Account
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neo-bg-dark"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-neu-bg text-neo-text-secondary font-body-sm">Or sign up with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" size="default" className="gap-2 h-12">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="font-body-md text-body-md">Google</span>
                  </Button>
                  <Button variant="outline" size="default" className="gap-2 h-12">
                    <Smartphone className="w-5 h-5" />
                    <span className="font-body-md text-body-md">Phone</span>
                  </Button>
                </div>
              </form>
            </StaggerItem>
          </StaggerContainer>

          <p className="text-center font-body-md text-body-md text-neo-text-secondary mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-neo-primary font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </NeuCard>
      </div>
    </PageTransition>
  );
}
