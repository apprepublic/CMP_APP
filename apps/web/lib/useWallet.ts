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
      setWallet(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    supabase
      .from('wallets')
      .select('id, user_id, coin_balance, lifetime_earned, lifetime_spent, created_at, updated_at')
      .eq('user_id', user.id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setWallet(null);
        } else {
          const w = data as any;
          setWallet({
            id: w.id,
            user_id: w.user_id,
            coin_balance: Number(w.coin_balance) || 0,
            lifetime_earned: Number(w.lifetime_earned) || 0,
            lifetime_spent: Number(w.lifetime_spent) || 0,
            created_at: w.created_at,
            updated_at: w.updated_at,
          } as Wallet);
        }
        setLoading(false);
      });
  }, [user, authLoading]);

  return { wallet, loading: loading || authLoading, user };
}