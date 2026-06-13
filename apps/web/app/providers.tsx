'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, ReactNode } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { PlayerProvider } from '@/components/music/PlayerProvider';
import { PlayerBar } from '@/components/music/PlayerBar';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <PlayerProvider>
        {children}
        <PlayerBar />
        <Toaster />
      </PlayerProvider>
    </QueryClientProvider>
  );
}