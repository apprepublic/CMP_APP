'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useSidebarStore } from '@/stores/sidebarStore';

export default function SideNavBar() {
  const pathname = usePathname();
  const { isCollapsed, toggle } = useSidebarStore();

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { href: '/tasks', label: 'Earn', icon: 'monetization_on' },
    { href: '/music', label: 'Music', icon: 'library_music' },
    { href: '/wallet', label: 'Wallet', icon: 'account_balance_wallet' },
  ];

  return (
    <nav
      className={clsx(
        "hidden lg:flex flex-col h-full border-r border-outline-variant bg-primary dark:bg-primary-container fixed left-0 z-40 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Logo + Collapse Toggle */}
      <div className={clsx("flex items-center", isCollapsed ? "p-4 justify-center" : "p-6 justify-between")}>
        <Link href="/dashboard" className="flex items-center gap-3 min-w-0">
          <img
            src="/logo.png"
            alt="CMPapp"
            className={clsx("h-10 w-auto transition-all duration-300 shrink-0", isCollapsed && "h-8")}
          />
          {!isCollapsed && (
            <div className="overflow-hidden">
              <div className="font-label-caps text-label-caps text-on-primary-container whitespace-nowrap">Creative Economy</div>
            </div>
          )}
        </Link>
      </div>

      {/* Toggle Button */}
      <div className={clsx("px-2 mb-2", isCollapsed ? "flex justify-center" : "flex justify-end pr-4")}>
        <button
          onClick={toggle}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-on-primary-container hover:bg-on-primary-fixed-variant hover:text-secondary-fixed transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
            {isCollapsed ? 'chevron_right' : 'chevron_left'}
          </span>
        </button>
      </div>

      {/* Nav Links */}
      <div className="flex flex-col gap-1 mt-2 flex-1 px-2">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');

          return (
            <Link
              key={link.href}
              href={link.href}
              title={isCollapsed ? link.label : undefined}
              className={clsx(
                "flex items-center gap-3 py-3 rounded-lg font-label-caps text-label-caps transition-all duration-200",
                isCollapsed ? "justify-center px-0 mx-1" : "px-4 mx-2",
                isActive
                  ? "bg-secondary-container text-on-secondary-container"
                  : "text-on-primary-container hover:bg-on-primary-fixed-variant"
              )}
            >
              <span className={clsx("material-symbols-outlined shrink-0", isActive && "text-on-secondary-container")}>
                {link.icon}
              </span>
              {!isCollapsed && (
                <span className="whitespace-nowrap overflow-hidden">{link.label}</span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom Section */}
      <div className="p-2 mt-auto">
        <div className={clsx("flex flex-col gap-1", isCollapsed ? "px-0" : "px-2")}>
          <Link
            href="/settings"
            title={isCollapsed ? "Settings" : undefined}
            className={clsx(
              "flex items-center gap-3 py-3 text-on-primary-container hover:bg-on-primary-fixed-variant transition-colors rounded-lg font-label-caps text-label-caps",
              isCollapsed ? "justify-center px-0 mx-1" : "px-4 mx-2"
            )}
          >
            <span className="material-symbols-outlined shrink-0">settings</span>
            {!isCollapsed && <span>Settings</span>}
          </Link>
          <button
            title={isCollapsed ? "Logout" : undefined}
            className={clsx(
              "flex items-center gap-3 py-3 text-on-primary-container hover:bg-on-primary-fixed-variant transition-colors rounded-lg font-label-caps text-label-caps w-full text-left",
              isCollapsed ? "justify-center px-0 mx-1" : "px-4 mx-2"
            )}
          >
            <span className="material-symbols-outlined shrink-0">logout</span>
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </nav>
  );
}
