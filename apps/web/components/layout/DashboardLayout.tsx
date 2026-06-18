'use client';

import { useEffect } from 'react';
import SideNavBar from './SideNavBar';
import TopNavBar from './TopNavBar';
import BottomNavBar from './BottomNavBar';
import { useSidebarStore } from '@/stores/sidebarStore';
import { useUserStore } from '@/stores/userStore';
import clsx from 'clsx';

function UserFetcher() {
  const { fetchUser } = useUserStore();
  
  useEffect(() => {
    fetchUser();
  }, []);
  
  return null;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen flex">
      <UserFetcher />
      <SideNavBar />

      <div
        className={clsx(
          "flex-1 flex flex-col min-h-screen w-full relative transition-all duration-300 ease-in-out",
          isCollapsed ? "lg:ml-[72px]" : "lg:ml-64"
        )}
      >
        <TopNavBar />

        {/* pb-24 for mobile BottomNavBar clearance, lg:pb-12 for desktop */}
        {/* We let the page control its own padding, but generally pages will have a main wrapper */}
        {children}
      </div>

      <BottomNavBar />
    </div>
  );
}
