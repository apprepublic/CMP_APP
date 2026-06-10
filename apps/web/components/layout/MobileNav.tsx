'use client';

import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Home, Music, Wallet, User, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  icon: typeof Home;
  label: string;
  path: string;
  active?: boolean;
}

const navItems: NavItem[] = [
  { icon: Home, label: 'Home', path: '/dashboard' },
  { icon: Music, label: 'Discover', path: '/discover' },
  { icon: Plus, label: 'Earn', path: '/tasks', active: true },
  { icon: Wallet, label: 'Wallet', path: '/wallet' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export default function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + '/');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface-container-lowest border-t border-surface-secondary z-50 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={cn(
                'flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-lg transition-colors min-w-[64px]',
                active
                  ? 'text-primary'
                  : 'text-on-surface-variant hover:text-on-surface'
              )}
            >
              <div className={cn(
                'relative',
                item.label === 'Earn' && 'mb-2'
              )}>
                {item.label === 'Earn' ? (
                  <div className={cn(
                    'w-12 h-12 -mt-6 rounded-full flex items-center justify-center transition-all',
                    active
                      ? 'bg-primary shadow-lg shadow-primary/30'
                      : 'bg-secondary-container'
                  )}>
                    <Icon className={cn(
                      'w-6 h-6',
                      active ? 'text-on-primary' : 'text-on-secondary-container'
                    )} />
                  </div>
                ) : (
                  <Icon className="w-6 h-6" />
                )}
              </div>
              <span className={cn(
                'font-body-xs text-[10px]',
                active ? 'text-primary' : 'text-text-muted'
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}