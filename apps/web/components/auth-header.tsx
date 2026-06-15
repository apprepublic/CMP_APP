'use client';

import Link from 'next/link';
import { useUserStore } from '@/stores/userStore';

export function AuthHeader() {
  const { isAuthenticated, user } = useUserStore();

  return (
    <nav className="hidden md:flex fixed top-0 w-full z-50 bg-primary backdrop-blur-lg border-b border-white/10 shadow-md h-20 justify-between items-center px-margin-desktop">
      <Link href="/" className="flex items-center gap-3">
        <img src="/logo.png" alt="CMPapp" className="h-10 w-auto" />
      </Link>
      <div className="flex items-center gap-4">
        {isAuthenticated && user ? (
          <>
            <div className="premium-border-gold rounded-full px-4 py-1 flex items-center gap-2 bg-white/10 backdrop-blur-md">
              <span className="material-symbols-outlined text-secondary-fixed text-xl">paid</span>
              <span className="font-data-md text-data-md text-secondary-fixed">
                {user.wallet?.coinBalance || 0}
              </span>
            </div>
            <button className="text-white hover:text-secondary-fixed transition-colors">
              <span className="material-symbols-outlined text-2xl">notifications</span>
            </button>
            <Link href="/profile">
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
  );
}