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
      .from('Wallet')
      .select('id, userId, coinBalance, lifetimeEarned, lifetimeSpent, createdAt, updatedAt')
      .eq('userId', user.id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setWallet(null);
        } else {
          setWallet({
            id: data.id,
            user_id: data.userId,
            coin_balance: data.coinBalance,
            lifetime_earned: data.lifetimeEarned,
            lifetime_spent: data.lifetimeSpent,
            created_at: data.createdAt,
            updated_at: data.updatedAt,
          } as Wallet);
        }
        setLoading(false);
      });
  }, [user, authLoading]);

  return { wallet, loading: loading || authLoading, user };
}