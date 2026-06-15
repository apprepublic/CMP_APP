'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/ui/page-transition';
import { Input } from '@/components/ui/input';
import { useUserStore } from '@/stores/userStore';
import { supabase } from '@/lib/supabase';
import { CheckCircle } from 'lucide-react';

const creators = [
  {
    name: 'DJ Horizon',
    location: 'London, UK',
    role: 'Audio Curator',
    coins: '450K+',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBE3pxt9qWHcXBSPsyxNGFoO-0Fp1JADPZzlFKBo6LchDLYGjhXHDh0KBI6mxEwSQ_mjTF19Q6glEJIYzVJ4ddam1Htz-rjt2xa9DheCZJfVL0WPpkLd7fhDZlmNK6BcWNeZJAjVbxXar3wsXTjXe63CZkXzxTdpSrOIGht1q9lF7FDeSClsdJXNLfu04BiHDwSjjWxyFzbpnWRDMmIrj8AUEqqPdRXj1VrDc20gbZAlHLVZN8W-lX7KrIyPTcaUW7zG8b_2C8XBDM',
    badge: 'TOP EARNER',
    badgeType: 'success'
  },
  {
    name: 'SynthX',
    location: 'NYC, USA',
    role: 'Visual Designer',
    coins: '280K+',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpiga3eNOVP8yXBmlTNQD-8rvLmmwEikDjZAWVzH-KFiNYtQPsXf_58t9SDDhgXjRA5aY6W_O6siz5Aenybsd59MVJMOfSCwNSVWK_lR7WLrbWVvO6DRmtTwUhJ_fG6shEvUUbqFYZjvXdpj_yt6RXOmpqfjkmGilqacpa3K-jHTsQFrSmcmIvjuU-HpJ3XON77d0wtkyEz-g3w8VJzDt8cpS-0442OCncJFJMzeNwMHa81VM-8KNTy-CaUme_QEjvQ4eAMVcRRn0',
    badge: 'PRO CREATOR',
    badgeType: 'primary'
  },
  {
    name: 'Bella Voices',
    location: 'Tokyo, JP',
    role: 'Podcast Host',
    coins: '190K+',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqkXT-8nTiFDgN-EPzsYxJc5xTladBCv9aJ-3nBZW3h8SlgZ7CzLq8lG-QyrU_GIIwa-aA-yG97Ux5LqSkEmuczKhqqe5vjBb3gdznHNOCHW2OVOFO172T_rOkAPy9RQ67azHCIjBanfO7Q2aeT-1OjmFX82-iOQbkyja9BwYkVRPh6huHB3veUqMzZgp9SpAuiDFGwhWHxYBdkWJ20vneKSjSpqUj5v9VDO_KAf2IHBJdq1kWS-MmbfpTeuJB8Py1JbstbzjjCps',
    badge: null,
    badgeType: null
  },
  {
    name: 'Network Queen',
    location: 'Berlin, DE',
    role: 'Referrer',
    coins: '1.2M+',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgaAYWsJ0U0tL27v8tcN5JaA3LkaKugrFW32u-0v9LdNNgPfykbMtqMjiqm2hUklepZHlEd_KLhbsoDbgJ2hyw8gGgmsEsVCQPsc3E6CkkpkGUEtkdKqi2dqBqKQUz5wPyj_6jQuVZ0WsBS5ZM5U6NUntnfXGV-1ofKGWWOlrhn1mPPnyWWVjmkWbTopnQuFYGpXEKuhk-AQMFyLJeUAUP2KcshuPOXepDytpZFQepqsvJBfmo1fCSA1dTIjZ6b4-hHrSKVo_KeCQ',
    badge: null,
    badgeType: null
  }
];

export default function LandingPage() {
  const { isAuthenticated, user } = useUserStore();
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
      {/* Top Navigation Shell - Desktop/Tablet Only */}
<nav className="hidden md:flex fixed top-0 w-full z-50 bg-primary backdrop-blur-lg border-b border-white/10 shadow-md h-20 justify-between items-center px-margin-desktop">
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="CMPapp" className="h-10 w-auto" />
      </div>
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
          <Link className="font-body-md text-body-md text-white/90 hover:text-secondary-fixed transition-colors" href="/marketplace">
            Market
          </Link>
          <Link className="font-body-md text-body-md text-white/90 hover:text-secondary-fixed transition-colors" href="/wallet">
            Wallet
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <>
              <div className="premium-border-gold rounded-full px-4 py-1 flex items-center gap-2 bg-white/10 backdrop-blur-md">
                <span className="material-symbols-outlined text-secondary-fixed text-xl">paid</span>
                <span className="font-data-md text-data-md text-secondary-fixed">
                  {user.wallet?.coinBalance || 0}
                </span>
              </div>
              <button className="text-white hover:text-secondary-fixed transition-colors">
                <span className="material-symbols-outlined text-2xl">notifications</span>
              </button>
              <Link href="/profile">
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
                <button className="bg-secondary-fixed hover:bg-secondary text-on-secondary-fixed font-bold font-h3 text-h3 px-8 py-4 rounded-lg transition-all shadow-[0_0_30px_rgba(255,222,166,0.3)] flex items-center gap-3">
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen pt-20 flex flex-col items-center justify-center overflow-hidden bg-primary">
        {/* Background Animation */}
        <div className="absolute inset-0 z-0 opacity-50">
          <img
            alt="Abstract fluid background"
            className="w-full h-full object-cover mix-blend-screen"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfcs8Eu4e4-pkMRvNodpKydY50KxK09NPYZ82AnxzqyG4Lj-m7Hm6RT7aReU5oC6E9TwiQsb4zJppJg9fGkFRB6wtdKfisaleLjC6GYSD6SA4Era6QYnHpNE4mo8jLT8c30C2CidhMtkh0L8uHbhvMm4bzgJjZx3x72ufRHzCTPIkG9pXFVvcQ6FgU8rlGa5CoHP6bW_8D_pVNiT44QVTR7k7OQKQ4fgUGQaiTQAiNHk6QBYyl4Jplm-wKX_HeG9bJg4gTBokqErQ"
          />
        </div>

        {/* Hero Image Layer - Between Background and Text (Desktop Only) */}
        <div className="hidden md:block absolute inset-0 z-10 flex items-center justify-start pl-56 pb-8 pointer-events-none overflow-hidden">
          <img
            alt="Hero visual"
            className="max-w-[120%] max-h-[120%] w-auto h-auto object-contain"
            src="/hero.png"
          />
        </div>

        <div className="relative z-20 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center">
          <div>
            <div className="inline-block px-4 py-1 rounded-full border border-secondary-fixed/50 bg-secondary-fixed/20 backdrop-blur-md text-secondary-fixed font-label-caps text-label-caps mb-6">
              GLOBAL DIGITAL REVOLUTION IS HERE
            </div>
          </div>
          <div>
            <h1 className="font-h1 text-h1 text-white max-w-4xl mx-auto mb-6">
              Empower Your Creativity. <br/>
              <span className="text-secondary-fixed">Monetize Your Passion.</span>
            </h1>
          </div>
          <div>
            <p className="font-body-lg text-body-lg text-white/90 max-w-2xl mx-auto mb-10">
              The first creative economy hub where every stream, task, and referral builds your wealth. Join thousands of creators in the global digital revolution.
            </p>
          </div>
          <div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href={isAuthenticated ? '/dashboard' : '/register'}
                  className="inline-flex items-center justify-center gap-3 bg-secondary-fixed hover:bg-secondary text-on-secondary-fixed font-bold font-h3 text-h3 px-8 py-4 rounded-lg transition-all scale-100 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,222,166,0.3)]"
                >
                  Join the Economy
                  <span className="material-symbols-outlined text-xl">trending_up</span>
                </Link>
                <Link
                  href="/marketplace"
                  className="inline-flex items-center justify-center gap-3 glass-dark hover:bg-white/10 text-white border border-white/30 font-h3 text-h3 px-8 py-4 rounded-lg transition-all"
                >
                  Explore Marketplace
                  <span className="material-symbols-outlined text-xl">arrow_forward</span>
                </Link>
              </div>
          </div>
        </div>


      </section>

      {/* Value Proposition Grid */}
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

      {/* The Coin Economy */}
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
                  <div className="font-h3 text-h3 text-white">100 Coins : 1 USD</div>
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
                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-secondary to-secondary-fixed flex items-center justify-center animate-pulse shadow-lg">
                  <span className="material-symbols-outlined text-primary text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
                </div>
                <div className="absolute -top-4 -right-4 bg-white/10 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-full font-data-md text-data-md shadow-xl">
                  Live Value
                </div>
              </div>
              <div className="font-data-lg text-data-lg text-white mb-2">Current Balance Value</div>
              <div className="font-h1 text-h1 text-secondary-fixed">$ 12,500.00</div>
              <div className="font-body-sm text-body-sm text-white/70 mt-4">1,250,000 CMP COINS</div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-fixed/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-fixed/10 rounded-full blur-3xl -ml-48 -mb-48"></div>
      </section>

      {/* Creator Spotlight */}
      <section className="py-24 bg-surface px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="font-h2 text-h2 text-primary">Creator Spotlight</h2>
              <p className="font-body-md text-body-md text-on-surface mt-2">See who's leading the digital revolution globally.</p>
            </div>
            <button className="text-secondary font-bold flex items-center gap-2 hover:opacity-80 transition-opacity">
              View Rankings <span className="material-symbols-outlined">expand_more</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {creators.map((creator, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden hover:shadow-xl transition-shadow group h-full">
                <div className="h-64 relative">
                  <img
                    alt={creator.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={creator.image}
                  />
                  {creator.badge && (
                    <div className={`absolute top-4 right-4 ${creator.badgeType === 'success' ? 'bg-success-verified/90' : 'bg-primary/90'} backdrop-blur-sm text-white px-2 py-1 rounded flex items-center gap-1 font-label-caps text-[10px] border border-white/20`}>
                      <CheckCircle className="w-3.5 h-3.5" />
                      {creator.badge}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h4 className="font-h3 text-h3 mb-1 text-primary">{creator.name}</h4>
                  <div className="font-body-sm text-body-sm text-on-surface-variant mb-4">
                    {creator.location} • {creator.role}
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-outline-variant">
                    <div className="font-label-caps text-label-caps text-secondary">COINS EARNED</div>
                    <div className="font-data-md text-data-md text-primary">{creator.coins}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
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
              className="h-12 bg-[#B8860B] hover:bg-[#8B6914] text-primary-container font-bold font-body-md text-body-md rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
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

      {/* Footer */}
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
              <li><Link className="hover:text-secondary-fixed transition-colors" href="/marketplace">Marketplace</Link></li>
              <li><Link className="hover:text-secondary-fixed transition-colors" href="/tasks">Earn Coins</Link></li>
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
  );
}
