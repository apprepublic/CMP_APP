import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  email: string | null;
  phone: string;
  displayName: string;
  username: string;
  role: 'USER' | 'ARTIST' | 'BUSINESS' | 'ADMIN' | 'SUPER_ADMIN';
  kycStatus: 'NONE' | 'PENDING' | 'VERIFIED' | 'REJECTED';
  referralCode: string;
  wallet?: {
    coinBalance: number;
    lifetimeEarned: number;
    lifetimeSpent: number;
  };
  streakRecord?: {
    currentStreak: number;
    longestStreak: number;
    freezesOwned: number;
  };
  artistProfile?: {
    id: string;
    stageName: string;
    isVerified: boolean;
  };
  businessProfile?: {
    id: string;
    businessName: string;
    isVerified: boolean;
  };
}

interface UserStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  login: (credentials: { email?: string; phone?: string; password: string }) => Promise<void>;
  register: (data: {
    email?: string;
    phone: string;
    password: string;
    displayName: string;
    username: string;
    referralCode?: string;
  }) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  updateWallet: (wallet: User['wallet']) => void;
  updateStreak: (streak: User['streakRecord']) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const { user, accessToken, refreshToken } = await api.login(credentials);
          api.setToken(accessToken);

          // Store refresh token
          if (typeof window !== 'undefined') {
            localStorage.setItem('refreshToken', refreshToken);
          }

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          // API server may be down — continue with Supabase auth as source of truth
          set({
            user: null,
            isAuthenticated: true,
            isLoading: false,
          });
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const { user, accessToken, refreshToken } = await api.register(data);
          api.setToken(accessToken);

          if (typeof window !== 'undefined') {
            localStorage.setItem('refreshToken', refreshToken);
          }

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        api.setToken(null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('refreshToken');
        }
        set({ user: null, isAuthenticated: false });
      },

      fetchUser: async () => {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) return;

        try {
          // Fetch profile from Supabase
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, full_name, username, referral_code')
            .eq('id', authUser.id)
            .single();

          // Fetch wallet from Supabase
          const { data: wallet } = await supabase
            .from('Wallet')
            .select('coinBalance, lifetimeEarned, lifetimeSpent')
            .eq('userId', authUser.id)
            .single();

          if (profile) {
            const user: User = {
              id: authUser.id,
              email: authUser.email || null,
              phone: '', // Not stored in profiles
              displayName: profile.full_name || authUser.email || '',
              username: profile.username || '',
              role: 'USER',
              kycStatus: 'NONE',
              referralCode: profile.referral_code || '',
              wallet: wallet ? {
                coinBalance: Number(wallet.coinBalance) || 0,
                lifetimeEarned: Number(wallet.lifetimeEarned) || 0,
                lifetimeSpent: Number(wallet.lifetimeSpent) || 0,
              } : undefined,
            };
            set({ user, isAuthenticated: true });
          }
        } catch {
          get().logout();
        }
      },

      updateWallet: (wallet) => {
        set((state) => ({
          user: state.user ? { ...state.user, wallet } : null,
        }));
      },

      updateStreak: (streak) => {
        set((state) => ({
          user: state.user ? { ...state.user, streakRecord: streak } : null,
        }));
      },
    }),
    {
      name: 'cmpapp-user',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);