'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

/**
 * Renders the global marketing Header + Footer ONLY on routes that do not
 * already provide their own navigation chrome.
 *
 * Previously the root layout rendered <Header/> + <Footer/> on EVERY route,
 * while the landing page, the dashboard layout, and most feature pages each
 * draw their own fixed nav — producing stacked/duplicate headers. The prefixes
 * below all render their own chrome, so the global chrome is suppressed there.
 */
const selfChromedPrefixes = [
  '/wallet',
  '/dashboard',
  '/settings',
  '/login',
  '/register',
  '/verify',
  '/tasks',
  '/music',
  '/marketplace',
  '/referrals',
  '/contests',
  '/articles',
  '/article',
  '/privacy',
  '/terms',
  '/cookies',
  '/', // Landing page has its own premium nav
];

export function ConditionalChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';

  const hasOwnChrome =
    selfChromedPrefixes.some(
      (p) => pathname === p || pathname.startsWith(p + '/')
    );

  if (hasOwnChrome) {
    return <div className="min-h-screen flex flex-col">{children}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}