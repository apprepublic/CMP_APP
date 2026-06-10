'use client';

import { useState } from 'react';
import Link from 'next/link';

const mockProducts = [
  {
    id: '1',
    name: 'Sony WH-1000XM4 Noise Canceling Headphones',
    store: 'TechHub',
    isVerified: true,
    price: '₦145,000',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARwNjHjRCYjo6u8yYYeq96nshpQbk4aZX_PHhl_kCvvDTdJYyvvjGbk9qUDCr5FPCs2hkAU-MQogRJZO1cdIamSFvFxgmNBsLAJivkKTP7xhLWoCzl_tiynruQnl8emqXsijjsh-iulNw_fQdF7YPwfV5vC14hILBOZYJ5EaZhyg7wdGo_-OJ4s8bcQq3Wfr3qFODtZR8M7gwEiHHiodt2ZrMS8QJm29JSQNgTSnWsVsGV2JlmeYcVQU6Rcvb--8YuE4ZGMcvy_xzR',
  },
  {
    id: '2',
    name: 'Nike Air Max Vintage Collection',
    store: 'ShoeZone',
    isVerified: true,
    price: '₦42,500',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtDaa9P8a01fNHA3nw6dBRx_t6uKRjRMqzCmV7cFKQiCMu3b7nf_eFzedBavoI6UFxYT0SQ69sWvgzihqhzWrY4RYuxmYhrJWjY3QKfSgvDN0di0M4tY5ajP3CfeLPMeD1GpKUVlnFsxIofTuN0CESOs7LQOzgki9g2POw982Epn_4Qg_quMdKXSYKX1XkgJZcxcdodvOPvYPGepSGkprKve9_Jn_GPqyrYw6IRHyiQnBJk_Ldl7m4Q0wRIunzYstVp9Xr7-0JfGfi',
  },
  {
    id: '3',
    name: 'Minimalist Series 7 Smartwatch Edition',
    store: 'TimePiece',
    isVerified: false,
    price: '₦85,000',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRs_6I_fDvIg4M9Gp1GbvCg4yD6oRHDgsr1kVpZXKrzZeNhkvYnSt7A5WZwI351yz4lOmnDdPEkH1_paIkg6slhDiiJZScTKh8Sg16BHmFvr8q95YxmQ_VQT8ISC2heCkhwrqkPkiSlK8xGU0tBQbbtEFRf7kNAnZnh3bbe13z8UWG7DWfU3Z1bnk87GjJiLlTLvtfvc2ktiE7ptWPbcpJhbf_2qAvwPoeG4kd9eJN3dai-MP2nu_bNvpZTixtG4tLwVQ8OnGa2hb9',
  },
  {
    id: '4',
    name: 'Handcrafted Ceramic Coffee Mug (Set of 2)',
    store: 'ArtisanHome',
    isVerified: true,
    price: '₦15,000',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArg26hrToCU9ihhjZzH-8BQIKSRTw7Fw4WrE5smO8fOojRnnm_oSdJc3aUwDK-kpR-uPOxg5TqNLkFI5pIXI16cQursly4D2bSXQxWSoZG4DEmpNlRvoWsDPbhnffrQcE2P9_ZRK8FZZQc6KbJF_Ib2UUR2Vm1WPF8_WK05Sso32dZTi8c76cflhlCmXki_-S_WBu7Pq0v2nUKGek7RNpF_AqnoJP5Uc68CeKhYTtJlpv-mdrANaYyhKQppVZYAhV_gliSvtn9h2-U',
  },
];

const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Beauty'];

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <div className="bg-background text-on-background min-h-screen pb-24 pt-16">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 py-2 bg-surface shadow-sm border-b border-surface-secondary">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-container overflow-hidden border border-surface-secondary">
            <img alt="User Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwxBy4t-VJFp40N6DLbW7ReAy8RanS7J7pCL6Y7OJALeEUZLCQw0UFHBN9ReDsGQslo__LuNjgWxjj1rmEYT7x-7tRsaiB4sT81Kp4YdQwwYgLQGov72AsG9drnfljIJlHP8ViUq-k7y5TatyIMY1ZFVzUhukZ0WfsuVIcD8LPN_P8V3wtbCO_MT6NmNRx4acQ5YvrE20CZ3EdN-42kP3zT4sG8PWahQG0jC2jFdS1sLXVMQURehSTTliN3p6KzY1zaONu1NoRGR6w" />
          </div>
          <h1 className="font-headline-md text-headline-md font-bold text-primary">CMPapp</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/10 rounded-full border border-secondary/20">
            <span className="font-wallet-display text-[14px] font-semibold text-secondary">₦124,500</span>
            <span className="material-symbols-outlined text-secondary" style={{ fontSize: '18px' }}>account_balance_wallet</span>
          </div>
          <button className="w-10 h-10 flex items-center justify-center rounded-full text-primary hover:bg-surface-container transition-colors relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full border border-surface"></span>
          </button>
        </div>
      </header>

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-gutter pt-stack-md flex flex-col gap-stack-lg">
        {/* Search Section */}
        <section className="flex flex-col gap-stack-sm">
          <h2 className="font-headline-lg text-headline-lg text-primary">Discover Market</h2>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">search</span>
            <input
              className="w-full pl-12 pr-4 py-4 rounded-lg bg-surface-container-lowest border border-surface-secondary text-body-lg font-body-lg text-text-main placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
              placeholder="Search products or stores..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </section>

        {/* Category Chips */}
        <section>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`snap-start shrink-0 px-5 py-2.5 rounded-full font-body-md text-body-md transition-transform hover:scale-[1.02] active:scale-95 ${
                  activeCategory === cat
                    ? 'bg-primary text-on-primary shadow-[0px_4px_12px_rgba(13,27,53,0.15)]'
                    : 'bg-surface-container-lowest text-text-main border border-surface-secondary hover:bg-surface-container'
                }`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Product Grid */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {mockProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-surface-container-lowest rounded-xl border border-surface-secondary overflow-hidden shadow-[0px_4px_20px_rgba(13,27,53,0.03)] hover:shadow-[0px_8px_30px_rgba(13,27,53,0.08)] transition-all flex flex-col cursor-pointer"
            >
              <div className="aspect-square w-full relative bg-surface-container-low overflow-hidden">
                <img
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src={product.image}
                />
                <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-surface-container-lowest/80 backdrop-blur-sm flex items-center justify-center text-outline hover:text-error hover:bg-surface-container-lowest transition-colors">
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>favorite</span>
                </button>
              </div>
              <div className="p-3 flex flex-col flex-grow gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] uppercase font-bold text-outline tracking-wider">{product.store}</span>
                  {product.isVerified && (
                    <span className="material-symbols-outlined text-[#1D9BF0] fill" style={{ fontSize: '14px' }}>verified</span>
                  )}
                </div>
                <h3 className="font-body-sm text-body-sm text-text-main font-medium line-clamp-2 flex-grow">{product.name}</h3>
                <div className="flex items-end justify-between mt-auto pt-2 border-t border-surface-secondary/50">
                  <span className="font-wallet-display text-[16px] font-bold text-primary">{product.price}</span>
                  <button className="w-8 h-8 rounded bg-primary-container text-on-primary flex items-center justify-center hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors">
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add_shopping_cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 bg-primary-container shadow-[0px_-4px_20px_rgba(13,27,53,0.1)] md:hidden">
        <Link href="/" className="flex flex-col items-center justify-center text-on-primary-fixed-variant px-3 py-1 hover:text-secondary-fixed transition-colors">
          <span className="material-symbols-outlined mb-1">home</span>
          <span className="font-label-caps text-label-caps">Home</span>
        </Link>
        <Link href="/tasks" className="flex flex-col items-center justify-center text-on-primary-fixed-variant px-3 py-1 hover:text-secondary-fixed transition-colors">
          <span className="material-symbols-outlined mb-1">payments</span>
          <span className="font-label-caps text-label-caps">Earn</span>
        </Link>
        <Link href="/music" className="flex flex-col items-center justify-center text-on-primary-fixed-variant px-3 py-1 hover:text-secondary-fixed transition-colors">
          <span className="material-symbols-outlined mb-1">music_note</span>
          <span className="font-label-caps text-label-caps">Music</span>
        </Link>
        <button className="flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-xl px-3 py-1 scale-90 transition-all">
          <span className="material-symbols-outlined mb-1 fill">storefront</span>
          <span className="font-label-caps text-label-caps">Market</span>
        </button>
        <Link href="/wallet" className="flex flex-col items-center justify-center text-on-primary-fixed-variant px-3 py-1 hover:text-secondary-fixed transition-colors">
          <span className="material-symbols-outlined mb-1">account_balance_wallet</span>
          <span className="font-label-caps text-label-caps">Wallet</span>
        </Link>
      </nav>
    </div>
  );
}