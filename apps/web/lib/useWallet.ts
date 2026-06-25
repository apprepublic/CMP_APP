'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabase';
import { useAuth } from './useAuth';

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  lifetime_earned: number;
  created_at: string;
  updated_at: string;
}

async function fetchWallet(): Promise<Wallet | null> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;

  const { data, error } = await supabase
    .from('wallets')
    .select('id, user_id, balance, lifetime_earned, created_at, updated_at')
    .eq('user_id', session.user.id)
    .single();

  if (error || !data) return null;

  const w = data as any;
  return {
    id: w.id,
    user_id: w.user_id,
    balance: Number(w.balance) || 0,
    lifetime_earned: Number(w.lifetime_earned) || 0,
    created_at: w.created_at,
    updated_at: w.updated_at,
  };
}

/**
 * Returns the current user's wallet via React Query.
 * Because the query key is ['wallet'], any call to
 * queryClient.invalidateQueries({ queryKey: ['wallet'] })
 * will instantly refetch and propagate the new balance to
 * TopNavBar, Dashboard, and Wallet page simultaneously.
 */
export function useWallet() {
  const { user, loading: authLoading } = useAuth();

  const { data: wallet, isLoading } = useQuery({
    queryKey: ['wallet'],
    queryFn: fetchWallet,
    // Don't fetch until auth is resolved and user is logged in
    enabled: !authLoading && !!user,
    // Refresh every 60 seconds automatically as a safety net
    refetchInterval: 60_000,
    // Always refetch when the window regains focus
    refetchOnWindowFocus: true,
    staleTime: 10_000, // consider fresh for 10s to avoid excessive round-trips
  });

  return { wallet: wallet ?? null, loading: isLoading || authLoading, user };
}

/**
 * Helper hook – call refresh() anywhere after a balance-changing action
 * to immediately re-fetch and sync all balance displays.
 */
export function useRefreshWallet() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ['wallet'] });
}