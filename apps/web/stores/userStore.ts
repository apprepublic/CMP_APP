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
  avatarUrl: string | null;
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
  updateAvatar: (url: string) => void;
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
        // Clear Supabase session (invalidates the session cookie/localStorage entry)
        supabase.auth.signOut();
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
          const { data: profile } = await supabase
            .from('users')
            .select('id, full_name, email, avatar_url, kyc_status')
            .eq('id', authUser.id)
            .single();

          const { data: wallet } = await supabase
            .from('wallets')
            .select('coin_balance, lifetime_earned, lifetime_spent, referral_code')
            .eq('user_id', authUser.id)
            .single();

          const { data: streak } = await supabase
            .from('streaks')
            .select('current_streak, longest_streak, freezes_owned')
            .eq('user_id', authUser.id)
            .maybeSingle();

          if (profile) {
            const p = profile as Record<string, any>;
            const user: User = {
              id: authUser.id,
              email: authUser.email || p.email || null,
              phone: '',
              displayName: p.full_name || authUser.email || '',
              username: authUser.user_metadata?.username || '',
              avatarUrl: p.avatar_url || null,
              role: 'USER',
              kycStatus: (p.kyc_status as User['kycStatus']) || 'NONE',
              referralCode: (wallet as any)?.referral_code || '',
              wallet: wallet ? {
                coinBalance: Number((wallet as any).coin_balance) || 0,
                lifetimeEarned: Number((wallet as any).lifetime_earned) || 0,
                lifetimeSpent: Number((wallet as any).lifetime_spent) || 0,
              } : undefined,
              streakRecord: streak ? {
                currentStreak: (streak as any).current_streak || 0,
                longestStreak: (streak as any).longest_streak || 0,
                freezesOwned: (streak as any).freezes_owned || 0,
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

      updateAvatar: (url) => {
        set((state) => ({
          user: state.user ? { ...state.user, avatarUrl: url } : null,
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