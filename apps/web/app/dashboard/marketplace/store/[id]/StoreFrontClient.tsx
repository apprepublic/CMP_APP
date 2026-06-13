'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/ui/page-transition';
import { NeuCard } from '@/components/ui/neu-card';
import { NeuIconBadge } from '@/components/ui/neu-icon-badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Verified, Star, TrendingUp, Users, Award } from 'lucide-react';

const store = {
  id: '1',
  name: 'TechHub',
  description: 'Your one-stop shop for the latest tech gadgets and accessories. We offer premium products at competitive prices with fast shipping across Nigeria.',
  isVerified: true,
  products: 156,
  rating: 4.8,
  followers: '12.5K',
  established: '2020',
  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARwNjHjRCYjo6u8yYYeq96nshpQbk4aZX_PHhl_kCvvDTdJYyvvjGbk9qUDCr5FPCs2hkAU-MQogRJZO1cdIamSFvFxgmNBsLAJivkKTP7xhLWoCzl_tiynruQnl8emqXsijjsh-iulNw_fQdF7YPwfV5vC14hILBOZYJ5EaZhyg7wdGo_-OJ4s8bcQq3Wfr3qFODtZR8M7gwEiHHiodt2ZrMS8QJm29JSQNgTSnWsVsGV2JlmeYcVQU6Rcvb--8YuE4ZGMcvy_xzR',
};

const products = [
  { id: '1', name: 'Sony WH-1000XM4', price: '₦145,000', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARwNjHjRCYjo6u8yYYeq96nshpQbk4aZX_PHhl_kCvvDTdJYyvvjGbk9qUDCr5FPCs2hkAU-MQogRJZO1cdIamSFvFxgmNBsLAJivkKTP7xhLWoCzl_tiynruQnl8emqXsijjsh-iulNw_fQdF7YPwfV5vC14hILBOZYJ5EaZhyg7wdGo_-OJ4s8bcQq3Wfr3qFODtZR8M7gwEiHHiodt2ZrMS8QJm29JSQNgTSnWsVsGV2JlmeYcVQU6Rcvb--8YuE4ZGMcvy_xzR' },
  { id: '2', name: 'Apple AirPods Pro', price: '₦95,000', image: '' },
  { id: '3', name: 'Samsung Galaxy Buds', price: '₦65,000', image: '' },
  { id: '4', name: 'JBL Flip 6', price: '₦55,000', image: '' },
  { id: '5', name: 'Anker PowerCore', price: '₦25,000', image: '' },
  { id: '6', name: 'Logitech MX Master 3', price: '₦45,000', image: '' },
];

export default function StoreFrontClient() {
  const params = useParams();
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <PageTransition className="bg-neu-bg text-neo-text-primary min-h-screen pb-24">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 py-2 bg-neu-bg shadow-neu-flat border-b border-neu-bg-dark">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/marketplace">
            <NeuIconBadge size="sm" interactive className="cursor-pointer">
              <span className="material-symbols-outlined text-[18px] text-neo-text-primary">arrow_back</span>
            </NeuIconBadge>
          </Link>
          <h1 className="font-h3 text-h3 text-neo-primary font-bold">{store.name}</h1>
        </div>
        <NeuIconBadge size="sm" interactive className="cursor-pointer">
          <span className="material-symbols-outlined text-[18px] text-neo-text-primary">shopping_cart</span>
        </NeuIconBadge>
      </header>

      <main className="pt-[60px] max-w-container-max mx-auto px-margin-mobile md:px-gutter">
        {/* Store Hero */}
        <section className="mt-4">
          <NeuCard padding="none" className="relative rounded-xl overflow-hidden shadow-neu-raised">
            <div className="h-48 md:h-64 w-full bg-neu-bg relative">
              <img alt="Store Cover" className="w-full h-full object-cover" src={store.image} />
              <div className="absolute inset-0 bg-gradient-to-t from-neo-primary/90 via-neo-primary/40 to-transparent"></div>
            </div>
            <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="flex items-end gap-4">
                <NeuIconBadge size="lg" active className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-neu-bg shadow-neu-raised overflow-hidden p-0 bg-neu-bg">
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neo-secondary to-neo-primary">
                    <span className="font-h2 text-h2 text-white font-bold">{store.name[0]}</span>
                  </div>
                </NeuIconBadge>
                <div className="text-white md:text-neo-text-primary pb-2">
                  <div className="flex items-center gap-2">
                    <h1 className="font-h2 text-h2 text-white md:text-neo-primary">{store.name}</h1>
                    {store.isVerified && (
                      <NeuIconBadge size="sm" active className="bg-blue-500/20 p-0">
                        <Verified className="w-4 h-4 text-blue-500" />
                      </NeuIconBadge>
                    )}
                  </div>
                  <p className="font-body-sm text-body-sm text-white/80 md:text-neo-text-secondary mt-1">{store.followers} followers • Est. {store.established}</p>
                </div>
              </div>
              <Button
                size="lg"
                variant={isFollowing ? 'outline' : 'default'}
                onClick={() => setIsFollowing(!isFollowing)}
                className="gap-2 shadow-neu-raised-sm"
              >
                {isFollowing ? 'Following' : 'Follow Store'}
              </Button>
            </div>
          </NeuCard>
        </section>

        {/* Store Stats */}
        <section className="mt-6 grid grid-cols-3 gap-4">
          <StaggerContainer stagger={0.1}>
            <StaggerItem>
              <NeuCard padding="md" className="shadow-neu-flat text-center">
                <NeuIconBadge size="md" active className="mx-auto mb-2 bg-neo-secondary/20">
                  <ShoppingCart className="w-5 h-5 text-neo-secondary" />
                </NeuIconBadge>
                <p className="font-data-lg text-data-lg text-neo-text-primary">{store.products}</p>
                <p className="font-label-caps text-label-caps text-neo-text-secondary mt-1">Products</p>
              </NeuCard>
            </StaggerItem>
            <StaggerItem>
              <NeuCard padding="md" className="shadow-neu-flat text-center">
                <NeuIconBadge size="md" active className="mx-auto mb-2 bg-neo-secondary/20">
                  <Star className="w-5 h-5 text-neo-secondary" />
                </NeuIconBadge>
                <p className="font-data-lg text-data-lg text-neo-text-primary">{store.rating}</p>
                <p className="font-label-caps text-label-caps text-neo-text-secondary mt-1">Rating</p>
              </NeuCard>
            </StaggerItem>
            <StaggerItem>
              <NeuCard padding="md" className="shadow-neu-flat text-center">
                <NeuIconBadge size="md" active className="mx-auto mb-2 bg-neo-secondary/20">
                  <Users className="w-5 h-5 text-neo-secondary" />
                </NeuIconBadge>
                <p className="font-data-lg text-data-lg text-neo-text-primary">{store.followers}</p>
                <p className="font-label-caps text-label-caps text-neo-text-secondary mt-1">Followers</p>
              </NeuCard>
            </StaggerItem>
          </StaggerContainer>
        </section>

        {/* About */}
        <section className="mt-6">
          <NeuCard padding="lg" className="shadow-neu-flat">
            <h3 className="font-h3 text-h3 text-neo-text-primary mb-3">About</h3>
            <p className="font-body-md text-body-md text-neo-text-secondary">{store.description}</p>
          </NeuCard>
        </section>

        {/* Products */}
        <section className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-h3 text-h3 text-neo-text-primary">All Products</h3>
            <div className="flex items-center gap-2 text-neo-text-secondary">
              <TrendingUp className="w-4 h-4" />
              <span className="font-body-sm text-body-sm">Sort by Popular</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <StaggerContainer stagger={0.06}>
              {products.map((product) => (
                <StaggerItem key={product.id}>
                  <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
                    <NeuCard padding="none" interactive className="rounded-xl border border-neu-bg-dark overflow-hidden shadow-neu-flat flex flex-col cursor-pointer group">
                      <div className="aspect-square w-full relative bg-neu-bg overflow-hidden">
                        {product.image ? (
                          <img alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={product.image} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neo-text-muted">
                            <span className="material-symbols-outlined text-[48px]">shopping_bag</span>
                          </div>
                        )}
                        <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-neu-bg/80 backdrop-blur flex items-center justify-center text-neo-text-muted hover:text-neo-error hover:bg-neu-bg transition-colors shadow-neu-raised-sm">
                          <Heart className="w-[18px] h-[18px]" />
                        </button>
                      </div>
                      <div className="p-3 flex flex-col flex-grow gap-2">
                        <h3 className="font-body-sm text-body-sm text-neo-text-primary font-medium line-clamp-2 flex-grow">{product.name}</h3>
                        <div className="flex items-end justify-between mt-auto pt-2 border-t border-neu-bg-dark/50">
                          <span className="font-data-lg text-data-lg font-bold text-neo-primary">{product.price}</span>
                          <NeuIconBadge size="md" interactive className="cursor-pointer bg-neo-primary shadow-neu-raised-sm">
                            <ShoppingCart className="w-5 h-5 text-white" />
                          </NeuIconBadge>
                        </div>
                      </div>
                    </NeuCard>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      </main>

      {/* BottomNavBar (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 bg-neu-bg shadow-neu-raised">
        <Link href="/dashboard" className="flex flex-col items-center justify-center text-neo-text-secondary px-3 py-1 hover:text-neo-secondary transition-colors">
          <span className="material-symbols-outlined mb-1">home</span>
          <span className="font-label-caps text-label-caps">Home</span>
        </Link>
        <Link href="/dashboard/tasks" className="flex flex-col items-center justify-center text-neo-text-secondary px-3 py-1 hover:text-neo-secondary transition-colors">
          <span className="material-symbols-outlined mb-1">payments</span>
          <span className="font-label-caps text-label-caps">Earn</span>
        </Link>
        <Link href="/dashboard/music" className="flex flex-col items-center justify-center text-neo-text-secondary px-3 py-1 hover:text-neo-secondary transition-colors">
          <span className="material-symbols-outlined mb-1">music_note</span>
          <span className="font-label-caps text-label-caps">Music</span>
        </Link>
        <Link href="/dashboard/marketplace" className="flex flex-col items-center justify-center bg-neo-secondary text-neo-primary rounded-xl px-3 py-1 scale-90 transition-all shadow-neu-raised-sm">
          <span className="material-symbols-outlined mb-1 fill">storefront</span>
          <span className="font-label-caps text-label-caps">Market</span>
        </Link>
        <Link href="/dashboard/wallet" className="flex flex-col items-center justify-center text-neo-text-secondary px-3 py-1 hover:text-neo-secondary transition-colors">
          <span className="material-symbols-outlined mb-1">account_balance_wallet</span>
          <span className="font-label-caps text-label-caps">Wallet</span>
        </Link>
      </nav>
    </PageTransition>
  );
}