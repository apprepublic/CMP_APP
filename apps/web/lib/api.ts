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
    const { data: { session } } = await supabase.auth.getSession();

    const [postedRes, systemRes, articlesRes] = await Promise.all([
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
      supabase
        .from('articles')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false }),
    ]);

    let approvedPosted = new Map<string, boolean>();
    if (session?.user) {
      const { data: completions } = await supabase
        .from('user_task_completions')
        .select('posted_task_id')
        .eq('user_id', session.user.id)
        .eq('status', 'APPROVED');
      (completions || []).forEach((c: any) => approvedPosted.set(c.posted_task_id, true));
    }

    const postedTasks = (postedRes.data || []).map((t: any) => ({
      ...t,
      isPostedTask: true,
      coinReward: t.coin_per_participant,
      category: t.category || 'USER_CREATED',
      userCompleted: approvedPosted.has(t.id),
      completedToday: approvedPosted.has(t.id) ? 1 : 0,
    }));

    const systemTasks = systemRes.data || [];

    const articleTasks = (articlesRes.data || []).map((a: any) => ({
      id: `article-${a.id}`,
      title: `Read: ${a.title}`,
      description: a.excerpt || `Read "${a.title}" and earn coins`,
      type: 'CONTENT',
      category: 'Article',
      coin_reward: a.coin_reward || 50,
      coinReward: a.coin_reward || 50,
      requiresAdGate: true,
      linkedArticle: { slug: a.slug, title: a.title },
      cover_image_url: a.cover_image_url,
      read_time_minutes: a.read_time_minutes || 5,
      dailyLimit: 1,
      frequency: 'DAILY',
      is_active: true,
      isLocked: false,
      completedToday: 0,
      canComplete: true,
      sort_order: 0,
    }));

    return { tasks: [...articleTasks, ...systemTasks, ...postedTasks] };
  }

  async getDailyTasks() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return { tasks: [] };

    const [tasksRes, articlesRes, postedRes] = await Promise.all([
      supabase
        .from('tasks')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),
      supabase
        .from('articles')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false }),
      supabase
        .from('user_posted_tasks')
        .select('*')
        .eq('is_active', true)
        .eq('status', 'ACTIVE'),
    ]);

    const tasks = tasksRes.data || [];
    const articles = articlesRes.data || [];
    const postedTasks = postedRes.data || [];

    if (tasksRes.error && articlesRes.error) return { tasks: [] };

    const { data: completions } = await supabase
      .from('task_completions')
      .select('task_id, status, completion_count, last_completed_at, proof_data')
      .eq('user_id', session.user.id);

    const { data: articleClaims } = await supabase
      .from('coin_transactions')
      .select('metadata')
      .eq('user_id', session.user.id)
      .eq('type', 'earn')
      .ilike('description', 'Read article:%');

    const { data: postedCompletions } = await supabase
      .from('user_task_completions')
      .select('posted_task_id')
      .eq('user_id', session.user.id)
      .eq('status', 'APPROVED');

    const approvedPosted = new Map((postedCompletions || []).map((c: any) => [c.posted_task_id, true]));

    const completionMap = new Map(
      (completions || []).map((c: any) => [c.task_id, c])
    );

    const tasksWithStatus = tasks.map((task: any) => {
      const completion = completionMap.get(task.id);
      const completedToday = completion ? (completion.completion_count || 1) : 0;
      const dailyLimit = task.frequency === 'UNLIMITED' ? 9999 : 1;
      const isLocked = completedToday >= 1;

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

    const articleCompletionsMap = new Map(
      (articleClaims || [])
        .filter((t: any) => t.metadata?.article_id)
        .map((t: any) => [t.metadata.article_id, 1])
    );

    const articleTasks = articles.map((a: any) => {
      const completedToday = articleCompletionsMap.get(a.id) || 0;
      return {
        id: `article-${a.id}`,
        title: `Read: ${a.title}`,
        description: a.excerpt || `Read "${a.title}" and earn coins`,
        type: 'CONTENT',
        category: 'Article',
        coin_reward: a.coin_reward || 50,
        coinReward: a.coin_reward || 50,
        requiresAdGate: true,
        linkedArticle: { slug: a.slug, title: a.title },
        cover_image_url: a.cover_image_url,
        read_time_minutes: a.read_time_minutes || 5,
        dailyLimit: 1,
        completedToday,
        isLocked: completedToday >= 1,
        canComplete: completedToday < 1,
        frequency: 'DAILY',
      };
    });

    const postedWithStatus = postedTasks.map((t: any) => {
      const completedToday = approvedPosted.has(t.id) ? 1 : 0;
      return {
        id: t.id,
        title: t.title,
        description: t.description || '',
        type: t.type || 'USER_CREATED',
        category: t.category || 'USER_CREATED',
        coinReward: t.coin_per_participant || 0,
        requiresAdGate: false,
        dailyLimit: 1,
        completedToday,
        isLocked: completedToday >= 1,
        canComplete: completedToday < 1,
        linkedArticle: null,
      };
    });

    return { tasks: [...articleTasks, ...tasksWithStatus, ...postedWithStatus] };
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

    const { count: postedCompletionsToday } = await supabase
      .from('user_task_completions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', session.user.id)
      .gte('completed_at', today.toISOString())
      .lt('completed_at', tomorrow.toISOString());

    return {
      streak: {
        currentStreak: streakData?.current_streak || 0,
        longestStreak: streakData?.longest_streak || 0,
        lastActiveDate: streakData?.last_activity_date || null,
        freezesOwned: streakData?.freezes_owned || 0,
        tasksCompletedToday: (completionsToday || 0) + (postedCompletionsToday || 0),
      },
    };
  }

  async buyStreakFreeze() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('Not authenticated');

    const FREEZE_PRICE = 500;
    const { data: wallet } = await supabase
      .from('wallets')
      .select('id, coin_balance')
      .eq('user_id', session.user.id)
      .single() as any;

    if (!wallet) throw new Error('Wallet not found');
    if (Number(wallet.coin_balance) < FREEZE_PRICE) throw new Error('Insufficient balance');

    const newBalance = Number(wallet.coin_balance) - FREEZE_PRICE;
    await (supabase.from('wallets') as any)
      .update({ coin_balance: newBalance, updated_at: new Date().toISOString() })
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

  async updateTaskCompletionStreak(userId: string) {
    try {
      const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      // Get existing streak
      const { data: streak, error } = await supabase
        .from('streaks')
        .select('*')
        .eq('user_id', userId)
        .eq('streak_type', 'TASK_COMPLETION')
        .maybeSingle() as any;

      if (error) {
        console.error('[Streak] Failed to fetch streak:', error);
        return;
      }

      const nextReset = new Date();
      nextReset.setDate(nextReset.getDate() + 2); // 48h reset window
      nextReset.setHours(0, 0, 0, 0);

      if (!streak) {
        // Create new streak
        await supabase.from('streaks').insert({
          user_id: userId,
          streak_type: 'TASK_COMPLETION',
          current_streak: 1,
          longest_streak: 1,
          last_activity_date: todayStr,
          next_reset_at: nextReset.toISOString(),
        });
      } else {
        const lastActivity = streak.last_activity_date;
        if (lastActivity === todayStr) {
          // Already completed a task today, streak is maintained but not incremented today
          return;
        }

        let newCurrent = 1;
        if (lastActivity === yesterdayStr) {
          newCurrent = (streak.current_streak || 0) + 1;
        } // else, lastActivity was before yesterday, so streak broke and resets to 1

        const newLongest = Math.max(newCurrent, streak.longest_streak || 0);

        await supabase
          .from('streaks')
          .update({
            current_streak: newCurrent,
            longest_streak: newLongest,
            last_activity_date: todayStr,
            next_reset_at: nextReset.toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', streak.id);
      }
    } catch (e) {
      console.error('[Streak] Error updating streak:', e);
    }
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

    // Credit coins to wallet
    const { data: wallet } = await supabase
      .from('wallets')
      .select('id, coin_balance, lifetime_earned')
      .eq('user_id', session.user.id)
      .single() as any;

    if (wallet && task.coin_reward) {
      const newBalance = Number(wallet.coin_balance) + Number(task.coin_reward);
      const newLifetime = Number(wallet.lifetime_earned) + Number(task.coin_reward);
      const { error: walletError } = await supabase
        .from('wallets')
        .update({ coin_balance: newBalance, lifetime_earned: newLifetime, updated_at: new Date().toISOString() })
        .eq('id', wallet.id);

      if (walletError) throw new Error(walletError.message);

      const { error: txError } = await supabase.from('coin_transactions').insert({
        id: crypto.randomUUID(),
        wallet_id: wallet.id,
        user_id: session.user.id,
        type: 'earn',
        amount: task.coin_reward,
        balance_after: newBalance,
        description: `Completed task: ${task.title}`,
        metadata: { task_id: taskId },
      });

      if (txError) throw new Error(txError.message);

      await supabase.from('notifications').insert({
        user_id: session.user.id,
        type: 'REWARD',
        title: 'Task Completed',
        message: `You earned ${task.coin_reward} coins for completing: ${task.title}`,
      });
    }

    // Update streak
    await this.updateTaskCompletionStreak(session.user.id);

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

    const { data: existingClaim } = await supabase
      .from('coin_transactions')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('type', 'earn')
      .eq('metadata->>article_id', articleId)
      .maybeSingle();

    if (existingClaim) throw new Error('You have already earned coins for this article.');

    const { data: wallet } = await supabase
      .from('wallets')
      .select('id, coin_balance, lifetime_earned')
      .eq('user_id', session.user.id)
      .single();

    if (!wallet) throw new Error('Wallet not found');

    const newBalance = Number((wallet as any).coin_balance) + article.coin_reward;
    const newLifetimeEarned = Number(wallet.lifetime_earned) + article.coin_reward;

    const { error: walletError } = await supabase
      .from('wallets')
      .update({ coin_balance: newBalance, lifetime_earned: newLifetimeEarned, updated_at: new Date().toISOString() })
      .eq('id', wallet.id);

    if (walletError) throw new Error(walletError.message);

    const txId = crypto.randomUUID();
    const { error: txError } = await supabase
      .from('coin_transactions')
      .insert({
        id: txId,
        wallet_id: wallet.id,
        user_id: session.user.id,
        type: 'earn',
        amount: article.coin_reward,
        balance_after: newBalance,
        description: `Read article: ${article.title}`,
        metadata: { article_id: articleId },
      });

    if (txError) throw new Error(txError.message);

    await supabase.from('notifications').insert({
      user_id: session.user.id,
      type: 'REWARD',
      title: 'Reading Reward',
      message: `You earned ${article.coin_reward} coins for reading: ${article.title}`,
    });

    // Update streak
    await this.updateTaskCompletionStreak(session.user.id);

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
    voteRequirements?: {
      targetUrl: string;
      voteTarget: string;
      contestDetails?: string;
      requiresScreenshot?: boolean;
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

  async togglePostedTaskStatus(id: string, currentStatus: string) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('Not authenticated');

    // PENDING and PAUSED both go to ACTIVE; ACTIVE goes to PAUSED
    const newStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    const isActive = newStatus === 'ACTIVE';

    const { data, error } = await supabase
      .from('user_posted_tasks')
      .update({ status: newStatus, is_active: isActive, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('creator_id', session.user.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    if (!data) throw new Error('Task not found or you do not have permission to update it');
    return { task: data };
  }

  async uploadProofScreenshot(file: File): Promise<string> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('Not authenticated');

    const ext = file.name.split('.').pop() || 'png';
    const path = `${session.user.id}/${crypto.randomUUID()}.${ext}`;

    const { data, error } = await supabase.storage
      .from('task-attachments')
      .upload(path, file, { cacheControl: '3600', upsert: false });

    if (error) throw new Error(error.message);

    const { data: urlData } = supabase.storage
      .from('task-attachments')
      .getPublicUrl(path);

    return urlData.publicUrl;
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

    // Check if already submitted
    const { data: existing } = await supabase
      .from('user_task_completions')
      .select('id, status')
      .eq('user_id', session.user.id)
      .eq('posted_task_id', id)
      .maybeSingle();

    if (existing) {
      if (existing.status === 'PENDING') throw new Error('You have already submitted proof - awaiting approval');
      if (existing.status === 'APPROVED') throw new Error('You have already completed this task');
      if (existing.status === 'REJECTED') throw new Error('Your submission was rejected - you cannot redo this task');
    }

    // Validate proof data based on social requirements
    const requirements = task.social_requirements || {};
    if (requirements.requiresScreenshot && !proofData?.screenshot) {
      throw new Error('Screenshot proof is required');
    }
    if (task.type === 'SHARE_SOCIAL' && !proofData?.actionUrl) {
      throw new Error('You must provide the URL of your shared post/action');
    }

    const isStreamMusic = task.type === 'STREAM_MUSIC' || proofData?.platform === 'STREAM_MUSIC';
    
    // Use atomic RPC function to insert completion and increment count in one transaction
    const { data: completionId, error: completionError } = await supabase.rpc('complete_posted_task_with_increment', {
      p_user_id: session.user.id,
      p_posted_task_id: id,
      p_coins_earned: task.coin_per_participant,
      p_proof_data: proofData || null,
      p_auto_approve: isStreamMusic,
    });

    if (completionError) {
      // Check for duplicate/already completed
      if (completionError.message?.includes('unique') || completionError.message?.includes('duplicate') || completionError.message?.includes('already')) {
        throw new Error('You have already completed this task');
      }
      // Fallback: try separate insert
      const { data: existing } = await supabase
        .from('user_task_completions')
        .select('id, status')
        .eq('user_id', session.user.id)
        .eq('posted_task_id', id)
        .maybeSingle();

      if (existing) {
        if (existing.status === 'PENDING') throw new Error('You have already submitted proof - awaiting approval');
        if (existing.status === 'APPROVED') throw new Error('You have already completed this task');
        if (existing.status === 'REJECTED') throw new Error('Your submission was rejected - you cannot redo this task');
      }

      // Try direct insert
      const { error: insertError } = await supabase
        .from('user_task_completions')
        .insert({
          user_id: session.user.id,
          posted_task_id: id,
          coins_earned: task.coin_per_participant,
          proof_data: proofData || null,
          status: isStreamMusic ? 'APPROVED' : 'PENDING',
        });

      if (insertError) {
        if (insertError.message?.includes('unique') || insertError.message?.includes('duplicate')) {
          throw new Error('You have already completed this task');
        }
        throw new Error(insertError.message);
      }

      // Try atomic increment as fallback
      const { error: updateError } = await supabase.rpc('increment_participant_count', { p_task_id: id });
      if (updateError) console.error('[API] Failed to increment participant count:', updateError);
      
      // Auto credit wallet if fallback is used and it's stream music
      if (isStreamMusic && !insertError) {
        const { data: wallet } = await supabase
          .from('wallets')
          .select('id, coin_balance, lifetime_earned')
          .eq('user_id', session.user.id)
          .single() as any;

        if (wallet) {
          const newBalance = Number(wallet.coin_balance) + Number(task.coin_per_participant);
          const newLifetime = Number(wallet.lifetime_earned) + Number(task.coin_per_participant);
          await supabase
            .from('wallets')
            .update({ coin_balance: newBalance, lifetime_earned: newLifetime, updated_at: new Date().toISOString() })
            .eq('id', wallet.id);

          await supabase.from('coin_transactions').insert({
            id: crypto.randomUUID(),
            wallet_id: wallet.id,
            user_id: session.user.id,
            type: 'earn',
            amount: task.coin_per_participant,
            balance_after: newBalance,
            description: `Auto-approved streaming task`,
            metadata: { posted_task_id: id },
          });

          // Send Notification
          await supabase.from('notifications').insert({
            user_id: session.user.id,
            type: 'REWARD',
            title: 'Stream Reward',
            message: `You earned ${task.coin_per_participant} coins for streaming!`,
          });
        }
      }
    }

    return {
      coinsEarned: task.coin_per_participant,
      message: isStreamMusic 
        ? 'Stream completed! Coins have been credited to your wallet.' 
        : 'Proof submitted! Coins will be credited after creator approval (auto-approved in 24hrs if no action)',
      status: isStreamMusic ? 'APPROVED' : 'PENDING',
    };
  }

  async getTaskCompletions(taskId: string) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return { completions: [] };

    const { data, error } = await supabase
      .from('user_task_completions')
      .select('id, user_id, posted_task_id, coins_earned, proof_data, status, completed_at, reviewed_at, rejection_reason')
      .eq('posted_task_id', taskId)
      .order('completed_at', { ascending: true });

    if (error) throw new Error(error.message);
    return { completions: data || [] };
  }

  async approveCompletion(completionId: string, postedTaskId: string) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('Not authenticated');

    // Use SECURITY DEFINER RPC to approve and credit wallet atomically.
    // This is required because the task creator needs to credit a DIFFERENT user's wallet,
    // which would be blocked by RLS if done from the client directly.
    const { data, error } = await supabase.rpc('approve_task_completion', {
      p_completion_id: completionId,
      p_reviewer_id: session.user.id,
      p_posted_task_id: postedTaskId,
    });

    if (error) throw new Error(error.message);

    // Fetch completer's info to send them a notification
    const { data: comp } = await supabase
      .from('user_task_completions')
      .select('user_id, coins_earned')
      .eq('id', completionId)
      .maybeSingle() as any;

    if (comp) {
      await supabase.from('notifications').insert({
        user_id: comp.user_id,
        type: 'REWARD',
        title: 'Task Approved',
        message: `Your task submission was approved! You earned ${comp.coins_earned} coins.`,
      });
    }

    return { message: 'Completion approved and coins credited', data };
  }

  async rejectCompletion(completionId: string, postedTaskId: string, reason: string) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('Not authenticated');

    // Verify user is the task creator
    const { data: task } = await supabase
      .from('user_posted_tasks')
      .select('creator_id')
      .eq('id', postedTaskId)
      .single();
    if (!task || task.creator_id !== session.user.id) throw new Error('Only the task creator can reject');

    const { error: updateError } = await supabase
      .from('user_task_completions')
      .update({
        status: 'REJECTED',
        reviewer_id: session.user.id,
        reviewed_at: new Date().toISOString(),
        rejection_reason: reason,
      })
      .eq('id', completionId)
      .eq('status', 'PENDING');

    // Decrement participant count
    const { data: taskData } = await supabase
      .from('user_posted_tasks')
      .select('current_participants')
      .eq('id', postedTaskId)
      .single();
    if (taskData) {
      await supabase
        .from('user_posted_tasks')
        .update({
          current_participants: Math.max(0, taskData.current_participants - 1),
          updated_at: new Date().toISOString(),
        })
        .eq('id', postedTaskId);
    }

    if (updateError) throw new Error(updateError.message);

    return { message: 'Completion rejected' };
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
