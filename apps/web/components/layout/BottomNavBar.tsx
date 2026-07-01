'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export default function BottomNavBar() {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: 'Home', icon: 'home' },
    { href: '/tasks', label: 'Tasks', icon: 'assignment' },
    { href: '/music', label: 'Music', icon: 'music_note' },
    { href: '/articles', label: 'Articles', icon: 'description' },
    { href: '/wallet', label: 'Wallet', icon: 'account_balance_wallet' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full z-50 bg-primary shadow-[0px_-4px_20px_rgba(13,27,53,0.2)] flex justify-around items-center h-20 px-2 pb-[env(safe-area-inset-bottom)]">
      {links.map((link) => {
        const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
        return (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              "flex flex-col items-center justify-center w-16 p-2 transition-all duration-200",
              isActive
                ? "text-[#B8860B] bg-primary-container/50 rounded-xl shadow-[inset_0px_2px_4px_rgba(0,0,0,0.3)]"
                : "text-on-primary-container hover:text-secondary-fixed-dim"
            )}
          >
            <span
              className="material-symbols-outlined mb-1"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {link.icon}
            </span>
            <span className="font-label-caps text-label-caps text-center">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
