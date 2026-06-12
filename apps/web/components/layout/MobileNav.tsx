'use client';

import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Home, Music, Wallet, User, Plus } from 'lucide-react';
import { NeuIconBadge } from '@/components/ui/neu-icon-badge';
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
    <nav className="fixed bottom-0 left-0 right-0 bg-neu-bg shadow-neu-raised z-50 safe-area-bottom pt-2">
      <div className="flex items-center justify-around px-2 pb-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className="flex flex-col items-center justify-center gap-1 py-1 min-w-[56px]"
            >
              {item.label === 'Earn' ? (
                <div className="-mt-5">
                  <NeuIconBadge
                    size="lg"
                    active={active}
                    className={cn(
                      'transition-all',
                      active && 'bg-neo-primary shadow-neu-pressed'
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(item.path);
                    }}
>
                    <Icon className={cn(
                      'w-6 h-6',
                      active ? 'text-white' : 'text-neo-primary'
                    )} />
                  </NeuIconBadge>
                </div>
              ) : (
                <NeuIconBadge
                  size="sm"
                  active={active}
                  className="transition-all"
                >
                  <Icon className={cn(
                    'w-4 h-4',
                    active ? 'text-neo-primary' : 'text-neo-text-muted'
                  )} />
                </NeuIconBadge>
              )}
              <span className={cn(
                'font-label-caps text-label-caps mt-1',
                active ? 'text-neo-primary' : 'text-neo-text-muted'
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
