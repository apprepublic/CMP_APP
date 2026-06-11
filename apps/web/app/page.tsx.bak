'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* Top Navigation Shell */}
      <nav className="fixed top-0 w-full z-50 bg-primary shadow-md h-20 flex justify-between items-center px-gutter">
        <div className="font-h3 text-h3 font-bold text-on-primary">CMPapp</div>
        <div className="hidden md:flex items-center space-x-8">
          <Link className="font-body-md text-body-md text-secondary-fixed border-b-2 border-secondary-fixed pb-1" href="/dashboard">
            Dashboard
          </Link>
          <Link className="font-body-md text-body-md text-on-primary-container hover:text-secondary transition-colors" href="/tasks">
            Earn
          </Link>
          <Link className="font-body-md text-body-md text-on-primary-container hover:text-secondary transition-colors" href="/music">
            Music
          </Link>
          <Link className="font-body-md text-body-md text-on-primary-container hover:text-secondary transition-colors" href="/marketplace">
            Market
          </Link>
          <Link className="font-body-md text-body-md text-on-primary-container hover:text-secondary transition-colors" href="/wallet">
            Wallet
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="premium-border-gold rounded-full px-4 py-1 flex items-center gap-2 bg-primary-container/30">
            <span className="material-symbols-outlined text-secondary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
            <span className="font-data-md text-data-md text-secondary-fixed">500</span>
          </div>
          <span className="material-symbols-outlined text-on-primary cursor-pointer">notifications</span>
          <Link href="/login">
            <span className="material-symbols-outlined text-on-primary cursor-pointer">account_circle</span>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen pt-20 flex flex-col items-center justify-center overflow-hidden bg-primary-container">
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-secondary-fixed via-transparent to-transparent"></div>

        <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-gutter text-center">
          <div className="inline-block px-4 py-1 rounded-full border border-secondary-fixed/30 bg-secondary-fixed/10 text-secondary-fixed font-label-caps text-label-caps mb-6">
            LAGOS DIGITAL REVOLUTION IS HERE
          </div>
          <h1 className="font-h1 text-h1 text-on-primary max-w-4xl mx-auto mb-6">
            Empower Your Creativity. <br/>
            <span className="text-secondary-fixed">Monetize Your Passion.</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-primary-container max-w-2xl mx-auto mb-10">
            The first creative economy hub where every stream, task, and referral builds your wealth. Join thousands of creators in the Lagos digital revolution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register" className="bg-secondary-fixed hover:bg-secondary text-on-secondary-fixed font-h3 text-h3 px-8 py-4 rounded-lg transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center gap-3">
              Join the Economy
              <span className="material-symbols-outlined">trending_flat</span>
            </Link>
            <Link href="/marketplace" className="bg-primary hover:bg-on-primary-fixed-variant text-on-primary border border-outline font-h3 text-h3 px-8 py-4 rounded-lg transition-all flex items-center gap-3">
              Explore Marketplace
            </Link>
          </div>
        </div>

        {/* Subtle Float UI */}
        <div className="absolute bottom-10 left-10 hidden lg:block">
          <div className="glass-dark premium-border-gold p-4 rounded-xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>music_note</span>
            </div>
            <div>
              <div className="font-label-caps text-label-caps text-secondary-fixed">RECENT EARNING</div>
              <div className="font-data-md text-data-md text-on-primary">DJ Horizon earned 2,400 Coins</div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Grid */}
      <section className="py-24 bg-surface px-margin-mobile md:px-gutter">
        <div className="max-w-container-max mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-h2 text-h2 text-primary mb-4">Multiple Paths to Prosperity</h2>
            <div className="h-1 w-24 bg-secondary-fixed mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {/* Stream to Earn */}
            <div className="bg-surface-alt p-8 rounded-xl border-b-4 border-secondary hover:border-secondary-fixed transition-all group">
              <div className="w-16 h-16 bg-primary-container rounded-lg flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
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

            {/* Micro-Task Market */}
            <div className="bg-surface-alt p-8 rounded-xl border-b-4 border-secondary hover:border-secondary-fixed transition-all group">
              <div className="w-16 h-16 bg-primary-container rounded-lg flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
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

            {/* Referral Network */}
            <div className="bg-surface-alt p-8 rounded-xl border-b-4 border-secondary hover:border-secondary-fixed transition-all group">
              <div className="w-16 h-16 bg-primary-container rounded-lg flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
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
      <section className="py-24 bg-primary-container relative overflow-hidden">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="flex-1 text-on-primary">
            <h2 className="font-h2 text-h2 mb-6">The Coin Economy</h2>
            <p className="font-body-lg text-body-lg text-on-primary-container mb-8">
              CMP Coins are the heart of our creative hub. We've built a stable, transparent conversion model that bridges the gap between digital effort and real-world value.
            </p>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full premium-border-gold flex items-center justify-center">
                  <span className="font-data-lg text-data-lg text-secondary-fixed">1</span>
                </div>
                <div>
                  <div className="font-h3 text-h3 text-on-primary">100 Coins : 1 NGN</div>
                  <div className="font-body-sm text-body-sm text-on-primary-container">Guaranteed conversion rate for liquidity.</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full premium-border-gold flex items-center justify-center">
                  <span className="font-data-lg text-data-lg text-secondary-fixed">2</span>
                </div>
                <div>
                  <div className="font-h3 text-h3 text-on-primary">VTU & Bills Utility</div>
                  <div className="font-body-sm text-body-sm text-on-primary-container">Pay electricity, data, and cable TV directly with coins.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 relative w-full max-w-md">
            <div className="aspect-square glass-dark rounded-3xl premium-border-gold p-8 flex flex-col justify-center items-center text-center">
              <div className="mb-6 relative">
                <div className="w-32 h-32 rounded-full bg-secondary-fixed flex items-center justify-center animate-pulse">
                  <span className="material-symbols-outlined text-primary text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
                </div>
                <div className="absolute -top-4 -right-4 bg-white text-primary px-3 py-1 rounded-full font-data-md text-data-md shadow-xl">
                  Live Value
                </div>
              </div>
              <div className="font-data-lg text-data-lg text-on-primary mb-2">Current Balance Value</div>
              <div className="font-h1 text-h1 text-secondary-fixed">₦ 12,500.00</div>
              <div className="font-body-sm text-body-sm text-on-primary-container mt-4">1,250,000 CMP COINS</div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-fixed/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-fixed/5 rounded-full blur-3xl -ml-48 -mb-48"></div>
      </section>

      {/* Creator Spotlight */}
      <section className="py-24 bg-surface px-margin-mobile md:px-gutter">
        <div className="max-w-container-max mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="font-h2 text-h2 text-primary">Creator Spotlight</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2">See who's leading the digital revolution in Lagos.</p>
            </div>
            <button className="text-secondary font-bold flex items-center gap-2">
              View Rankings <span className="material-symbols-outlined">expand_more</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {/* Creator 1 */}
            <div className="bg-surface-container-low rounded-xl overflow-hidden hover:shadow-xl transition-shadow group">
              <div className="h-64 relative">
                <img
                  alt="DJ Horizon"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBE3pxt9qWHcXBSPsyxNGFoO-0Fp1JADPZzlFKBo6LchDLYGjhXHDh0KBI6mxEwSQ_mjTF19Q6glEJIYzVJ4ddam1Htz-rjt2xa9DheCZJfVL0WPpkLd7fhDZlmNK6BcWNeZJAjVbxXar3wsXTjXe63CZkXzxTdpSrOIGht1q9lF7FDeSClsdJXNLfu04BiHDwSjjWxyFzbpnWRDMmIrj8AUEqqPdRXj1VrDc20gbZAlHLVZN8W-lX7KrIyPTcaUW7zG8b_2C8XBDM"
                />
                <div className="absolute top-4 right-4 bg-success-verified text-on-primary px-2 py-1 rounded flex items-center gap-1 font-label-caps text-[10px]">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> TOP EARNER
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-h3 text-h3 mb-1">DJ Horizon</h4>
                <div className="font-body-sm text-body-sm text-on-surface-variant mb-4">Lagos, NG • Audio Curator</div>
                <div className="flex justify-between items-center pt-4 border-t border-outline-variant">
                  <div className="font-label-caps text-label-caps text-secondary">COINS EARNED</div>
                  <div className="font-data-md text-data-md text-primary">450K+</div>
                </div>
              </div>
            </div>

            {/* Creator 2 */}
            <div className="bg-surface-container-low rounded-xl overflow-hidden hover:shadow-xl transition-shadow group">
              <div className="h-64 relative">
                <img
                  alt="SynthX"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpiga3eNOVP8yXBmlTNQD-8rvLmmwEikDjZAWVzH-KFiNYtQPsXf_58t9SDDhgXjRA5aY6W_O6siz5Aenybsd59MVJMOfSCwNSVWK_lR7WLrbWVvO6DRmtTwUhJ_fG6shEvUUbqFYZjvXdpj_yt6RXOmpqfjkmGilqacpa3K-jHTsQFrSmcmIvjuU-HpJ3XON77d0wtkyEz-g3w8VJzDt8cpS-0442OCncJFJMzeNwMHa81VM-8KNTy-CaUme_QEjvQ4eAMVcRRn0"
                />
                <div className="absolute top-4 right-4 bg-primary text-on-primary px-2 py-1 rounded flex items-center gap-1 font-label-caps text-[10px]">
                  PRO CREATOR
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-h3 text-h3 mb-1">SynthX</h4>
                <div className="font-body-sm text-body-sm text-on-surface-variant mb-4">Abuja, NG • Visual Designer</div>
                <div className="flex justify-between items-center pt-4 border-t border-outline-variant">
                  <div className="font-label-caps text-label-caps text-secondary">COINS EARNED</div>
                  <div className="font-data-md text-data-md text-primary">280K+</div>
                </div>
              </div>
            </div>

            {/* Creator 3 */}
            <div className="bg-surface-container-low rounded-xl overflow-hidden hover:shadow-xl transition-shadow group">
              <div className="h-64 relative">
                <img
                  alt="Creative Soul"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqkXT-8nTiFDgN-EPzsYxJc5xTladBCv9aJ-3nBZW3h8SlgZ7CzLq8lG-QyrU_GIIwa-aA-yG97Ux5LqSkEmuczKhqqe5vjBb3gdznHNOCHW2OVOFO172T_rOkAPy9RQ67azHCIjBanfO7Q2aeT-1OjmFX82-iOQbkyja9BwYkVRPh6huHB3veUqMzZgp9SpAuiDFGwhWHxYBdkWJ20vneKSjSpqUj5v9VDO_KAf2IHBJdq1kWS-MmbfpTeuJB8Py1JbstbzjjCps"
                />
              </div>
              <div className="p-6">
                <h4 className="font-h3 text-h3 mb-1">Bella Voices</h4>
                <div className="font-body-sm text-body-sm text-on-surface-variant mb-4">Lekki, NG • Podcast Host</div>
                <div className="flex justify-between items-center pt-4 border-t border-outline-variant">
                  <div className="font-label-caps text-label-caps text-secondary">COINS EARNED</div>
                  <div className="font-data-md text-data-md text-primary">190K+</div>
                </div>
              </div>
            </div>

            {/* Creator 4 */}
            <div className="bg-surface-container-low rounded-xl overflow-hidden hover:shadow-xl transition-shadow group">
              <div className="h-64 relative">
                <img
                  alt="Networker"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgaAYWsJ0U0tL27v8tcN5JaA3LkaKugrFW32u-0v9LdNNgPfykbMtqMjiqm2hUklepZHlEd_KLhbsoDbgJ2hyw8gGgmsEsVCQPsc3E6CkkpkGUEtkdKqi2dqBqKQUz5wPyj_6jQuVZ0WsBS5ZM5U6NUntnfXGV-1ofKGWWOlrhn1mPPnyWWVjmkWbTopnQuFYGpXEKuhk-AQMFyLJeUAUP2KcshuPOXepDytpZFQepqsvJBfmo1fCSA1dTIjZ6b4-hHrSKVo_KeCQ"
                />
              </div>
              <div className="p-6">
                <h4 className="font-h3 text-h3 mb-1">Network Queen</h4>
                <div className="font-body-sm text-body-sm text-on-surface-variant mb-4">Portharcourt, NG • Referrer</div>
                <div className="flex justify-between items-center pt-4 border-t border-outline-variant">
                  <div className="font-label-caps text-label-caps text-secondary">COINS EARNED</div>
                  <div className="font-data-md text-data-md text-primary">1.2M+</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-primary px-margin-mobile md:px-gutter relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="font-h1 text-h1 text-on-primary mb-6">Ready to Build Your Wealth?</h2>
          <p className="font-body-lg text-body-lg text-on-primary-container mb-12">
            Start Your Journey with <span className="text-secondary-fixed font-bold">500 Bonus Coins</span>. It takes less than 60 seconds to join the hub and begin monetizing your tasks.
          </p>
          <form className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto mb-8">
            <input className="flex-1 bg-white/5 border border-outline-variant rounded-lg px-6 py-4 text-on-primary focus:outline-none focus:ring-2 focus:ring-secondary-fixed" placeholder="Enter your email address" type="email"/>
            <Link href="/register" className="bg-secondary-fixed hover:bg-secondary text-on-secondary-fixed font-h3 text-h3 px-10 py-4 rounded-lg transition-all shadow-[0_0_20px_rgba(255,222,166,0.3)]">
              Get Started
            </Link>
          </form>
          <div className="flex items-center justify-center gap-8 text-on-primary-container font-label-caps text-label-caps">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary-fixed">check_circle</span>
              No Fees
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary-fixed">check_circle</span>
              Instant Withdraw
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary-fixed">check_circle</span>
              Lagos Based
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-on-primary py-16 px-margin-mobile md:px-gutter border-t border-outline-variant/10">
        <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-4 gap-gutter">
          <div className="md:col-span-1">
            <div className="font-h2 text-h2 text-on-primary mb-4">CMPapp</div>
            <p className="font-body-sm text-body-sm text-on-primary-container">
              The creative economy hub empowering Africa's digital generation through music, tasks, and community.
            </p>
          </div>
          <div>
            <h5 className="font-label-caps text-label-caps text-secondary-fixed mb-6">PLATFORM</h5>
            <ul className="space-y-3 font-body-sm text-body-sm text-on-primary-container">
              <li><Link className="hover:text-on-primary transition-colors" href="#">How it Works</Link></li>
              <li><Link className="hover:text-on-primary transition-colors" href="/marketplace">Marketplace</Link></li>
              <li><Link className="hover:text-on-primary transition-colors" href="/tasks">Earn Coins</Link></li>
              <li><Link className="hover:text-on-primary transition-colors" href="/wallet">VTU Store</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-label-caps text-label-caps text-secondary-fixed mb-6">COMMUNITY</h5>
            <ul className="space-y-3 font-body-sm text-body-sm text-on-primary-container">
              <li><Link className="hover:text-on-primary transition-colors" href="#">Discord Hub</Link></li>
              <li><Link className="hover:text-on-primary transition-colors" href="/referrals">Referral Program</Link></li>
              <li><Link className="hover:text-on-primary transition-colors" href="#">Creator Perks</Link></li>
              <li><Link className="hover:text-on-primary transition-colors" href="/contests">Leaderboards</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-label-caps text-label-caps text-secondary-fixed mb-6">LEGAL</h5>
            <ul className="space-y-3 font-body-sm text-body-sm text-on-primary-container">
              <li><Link className="hover:text-on-primary transition-colors" href="#">Privacy Policy</Link></li>
              <li><Link className="hover:text-on-primary transition-colors" href="#">Terms of Service</Link></li>
              <li><Link className="hover:text-on-primary transition-colors" href="#">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-container-max mx-auto mt-16 pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center font-body-sm text-body-sm text-on-primary-container gap-4">
          <div>© 2024 CMPapp. Built for the Creative Revolution.</div>
          <div className="flex gap-6">
            <span className="material-symbols-outlined cursor-pointer hover:text-secondary-fixed transition-colors">language</span>
            <span className="material-symbols-outlined cursor-pointer hover:text-secondary-fixed transition-colors">share</span>
          </div>
        </div>
      </footer>
    </div>
  );
}