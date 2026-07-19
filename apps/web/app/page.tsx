'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useUserStore } from '@/stores/userStore';
import { useWallet } from '@/lib/useWallet';
import { supabase } from '@/lib/supabase';
import { CheckCircle } from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated, user } = useUserStore();
  const { wallet } = useWallet();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('waitlist')
        .insert({ email } as any);

      if (error) throw error;

      setEmail('');
      alert('Thank you! You\'ve been added to our waitlist.');
    } catch (err) {
      console.error('Error adding to waitlist:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Desktop/Tablet Landing Page */}
      <div className="hidden md:block">
        <nav className="hidden md:flex fixed top-0 w-full z-50 bg-primary backdrop-blur-lg border-b border-white/10 shadow-md h-20 justify-between items-center px-margin-desktop">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="CMPapp" className="h-10 w-auto" />
          </Link>
          {isAuthenticated && (
            <div className="flex items-center gap-x-8">
              <Link className="font-body-md text-body-md text-secondary-fixed border-b-2 border-secondary-fixed pb-1" href="/dashboard">
                Dashboard
              </Link>
              <Link className="font-body-md text-body-md text-white/90 hover:text-secondary-fixed transition-colors" href="/tasks">
                Earn
              </Link>
              <Link className="font-body-md text-body-md text-white/90 hover:text-secondary-fixed transition-colors" href="/music">
                Music
              </Link>
              <Link className="font-body-md text-body-md text-white/90 hover:text-secondary-fixed transition-colors" href="/wallet">
                Wallet
              </Link>
            </div>
          )}
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <>
                <div className="premium-border-gold rounded-full px-4 py-1 flex items-center gap-2 bg-white/10 backdrop-blur-md">
                  <span className="material-symbols-outlined text-secondary-fixed text-xl">paid</span>
                  <span className="font-data-md text-data-md text-secondary-fixed">
                    {wallet?.balance?.toLocaleString() || 0}
                  </span>
                </div>
                <button className="text-white hover:text-secondary-fixed transition-colors">
                  <span className="material-symbols-outlined text-2xl">notifications</span>
                </button>
                <Link href="/settings">
                  <span className="material-symbols-outlined text-2xl text-white hover:text-secondary-fixed transition-colors cursor-pointer">account_circle</span>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <button className="text-white hover:text-secondary-fixed font-medium transition-colors">
                    Login
                  </button>
                </Link>
                <Link href="/register">
                  <button className="bg-secondary-fixed hover:bg-secondary text-on-secondary-fixed font-bold font-body-md text-body-md px-6 py-2.5 rounded-lg transition-all shadow-[0_0_20px_rgba(255,222,166,0.3)]">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
        </nav>

        <section className="relative min-h-screen pt-20 flex flex-col justify-center overflow-hidden bg-primary">
          <div className="absolute inset-0 z-0 opacity-50">
            <img
              alt="Abstract fluid background"
              className="w-full h-full object-cover mix-blend-screen"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfcs8Eu4e4-pkMRvNodpKydY50KxK09NPYZ82AnxzqyG4Lj-m7Hm6RT7aReU5oC6E9TwiQsb4zJppJg9fGkFRB6wtdKfisaleLjC6GYSD6SA4Era6QYnHpNE4mo8jLT8c30C2CidhMtkh0L8uHbhvMm4bzgJjZx3x72ufRHzCTPIkG9pXFVvcQ6FgU8rlGa5CoHP6bW_8D_pVNiT44QVTR7k7OQKQ4fgUGQaiTQAiNHk6QBYyl4Jplm-wKX_HeG9bJg4gTBokqErQ"
            />
          </div>
          <div className="hidden md:block absolute top-0 left-0 w-full h-full z-10 pointer-events-none overflow-visible">
            <img
              alt="Hero visual"
              className="absolute bottom-[0px] left-[550px] w-[900px] h-auto object-contain"
              src="/hero.png"
            />
          </div>
          <div className="relative z-20 w-full px-4 md:px-8 lg:px-16 text-left">
            <div>
              <h1 className="font-h1 text-h1 text-white max-w-4xl mb-6">
                Empower Your Creativity. <br/>
                <span className="text-secondary-fixed">Monetize Your Passion.</span>
              </h1>
            </div>
            <div>
              <p className="font-body-lg text-body-lg text-white/90 max-w-2xl mb-10">
                The first creative economy hub where every stream, task, and referral builds your wealth. Join thousands of creators in the global digital revolution.
              </p>
            </div>
            <div>
              <div className="flex flex-col sm:flex-row gap-4 justify-start items-center">
                <Link
                  href={isAuthenticated ? '/dashboard' : '/register'}
                  className="inline-flex items-center justify-center gap-3 bg-secondary-fixed hover:bg-secondary text-on-secondary-fixed font-bold font-h3 text-h3 px-8 py-4 rounded-lg transition-all scale-100 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,222,166,0.3)]"
                >
                  Join the Economy
                  <span className="material-symbols-outlined text-xl">trending_up</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-surface px-margin-mobile md:px-margin-desktop relative z-10">
          <div className="max-w-container-max mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-h2 text-h2 text-primary mb-4">Multiple Paths to Prosperity</h2>
              <div className="h-1 w-24 bg-secondary-fixed mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              <div className="bg-surface-alt/80 backdrop-blur-md p-8 rounded-xl border-b-4 border-secondary hover:border-secondary-fixed transition-all group shadow-sm">
                <div className="w-16 h-16 bg-primary-container rounded-lg flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-md">
                  <span className="material-symbols-outlined text-secondary-fixed text-4xl">headphones</span>
                </div>
                <h3 className="font-h3 text-h3 mb-4">Stream to Earn</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                  Earn coins by discovering and listening to emerging African artists. Your ears are assets—get paid for every minute you spend on premium audio.
                </p>
                <Link className="text-secondary font-bold flex items-center gap-2 hover:gap-4 transition-all" href="/music">
                  Start Listening <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
              </div>
              <div className="bg-surface-alt/80 backdrop-blur-md p-8 rounded-xl border-b-4 border-secondary hover:border-secondary-fixed transition-all group shadow-sm">
                <div className="w-16 h-16 bg-primary-container rounded-lg flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-md">
                  <span className="material-symbols-outlined text-secondary-fixed text-4xl">task_alt</span>
                </div>
                <h3 className="font-h3 text-h3 mb-4">Micro-Task Market</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                  Complete simple digital tasks for global brands. From survey participation to content tagging, leverage your downtime for steady growth.
                </p>
                <Link className="text-secondary font-bold flex items-center gap-2 hover:gap-4 transition-all" href="/tasks">
                  Browse Tasks <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
              </div>
              <div className="bg-surface-alt/80 backdrop-blur-md p-8 rounded-xl border-b-4 border-secondary hover:border-secondary-fixed transition-all group shadow-sm">
                <div className="w-16 h-16 bg-primary-container rounded-lg flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-md">
                  <span className="material-symbols-outlined text-secondary-fixed text-4xl">groups</span>
                </div>
                <h3 className="font-h3 text-h3 mb-4">Referral Network</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                  Build your tribe and earn 3-tier passive commissions. Empower your circle to earn and watch your ecosystem rewards scale indefinitely.
                </p>
                <Link className="text-secondary font-bold flex items-center gap-2 hover:gap-4 transition-all" href="/referrals">
                  Invite Friends <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-40">
            <img
              alt="Abstract fluid background"
              className="w-full h-full object-cover mix-blend-screen"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-djhaqbFQ24bTIjgMfdOIK7jXca0r5lqLrYgkl3hiceKMMiflWANi7RTkK27dtByG_Qy8fPkGiT34KLkFKB103_twCy2r2Aam2x5gPiMps1TuiTPv58MoHSEVjWvAZqxf-3lDDw2qUis_0pL93VdQHeuJcqg6LRvfWFUGSiV1zy7WU2ruCxmVbmcyS5kOtMZx1FJebjA352LxQuf5hgjbkLXtXC9cP95lsL--TEfqNFyv92ZdW5Bz1scNkI256Hv1CK3t5ZAJFRg"
            />
          </div>
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row items-center gap-16 relative z-10">
            <div className="flex-1 text-white">
              <h2 className="font-h2 text-h2 mb-6">The Coin Economy</h2>
              <p className="font-body-lg text-body-lg text-white/90 mb-8">
                CMP Coins are the heart of our creative hub. We've built a stable, transparent conversion model that bridges the gap between digital effort and real-world value.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4 glass-dark p-4 rounded-xl w-max">
                  <div className="w-12 h-12 rounded-full border border-secondary-fixed/50 flex items-center justify-center bg-primary-container/50">
                    <span className="font-data-lg text-data-lg text-secondary-fixed">1</span>
                  </div>
                  <div>
                    <div className="font-h3 text-h3 text-white">15,000 Coins : 1 USD</div>
                    <div className="font-body-sm text-body-sm text-white/70">Guaranteed conversion rate for liquidity.</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 glass-dark p-4 rounded-xl w-max">
                  <div className="w-12 h-12 rounded-full border border-secondary-fixed/50 flex items-center justify-center bg-primary-container/50">
                    <span className="font-data-lg text-data-lg text-secondary-fixed">2</span>
                  </div>
                  <div>
                    <div className="font-h3 text-h3 text-white">Global Utilities</div>
                    <div className="font-body-sm text-body-sm text-white/70">Pay subscriptions, digital goods, and services directly with coins.</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 relative w-full max-w-md">
              <div className="aspect-square glass-dark rounded-3xl p-8 flex flex-col justify-center items-center text-center shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <div className="mb-6 relative">
                  <div className="w-32 h-32 flex items-center justify-center animate-pulse shadow-lg">
                    <img src="/coin.png" alt="CMP Coin" className="w-full h-full object-contain" />
                  </div>
                  <div className="absolute -top-4 -right-4 bg-white/10 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-full font-data-md text-data-md shadow-xl">
                    Live Value
                  </div>
                </div>
                <div className="font-data-lg text-data-lg text-white mb-2">Current Balance Value</div>
                <div className="font-h1 text-h1 text-secondary-fixed">$ 83.33</div>
                <div className="font-body-sm text-body-sm text-white/70 mt-4">1,250,000 CMP COINS</div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-fixed/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-fixed/10 rounded-full blur-3xl -ml-48 -mb-48"></div>
        </section>

        <section className="py-24 bg-primary px-margin-mobile md:px-margin-desktop relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-20">
            <img
              alt="Abstract fluid background"
              className="w-full h-full object-cover mix-blend-screen"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwoEjE5iweugLps_wKqXR1uLh0kjNtpWVTWQJhXL2YbXWnNu_WRCTSnrffQlL5yLdUykpacu6IJUrnjcC5lr2vCeseIZCA-5xMCyuQqjcAEre04gx7us8jK8aZp2so2Oq3tR3imxoqoMZvAUQLnsJoxXbl7E13hGhdjgMid4eNHxvzZs_jhgXgOkNG_P38FpsGx3576-mArpwqM-_XB-R7PzEuuxV8xiaFWHqtMIg47dwpwG5jm_eKLlw-57ldpeSrnDxumFoMaEQ"
            />
          </div>
          <div className="max-w-4xl mx-auto text-center relative z-10 glass-dark p-12 rounded-3xl border border-white/20">
            <h2 className="font-h1 text-h1 text-white mb-6">Ready to Build Your Wealth?</h2>
            <p className="font-body-lg text-body-lg text-white/90 mb-12">
              Start Your Journey with <span className="text-secondary-fixed font-bold">500 Bonus Coins</span>. It takes less than 60 seconds to join the hub and begin monetizing your tasks.
            </p>
            <form onSubmit={handleEmailSubmit} className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto mb-8">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white/10 border border-white/30 rounded-lg px-6 py-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-secondary-fixed backdrop-blur-sm"
                required
              />
              <button
                type="submit"
                className="bg-secondary-fixed hover:bg-secondary text-primary font-bold font-body-md text-body-md px-16 py-4 rounded-lg transition-all shadow-[0_0_20px_rgba(255,222,166,0.3)] disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto whitespace-nowrap"
              >
                {isSubmitting ? 'Submitting...' : 'Get Started'}
              </button>
            </form>
            <div className="flex items-center justify-center gap-8 text-white/80 font-label-caps text-label-caps flex-wrap">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-secondary-fixed" />
                No Fees
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-secondary-fixed" />
                Instant Withdraw
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-secondary-fixed" />
                Global Community
              </div>
            </div>
          </div>
        </section>

        <footer className="bg-primary text-white py-16 px-margin-mobile md:px-margin-desktop border-t border-white/10">
          <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-4 gap-gutter">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <img src="/logo.png" alt="CMPapp" className="h-10 w-auto" />
              </div>
              <p className="font-body-sm text-body-sm text-white/70">
                The creative economy hub empowering the global digital generation through music, tasks, and community.
              </p>
            </div>
            <div>
              <h5 className="font-label-caps text-label-caps text-secondary-fixed mb-6">PLATFORM</h5>
              <ul className="space-y-3 font-body-sm text-body-sm text-white/70">
                <li><Link className="hover:text-secondary-fixed transition-colors" href="#">How it Works</Link></li>
                <li><Link className="hover:text-secondary-fixed transition-colors" href="/tasks">Tasks</Link></li>
                <li><Link className="hover:text-secondary-fixed transition-colors" href="/wallet">Store</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-label-caps text-label-caps text-secondary-fixed mb-6">COMMUNITY</h5>
              <ul className="space-y-3 font-body-sm text-body-sm text-white/70">
                <li><Link className="hover:text-secondary-fixed transition-colors" href="#">Discord Hub</Link></li>
                <li><Link className="hover:text-secondary-fixed transition-colors" href="/referrals">Referral Program</Link></li>
                <li><Link className="hover:text-secondary-fixed transition-colors" href="#">Creator Perks</Link></li>
                <li><Link className="hover:text-secondary-fixed transition-colors" href="/contests">Leaderboards</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-label-caps text-label-caps text-secondary-fixed mb-6">LEGAL</h5>
              <ul className="space-y-3 font-body-sm text-body-sm text-white/70">
                <li><Link className="hover:text-secondary-fixed transition-colors" href="#">Privacy Policy</Link></li>
                <li><Link className="hover:text-secondary-fixed transition-colors" href="#">Terms of Service</Link></li>
                <li><Link className="hover:text-secondary-fixed transition-colors" href="#">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="max-w-container-max mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center font-body-sm text-body-sm text-white/70 gap-4">
            <div>© 2024 CMPapp. Built for the Creative Revolution.</div>
            <div className="flex gap-6">
              <button className="cursor-pointer hover:text-secondary-fixed transition-colors">
                <span className="material-symbols-outlined">language</span>
              </button>
              <button className="cursor-pointer hover:text-secondary-fixed transition-colors">
                <span className="material-symbols-outlined">share</span>
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Mobile Landing Page */}
      <div className="md:hidden min-h-screen bg-surface text-on-surface font-body-md antialiased flex flex-col">
        <header className="fixed top-0 w-full z-50 bg-primary shadow-[0px_4px_20px_rgba(13,27,53,0.15)] flex justify-between items-center px-4 h-16">
          <div className="flex items-center gap-2">
            <Link href="/">
              <img src="/logo.png" alt="CMPapp" className="h-8 w-auto" />
            </Link>
          </div>
          <Link href="/register">
            <button className="bg-gold-metallic text-primary font-label-caps text-label-caps px-4 py-2 rounded-full hover:opacity-80 transition-opacity active:scale-95" style={{border: '1px solid #f7bd48', boxShadow: 'inset 0 0 0 1px rgba(247, 189, 72, 0.3)'}}>
              Sign Up
            </button>
          </Link>
        </header>

        <main className="flex-grow pt-16">
          <section className="relative px-4 py-stack-lg text-center overflow-hidden">
            <img src="/auth.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40" />
            <div className="content-relative flex flex-col items-center justify-center min-h-[442px]">
              <h1 className="font-['Montserrat'] text-[28px] leading-9 font-bold text-white mb-4 max-w-2xl mx-auto">
                Empower Your Creativity. Monetize Your Passion.
              </h1>
              <p className="font-body-md text-body-md text-white/80 mb-6 max-w-xl mx-auto">
                The platform designed for modern creators to build, share, and earn seamlessly.
              </p>
              <Link href="/register">
                <button className="btn-gold font-body-lg text-body-lg px-8 py-3 rounded-full hover:opacity-80 transition-opacity active:scale-95 inline-flex items-center gap-2">
                  Join the Economy
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
              </Link>
            </div>
          </section>

          <section className="px-4 py-stack-lg bg-surface">
            <div className="grid grid-cols-1 gap-4 max-w-5xl mx-auto">
              <div className="neumorphic-card rounded-xl p-4 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center mb-2 text-gold-metallic">
                  <span className="material-symbols-outlined text-[24px]">stream</span>
                </div>
                <h3 className="font-['Montserrat'] text-[24px] leading-8 font-bold text-primary mb-1">Stream to Earn</h3>
                <p className="font-body-sm text-body-sm text-on-surface-muted">Monetize your live content instantly with our integrated coin system.</p>
              </div>
              <div className="neumorphic-card rounded-xl p-4 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center mb-2 text-gold-metallic">
                  <span className="material-symbols-outlined text-[24px]">task_alt</span>
                </div>
                <h3 className="font-['Montserrat'] text-[24px] leading-8 font-bold text-primary mb-1">Micro-Task Market</h3>
                <p className="font-body-sm text-body-sm text-on-surface-muted">Complete small tasks for direct payouts to your CMP wallet.</p>
              </div>
              <div className="neumorphic-card rounded-xl p-4 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center mb-2 text-gold-metallic">
                  <span className="material-symbols-outlined text-[24px]">group_add</span>
                </div>
                <h3 className="font-['Montserrat'] text-[24px] leading-8 font-bold text-primary mb-1">Referral Network</h3>
                <p className="font-body-sm text-body-sm text-on-surface-muted">Invite friends and earn a percentage of their ongoing success.</p>
              </div>
            </div>
          </section>

          <section className="relative px-4 py-stack-lg overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img alt="" src="/coin-economy-bg.png" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 z-[1] bg-black/40"></div>
            <div className="max-w-4xl mx-auto flex flex-col items-center gap-6 relative z-[2]">
              <div className="flex-1 text-center">
                <h2 className="font-['Montserrat'] text-[28px] leading-9 font-bold text-white mb-2">The Coin Economy</h2>
                <p className="font-body-md text-body-md text-white/80 mb-4">A stable, transparent currency designed for digital creators.</p>
                <div className="flex items-center gap-4 glass-dark p-4 rounded-xl w-max mx-auto mb-4">
                  <div className="w-12 h-12 rounded-full border border-secondary-fixed/50 flex items-center justify-center bg-primary-container/50">
                    <span className="font-data-lg text-data-lg text-secondary-fixed">1</span>
                  </div>
                  <div className="text-left">
                    <div className="font-h3 text-h3 text-white">15,000 Coins : 1 USD</div>
                    <div className="font-body-sm text-body-sm text-white/70">Guaranteed conversion rate for liquidity.</div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative w-48 h-48 rounded-full bg-gold-metallic/10 border-2 border-gold-metallic flex items-center justify-center shadow-[0_0_40px_rgba(184,134,11,0.2)] overflow-hidden">
                  <img src="/coin.png" alt="CMP Coin" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </section>

          <section className="px-4 py-stack-lg bg-surface text-center">
            <div className="max-w-xl mx-auto neumorphic-card-high rounded-xl p-6">
              <h2 className="font-['Montserrat'] text-[24px] leading-8 font-bold text-primary mb-2">Ready to Start Earning?</h2>
              <p className="font-body-sm text-body-sm text-on-surface-muted mb-4">Join thousands of creators building their digital empire on CMPapp.</p>
              <form onSubmit={handleEmailSubmit} className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="neumorphic-input w-full rounded-lg border-outline-variant py-3 px-4 focus:ring-primary focus:border-primary font-body-md text-body-md text-primary placeholder-on-surface-muted"
                  required
                />
                <button
                  type="submit"
                  className="btn-primary font-body-md text-body-md py-3 rounded-lg hover:opacity-90 transition-opacity active:scale-95 w-full"
                >
                  {isSubmitting ? 'Submitting...' : 'Get Started'}
                </button>
              </form>
            </div>
          </section>
        </main>

        <footer className="bg-surface-container-high py-stack-lg px-4 mt-auto">
          <div className="max-w-5xl mx-auto flex flex-col items-center gap-4">
            <div className="text-center">
              <span className="font-['Montserrat'] text-[20px] font-bold text-primary">CMPapp</span>
              <p className="font-body-sm text-body-sm text-on-surface-muted mt-1">© 2024 CMPapp. All rights reserved.</p>
            </div>
            <div className="flex gap-4 font-body-sm text-body-sm text-on-surface-variant">
              <Link className="hover:text-primary transition-colors" href="#">Platform</Link>
              <Link className="hover:text-primary transition-colors" href="#">Company</Link>
              <Link className="hover:text-primary transition-colors" href="#">Terms</Link>
              <Link className="hover:text-primary transition-colors" href="#">Privacy</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
