export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone_number: string | null
          avatar_url: string | null
          kyc_status: string
          kyc_metadata: Json | null
          is_active: boolean
          last_login_at: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone_number?: string | null
          avatar_url?: string | null
          kyc_status?: string
          kyc_metadata?: Json | null
          is_active?: boolean
          last_login_at?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone_number?: string | null
          avatar_url?: string | null
          kyc_status?: string
          kyc_metadata?: Json | null
          is_active?: boolean
          last_login_at?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      wallets: {
        Row: {
          id: string
          user_id: string
          balance: string
          lifetime_earned: string
          referral_code: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          balance?: string
          lifetime_earned?: string
          referral_code?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          balance?: string
          lifetime_earned?: string
          referral_code?: string
          created_at?: string
          updated_at?: string
        }
      }
      referrals: {
        Row: {
          id: string
          referrer_id: string
          referred_user_id: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          referrer_id: string
          referred_user_id: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          referrer_id?: string
          referred_user_id?: string
          status?: string
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          coin_reward: number
          category: string
          frequency: string
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          coin_reward: number
          category?: string
          frequency?: string
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          coin_reward?: number
          category?: string
          frequency?: string
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      task_completions: {
        Row: {
          id: string
          user_id: string
          task_id: string
          status: string
          completion_count: number
          last_completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          task_id: string
          status?: string
          completion_count?: number
          last_completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          task_id?: string
          status?: string
          completion_count?: number
          last_completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      streaks: {
        Row: {
          id: string
          user_id: string
          streak_type: string
          current_streak: number
          longest_streak: number
          last_activity_date: string
          next_reset_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          streak_type: string
          current_streak?: number
          longest_streak?: number
          last_activity_date?: string
          next_reset_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          streak_type?: string
          current_streak?: number
          longest_streak?: number
          last_activity_date?: string
          next_reset_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      articles: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string | null
          content: string
          author_id: string | null
          category: string
          read_time_minutes: number
          view_count: number
          is_published: boolean
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt?: string | null
          content: string
          author_id?: string | null
          category?: string
          read_time_minutes?: number
          view_count?: number
          is_published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string | null
          content?: string
          author_id?: string | null
          category?: string
          read_time_minutes?: number
          view_count?: number
          is_published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      contests: {
        Row: {
          id: string
          title: string
          description: string | null
          start_date: string
          end_date: string
          entry_deadline: string | null
          prize_pool_coins: number
          status: string
          category: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          start_date?: string
          end_date?: string
          entry_deadline?: string | null
          prize_pool_coins?: number
          status?: string
          category?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          start_date?: string
          end_date?: string
          entry_deadline?: string | null
          prize_pool_coins?: number
          status?: string
          category?: string
          created_at?: string
          updated_at?: string
        }
      }
      stores: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          store_id: string
          name: string
          description: string | null
          price_coins: number
          stock_quantity: number
          image_url: string | null
          is_available: boolean
          category: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          store_id: string
          name: string
          description?: string | null
          price_coins?: number
          stock_quantity?: number
          image_url?: string | null
          is_available?: boolean
          category?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          store_id?: string
          name?: string
          description?: string | null
          price_coins?: number
          stock_quantity?: number
          image_url?: string | null
          is_available?: boolean
          category?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      withdrawal_requests: {
        Row: {
          id: string
          user_id: string
          amount: string
          coin_amount: string
          status: string
          account_details: Json
          processed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: string
          coin_amount: string
          status?: string
          account_details: Json
          processed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: string
          coin_amount?: string
          status?: string
          account_details?: Json
          processed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      coin_transactions: {
        Row: {
          id: string
          wallet_id: string
          type: string
          amount: number
          balance_after: string
          description: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          wallet_id: string
          type: string
          amount: number
          balance_after: string
          description?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          wallet_id?: string
          type?: string
          amount?: number
          balance_after?: string
          description?: string | null
          metadata?: Json | null
          created_at?: string
        }
      }
      crypto_payments: {
        Row: {
          id: string
          user_id: string
          nowpayments_id: number | null
          purchase_id: string | null
          order_id: string
          price_amount: string
          price_currency: string
          pay_amount: string | null
          pay_currency: string | null
          pay_address: string | null
          coin_amount: number | null
          status: string
          metadata: Json | null
          created_at: string
          updated_at: string
          expires_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          nowpayments_id?: number | null
          purchase_id?: string | null
          order_id: string
          price_amount: string
          price_currency?: string
          pay_amount?: string | null
          pay_currency?: string | null
          pay_address?: string | null
          coin_amount?: number | null
          status?: string
          metadata?: Json | null
          created_at?: string
          updated_at?: string
          expires_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          nowpayments_id?: number | null
          purchase_id?: string | null
          order_id?: string
          price_amount?: string
          price_currency?: string
          pay_amount?: string | null
          pay_currency?: string | null
          pay_address?: string | null
          coin_amount?: number | null
          status?: string
          metadata?: Json | null
          created_at?: string
          updated_at?: string
          expires_at?: string | null
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string
          is_read?: boolean
          created_at?: string
        }
      }
      waitlist: {
        Row: {
          id: string
          email: string
          created_at: string
          status: string | null
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          status?: string | null
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          status?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_crypto_payment: {
        Args: {
          p_user_id: string
          p_price_amount: string
          p_price_currency?: string
          p_pay_currency?: string
        }
        Returns: {
          order_id: string
          payment_url: string
          pay_address: string
          pay_amount: string
          pay_currency: string
          expires_at: string
        }[]
      }
      update_crypto_payment_status: {
        Args: {
          p_nowpayments_id: number
          p_status: string
          p_pay_amount?: string
          p_pay_currency?: string
          p_pay_address?: string
          p_metadata?: Json
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}