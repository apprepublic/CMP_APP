'use client';

import Link from 'next/link';
import { useStore } from '@/lib/hooks';

export default function StoreFrontClient({ slug }: { slug: string }) {
  const { data, isLoading } = useStore(slug);

  if (isLoading) {
    return (
      <div className="bg-neu-bg text-neo-text-primary min-h-screen pb-24">
        <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 py-2 bg-neu-bg shadow-neu-flat border-b border-neu-bg-dark">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/marketplace">
              <span className="material-symbols-outlined text-[18px] text-neo-text-primary">arrow_back</span>
            </Link>
            <h1 className="font-h3 text-h3 text-neo-primary font-bold">Loading...</h1>
          </div>
          <span className="material-symbols-outlined text-[18px] text-neo-text-primary">shopping_cart</span>
        </header>
        <main className="pt-[60px] max-w-container-max mx-auto px-margin-mobile md:px-gutter">
          <div className="h-48 rounded-xl neo-skeleton mb-6" />
          <div className="grid grid-cols-3 gap-4 mb-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 rounded-lg neo-skeleton" />
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-48 rounded-lg neo-skeleton" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-neu-bg text-neo-text-primary min-h-screen pb-24">
        <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 py-2 bg-neu-bg shadow-neu-flat border-b border-neu-bg-dark">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/marketplace">
              <span className="material-symbols-outlined text-[18px] text-neo-text-primary">arrow_back</span>
            </Link>
            <h1 className="font-h3 text-h3 text-neo-primary font-bold">Store not found</h1>
          </div>
          <span className="material-symbols-outlined text-[18px] text-neo-text-primary">shopping_cart</span>
        </header>
        <main className="pt-[60px] max-w-container-max mx-auto px-margin-mobile md:px-gutter">
          <div className="text-center py-20 text-neo-text-secondary">
            <span className="material-symbols-outlined text-[64px] mb-4">storefront</span>
            <h2 className="font-h3 text-h3 text-neo-text-primary mb-2">Store not found</h2>
            <p>The store you're looking for doesn't exist or has been removed.</p>
          </div>
        </main>
      </div>
    );
  }

  const { store, products } = data;

  return (
    <div className="bg-neu-bg text-neo-text-primary min-h-screen pb-24">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 py-2 bg-neu-bg shadow-neu-flat border-b border-neu-bg-dark">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/marketplace">
            <span className="material-symbols-outlined text-[18px] text-neo-text-primary">arrow_back</span>
          </Link>
          <h1 className="font-h3 text-h3 text-neo-primary font-bold">{store.name}</h1>
        </div>
        <span className="material-symbols-outlined text-[18px] text-neo-text-primary">shopping_cart</span>
      </header>

      <main className="pt-[60px] max-w-container-max mx-auto px-margin-mobile md:px-gutter">
        {/* Store Hero */}
        <section className="mt-4">
          <div className="relative rounded-xl overflow-hidden shadow-neu-raised">
            <div className="h-48 md:h-64 w-full bg-gradient-to-br from-neo-primary/20 to-neo-secondary/20 flex items-center justify-center">
              <span className="font-h1 text-h1 text-neo-primary font-bold">{store.name?.[0]?.toUpperCase() || 'S'}</span>
            </div>
            <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col md:flex-row md:items-end justify-between gap-6 bg-gradient-to-t from-neu-bg via-neu-bg/80 to-transparent">
              <div className="flex items-end gap-4">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-neu-bg shadow-neu-raised flex items-center justify-center bg-gradient-to-br from-neo-secondary to-neo-primary">
                  <span className="font-h2 text-h2 text-white font-bold">{store.name?.[0]?.toUpperCase() || 'S'}</span>
                </div>
                <div className="pb-2">
                  <h1 className="font-h2 text-h2 text-neo-text-primary">{store.name}</h1>
                  {store.description && (
                    <p className="font-body-sm text-body-sm text-neo-text-secondary mt-1 line-clamp-2">{store.description}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-h3 text-h3 text-neo-text-primary">All Products</h3>
          </div>
          {products.length === 0 ? (
            <div className="text-center py-10 text-neo-text-secondary">
              <span className="material-symbols-outlined text-[48px] mb-2">shopping_bag</span>
              <p>No products available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <div key={product.id} className="rounded-xl border border-neu-bg-dark overflow-hidden shadow-neu-flat flex flex-col">
                  <div className="aspect-square w-full relative bg-neu-bg overflow-hidden flex items-center justify-center">
                    {product.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img alt={product.name} className="w-full h-full object-cover" src={product.image_url} />
                    ) : (
                      <span className="material-symbols-outlined text-[48px] text-neo-text-muted">shopping_bag</span>
                    )}
                  </div>
                  <div className="p-3 flex flex-col flex-grow gap-2">
                    <h3 className="font-body-sm text-body-sm text-neo-text-primary font-medium line-clamp-2 flex-grow">{product.name}</h3>
                    {product.category && (
                      <span className="text-[10px] uppercase font-bold text-neo-text-muted tracking-wider">{product.category}</span>
                    )}
                    <div className="flex items-end justify-between mt-auto pt-2 border-t border-neu-bg-dark/50">
                      <span className="font-data-lg text-data-lg font-bold text-neo-secondary">{product.price_coins.toLocaleString()} Coins</span>
                      <button className="w-8 h-8 rounded-full bg-neo-primary flex items-center justify-center hover:bg-neo-primary/90 transition-colors shadow-neu-raised-sm">
                        <span className="material-symbols-outlined text-[18px] text-white">add_shopping_cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
    </div>
  );
}