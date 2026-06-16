'use client';

import Link from 'next/link';
import { useUserStore } from '@/stores/userStore';
import { useWallet } from '@/lib/useWallet';
import NotificationDropdown from './NotificationDropdown';
import UserMenuDropdown from './UserMenuDropdown';

export default function TopNavBar() {
  const { user } = useUserStore();
  const { wallet, loading: walletLoading } = useWallet();

  const displayBalance = walletLoading 
    ? '...' 
    : (wallet?.coin_balance ?? 500).toLocaleString();

  return (
    <header className="sticky top-0 w-full z-40 bg-primary shadow-md flex justify-between items-center px-margin-mobile lg:px-margin-desktop h-20">
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
  );
}
