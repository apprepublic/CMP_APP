'use client';

import Link from 'next/link';
import { useWallet } from '@/lib/useWallet';
import NotificationDropdown from './NotificationDropdown';
import UserMenuDropdown from './UserMenuDropdown';

export default function TopNavBar() {
  const { wallet, loading: walletLoading } = useWallet();

  const displayBalance = walletLoading
    ? '...'
    : (wallet?.balance ?? 0).toLocaleString();

  return (
    <>
      {/* Mobile TopAppBar */}
      <div className="lg:hidden fixed top-0 w-full z-50 bg-primary shadow-[0px_4px_20px_rgba(13,27,53,0.15)] flex justify-between items-center px-4 h-16">
        <Link href="/dashboard" className="flex items-center gap-3">
          <img src="/logo.png" alt="CMPapp" className="h-8 w-auto" />
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-[#B8860B]/5 border border-[#B8860B] rounded-full px-3 py-0.5">
            <span className="material-symbols-outlined text-[16px] text-[#B8860B]">monetization_on</span>
            <span className="font-data-lg text-data-lg text-[#B8860B]">{displayBalance}</span>
          </div>
          <button className="text-on-primary-container hover:opacity-80 transition-opacity active:scale-95 transition-transform">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
      </div>

      {/* Desktop TopNavBar */}
      <header className="hidden lg:flex sticky top-0 w-full z-40 bg-primary shadow-md justify-between items-center px-margin-mobile lg:px-margin-desktop h-20">
        <div className="flex items-center gap-6">
          <Link href="/" className="lg:hidden">
            <img src="/logo.png" alt="CMPapp" className="h-8 w-auto" />
          </Link>
        </div>

        <div className="flex items-center gap-4 lg:gap-6">
          <div className="flex items-center bg-[#1A1A1A] lg:bg-secondary-container lg:text-on-secondary-container rounded-lg lg:px-4 lg:py-2 px-3 py-1.5 border lg:border-none border-secondary/30 transition-colors">
            <img src="/coin.png" alt="CMP" className="w-5 h-5 object-contain mr-1.5" />
            <span className="font-data-md text-data-md text-secondary-fixed lg:text-on-secondary-container">
              {displayBalance}
            </span>
          </div>

          <NotificationDropdown />
          <UserMenuDropdown />
        </div>
      </header>
    </>
  );
}
