export const runtime = 'edge';
export const dynamicParams = true;

export async function generateStaticParams() {
  return [{ id: 'demo' }];
}

'use client';

import { useState } from 'react';
import Link from 'next/link';

const mockStore = {
  id: '1',
  name: 'TechHaven Hub',
  category: 'Gadgets & Gear',
  rating: 4.8,
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhH3IxIBTl7Y4Gh-nRvQQSq85DHbiZ-k5Rc0S9dwPS4m9axjy7JlEwT2_PznZbcDapxLCXQ85_TA9_gS24LXQAhiFlpK8-wNpj5jSRFHmhOPZsTNMM5L-VChLDJND3dKhbWXOfiBXlyjMAQYYw2-bSkSf_GgryZZyHVHKZbPsNtsDxY8Uhgcm1KCjPT8slfxtLe8JdoIB9tM-SOlTFrUjEy0L2kwsiwzsZw8aoN14oREM9KMoYx-7tBeKAiyfnmDelaaIfA77f6V83',
  products: [
    { id: '1', name: 'Quantum Smart Watch Pro', price: '$299', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4lLzO1jJYtqSZ5REFLc88mYvoWlXb_PsORhACwVVUdLWibD3olgNtzi2cPOxaxGheBIujP6LlNoM9SU_89g89WevzrF3xf2tzGmDiuhEGBsLCRjAd9m1Ct6znhJN5-QhtTogrcVvOmVrTR760KB_jeD4S6C4YOTUQAvMAXAJIDiGTXnQBzxJNwZ-q3BoHcjwggBnuLl-g8uplULCAY5W-CRwZwGdyvPGbwIErVrsbrb3s_uz0QpwSpnbbkOkvxD0dqreL0oj1llG6', featured: true },
    { id: '2', name: 'SonicFlow Noise Cancelling Headphones', price: '$199', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBM64juZIu1pkykhkrqJMnwS1g6AuYjuFWHdPd_lKjn7JftxE13lmojhph-MYnKUcJ_qJWTSjlxMIYJI-_lcxPwWqM7YPnjWlYa73CE6uLVdmtVVr1aMgbQSMQTsncb2t1wfg_39Rozr34IcHPKG0TqRQoUO6ijOlbxjbU_ZQaVMwCxY7vWjIBp8n8aHPzCnCXMaxXvgQjmoxeW3euMoiPOMdgKUaFdS6E9aFKwrgzj5JEXTeJ_nDonHMtMdsjWrXbk64dNmD2c_hFT' },
    { id: '3', name: 'AeroPods True Wireless', price: '$129', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOqcVOq5EOfKgYdh_duYqYC8DGOLxwkX8Sr7v7WJl25PJj9Rjzb5lxA9sYHpgPw1lFJIF6eh3qjkeND6EC11hWzk-Qcs6SJeFqADY9FMkC3wi-u4PoIJGjZE7XglNWqjEjOGQWMx5vugOtFF4lqexVIjiENp8otBG194fCwqwupvpzznOmF90gFVUltd4kLUs4sozUuroUsrc4THc9AGb9rudkWDrbH5Adw9kTgVIj0bHZRMdQhKuL7Mhv0PA5cSyOtUlZHkJlfU7l' },
    { id: '4', name: 'BoomBox Mini Portable Speaker', price: '$89', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCN49Br0RDnED9PEZSlrtp9XX_Krbz-7RM7StogenwSqHi9yxJHeFB1JVY0JUZemllIr7JT34BYpee7He7a8BOasaESE1QAeKD_NI6VcqWQ-GKOD01f0BQiSh1z6Mxa8EPGmmJ2eQF2Q4a3a9XUFeD1FjAJGibaAD97F9R4KT4gWWPXr_bVtsVugM6_3hydB_6I8QZ0FR7612-IN0Z5_t1ACCnqOVMY83Al0dmgp0EJNogQthFzLhMHy5MiI678TCoPsdDX4CH9jx_s' },
  ],
};

export default function StoreFrontPage() {
  return (
    <div className="bg-background text-on-background min-h-screen pb-[80px] pt-[64px]">
      {/* TopAppBar */}
      <header className="bg-surface border-b border-surface-secondary shadow-sm fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 py-2 h-[64px]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-variant overflow-hidden">
            <img alt="User Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBt27hFeTQVgVNv07rzpdkMhRFDQye7NsmbXqB75YViH8WZIUc0YofRECEHwJ54eBn_n4SCuRd-zgHX_yPHAz0MQ1Phl1bCgeerSjaLEnSCQZLZvJhAx9qt0TjGib7QBi7IaEtdaeyOxSOKbiU15ew9_8Y0nPbKEwleiYfrpuxszBQNuqFbsrmeN-LclNCVPB6mnE-1j9-E3fVneV_GnJOQ3nqXi4WngP7B6MLS4vP9EN9zeUdUB7Dv7c_Ge5v8F1amf93CI4wLK5WR" />
          </div>
          <h1 className="font-headline-md text-headline-md font-bold text-primary">CMPapp</h1>
        </div>
        <div className="hidden md:flex gap-6 items-center">
          <Link className="text-on-surface-variant hover:opacity-80 transition-opacity font-body-md text-body-md" href="/">Home</Link>
          <Link className="text-on-surface-variant hover:opacity-80 transition-opacity font-body-md text-body-md" href="/tasks">Earn</Link>
          <Link className="text-on-surface-variant hover:opacity-80 transition-opacity font-body-md text-body-md" href="/music">Music</Link>
          <Link className="text-primary font-bold hover:opacity-80 transition-opacity font-body-md text-body-md flex flex-col items-center" href="/marketplace">Market</Link>
          <Link className="text-on-surface-variant hover:opacity-80 transition-opacity font-body-md text-body-md" href="/wallet">Wallet</Link>
        </div>
        <button className="text-primary hover:opacity-80 transition-opacity">
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-gutter py-stack-lg">
        {/* Store Hero */}
        <section className="bg-surface-container-lowest rounded-xl p-stack-md shadow-[0px_4px_20px_rgba(13,27,53,0.05)] border border-surface-secondary mb-stack-lg flex flex-col md:flex-row gap-stack-md items-start md:items-center">
          <div className="w-24 h-24 rounded-lg bg-surface-variant overflow-hidden shrink-0 border border-surface-secondary shadow-sm">
            <img alt="TechHaven Hub Logo" className="w-full h-full object-cover" src={mockStore.avatar} />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-headline-lg text-headline-lg text-primary mb-1">{mockStore.name}</h2>
                <p className="font-body-md text-body-md text-on-surface-variant mb-2">{mockStore.category}</p>
              </div>
              <div className="flex items-center gap-1 bg-surface-container px-2 py-1 rounded-full">
                <span className="material-symbols-outlined text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="font-wallet-display text-wallet-display text-primary">{mockStore.rating}</span>
              </div>
            </div>
            <div className="flex gap-2 mt-stack-sm">
              <span className="px-3 py-1 rounded-full border border-surface-secondary bg-surface text-on-surface-variant font-label-caps text-label-caps">Electronics</span>
              <span className="px-3 py-1 rounded-full border border-surface-secondary bg-surface text-on-surface-variant font-label-caps text-label-caps">Accessories</span>
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section>
          <h3 className="font-headline-md text-headline-md text-primary mb-stack-md">Featured Products</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-stack-md">
            {mockStore.products.map((product) => (
              <article
                key={product.id}
                className={`bg-surface-container-lowest rounded-lg border shadow-[0px_4px_20px_rgba(13,27,53,0.05)] overflow-hidden flex flex-col relative ${
                  product.featured ? 'border-secondary-container shadow-[0px_4px_20px_rgba(253,195,77,0.15)]' : 'border-surface-secondary'
                }`}
              >
                {product.featured && (
                  <div className="absolute top-2 left-2 z-10 px-2 py-1 bg-secondary-container text-on-secondary-container rounded-full font-label-caps text-label-caps">Featured</div>
                )}
                <div className="aspect-square bg-surface-variant relative">
                  <img alt={product.name} className="w-full h-full object-cover" src={product.image} />
                </div>
                <div className="p-stack-sm flex flex-col flex-1">
                  <h4 className="font-body-md text-body-md text-primary font-medium mb-1 line-clamp-2">{product.name}</h4>
                  <div className="mt-auto pt-2 flex justify-between items-center">
                    <span className="font-wallet-display text-wallet-display text-primary">{product.price}</span>
                    <button className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center hover:bg-primary transition-colors">
                      <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden bg-primary-container fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 shadow-[0px_-4px_20px_rgba(13,27,53,0.1)] h-[80px]">
        <Link className="flex flex-col items-center justify-center text-on-primary-fixed-variant px-3 py-1 hover:text-secondary-fixed transition-colors w-16" href="/">
          <span className="material-symbols-outlined mb-1">home</span>
          <span className="font-label-caps text-[10px] uppercase tracking-wider">Home</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-on-primary-fixed-variant px-3 py-1 hover:text-secondary-fixed transition-colors w-16" href="/tasks">
          <span className="material-symbols-outlined mb-1">payments</span>
          <span className="font-label-caps text-[10px] uppercase tracking-wider">Earn</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-on-primary-fixed-variant px-3 py-1 hover:text-secondary-fixed transition-colors w-16" href="/music">
          <span className="material-symbols-outlined mb-1">music_note</span>
          <span className="font-label-caps text-[10px] uppercase tracking-wider">Music</span>
        </Link>
        <button className="flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-xl px-3 py-1 w-16 h-14 scale-90 transition-all">
          <span className="material-symbols-outlined mb-1">storefront</span>
          <span className="font-label-caps text-[10px] uppercase tracking-wider">Market</span>
        </button>
        <Link className="flex flex-col items-center justify-center text-on-primary-fixed-variant px-3 py-1 hover:text-secondary-fixed transition-colors w-16" href="/wallet">
          <span className="material-symbols-outlined mb-1">account_balance_wallet</span>
          <span className="font-label-caps text-[10px] uppercase tracking-wider">Wallet</span>
        </Link>
      </nav>
    </div>
  );
}