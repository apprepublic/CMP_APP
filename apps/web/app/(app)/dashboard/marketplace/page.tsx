'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/ui/page-transition';
import { NeuCard } from '@/components/ui/neu-card';
import { NeuIconBadge } from '@/components/ui/neu-icon-badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Search, ShoppingCart, Verified, Store } from 'lucide-react';
import { useStores, useProducts } from '@/lib/hooks';

const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Beauty'];

export default function MarketplacePage() {
  const { data: stores = [], isLoading: storesLoading } = useStores();
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <PageTransition className="bg-neu-bg text-neo-text-primary min-h-screen pb-24">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 py-2 bg-neu-bg shadow-neu-flat border-b border-neu-bg-dark">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="CMPapp" className="h-8 w-auto" />
        </div>
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 flex items-center justify-center rounded-full text-neo-text-secondary hover:bg-neu-bg shadow-neu-flat transition-colors relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-neo-secondary rounded-full border-2 border-neu-bg"></span>
          </button>
        </div>
      </header>

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-gutter pt-6 flex flex-col gap-6">
        {/* Search Section */}
        <section className="flex flex-col gap-2">
          <h2 className="font-h2 text-h2 text-neo-primary">Discover Stores</h2>
          <Input
            placeholder="Search stores..."
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

        {/* Stores Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {storesLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-48 rounded-neo neo-skeleton" />
            ))
          ) : stores.length === 0 ? (
            <NeuCard padding="lg" className="text-center py-10 text-neo-text-secondary col-span-full">
              No stores available yet.
            </NeuCard>
          ) : (
            <StaggerContainer stagger={0.08}>
              {stores.map((store) => (
                <StaggerItem key={store.id}>
                  <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
                    <NeuCard padding="none" interactive className="rounded-xl border border-neu-bg-dark overflow-hidden shadow-neu-flat flex flex-col cursor-pointer group">
                      <Link href={`/dashboard/marketplace/store/${store.slug}`} className="flex flex-col h-full">
                        <div className="aspect-video w-full relative bg-neu-bg overflow-hidden">
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neo-primary/20 to-neo-secondary/20">
                            <span className="material-symbols-outlined text-[64px] text-neo-text-muted">storefront</span>
                          </div>
                        </div>
                        <div className="p-4 flex flex-col flex-grow gap-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-h3 text-h3 text-neo-text-primary">{store.name}</h3>
                              {store.description && (
                                <p className="font-body-sm text-body-sm text-neo-text-secondary mt-1 line-clamp-2">{store.description}</p>
                              )}
                            </div>
                            <NeuIconBadge size="sm" active className="bg-neo-text-muted/20">
                              <Store className="w-4 h-4 text-neo-text-secondary" />
                            </NeuIconBadge>
                          </div>
                          <div className="flex items-center gap-2 mt-auto pt-3 border-t border-neu-bg-dark">
                            <Button size="sm" variant="outline" className="flex-1 border-neo-primary text-neo-primary hover:bg-neo-primary hover:text-white">
                              Visit Store
                            </Button>
                            <NeuIconBadge size="md" interactive className="cursor-pointer bg-neo-primary shadow-neu-raised-sm">
                              <ShoppingCart className="w-5 h-5 text-white" />
                            </NeuIconBadge>
                          </div>
                        </div>
                      </Link>
                    </NeuCard>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </section>

        {/* Featured Products Preview */}
        <section className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-h3 text-h3 text-neo-text-primary">Featured Products</h3>
            <Link href="/marketplace" className="font-body-sm text-body-sm text-neo-secondary font-semibold hover:underline">
              View All
            </Link>
          </div>
          {productsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-40 rounded-neo neo-skeleton" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <NeuCard padding="lg" className="text-center py-10 text-neo-text-secondary">
              No products available yet.
            </NeuCard>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.slice(0, 4).map((product) => (
                <NeuCard key={product.id} padding="none" interactive className="rounded-lg border border-neu-bg-dark overflow-hidden shadow-neu-flat group">
                  <div className="aspect-square bg-neu-bg">
                    {product.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        alt={product.name}
                        className="w-full h-full object-cover"
                        src={product.image_url}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neo-text-muted">
                        <span className="material-symbols-outlined text-[48px]">shopping_bag</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-body-sm text-body-sm text-neo-text-primary truncate">{product.name}</p>
                    <p className="font-data-md text-data-md text-neo-secondary mt-1">{product.price_coins.toLocaleString()} Coins</p>
                  </div>
                </NeuCard>
              ))}
            </div>
          )}
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