'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export default function BottomNavBar() {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: 'Home', icon: 'home' },
    { href: '/tasks', label: 'Earn', icon: 'paid' },
    { href: '/music', label: 'Music', icon: 'music_note' },
    { href: '/marketplace', label: 'Market', icon: 'shopping_bag' },
    { href: '/wallet', label: 'Wallet', icon: 'wallet' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full flex justify-around items-center py-3 pb-safe px-4 bg-navy-glass backdrop-blur-md shadow-lg z-50 border-t border-white/10">
      {links.map((link) => {
        const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
        
        return (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              "flex flex-col items-center justify-center scale-110 transition-transform active:opacity-80",
              isActive ? "text-secondary-fixed" : "text-on-primary-container opacity-70"
            )}
          >
            <span 
              className="material-symbols-outlined mb-1"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {link.icon}
            </span>
            <span className="font-label-caps text-label-caps uppercase text-[10px] md:text-[12px]">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
