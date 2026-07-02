'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useUserStore } from '@/stores/userStore';
import { supabase } from '@/lib/supabase';
import NotificationDropdown from './NotificationDropdown';
import UserMenuDropdown from './UserMenuDropdown';
import clsx from 'clsx';

export default function TopNavBar() {
  const { logout } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    router.push('/login');
  };

  const mobileNavLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { href: '/tasks', label: 'Tasks', icon: 'task' },
    { href: '/music', label: 'Music', icon: 'library_music' },
    { href: '/articles', label: 'Articles', icon: 'article' },
    { href: '/referrals', label: 'Referrals', icon: 'groups' },
    { href: '/wallet', label: 'Wallet', icon: 'account_balance_wallet' },
    { href: '/settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <>
      {/* Mobile TopAppBar */}
      <div className="lg:hidden fixed top-0 w-full z-50 bg-primary shadow-[0px_4px_20px_rgba(13,27,53,0.15)] flex justify-between items-center px-4 h-16">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-on-primary-container hover:opacity-80 transition-opacity active:scale-95"
            aria-label="Open navigation menu"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <Link href="/dashboard" className="flex items-center">
            <img src="/logo.png" alt="CMPapp" className="h-8 w-auto" />
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <NotificationDropdown />
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div
        className={clsx(
          "lg:hidden fixed inset-0 z-[60]",
          !isMobileMenuOpen && "pointer-events-none"
        )}
      >
        <div
          className={clsx(
            "absolute inset-0 bg-black/50 transition-opacity duration-300",
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={clsx(
            "absolute top-0 left-0 h-full w-72 bg-primary shadow-2xl transition-transform duration-300 ease-in-out flex flex-col",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-6 border-b border-on-primary-container/10">
            <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
              <img src="/logo.png" alt="CMPapp" className="h-10 w-auto" />
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-on-primary-container hover:opacity-80"
              aria-label="Close navigation menu"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Drawer Links */}
          <div className="flex flex-col gap-1 mt-4 flex-1 px-3">
            {mobileNavLinks.map((link) => {
              const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={clsx(
                    "flex items-center gap-4 py-3 px-4 rounded-lg font-label-caps text-label-caps transition-all duration-200",
                    isActive
                      ? "bg-secondary-container text-on-secondary-container"
                      : "text-on-primary-container hover:bg-on-primary-fixed-variant"
                  )}
                >
                  <span className={clsx("material-symbols-outlined shrink-0", isActive && "text-on-secondary-container")}>
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Drawer Footer */}
          <div className="p-3 mt-auto border-t border-on-primary-container/10">
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 py-3 px-4 w-full text-on-primary-container hover:bg-on-primary-fixed-variant transition-colors rounded-lg font-label-caps text-label-caps"
            >
              <span className="material-symbols-outlined shrink-0">logout</span>
              <span>Logout</span>
            </button>
          </div>
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
