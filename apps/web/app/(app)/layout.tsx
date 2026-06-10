'use client';

import { usePathname } from 'next/navigation';
import MobileNav from '@/components/layout/MobileNav';

const noNavPaths = ['/onboarding', '/register', '/login', '/landing', '/'];

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showNav = !noNavPaths.some(path => pathname === path || pathname?.startsWith(path + '/'));

  return (
    <div className="min-h-screen bg-surface-container">
      {children}
      {showNav && <MobileNav />}
    </div>
  );
}