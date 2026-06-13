'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/ui/page-transition';
import { NeuCard } from '@/components/ui/neu-card';
import { NeuIconBadge } from '@/components/ui/neu-icon-badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Search, ShoppingCart, Heart, Verified } from 'lucide-react';
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
    <PageTransition className="bg-neu-bg text-neo-text-primary min-h-screen pb-24 pt-16">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 py-2 bg-neu-bg shadow-neu-flat border-b border-neu-bg-dark">
        <div className="flex items-center gap-3">
          <NeuIconBadge size="sm" active>
            <span className="material-symbols-outlined text-neo-primary">person</span>
          </NeuIconBadge>
          <h1 className="font-h3 text-h3 text-neo-primary font-bold">CMPapp</h1>
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

        {/* Stores Section */}
        <section>
          <h3 className="font-h3 text-h3 text-neo-text-primary mb-4">Featured Stores</h3>
          {storesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-48 rounded-neo neo-skeleton" />
              ))}
            </div>
          ) : stores.length === 0 ? (
            <NeuCard padding="lg" className="text-center py-10 text-neo-text-secondary">
              No stores available yet.
            </NeuCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StaggerContainer stagger={0.08}>
                {stores.map((store) => (
                  <StaggerItem key={store.id}>
                    <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
                      <NeuCard padding="none" interactive className="rounded-xl border border-neu-bg-dark overflow-hidden shadow-neu-flat flex flex-col cursor-pointer group">
                        <Link href={`/marketplace/store/${store.slug}`} className="flex flex-col h-full">
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
                            </div>
                            <div className="flex items-center gap-2 mt-auto pt-3 border-t border-neu-bg-dark">
                              <Button size="sm" variant="outline" className="flex-1 border-neo-primary text-neo-primary hover:bg-neo-primary hover:text-white">
                                Visit Store
                              </Button>
                            </div>
                          </div>
                        </Link>
                      </NeuCard>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          )}
        </section>

        {/* Product Grid */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          <StaggerContainer stagger={0.06}>
            {productsLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-48 rounded-neo neo-skeleton" />
              ))
            ) : filteredProducts.length === 0 ? (
              <div className="col-span-full">
                <NeuCard padding="lg" className="text-center py-10 text-neo-text-secondary">
                  {products.length === 0 ? 'No products available yet.' : 'No products match your search.'}
                </NeuCard>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <StaggerItem key={product.id}>
                  <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
                    <NeuCard padding="none" interactive className="rounded-xl border border-neu-bg-dark overflow-hidden shadow-neu-flat flex flex-col cursor-pointer group">
                      <div className="aspect-square w-full relative bg-neu-bg overflow-hidden">
                        {product.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            src={product.image_url}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neo-primary/20 to-neo-secondary/20">
                            <span className="material-symbols-outlined text-[48px] text-neo-text-muted">shopping_bag</span>
                          </div>
                        )}
                        <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-neu-bg/80 backdrop-blur-sm flex items-center justify-center text-neo-text-muted hover:text-neo-error hover:bg-neu-bg transition-colors shadow-neu-raised-sm">
                          <Heart className="w-[18px] h-[18px]" />
                        </button>
                      </div>
                      <div className="p-3 flex flex-col flex-grow gap-2">
                        {product.category && (
                          <span className="text-[10px] uppercase font-bold text-neo-text-muted tracking-wider">{product.category}</span>
                        )}
                        <h3 className="font-body-sm text-body-sm text-neo-text-primary font-medium line-clamp-2 flex-grow">{product.name}</h3>
                        <div className="flex items-end justify-between mt-auto pt-2 border-t border-neu-bg-dark/50">
                          <span className="font-data-lg text-data-lg font-bold text-neo-secondary">{product.price_coins.toLocaleString()} Coins</span>
                          <NeuIconBadge size="md" active className="bg-neo-primary shadow-neu-raised-sm cursor-pointer hover:bg-neo-primary/90 transition-colors">
                            <ShoppingCart className="w-5 h-5 text-white" />
                          </NeuIconBadge>
                        </div>
                      </div>
                    </NeuCard>
                  </motion.div>
                </StaggerItem>
              ))
            )}
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