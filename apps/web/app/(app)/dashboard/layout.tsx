'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/lib/useAuth';
import { NeuCard } from '@/components/ui/neu-card';

const navItems = [
  { href: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { href: '/dashboard/tasks', icon: 'monetization_on', label: 'Earn' },
  { href: '/dashboard/music', icon: 'library_music', label: 'Music' },
  { href: '/dashboard/marketplace', icon: 'storefront', label: 'Market' },
  { href: '/dashboard/wallet', icon: 'account_balance_wallet', label: 'Wallet' },
];

const bottomNavItems = [
  { href: '/dashboard/settings', icon: 'settings', label: 'Settings' },
  { href: '/login', icon: 'logout', label: 'Logout' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  // Redirect to login if not authenticated and not loading
  if (!loading && !user) {
    router.push('/login');
    return (
      <div className="flex min-h-screen items-center justify-center bg-neu-bg">
        <NeuCard padding="lg" className="text-center">
          <p className="font-body-md text-body-md text-neo-text-secondary">Redirecting to login...</p>
        </NeuCard>
      </div>
    );
  }

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neu-bg">
        <NeuCard padding="lg" className="text-center">
          <div className="w-8 h-8 border-2 border-neo-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-body-md text-body-md text-neo-text-secondary">Loading...</p>
        </NeuCard>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-surface">
      {/* SideNavBar (Desktop) */}
      <nav className="hidden lg:flex flex-col h-full border-r border-outline-variant bg-primary fixed left-0 h-full w-64 z-40">
        <div className="p-6">
          <h1 className="font-h2 text-h2 text-on-primary flex items-center gap-3">
            <img src="/logo.png" alt="CMPapp" className="h-8 w-auto" />
          </h1>
          <p className="font-label-caps text-label-caps text-on-primary-container">Creative Economy</p>
        </div>
        <div className="flex-1 overflow-y-auto py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                className={`flex items-center space-x-3 px-4 py-3 transition-all duration-200 ease-in-out ${
                  isActive
                    ? 'bg-secondary-container text-on-secondary-container rounded-lg mx-2'
                    : 'text-on-primary-container hover:bg-on-primary-fixed-variant mx-2 rounded-lg'
                }`}
                href={item.href}
              >
                <span className="material-symbols-outlined font-label-caps text-label-caps">
                  {item.icon}
                </span>
                <span className="font-label-caps text-label-caps uppercase">{item.label}</span>
              </Link>
            );
          })}
        </div>
        <div className="p-4 border-t border-outline-variant space-y-2 bg-primary">
          <button className="w-full bg-secondary-container text-on-secondary-container font-body-md font-semibold py-3 rounded-lg hover:bg-secondary-fixed-dim transition-colors mb-4 shadow-sm border border-secondary">
            Upgrade to Premium
          </button>
          {bottomNavItems.map((item) => (
            <Link
              key={item.href}
              className="flex items-center space-x-3 text-on-primary-container px-4 py-3 hover:bg-on-primary-fixed-variant transition-all duration-200 ease-in-out rounded-lg"
              href={item.href}
            >
              <span className="material-symbols-outlined font-label-caps text-label-caps">
                {item.icon}
              </span>
              <span className="font-label-caps text-label-caps uppercase">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64 w-full relative">
        {/* TopNavBar */}
        <Header />

        {/* Page Canvas */}
        <main className="flex-1 pt-24 pb-12 px-margin-mobile lg:px-gutter max-w-container-max mx-auto w-full space-y-gutter">
          {children}
        </main>
      </div>
    </div>
  );
}