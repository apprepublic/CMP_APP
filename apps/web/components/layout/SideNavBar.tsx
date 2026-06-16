'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export default function SideNavBar() {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { href: '/tasks', label: 'Earn', icon: 'monetization_on' },
    { href: '/music', label: 'Music', icon: 'library_music' },

    { href: '/wallet', label: 'Wallet', icon: 'account_balance_wallet' },
  ];

  return (
    <nav className="hidden lg:flex flex-col h-full border-r border-outline-variant bg-primary dark:bg-primary-container fixed left-0 w-64 z-40 transition-all duration-200 ease-in-out">
      <div className="p-6">
        <div className="font-h2 text-h2 text-on-primary mb-2">CMPapp</div>
        <div className="font-label-caps text-label-caps text-on-primary-container">Creative Economy</div>
      </div>
      
      <div className="flex flex-col gap-1 mt-6 flex-1 px-2">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-lg font-label-caps text-label-caps transition-colors mx-2",
                isActive 
                  ? "bg-secondary-container text-on-secondary-container" 
                  : "text-on-primary-container hover:bg-on-primary-fixed-variant"
              )}
            >
              <span className={clsx("material-symbols-outlined", isActive && "text-on-secondary-container")}>
                {link.icon}
              </span>
              {link.label}
            </Link>
          );
        })}
      </div>
      
      <div className="p-4 mt-auto">

        <div className="flex flex-col gap-1 px-2">
          <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-on-primary-container hover:bg-on-primary-fixed-variant transition-colors rounded-lg font-label-caps text-label-caps mx-2">
            <span className="material-symbols-outlined">settings</span>
            Settings
          </Link>
          <button className="flex items-center gap-3 px-4 py-3 text-on-primary-container hover:bg-on-primary-fixed-variant transition-colors rounded-lg font-label-caps text-label-caps mx-2 w-full text-left">
            <span className="material-symbols-outlined">logout</span>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
