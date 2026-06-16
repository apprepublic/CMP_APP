'use client';

import Link from 'next/link';
import { useStore } from '@/lib/hooks';

export default function StoreFrontClient({ slug }: { slug: string }) {
  const { data, isLoading } = useStore(slug);

  if (isLoading) {
    return (
      <div className="bg-background text-on-background min-h-screen pb-[80px] pt-[64px]">
        <header className="bg-surface border-b border-surface-secondary shadow-sm fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 py-2 h-[64px]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-variant overflow-hidden">
              <span className="material-symbols-outlined text-on-surface-variant">person</span>
            </div>
            <h1 className="font-headline-md text-headline-md font-bold text-primary">CMPapp</h1>
          </div>
          <button className="text-primary hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </header>
        <main className="max-w-container-max mx-auto px-margin-mobile md:px-gutter py-6">
          <div className="h-48 rounded-xl neo-skeleton mb-6" />
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
      <div className="bg-background text-on-background min-h-screen pb-[80px] pt-[64px]">
        <header className="bg-surface border-b border-surface-secondary shadow-sm fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 py-2 h-[64px]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-variant overflow-hidden">
              <span className="material-symbols-outlined text-on-surface-variant">person</span>
            </div>
            <h1 className="font-headline-md text-headline-md font-bold text-primary">CMPapp</h1>
          </div>
          <button className="text-primary hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </header>
        <main className="max-w-container-max mx-auto px-margin-mobile md:px-gutter py-6">
          <div className="text-center py-20 text-on-surface-variant">
            <span className="material-symbols-outlined text-[64px] mb-4">storefront</span>
            <h2 className="font-headline-md text-headline-md text-primary mb-2">Store not found</h2>
            <p>The store you're looking for doesn't exist or has been removed.</p>
          </div>
        </main>
      </div>
    );
  }

  const { store, products } = data;

  return (
    <div className="bg-background text-on-background min-h-screen pb-[80px] pt-[64px]">
      {/* TopAppBar */}
      <header className="bg-surface border-b border-surface-secondary shadow-sm fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 py-2 h-[64px]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-variant overflow-hidden">
            <span className="material-symbols-outlined text-on-surface-variant">person</span>
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
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-gutter py-6">
        {/* Store Hero */}
        <section className="bg-surface-container-lowest rounded-xl p-4 shadow-[0px_4px_20px_rgba(13,27,53,0.05)] border border-surface-secondary mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="w-24 h-24 rounded-lg bg-surface-variant overflow-hidden shrink-0 border border-surface-secondary shadow-sm flex items-center justify-center bg-gradient-to-br from-neo-primary/20 to-neo-secondary/20">
            <span className="font-h2 text-h2 text-neo-primary font-bold">{store.name?.[0]?.toUpperCase() || 'S'}</span>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-headline-lg text-headline-lg text-primary mb-1">{store.name}</h2>
                {store.description && (
                  <p className="font-body-md text-body-md text-on-surface-variant mb-2 line-clamp-2">{store.description}</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section>
          <h3 className="font-headline-md text-headline-md text-primary mb-4">Products</h3>
          {products.length === 0 ? (
            <div className="text-center py-10 text-on-surface-variant">
              <span className="material-symbols-outlined text-[48px] mb-2">shopping_bag</span>
              <p>No products available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="bg-surface-container-lowest rounded-lg border border-surface-secondary shadow-[0px_4px_20px_rgba(13,27,53,0.05)] overflow-hidden flex flex-col"
                >
                  <div className="aspect-square bg-surface-variant relative flex items-center justify-center">
                    {product.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img alt={product.name} className="w-full h-full object-cover" src={product.image_url} />
                    ) : (
                      <span className="material-symbols-outlined text-[48px] text-neo-text-muted">shopping_bag</span>
                    )}
                  </div>
                  <div className="p-3 flex flex-col flex-1">
                    <h4 className="font-body-md text-body-md text-primary font-medium mb-1 line-clamp-2">{product.name}</h4>
                    {product.category && (
                      <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider mb-1">{product.category}</span>
                    )}
                    <div className="mt-auto pt-2 flex justify-between items-center">
                      <span className="font-wallet-display text-wallet-display text-primary">{product.price_coins.toLocaleString()} Coins</span>
                      <button className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center hover:bg-primary transition-colors">
                        <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
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