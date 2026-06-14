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
      .select('*')
      .eq('user_id', user.id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setWallet(null);
        } else {
          setWallet(data as Wallet);
        }
        setLoading(false);
      });
  }, [user, authLoading]);

  return { wallet, loading: loading || authLoading, user };
}