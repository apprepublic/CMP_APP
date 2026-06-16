'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useUserStore } from '@/stores/userStore';

export default function TopNavBar() {
  const pathname = usePathname();
  const { user } = useUserStore();

  const links = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/tasks', label: 'Earn' },
    { href: '/music', label: 'Music' },
    { href: '/marketplace', label: 'Market' },
    { href: '/wallet', label: 'Wallet' },
  ];

  return (
    <header className="sticky top-0 w-full z-40 bg-primary shadow-md flex justify-between items-center px-margin-mobile lg:px-margin-desktop h-20">
      <div className="flex items-center gap-6">
        <span className="lg:hidden font-h3 text-h3 font-bold text-on-primary">
          CMPapp
        </span>
        
        {/* Desktop Nav Links (Hidden on mobile) */}
        <nav className="hidden lg:flex items-center gap-6 pt-2">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "font-body-md text-body-md transition-colors pb-1 scale-95 active:duration-100",
                  isActive 
                    ? "text-secondary-fixed border-b-2 border-secondary-fixed"
                    : "text-on-primary-container hover:text-secondary"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="flex items-center gap-4 lg:gap-6">
        <div className="flex items-center gap-2 bg-[#1A1A1A] lg:bg-secondary-container lg:text-on-secondary-container rounded-lg lg:px-4 lg:py-2 px-3 py-1.5 border lg:border-none border-secondary/30 transition-colors">
          <span className="material-symbols-outlined lg:hidden text-secondary-fixed" style={{ fontSize: '18px' }}>generating_tokens</span>
          <span className="font-data-md text-data-md text-secondary-fixed lg:text-on-secondary-container">
            <span className="hidden lg:inline">🪙</span> {user?.wallet?.coinBalance || 500}
          </span>
        </div>
        
        <button className="text-on-primary lg:text-on-primary-container hover:text-secondary transition-colors scale-95 active:duration-100">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="text-on-primary lg:text-on-primary-container hover:text-secondary transition-colors scale-95 active:duration-100">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
        </button>
      </div>
    </header>
  );
}
