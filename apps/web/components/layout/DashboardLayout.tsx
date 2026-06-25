'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SideNavBar from './SideNavBar';
import TopNavBar from './TopNavBar';
import BottomNavBar from './BottomNavBar';
import { useSidebarStore } from '@/stores/sidebarStore';
import { useUserStore } from '@/stores/userStore';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

/**
 * AuthGuard — checks the live Supabase session before rendering any
 * protected content. This runs on the client because the app is a static
 * export (output: 'export') and Next.js middleware is not available.
 *
 * Flow:
 *  1. Mount → show loading spinner, call supabase.auth.getSession()
 *  2. No session → redirect to /login immediately
 *  3. Session exists → render children (DashboardLayout content)
 */
function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { fetchUser } = useUserStore();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      // getSession() reads from local storage — fast, no network request
      const { data: { session } } = await supabase.auth.getSession();

      if (!mounted) return;

      if (!session) {
        // No active session — redirect to login, preserving the intended destination
        const returnTo = encodeURIComponent(window.location.pathname + window.location.search);
        router.replace(`/login?returnTo=${returnTo}`);
        return;
      }

      // Valid session — fetch the user profile into the store
      await fetchUser();
      if (mounted) setAuthChecked(true);
    };

    checkAuth();

    // Also listen for auth state changes (e.g. session expiry while page is open)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        router.replace('/login');
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Show a minimal full-screen spinner while auth is being verified
  // This prevents any flash of protected content to guest users
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-[#B8860B]" />
          <p className="text-on-surface-variant text-sm font-body-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isCollapsed } = useSidebarStore();

  return (
    <AuthGuard>
      <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen flex">
        <SideNavBar />

        <div
          className={clsx(
            "flex-1 flex flex-col min-h-screen w-full relative transition-all duration-300 ease-in-out",
            isCollapsed ? "lg:ml-[72px]" : "lg:ml-64"
          )}
        >
          <TopNavBar />
          {children}
        </div>

        <BottomNavBar />
      </div>
    </AuthGuard>
  );
}
