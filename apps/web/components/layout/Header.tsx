'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
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

const navItems = [
  { href: '/tasks', label: 'Earn', icon: Coins },
  { href: '/music', label: 'Music', icon: Music },
  { href: '/marketplace', label: 'Shop', icon: ShoppingBag },
  { href: '/referrals', label: 'Refer', icon: Users },
  { href: '/contests', label: 'Contests', icon: Trophy },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useUserStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <span className="text-lg font-bold text-primary-foreground">C</span>
          </div>
          <span className="text-xl font-bold">CMPapp</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  size="sm"
                  className={cn('gap-2', isActive && 'bg-primary/10')}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {isAuthenticated && user ? (
            <>
              <Link href="/wallet" className="hidden sm:flex">
                <Button variant="outline" size="sm" className="gap-2">
                  <Wallet className="h-4 w-4 text-yellow-600" />
                  <span className="font-semibold">
                    {new Intl.NumberFormat('en-NG').format(user.wallet?.coinBalance || 0)}
                  </span>
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <span className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    {user.displayName?.[0]?.toUpperCase() || 'U'}
                  </span>
                </Button>
              </Link>
            </>
          ) : (
            <div className="flex gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="gap-2">
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
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="container py-4 flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={cn('w-full justify-start gap-2', isActive && 'bg-primary/10')}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
            {isAuthenticated && (
              <Link href="/wallet" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Wallet className="h-4 w-4 text-yellow-600" />
                  Wallet ({new Intl.NumberFormat('en-NG').format(user?.wallet?.coinBalance || 0)})
                </Button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}