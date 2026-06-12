'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/ui/page-transition';
import { NeuCard } from '@/components/ui/neu-card';
import { NeuIconBadge } from '@/components/ui/neu-icon-badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Search, ShoppingCart, Heart, Verified, Wallet } from 'lucide-react';

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
    <PageTransition className="bg-neu-bg text-neo-text-primary min-h-screen pb-24 pt-16">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 py-2 bg-neu-bg shadow-neu-flat border-b border-neu-bg-dark">
        <div className="flex items-center gap-3">
          <NeuIconBadge size="sm" active>
            <img alt="User Profile" className="w-full h-full object-cover rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwxBy4t-VJFp40N6DLbW7ReAy8RanS7J7pCL6Y7OJALeEUZLCQw0UFHBN9ReDsGQslo__LuNjgWxjj1rmEYT7x-7tRsaiB4sT81Kp4YdQwwYgLQGov72AsG9drnfljIJlHP8ViUq-k7y5TatyIMY1ZFVzUhukZ0WfsuVIcD8LPN_P8V3wtbCO_MT6NmNRx4acQ5YvrE20CZ3EdN-42kP3zT4sG8PWahQG0jC2jFdS1sLXVMQURehSTTliN3p6KzY1zaONu1NoRGR6w" />
          </NeuIconBadge>
          <h1 className="font-h3 text-h3 text-neo-primary font-bold">CMPapp</h1>
        </div>
        <div className="flex items-center gap-4">
          <NeuCard padding="none" className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neu-bg shadow-neu-inset">
            <span className="font-data-md text-data-md text-neo-secondary">₦124,500</span>
            <NeuIconBadge size="sm" active className="bg-neo-secondary/20">
              <Wallet className="w-4 h-4 text-neo-secondary" />
            </NeuIconBadge>
          </NeuCard>
          <button className="w-10 h-10 flex items-center justify-center rounded-full text-neo-text-secondary hover:bg-neu-bg shadow-neu-flat transition-colors relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-neo-secondary rounded-full border-2 border-neu-bg"></span>
          </button>
        </div>
      </header>

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-gutter pt-6 flex flex-col gap-6">
        {/* Search Section */}
        <section className="flex flex-col gap-2">
          <h2 className="font-h2 text-h2 text-neo-primary">Discover Market</h2>
          <Input
            placeholder="Search products or stores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-5 h-5 text-neo-text-muted" />}
            className="pl-12"
          />
        </section>

        {/* Category Chips */}
        <section>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`snap-start shrink-0 px-5 py-2.5 rounded-full font-body-md text-body-md transition-all active:scale-95 ${
                  activeCategory === cat
                    ? 'bg-neo-primary text-white shadow-neu-raised-sm'
                    : 'bg-neu-bg text-neo-text-secondary shadow-neu-flat hover:shadow-neu-raised-sm'
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
          <StaggerContainer stagger={0.06}>
            {mockProducts.map((product) => (
              <StaggerItem key={product.id}>
                <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
                  <NeuCard padding="none" interactive className="rounded-xl border border-neu-bg-dark overflow-hidden shadow-neu-flat flex flex-col cursor-pointer group">
                    <div className="aspect-square w-full relative bg-neu-bg overflow-hidden">
                      <img
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src={product.image}
                      />
                      <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-neu-bg/80 backdrop-blur-sm flex items-center justify-center text-neo-text-muted hover:text-neo-error hover:bg-neu-bg transition-colors shadow-neu-raised-sm">
                        <Heart className="w-[18px] h-[18px]" />
                      </button>
                    </div>
                    <div className="p-3 flex flex-col flex-grow gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] uppercase font-bold text-neo-text-muted tracking-wider">{product.store}</span>
                        {product.isVerified && (
                          <NeuIconBadge size="sm" active className="bg-blue-500/20 p-0">
                            <Verified className="w-3 h-3 text-blue-500" />
                          </NeuIconBadge>
                        )}
                      </div>
                      <h3 className="font-body-sm text-body-sm text-neo-text-primary font-medium line-clamp-2 flex-grow">{product.name}</h3>
                      <div className="flex items-end justify-between mt-auto pt-2 border-t border-neu-bg-dark/50">
                        <span className="font-data-lg text-data-lg font-bold text-neo-primary">{product.price}</span>
                        <NeuIconBadge size="md" active className="bg-neo-primary shadow-neu-raised-sm cursor-pointer hover:bg-neo-primary/90 transition-colors">
                          <ShoppingCart className="w-5 h-5 text-white" />
                        </NeuIconBadge>
                      </div>
                    </div>
                  </NeuCard>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 bg-neu-bg shadow-neu-raised md:hidden">
        <Link href="/" className="flex flex-col items-center justify-center text-neo-text-secondary px-3 py-1 hover:text-neo-secondary transition-colors">
          <span className="material-symbols-outlined mb-1">home</span>
          <span className="font-label-caps text-label-caps">Home</span>
        </Link>
        <Link href="/tasks" className="flex flex-col items-center justify-center text-neo-text-secondary px-3 py-1 hover:text-neo-secondary transition-colors">
          <span className="material-symbols-outlined mb-1">payments</span>
          <span className="font-label-caps text-label-caps">Earn</span>
        </Link>
        <Link href="/music" className="flex flex-col items-center justify-center text-neo-text-secondary px-3 py-1 hover:text-neo-secondary transition-colors">
          <span className="material-symbols-outlined mb-1">music_note</span>
          <span className="font-label-caps text-label-caps">Music</span>
        </Link>
        <button className="flex flex-col items-center justify-center bg-neo-secondary text-neo-primary rounded-xl px-3 py-1 scale-90 transition-all shadow-neu-raised-sm">
          <span className="material-symbols-outlined mb-1 fill">storefront</span>
          <span className="font-label-caps text-label-caps">Market</span>
        </button>
        <Link href="/wallet" className="flex flex-col items-center justify-center text-neo-text-secondary px-3 py-1 hover:text-neo-secondary transition-colors">
          <span className="material-symbols-outlined mb-1">account_balance_wallet</span>
          <span className="font-label-caps text-label-caps">Wallet</span>
        </Link>
      </nav>
    </PageTransition>
  );
}