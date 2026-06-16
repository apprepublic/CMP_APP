'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { NeuIconBadge } from '@/components/ui/neu-icon-badge';
import { useUserStore } from '@/stores/userStore';
import { cn } from '@/lib/utils';
import {
  Coins,
  Music,
  ShoppingBag,
  Users,
  Trophy,
  Wallet,
  Menu,
  X,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { useState } from 'react';

const publicNavItems = [
  { href: '/', label: 'Home', icon: Coins },

  { href: '/contests', label: 'Contests', icon: Trophy },
];

const authenticatedNavItems = [
  { href: '/tasks', label: 'Earn', icon: Coins },
  { href: '/music', label: 'Music', icon: Music },

  { href: '/referrals', label: 'Refer', icon: Users },
  { href: '/contests', label: 'Contests', icon: Trophy },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useUserStore();

  const navItems = isAuthenticated ? authenticatedNavItems : publicNavItems;

  return (
    <header className="sticky top-0 z-50 w-full bg-neu-bg shadow-neu-flat">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="CMPapp" className="h-10 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname?.startsWith(item.href) ?? false;
            return (
              <Link key={item.href} href={item.href} className="flex items-center gap-2">
                <NeuIconBadge size="sm" active={isActive}>
                  <Icon className={cn('h-4 w-4', isActive ? 'text-neo-primary' : 'text-neo-text-secondary')} />
                </NeuIconBadge>
                <span className={cn(
                  'font-body-sm text-body-sm',
                  isActive ? 'text-neo-primary font-semibold' : 'text-neo-text-secondary'
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {isAuthenticated && user ? (
            <>
              <Link href="/wallet" className="hidden sm:flex">
                <Button variant="neumorphic" size="sm" className="gap-2">
                  <Wallet className="h-4 w-4 text-neo-secondary" />
                  <span className="font-semibold text-neo-text-primary">
                    {new Intl.NumberFormat('en-NG').format(user.wallet?.coinBalance || 0)}
                  </span>
                </Button>
              </Link>
              <Link href="/profile">
                <NeuIconBadge size="sm">
                  <span className="h-6 w-6 rounded-full bg-neo-primary flex items-center justify-center text-white text-sm font-bold">
                    {user.displayName?.[0]?.toUpperCase() || 'U'}
                  </span>
                </NeuIconBadge>
              </Link>
            </>
          ) : (
            <div className="flex gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="gap-2 text-neo-text-secondary">
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <NeuIconBadge
            size="sm"
            className="md:hidden cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5 text-neo-text-primary" /> : <Menu className="h-5 w-5 text-neo-text-primary" />}
          </NeuIconBadge>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neu-bg-dark bg-neu-bg">
          <nav className="container py-4 flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname?.startsWith(item.href) ?? false;
              return (
                <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                  <button
                    className={cn(
                      'w-full flex items-center gap-3 py-3 px-4 rounded-xl transition-all',
                      isActive ? 'shadow-neu-inset text-neo-primary' : 'shadow-neu-flat text-neo-text-secondary'
                    )}
                  >
                    <NeuIconBadge size="sm" active={isActive}>
                      <Icon className="h-4 w-4" />
                    </NeuIconBadge>
                    <span className={cn(
                      'font-body-md text-body-md',
                      isActive && 'font-semibold'
                    )}>
                      {item.label}
                    </span>
                  </button>
                </Link>
              );
            })}
            {isAuthenticated && (
              <Link href="/wallet" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full flex items-center gap-3 py-3 px-4 rounded-xl shadow-neu-flat text-neo-text-secondary">
                  <NeuIconBadge size="sm">
                    <Wallet className="h-4 w-4 text-neo-secondary" />
                  </NeuIconBadge>
                  <span className="font-body-md text-body-md">
                    Wallet ({new Intl.NumberFormat('en-NG').format(user?.wallet?.coinBalance || 0)})
                  </span>
                </button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
