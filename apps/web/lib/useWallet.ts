'use client';

import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { useAuth } from './useAuth';

export interface Wallet {
  id: string;
  user_id: string;
  coin_balance: number;
  lifetime_earned: number;
  lifetime_spent: number;
  created_at: string;
  updated_at: string;
}

export function useWallet() {
  const { user, loading: authLoading } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      console.log('useWallet: No user');
      setWallet(null);
      setLoading(false);
      return;
    }

    console.log('useWallet: Fetching wallet for user', user.id);
    setLoading(true);
    supabase
      .from('Wallet')
      .select('id, userId, coinBalance, lifetimeEarned, lifetimeSpent, createdAt, updatedAt')
      .eq('userId', user.id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error('useWallet: Error fetching wallet', error);
          setWallet(null);
        } else if (!data) {
          console.log('useWallet: No wallet data found');
          setWallet(null);
        } else {
          console.log('useWallet: Wallet data found', data);
          setWallet({
            id: (data as any).id,
            user_id: (data as any).userId,
            coin_balance: (data as any).coinBalance,
            lifetime_earned: (data as any).lifetimeEarned,
            lifetime_spent: (data as any).lifetimeSpent,
            created_at: (data as any).createdAt,
            updated_at: (data as any).updatedAt,
          } as Wallet);
        }
        setLoading(false);
      });
  }, [user, authLoading]);

  return { wallet, loading: loading || authLoading, user };
}