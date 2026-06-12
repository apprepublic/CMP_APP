'use client';

import Link from 'next/link';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/ui/page-transition';
import { NeuCard } from '@/components/ui/neu-card';
import { NeuIconBadge } from '@/components/ui/neu-icon-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Headphones, ClipboardCheck, TrendingUp, ArrowRight, Coins, Users, CheckCircle, Music, Wallet } from 'lucide-react';

export default function LandingPage() {
  return (
    <PageTransition className="min-h-screen bg-neu-bg">
      {/* Top Navigation Shell */}
      <nav className="fixed top-0 w-full z-50 bg-neu-bg shadow-neu-flat h-20 flex justify-between items-center px-gutter">
        <div className="font-h3 text-h3 font-bold text-neo-text-primary">CMPapp</div>
        <div className="hidden md:flex items-center space-x-8">
          <Link className="font-body-md text-body-md text-neo-secondary border-b-2 border-neo-secondary pb-1" href="/dashboard">
            Dashboard
          </Link>
          <Link className="font-body-md text-body-md text-neo-text-secondary hover:text-neo-primary transition-colors" href="/tasks">
            Earn
          </Link>
          <Link className="font-body-md text-body-md text-neo-text-secondary hover:text-neo-primary transition-colors" href="/music">
            Music
          </Link>
          <Link className="font-body-md text-body-md text-neo-text-secondary hover:text-neo-primary transition-colors" href="/marketplace">
            Market
          </Link>
          <Link className="font-body-md text-body-md text-neo-text-secondary hover:text-neo-primary transition-colors" href="/wallet">
            Wallet
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <NeuIconBadge size="md" className="flex items-center gap-2 px-4 py-2 rounded-full">
            <span className="material-symbols-outlined text-neo-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
            <span className="font-data-md text-data-md text-neo-secondary">500</span>
          </NeuIconBadge>
          <NeuIconBadge size="sm" className="cursor-pointer">
            <span className="material-symbols-outlined text-neo-text-primary">notifications</span>
          </NeuIconBadge>
          <Link href="/login">
            <NeuIconBadge size="sm" className="cursor-pointer">
              <span className="material-symbols-outlined text-neo-text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
            </NeuIconBadge>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen pt-20 flex flex-col items-center justify-center overflow-hidden bg-neu-bg">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neo-secondary via-transparent to-transparent"></div>

        <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-gutter text-center">
          <StaggerContainer stagger={0.1}>
            <StaggerItem>
              <div className="inline-block px-4 py-1 rounded-full border border-neo-secondary/30 bg-neo-secondary/10 text-neo-secondary font-label-caps text-label-caps mb-6">
                LAGOS DIGITAL REVOLUTION IS HERE
              </div>
            </StaggerItem>
            <StaggerItem>
              <h1 className="font-h1 text-h1 text-neo-text-primary max-w-4xl mx-auto mb-6">
                Empower Your Creativity. <br/>
                <span className="text-neo-secondary">Monetize Your Passion.</span>
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className="font-body-lg text-body-lg text-neo-text-secondary max-w-2xl mx-auto mb-10">
                The first creative economy hub where every stream, task, and referral builds your wealth. Join thousands of creators in the Lagos digital revolution.
              </p>
            </StaggerItem>
            <StaggerItem>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button size="xl" variant="default" asChild>
                  <Link href="/register" className="flex items-center gap-3">
                    Join the Economy
                    <TrendingUp className="w-5 h-5" />
                  </Link>
                </Button>
                <Button size="xl" variant="outline" asChild>
                  <Link href="/marketplace" className="flex items-center gap-3">
                    Explore Marketplace
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>

        {/* Subtle Float UI */}
        <div className="absolute bottom-10 left-10 hidden lg:block">
          <NeuCard padding="md" className="flex items-center gap-4 shadow-neu-raised">
            <NeuIconBadge size="md" active>
              <span className="material-symbols-outlined text-neo-primary" style={{ fontVariationSettings: "'FILL' 1" }}>music_note</span>
            </NeuIconBadge>
            <div>
              <div className="font-label-caps text-label-caps text-neo-secondary">RECENT EARNING</div>
              <div className="font-data-md text-data-md text-neo-text-primary">DJ Horizon earned 2,400 Coins</div>
            </div>
          </NeuCard>
        </div>
      </section>

      {/* Value Proposition Grid */}
      <section className="py-24 bg-neu-bg px-margin-mobile md:px-gutter">
        <div className="max-w-container-max mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-h2 text-h2 text-neo-text-primary mb-4">Multiple Paths to Prosperity</h2>
            <div className="h-1 w-24 bg-neo-secondary mx-auto rounded-full"></div>
          </div>
          <StaggerContainer stagger={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              <StaggerItem>
                <NeuCard padding="lg" interactive className="h-full">
                  <NeuIconBadge size="lg" className="mb-6">
                    <Headphones className="w-6 h-6 text-neo-secondary" />
                  </NeuIconBadge>
                  <h3 className="font-h3 text-h3 text-neo-text-primary mb-4">Stream to Earn</h3>
                  <p className="font-body-md text-body-md text-neo-text-secondary mb-6">
                    Earn coins by discovering and listening to emerging African artists. Your ears are assets—get paid for every minute you spend on premium audio.
                  </p>
                  <Link className="text-neo-primary font-bold flex items-center gap-2 hover:gap-4 transition-all" href="/music">
                    Start Listening <ArrowRight className="w-4 h-4" />
                  </Link>
                </NeuCard>
              </StaggerItem>

              <StaggerItem>
                <NeuCard padding="lg" interactive className="h-full">
                  <NeuIconBadge size="lg" className="mb-6">
                    <ClipboardCheck className="w-6 h-6 text-neo-secondary" />
                  </NeuIconBadge>
                  <h3 className="font-h3 text-h3 text-neo-text-primary mb-4">Micro-Task Market</h3>
                  <p className="font-body-md text-body-md text-neo-text-secondary mb-6">
                    Complete simple digital tasks for global brands. From survey participation to content tagging, leverage your downtime for steady growth.
                  </p>
                  <Link className="text-neo-primary font-bold flex items-center gap-2 hover:gap-4 transition-all" href="/tasks">
                    Browse Tasks <ArrowRight className="w-4 h-4" />
                  </Link>
                </NeuCard>
              </StaggerItem>

              <StaggerItem>
                <NeuCard padding="lg" interactive className="h-full">
                  <NeuIconBadge size="lg" className="mb-6">
                    <Users className="w-6 h-6 text-neo-secondary" />
                  </NeuIconBadge>
                  <h3 className="font-h3 text-h3 text-neo-text-primary mb-4">Referral Network</h3>
                  <p className="font-body-md text-body-md text-neo-text-secondary mb-6">
                    Build your tribe and earn 3-tier passive commissions. Empower your circle to earn and watch your ecosystem rewards scale indefinitely.
                  </p>
                  <Link className="text-neo-primary font-bold flex items-center gap-2 hover:gap-4 transition-all" href="/referrals">
                    Invite Friends <ArrowRight className="w-4 h-4" />
                  </Link>
                </NeuCard>
              </StaggerItem>
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* The Coin Economy */}
      <section className="py-24 bg-neu-bg relative overflow-hidden">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="flex-1">
            <h2 className="font-h2 text-h2 text-neo-text-primary mb-6">The Coin Economy</h2>
            <p className="font-body-lg text-body-lg text-neo-text-secondary mb-8">
              CMP Coins are the heart of our creative hub. We've built a stable, transparent conversion model that bridges the gap between digital effort and real-world value.
            </p>
            <div className="space-y-6">
              <NeuCard padding="md" interactive className="flex items-center gap-4">
                <NeuIconBadge size="lg" active className="flex-shrink-0">
                  <span className="font-data-lg text-data-lg text-neo-secondary">1</span>
                </NeuIconBadge>
                <div>
                  <div className="font-h3 text-h3 text-neo-text-primary">100 Coins : 1 NGN</div>
                  <div className="font-body-sm text-body-sm text-neo-text-secondary">Guaranteed conversion rate for liquidity.</div>
                </div>
              </NeuCard>
              <NeuCard padding="md" interactive className="flex items-center gap-4">
                <NeuIconBadge size="lg" active className="flex-shrink-0">
                  <span className="font-data-lg text-data-lg text-neo-secondary">2</span>
                </NeuIconBadge>
                <div>
                  <div className="font-h3 text-h3 text-neo-text-primary">VTU & Bills Utility</div>
                  <div className="font-body-sm text-body-sm text-neo-text-secondary">Pay electricity, data, and cable TV directly with coins.</div>
                </div>
              </NeuCard>
            </div>
          </div>

          <div className="flex-1 relative w-full max-w-md">
            <NeuCard padding="lg" className="aspect-square flex flex-col justify-center items-center text-center shadow-neu-raised">
              <div className="mb-6 relative">
                <NeuIconBadge size="lg" active className="animate-pulse" style={{ background: 'var(--neo-secondary)' }}>
                  <span className="material-symbols-outlined text-neo-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
                </NeuIconBadge>
                <div className="absolute -top-4 -right-4 bg-neu-bg text-neo-primary px-3 py-1 rounded-full font-data-md text-data-md shadow-neu-raised">
                  Live Value
                </div>
              </div>
              <div className="font-data-lg text-data-lg text-neo-text-primary mb-2">Current Balance Value</div>
              <div className="font-h1 text-h1 text-neo-secondary">₦ 12,500.00</div>
              <div className="font-body-sm text-body-sm text-neo-text-secondary mt-4">1,250,000 CMP COINS</div>
            </NeuCard>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-64 h-64 bg-neo-secondary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-neo-secondary/5 rounded-full blur-3xl -ml-48 -mb-48"></div>
      </section>

      {/* Creator Spotlight */}
      <section className="py-24 bg-neu-bg px-margin-mobile md:px-gutter">
        <div className="max-w-container-max mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="font-h2 text-h2 text-neo-text-primary">Creator Spotlight</h2>
              <p className="font-body-md text-body-md text-neo-text-secondary mt-2">See who's leading the digital revolution in Lagos.</p>
            </div>
            <Button variant="ghost" className="gap-2">
              View Rankings <span className="material-symbols-outlined">expand_more</span>
            </Button>
          </div>

          <StaggerContainer stagger={0.08}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
              <StaggerItem>
                <NeuCard padding="none" interactive className="overflow-hidden h-full">
                  <div className="h-64 relative">
                    <img
                      alt="DJ Horizon"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBE3pxt9qWHcXBSPsyxNGFoO-0Fp1JADPZzlFKBo6LchDLYGjhXHDh0KBI6mxEwSQ_mjTF19Q6glEJIYzVJ4ddam1Htz-rjt2xa9DheCZJfVL0WPpkLd7fhDZlmNK6BcWNeZJAjVbxXar3wsXTjXe63CZkXzxTdpSrOIGht1q9lF7FDeSClsdJXNLfu04BiHDwSjjWxyFzbpnWRDMmIrj8AUEqqPdRXj1VrDc20gbZAlHLVZN8W-lX7KrIyPTcaUW7zG8b_2C8XBDM"
                    />
                    <div className="absolute top-4 right-4 neo-badge-success px-2 py-1 rounded flex items-center gap-1 font-label-caps text-[10px]">
                      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> TOP EARNER
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="font-h3 text-h3 mb-1 text-neo-text-primary">DJ Horizon</h4>
                    <div className="font-body-sm text-body-sm text-neo-text-secondary mb-4">Lagos, NG • Audio Curator</div>
                    <div className="flex justify-between items-center pt-4 border-t border-neo-bg-dark">
                      <div className="font-label-caps text-label-caps text-neo-secondary">COINS EARNED</div>
                      <div className="font-data-md text-data-md text-neo-primary">450K+</div>
                    </div>
                  </div>
                </NeuCard>
              </StaggerItem>

              <StaggerItem>
                <NeuCard padding="none" interactive className="overflow-hidden h-full">
                  <div className="h-64 relative">
                    <img
                      alt="SynthX"
                      className="w-full h-full object-cover transition-transform duration-500"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpiga3eNOVP8yXBmlTNQD-8rvLmmwEikDjZAWVzH-KFiNYtQPsXf_58t9SDDhgXjRA5aY6W_O6siz5Aenybsd59MVJMOfSCwNSVWK_lR7WLrbWVvO6DRmtTwUhJ_fG6shEvUUbqFYZjvXdpj_yt6RXOmpqfjkmGilqacpa3K-jHTsQFrSmcmIvjuU-HpJ3XON77d0wtkyEz-g3w8VJzDt8cpS-0442OCncJFJMzeNwMHa81VM-8KNTy-CaUme_QEjvQ4eAMVcRRn0"
                    />
                    <div className="absolute top-4 right-4 neo-badge-primary px-2 py-1 rounded flex items-center gap-1 font-label-caps text-[10px]">
                      PRO CREATOR
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="font-h3 text-h3 mb-1 text-neo-text-primary">SynthX</h4>
                    <div className="font-body-sm text-body-sm text-neo-text-secondary mb-4">Abuja, NG • Visual Designer</div>
                    <div className="flex justify-between items-center pt-4 border-t border-neo-bg-dark">
                      <div className="font-label-caps text-label-caps text-neo-secondary">COINS EARNED</div>
                      <div className="font-data-md text-data-md text-neo-primary">280K+</div>
                    </div>
                  </div>
                </NeuCard>
              </StaggerItem>

              <StaggerItem>
                <NeuCard padding="none" interactive className="overflow-hidden h-full">
                  <div className="h-64 relative">
                    <img
                      alt="Creative Soul"
                      className="w-full h-full object-cover transition-transform duration-500"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqkXT-8nTiFDgN-EPzsYxJc5xTladBCv9aJ-3nBZW3h8SlgZ7CzLq8lG-QyrU_GIIwa-aA-yG97Ux5LqSkEmuczKhqqe5vjBb3gdznHNOCHW2OVOFO172T_rOkAPy9RQ67azHCIjBanfO7Q2aeT-1OjmFX82-iOQbkyja9BwYkVRPh6huHB3veUqMzZgp9SpAuiDFGwhWHxYBdkWJ20vneKSjSpqUj5v9VDO_KAf2IHBJdq1kWS-MmbfpTeuJB8Py1JbstbzjjCps"
                    />
                  </div>
                  <div className="p-6">
                    <h4 className="font-h3 text-h3 mb-1 text-neo-text-primary">Bella Voices</h4>
                    <div className="font-body-sm text-body-sm text-neo-text-secondary mb-4">Lekki, NG • Podcast Host</div>
                    <div className="flex justify-between items-center pt-4 border-t border-neo-bg-dark">
                      <div className="font-label-caps text-label-caps text-neo-secondary">COINS EARNED</div>
                      <div className="font-data-md text-data-md text-neo-primary">190K+</div>
                    </div>
                  </div>
                </NeuCard>
              </StaggerItem>

              <StaggerItem>
                <NeuCard padding="none" interactive className="overflow-hidden h-full">
                  <div className="h-64 relative">
                    <img
                      alt="Networker"
                      className="w-full h-full object-cover transition-transform duration-500"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgaAYWsJ0U0tL27v8tcN5JaA3LkaKugrFW32u-0v9LdNNgPfykbMtqMjiqm2hUklepZHlEd_KLhbsoDbgJ2hyw8gGgmsEsVCQPsc3E6CkkpkGUEtkdKqi2dqBqKQUz5wPyj_6jQuVZ0WsBS5ZM5U6NUntnfXGV-1ofKGWWOlrhn1mPPnyWWVjmkWbTopnQuFYGpXEKuhk-AQMFyLJeUAUP2KcshuPOXepDytpZFQepqsvJBfmo1fCSA1dTIjZ6b4-hHrSKVo_KeCQ"
                    />
                  </div>
                  <div className="p-6">
                    <h4 className="font-h3 text-h3 mb-1 text-neo-text-primary">Network Queen</h4>
                    <div className="font-body-sm text-body-sm text-neo-text-secondary mb-4">Portharcourt, NG • Referrer</div>
                    <div className="flex justify-between items-center pt-4 border-t border-neo-bg-dark">
                      <div className="font-label-caps text-label-caps text-neo-secondary">COINS EARNED</div>
                      <div className="font-data-md text-data-md text-neo-primary">1.2M+</div>
                    </div>
                  </div>
                </NeuCard>
              </StaggerItem>
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-neu-bg px-margin-mobile md:px-gutter relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="font-h1 text-h1 text-neo-text-primary mb-6">Ready to Build Your Wealth?</h2>
          <p className="font-body-lg text-body-lg text-neo-text-secondary mb-12">
            Start Your Journey with <span className="text-neo-secondary font-bold">500 Bonus Coins</span>. It takes less than 60 seconds to join the hub and begin monetizing your tasks.
          </p>
          <form className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto mb-8">
            <Input
              type="email"
              placeholder="Enter your email address"
              icon={<span className="material-symbols-outlined text-neo-text-muted">mail</span>}
              className="flex-1"
            />
            <Button size="xl" variant="default" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </form>
          <div className="flex items-center justify-center gap-8 text-neo-text-secondary font-label-caps text-label-caps">
            <div className="flex items-center gap-2">
              <NeuIconBadge size="sm" active>
                <CheckCircle className="w-4 h-4 text-neo-secondary" />
              </NeuIconBadge>
              No Fees
            </div>
            <div className="flex items-center gap-2">
              <NeuIconBadge size="sm" active>
                <CheckCircle className="w-4 h-4 text-neo-secondary" />
              </NeuIconBadge>
              Instant Withdraw
            </div>
            <div className="flex items-center gap-2">
              <NeuIconBadge size="sm" active>
                <CheckCircle className="w-4 h-4 text-neo-secondary" />
              </NeuIconBadge>
              Lagos Based
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neu-bg py-16 px-margin-mobile md:px-gutter shadow-neu-flat">
        <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-4 gap-gutter">
          <div className="md:col-span-1">
            <div className="font-h2 text-h2 text-neo-text-primary mb-4">CMPapp</div>
            <p className="font-body-sm text-body-sm text-neo-text-secondary">
              The creative economy hub empowering Africa's digital generation through music, tasks, and community.
            </p>
          </div>
          <div>
            <h5 className="font-label-caps text-label-caps text-neo-secondary mb-6">PLATFORM</h5>
            <ul className="space-y-3 font-body-sm text-body-sm text-neo-text-secondary">
              <li><Link className="hover:text-neo-primary transition-colors" href="#">How it Works</Link></li>
              <li><Link className="hover:text-neo-primary transition-colors" href="/marketplace">Marketplace</Link></li>
              <li><Link className="hover:text-neo-primary transition-colors" href="/tasks">Earn Coins</Link></li>
              <li><Link className="hover:text-neo-primary transition-colors" href="/wallet">VTU Store</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-label-caps text-label-caps text-neo-secondary mb-6">COMMUNITY</h5>
            <ul className="space-y-3 font-body-sm text-body-sm text-neo-text-secondary">
              <li><Link className="hover:text-neo-primary transition-colors" href="#">Discord Hub</Link></li>
              <li><Link className="hover:text-neo-primary transition-colors" href="/referrals">Referral Program</Link></li>
              <li><Link className="hover:text-neo-primary transition-colors" href="#">Creator Perks</Link></li>
              <li><Link className="hover:text-neo-primary transition-colors" href="/contests">Leaderboards</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-label-caps text-label-caps text-neo-secondary mb-6">LEGAL</h5>
            <ul className="space-y-3 font-body-sm text-body-sm text-neo-text-secondary">
              <li><Link className="hover:text-neo-primary transition-colors" href="#">Privacy Policy</Link></li>
              <li><Link className="hover:text-neo-primary transition-colors" href="#">Terms of Service</Link></li>
              <li><Link className="hover:text-neo-primary transition-colors" href="#">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-container-max mx-auto mt-16 pt-8 border-t border-neo-bg-dark flex flex-col md:flex-row justify-between items-center font-body-sm text-body-sm text-neo-text-secondary gap-4">
          <div>&copy; 2024 CMPapp. Built for the Creative Revolution.</div>
          <div className="flex gap-6">
            <NeuIconBadge size="sm" className="cursor-pointer">
              <span className="material-symbols-outlined text-neo-text-muted">language</span>
            </NeuIconBadge>
            <NeuIconBadge size="sm" className="cursor-pointer">
              <span className="material-symbols-outlined text-neo-text-muted">share</span>
            </NeuIconBadge>
          </div>
        </div>
      </footer>
    </PageTransition>
  );
}
