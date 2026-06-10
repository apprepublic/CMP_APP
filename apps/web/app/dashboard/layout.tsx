'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

  return (
    <div className="flex min-h-screen bg-surface">
      {/* SideNavBar (Desktop) */}
      <nav className="hidden lg:flex flex-col h-full border-r border-outline-variant bg-primary fixed left-0 h-full w-64 z-40">
        <div className="p-6">
          <h1 className="font-h2 text-h2 text-on-primary">CMPapp</h1>
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
        <header className="fixed top-0 w-full z-50 bg-primary shadow-md flex justify-between items-center px-gutter h-20 w-full">
          <div className="flex items-center space-x-8">
            <h1 className="font-h3 text-h3 font-bold text-on-primary">CMPapp</h1>
            <nav className="hidden md:flex space-x-6 items-center pt-2">
              <Link className="text-on-primary-container font-body-md text-body-md hover:text-secondary transition-colors pb-1" href="/dashboard">Dashboard</Link>
              <Link className="text-on-primary-container font-body-md text-body-md hover:text-secondary transition-colors pb-1" href="/dashboard/tasks">Earn</Link>
              <Link className="text-on-primary-container font-body-md text-body-md hover:text-secondary transition-colors pb-1" href="/dashboard/music">Music</Link>
              <Link className="text-on-primary-container font-body-md text-body-md hover:text-secondary transition-colors pb-1" href="/dashboard/marketplace">Market</Link>
              <Link className="text-secondary-fixed border-b-2 border-secondary-fixed pb-1 font-body-md text-body-md" href="/dashboard/wallet">Wallet</Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center bg-secondary-container text-on-secondary-container px-4 py-2 rounded-lg font-data-md text-data-md scale-95 active:duration-100 hover:bg-secondary-fixed transition-colors">
              🪙 500
            </button>
            <button className="text-on-primary-container hover:text-secondary transition-colors scale-95 active:duration-100">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <Link href="/profile" className="text-on-primary-container hover:text-secondary transition-colors scale-95 active:duration-100">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
            </Link>
          </div>
        </header>

        {/* Page Canvas */}
        <main className="flex-1 pt-28 pb-12 px-margin-mobile lg:px-gutter max-w-container-max mx-auto w-full space-y-gutter">
          {children}
        </main>
      </div>
    </div>
  );
}