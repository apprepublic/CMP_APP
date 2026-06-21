import { supabase } from './supabase';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zympjjrkiqfsuhdwddur.supabase.co';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://cmpapp.ng';
const EDGE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1`;

interface FetchOptions extends RequestInit {
  token?: string;
}

class ApiService {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('accessToken', token);
      } else {
        localStorage.removeItem('accessToken');
      }
    }
  }

  getToken(): string | null {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  async request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { token, ...fetchOptions } = options;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    };

    const authToken = token || this.getToken();
    if (authToken) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${authToken}`;
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...fetchOptions,
        headers,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || 'Request failed');
      }

      return response.json();
    } catch (error: any) {
      // Network errors (CORS, connection refused, etc.)
      if (error.message === 'Failed to fetch') {
        console.error('Network error - check if API is running at:', API_URL);
        throw new Error('Unable to connect to server. Please try again later.');
      }
      throw error;
    }
  }

  // Auth
  async register(data: {
    email?: string;
    phone: string;
    password: string;
    displayName: string;
    username: string;
    referralCode?: string;
  }) {
    return this.request<{ user: any; accessToken: string; refreshToken: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(credentials: { email?: string; phone?: string; password: string }) {
    return this.request<{ user: any; accessToken: string; refreshToken: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async refreshToken(refreshToken: string) {
    return this.request<{ accessToken: string; refreshToken: string }>('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  // User
  async getMe() {
    return this.request<{ user: any }>('/api/users/me');
  }

  async updateProfile(data: { displayName?: string }) {
    return this.request<{ user: any }>('/api/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async submitKyc(data: {
    bvn?: string;
    idNumber?: string;
    idType?: string;
    selfieUrl?: string;
    idImageUrl?: string;
  }) {
    return this.request<{ kyc: any }>('/api/users/kyc', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async upgradeToArtist(data: { stageName: string; bio?: string; genre?: string }) {
    return this.request<{ profile: any }>('/api/users/upgrade/artist', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async upgradeToBusiness(data: {
    businessName: string;
    description?: string;
    category: string;
    location?: string;
    whatsappNumber?: string;
  }) {
    return this.request<{ profile: any }>('/api/users/upgrade/business', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Wallet
  async getWallet() {
    return this.request<{ wallet: any }>('/api/wallet');
  }

  async getTransactions(page = 1, limit = 20, type?: string) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (type) params.set('type', type);
    return this.request<{ transactions: any[]; pagination: any }>(`/api/wallet/transactions?${params}`);
  }

  async topUp(amount: number, paymentMethod: string) {
    return this.request<{ coinsReceived: number; newBalance: number }>('/api/wallet/topup', {
      method: 'POST',
      body: JSON.stringify({ amount, paymentMethod }),
    });
  }

  async withdraw(data: {
    coinsAmount: number;
    method: 'BANK' | 'CRYPTO';
    bankAccount?: string;
    bankName?: string;
    pin: string;
  }) {
    return this.request<{ withdrawal: any }>('/api/wallet/withdraw', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Tasks - fetch from Supabase instead of dead API
  async getTasks(type?: string, category?: string) {
    const [postedRes, systemRes] = await Promise.all([
      supabase
        .from('user_posted_tasks')
        .select('*')
        .eq('is_active', true)
        .eq('status', 'ACTIVE')
        .order('created_at', { ascending: false }),
      supabase
        .from('tasks')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),
    ]);

    const postedTasks = (postedRes.data || []).map((t: any) => ({
      ...t,
      isPostedTask: true,
      coinReward: t.coin_per_participant,
      category: t.category || 'USER_CREATED',
    }));

    const systemTasks = systemRes.data || [];

    return { tasks: [...systemTasks, ...postedTasks] };
  }

  async getDailyTasks() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return { tasks: [] };

    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (tasksError || !tasks) return { tasks: [] };

    const { data: completions } = await supabase
      .from('task_completions')
      .select('task_id, status, completion_count, last_completed_at')
      .eq('user_id', session.user.id);

    const completionMap = new Map(
      (completions || []).map((c: any) => [c.task_id, c])
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tasksWithStatus = tasks.map((task: any) => {
      const completion = completionMap.get(task.id);
      const lastCompleted = completion?.last_completed_at
        ? new Date(completion.last_completed_at)
        : null;
      const completedToday =
        lastCompleted && lastCompleted >= today
          ? completion.completion_count || 0
          : 0;
      const dailyLimit = task.frequency === 'UNLIMITED' ? 9999 : 1;
      const isLocked = completedToday >= dailyLimit;

      return {
        id: task.id,
        title: task.title,
        description: task.description,
        type: task.category,
        category: task.category,
        coinReward: task.coin_reward,
        requiresAdGate: true,
        dailyLimit,
        completedToday,
        isLocked,
        canComplete: !isLocked,
        linkedArticle: null,
      };
    });

    return { tasks: tasksWithStatus };
  }

  async getStreak() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return { streak: { currentStreak: 0, longestStreak: 0, lastActiveDate: null, freezesOwned: 0, tasksCompletedToday: 0 } };

    const { data: streakData } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', session.user.id)
      .order('last_activity_date', { ascending: false })
      .limit(1)
      .maybeSingle() as any;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { count: completionsToday } = await supabase
      .from('task_completions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', session.user.id)
      .gte('last_completed_at', today.toISOString())
      .lt('last_completed_at', tomorrow.toISOString());

    return {
      streak: {
        currentStreak: streakData?.current_streak || 0,
        longestStreak: streakData?.longest_streak || 0,
        lastActiveDate: streakData?.last_activity_date || null,
        freezesOwned: streakData?.freezes_owned || 0,
        tasksCompletedToday: completionsToday || 0,
      },
    };
  }

  async buyStreakFreeze() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('Not authenticated');

    const FREEZE_PRICE = 500;
    const { data: wallet } = await supabase
      .from('wallets')
      .select('id, balance')
      .eq('user_id', session.user.id)
      .single() as any;

    if (!wallet) throw new Error('Wallet not found');
    if (Number(wallet.balance) < FREEZE_PRICE) throw new Error('Insufficient balance');

    const newBalance = Number(wallet.balance) - FREEZE_PRICE;
    await (supabase.from('wallets') as any)
      .update({ balance: newBalance, updated_at: new Date().toISOString() })
      .eq('id', wallet.id);

    const { data: streak } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', session.user.id)
      .limit(1)
      .maybeSingle() as any;

    if (streak) {
      await (supabase.from('streaks') as any)
        .update({ freezes_owned: (streak.freezes_owned || 0) + 1 })
        .eq('id', streak.id);
    } else {
      await (supabase.from('streaks') as any)
        .insert({ user_id: session.user.id, streak_type: 'TASK_COMPLETION', freezes_owned: 1 });
    }

    return { message: 'Streak freeze purchased', freezesOwned: (streak?.freezes_owned || 0) + 1 };
  }

  async completeTask(taskId: string, adWatched = true) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('Not authenticated');

    const { data: task } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .eq('is_active', true)
      .single();

    if (!task) throw new Error('Task not found or inactive');

    const { data: existingCompletion } = await supabase
      .from('task_completions')
      .select('id, completion_count, last_completed_at')
      .eq('user_id', session.user.id)
      .eq('task_id', taskId)
      .single() as any;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastCompleted = existingCompletion?.last_completed_at
      ? new Date(existingCompletion.last_completed_at)
      : null;
    const completedToday =
      lastCompleted && lastCompleted >= today
        ? existingCompletion.completion_count || 0
        : 0;
    const dailyLimit = task.frequency === 'UNLIMITED' ? 9999 : 1;

    if (completedToday >= dailyLimit) throw new Error('Daily limit reached');

    if (existingCompletion) {
      const { error } = await (supabase.from('task_completions') as any)
        .update({
          completion_count: (existingCompletion.completion_count || 0) + 1,
          last_completed_at: new Date().toISOString(),
          status: 'COMPLETED',
        })
        .eq('id', existingCompletion.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await (supabase.from('task_completions') as any)
        .insert({
          user_id: session.user.id,
          task_id: taskId,
          status: 'COMPLETED',
          completion_count: 1,
          last_completed_at: new Date().toISOString(),
        });
      if (error) throw new Error(error.message);
    }

    return { coinsEarned: task.coin_reward, message: 'Task completed successfully' };
  }

  async claimArticle(articleId: string) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('Not authenticated');

    const { data: article } = await supabase
      .from('articles')
      .select('*')
      .eq('id', articleId)
      .eq('is_published', true)
      .single();

    if (!article) throw new Error('Article not found or not published');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data: existingClaim } = await supabase
      .from('task_completions')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('proof_data->>articleId', articleId)
      .gte('last_completed_at', today.toISOString())
      .lt('last_completed_at', tomorrow.toISOString())
      .maybeSingle();

    if (existingClaim) throw new Error('Article already claimed today');

    const { data: wallet } = await supabase
      .from('wallets')
      .select('id, balance, lifetime_earned')
      .eq('user_id', session.user.id)
      .single();

    if (!wallet) throw new Error('Wallet not found');

    const newBalance = Number(wallet.balance) + article.coin_reward;
    const newLifetimeEarned = Number(wallet.lifetime_earned) + article.coin_reward;

    await supabase
      .from('wallets')
      .update({ balance: newBalance, lifetime_earned: newLifetimeEarned, updated_at: new Date().toISOString() })
      .eq('id', wallet.id);

    await supabase
      .from('task_completions')
      .insert({
        user_id: session.user.id,
        task_id: null,
        status: 'COMPLETED',
        completion_count: 1,
        last_completed_at: new Date().toISOString(),
        proof_data: { articleId: articleId, type: 'READ_ARTICLE' },
      });

    const txId = crypto.randomUUID();
    await supabase
      .from('coin_transactions')
      .insert({
        id: txId,
        user_id: session.user.id,
        type: 'earn',
        amount: article.coin_reward,
        balance_after: newBalance,
        description: `Read article: ${article.title}`,
        reference_id: articleId,
      });

    return { coinsEarned: article.coin_reward, message: 'Coins claimed' };
  }

  async createPostedTask(data: {
    title: string;
    description: string;
    type: string;
    participantThreshold: number;
    totalBudget: number;
    expiresAt?: string;
    socialRequirements?: {
      platform?: string;
      actions?: string[];
      targetUrl?: string;
      commentText?: string;
      minCommentLength?: number;
      requiresScreenshot?: boolean;
    };
    musicMetadata?: {
      audioUrl: string;
      coverImageUrl?: string;
      genre?: string;
      durationSeconds?: number;
      isDownloadEnabled?: boolean;
    };
  }) {
    const url = `${EDGE_FUNCTION_URL}/create-posted-task`;
    const { data: { session } } = await supabase.auth.getSession();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    };
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || error.message || 'Request failed');
    }

    return response.json();
  }

  async getPostedTasks() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return { tasks: [] };

    const { data, error } = await supabase
      .from('user_posted_tasks')
      .select('*')
      .eq('creator_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[API] getPostedTasks error:', error);
      throw new Error(error.message);
    }
    
    const tasks = (data || []).map((t: any) => ({
      ...t,
      id: t.id,
      title: t.title,
      description: t.description,
      type: t.type,
      status: t.status,
      is_active: t.is_active,
      currentParticipants: t.current_participants,
      participantThreshold: t.participant_threshold,
      totalBudget: t.total_budget,
      coinPerParticipant: t.coin_per_participant,
      creationFee: t.creation_fee,
      createdAt: t.created_at,
      updatedAt: t.updated_at,
      expiresAt: t.expires_at,
      socialRequirements: t.social_requirements,
      audioUrl: t.audio_url,
      coverImageUrl: t.cover_image_url,
      genre: t.genre,
      durationSeconds: t.duration_seconds,
      isDownloadEnabled: t.is_download_enabled,
      songId: t.song_id,
    }));
    
    return { tasks };
  }

  async activatePostedTask(id: string) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('user_posted_tasks')
      .update({ status: 'ACTIVE', is_active: true, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('creator_id', session.user.id)
      .eq('status', 'PENDING')
      .select()
      .single();

    if (error) throw new Error(error.message);
    return { task: data };
  }

  async completePostedTask(id: string, proofData?: any) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('Not authenticated');

    const { data: task, error: taskError } = await supabase
      .from('user_posted_tasks')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (taskError || !task) throw new Error('Task not found or not active');
    if (task.creator_id === session.user.id) throw new Error('Cannot complete your own task');
    if (task.current_participants >= task.participant_threshold) throw new Error('Task has reached participant limit');

    const { error: completionError } = await supabase
      .from('user_task_completions')
      .insert({
        user_id: session.user.id,
        posted_task_id: id,
        coins_earned: task.coin_per_participant,
        proof_data: proofData || null,
      });

    if (completionError) {
      if (completionError.message?.includes('unique') || completionError.message?.includes('duplicate')) {
        throw new Error('You have already completed this task');
      }
      throw new Error(completionError.message);
    }

    const { error: updateError } = await supabase
      .from('user_posted_tasks')
      .update({
        current_participants: task.current_participants + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (updateError) console.error('[API] Failed to update participant count:', updateError);

    return {
      coinsEarned: task.coin_per_participant,
      message: 'Task completed successfully',
    };
  }

  // Music
  async getSongs(page = 1, limit = 20, genre?: string, search?: string) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (genre) params.set('genre', genre);
    if (search) params.set('search', search);
    return this.request<{ songs: any[]; pagination: any }>(`/api/music/songs?${params}`);
  }

  async getFeaturedSongs() {
    return this.request<{ songs: any[] }>('/api/music/songs/featured');
  }

  async streamSong(songId: string, duration: number) {
    return this.request<{ message: string }>(`/api/music/songs/${songId}/stream`, {
      method: 'POST',
      body: JSON.stringify({ duration }),
    });
  }

  async downloadSong(songId: string) {
    return this.request<{ downloadUrl: string }>(`/api/music/songs/${songId}/download`, {
      method: 'POST',
    });
  }

  // Marketplace
  async getProducts(page = 1, limit = 20, category?: string, search?: string) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    return this.request<{ products: any[]; pagination: any }>(`/api/marketplace/products?${params}`);
  }

  async getCategories() {
    return this.request<{ categories: any[] }>('/api/marketplace/categories');
  }

  // Referrals
  async getReferrals() {
    return this.request<{ referral: any }>('/api/referrals');
  }

  async getL1Referrals(page = 1, limit = 20) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    return this.request<{ referrals: any[]; pagination: any }>(`/api/referrals/l1?${params}`);
  }

  // Contests
  async getContests() {
    return this.request<{ contests: any[] }>('/api/contests');
  }

  async vote(contestId: string, entryId: string) {
    return this.request<{ coinsEarned: number }>(`/api/contests/${contestId}/vote/${entryId}`, {
      method: 'POST',
    });
  }

  // Notifications
  async getNotifications(page = 1, limit = 20) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    return this.request<{ notifications: any[]; unreadCount: number; pagination: any }>(
      `/api/notifications?${params}`
    );
  }

  async markNotificationRead(id: string) {
    return this.request<{ message: string }>(`/api/notifications/${id}/read`, {
      method: 'PATCH',
    });
  }

  // Email Verification
  async verifyEmail(otp: string, email: string) {
    return this.request<{ message: string; isEmailVerified: boolean }>('/api/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ otp, email }),
    });
  }

  async resendVerification(email: string) {
    return this.request<{ message: string }>('/api/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Articles
  async getArticles(opts: { category?: string; search?: string } = {}) {
    const params = new URLSearchParams();
    if (opts.category) params.set('category', opts.category);
    if (opts.search) params.set('search', opts.search);
    return this.request<{ articles: any[] }>(`/api/articles?${params.toString()}`);
  }

  async getArticle(id: string) {
    return this.request<{ article: any }>(`/api/articles/${id}`);
  }

  async getArticleBySlug(slug: string) {
    return this.request<{ article: any }>(`/api/articles/slug/${slug}`);
  }
}

export const api = new ApiService();