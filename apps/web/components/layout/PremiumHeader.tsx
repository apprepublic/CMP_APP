'use client';

import Link from 'next/link';
import { useUserStore } from '@/stores/userStore';
import { useWallet } from '@/lib/useWallet';

export function PremiumHeader() {
  const { isAuthenticated, user } = useUserStore();
  const { wallet } = useWallet();

  return (
    <>
      {/* Desktop premium nav */}
      <nav className="hidden md:flex fixed top-0 w-full z-50 bg-primary backdrop-blur-lg border-b border-white/10 shadow-md h-20 justify-between items-center px-margin-desktop">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="CMPapp" className="h-10 w-auto" />
        </Link>
        {isAuthenticated && (
          <div className="flex items-center gap-x-8">
            <Link className="font-body-md text-body-md text-secondary-fixed border-b-2 border-secondary-fixed pb-1" href="/dashboard">
              Dashboard
            </Link>
            <Link className="font-body-md text-body-md text-white/90 hover:text-secondary-fixed transition-colors" href="/tasks">
              Earn
            </Link>
            <Link className="font-body-md text-body-md text-white/90 hover:text-secondary-fixed transition-colors" href="/music">
              Music
            </Link>
            <Link className="font-body-md text-body-md text-white/90 hover:text-secondary-fixed transition-colors" href="/wallet">
              Wallet
            </Link>
          </div>
        )}
        {!isAuthenticated && (
          <div className="flex items-center gap-x-8">
            <Link className="font-body-md text-body-md text-white/90 hover:text-secondary-fixed transition-colors" href="/articles">
              Articles
            </Link>
            <Link className="font-body-md text-body-md text-white/90 hover:text-secondary-fixed transition-colors" href="/music">
              Music
            </Link>
          </div>
        )}
        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <>
              <div className="premium-border-gold rounded-full px-4 py-1 flex items-center gap-2 bg-white/10 backdrop-blur-md">
                <span className="material-symbols-outlined text-secondary-fixed text-xl">paid</span>
                <span className="font-data-md text-data-md text-secondary-fixed">
                  {wallet?.balance?.toLocaleString() || 0}
                </span>
              </div>
              <button className="text-white hover:text-secondary-fixed transition-colors">
                <span className="material-symbols-outlined text-2xl">notifications</span>
              </button>
              <Link href="/settings">
                <span className="material-symbols-outlined text-2xl text-white hover:text-secondary-fixed transition-colors cursor-pointer">account_circle</span>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login">
                <button className="text-white hover:text-secondary-fixed font-medium transition-colors">
                  Login
                </button>
              </Link>
              <Link href="/register">
                <button className="bg-secondary-fixed hover:bg-secondary text-on-secondary-fixed font-bold font-body-md text-body-md px-6 py-2.5 rounded-lg transition-all shadow-[0_0_20px_rgba(255,222,166,0.3)]">
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Mobile premium header */}
      <header className="md:hidden fixed top-0 w-full z-50 bg-primary shadow-[0px_4px_20px_rgba(13,27,53,0.15)] flex justify-between items-center px-4 h-16">
        <div className="flex items-center gap-2">
          <Link href="/">
            <img src="/logo.png" alt="CMPapp" className="h-8 w-auto" />
          </Link>
        </div>
        <Link href="/register">
          <button className="bg-gold-metallic text-primary font-label-caps text-label-caps px-4 py-2 rounded-full hover:opacity-80 transition-opacity active:scale-95" style={{border: '1px solid #f7bd48', boxShadow: 'inset 0 0 0 1px rgba(247, 189, 72, 0.3)'}}>
            Sign Up
          </button>
        </Link>
      </header>
    </>
  );
}
