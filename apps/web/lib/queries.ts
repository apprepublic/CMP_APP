import { supabase } from './supabase';

/**
 * Data-access layer. All reads go through these functions so pages never embed
 * mock data. The music/artist tables are added by migration 0004 and are not in
 * the generated Database types yet, so we use a loosely-typed client here and
 * return hand-written interfaces. Regenerate supabase-types to tighten this.
 */
const db = supabase as any;

export interface Artist {
  id: string;
  stage_name: string;
  slug: string;
  bio: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  genre: string | null;
  is_verified: boolean;
  follower_count: number;
  monthly_listeners: number;
}

export interface Song {
  id: string;
  artist_id: string;
  title: string;
  slug: string;
  description: string | null;
  audio_url: string;
  cover_url: string | null;
  duration_seconds: number;
  genre: string | null;
  coin_reward: number;
  play_count: number;
  is_featured: boolean;
  artist?: Pick<Artist, 'id' | 'stage_name' | 'slug' | 'avatar_url' | 'is_verified'> | null;
  is_download_enabled?: boolean;
  taskId?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string;
  read_time_minutes: number;
  coin_reward: number;
  cover_image_url: string | null;
  view_count: number;
  tags: string[] | null;
  published_at: string | null;
  created_at: string;
  author?: { display_name: string } | null;
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface Product {
  id: string;
  store_id: string;
  name: string;
  description: string | null;
  price_coins: number;
  stock_quantity: number;
  image_url: string | null;
  category: string | null;
  is_available: boolean;
}

export interface Contest {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string;
  entry_deadline: string | null;
  prize_pool_coins: number;
  status: string;
  category: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  coin_reward: number;
  category: string;
  frequency: string;
  sort_order: number;
}

export interface CoinTransaction {
  id: string;
  wallet_id: string;
  type: string;
  amount: number;
  balance_after: string;
  description: string | null;
  created_at: string;
  metadata?: { withdrawal_id?: string } | null;
  withdrawal_status?: string | null;
}

export interface AppNotification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referred_user_id: string;
  status: string;
  created_at: string;
  referred_user?: {
    id: string;
    email: string;
    full_name: string | null;
  };
}

export interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  totalEarned: number;
  referralEarnings: number;
  weeklyEarnings: number;
  weeklyData: { name: string; coins: number }[];
}

function unwrap<T>(res: { data: T | null; error: any }): T {
  if (res.error) throw new Error(res.error.message || 'Query failed');
  return (res.data ?? ([] as unknown)) as T;
}

/* ----------------------------- WALLET ---------------------------- */

export async function getTransactions(walletId: string): Promise<CoinTransaction[]> {
  const txs = await unwrap<CoinTransaction[]>(
    await db.from('coin_transactions').select('*').eq('wallet_id', walletId).order('created_at', { ascending: false }).limit(20)
  );

  const withdrawalTxIds = txs
    .filter(tx => tx.type === 'WITHDRAWAL' && tx.metadata?.withdrawal_id)
    .map(tx => tx.metadata!.withdrawal_id!);

  if (withdrawalTxIds.length > 0) {
    const { data: requests } = await db
      .from('withdrawal_requests')
      .select('id, status')
      .in('id', withdrawalTxIds);

    if (requests) {
      const statusMap = Object.fromEntries(requests.map((r: any) => [r.id, r.status]));
      for (const tx of txs) {
        if (tx.type === 'WITHDRAWAL' && tx.metadata?.withdrawal_id) {
          tx.withdrawal_status = statusMap[tx.metadata.withdrawal_id] || null;
        }
      }
    }
  }

  return txs;
}

export async function processWithdrawal(
  walletId: string, 
  amountCoins: number, 
  bankDetails: any
): Promise<string> {
  // In a real app this would be an RPC call or edge function to ensure atomicity.
  // We'll perform it sequentially for the prototype.
  
  // 1. Get current wallet
  const { data: wallet, error: walletError } = await db.from('wallets').select('*').eq('id', walletId).single();
  if (walletError) throw new Error('Failed to load wallet');
  
  const currentBalance = parseFloat(wallet.coin_balance || '0');
  if (currentBalance < amountCoins) throw new Error('Insufficient balance');
  
  const newBalance = currentBalance - amountCoins;

  // 2. Update wallet balance
  const { error: updateError } = await db.from('wallets').update({ coin_balance: newBalance.toString() }).eq('id', walletId);
  if (updateError) throw new Error('Failed to update balance');

  // 3. Insert transaction record
  const { data: txn, error: txnError } = await db.from('coin_transactions').insert({
    user_id: wallet.user_id,
    type: 'spend',
    amount: amountCoins,
    balance_after: newBalance.toString(),
    description: `Withdrawal to ${bankDetails.name || 'Bank'}`,
    reference_id: walletId,
  }).select().single();

  if (txnError) {
    // If this fails, we ideally should rollback the balance, but skipping for prototype simplicity
    throw new Error('Failed to create transaction record');
  }

  // Send Notification
  await db.from('notifications').insert({
    user_id: wallet.user_id,
    type: 'SYSTEM',
    title: 'Withdrawal Initiated',
    message: `Your withdrawal of ${amountCoins} coins is being processed.`,
  });

  return txn.id;
}

/* ---------------------------- REFERRALS -------------------------- */

export async function getReferrals(userId: string): Promise<Referral[]> {
  return unwrap<Referral[]>(
    await db.from('referrals').select('*, referred_user:users!referred_user_id(id, email, full_name)').eq('referrer_id', userId).order('created_at', { ascending: false })
  );
}

export async function getReferralStats(userId: string): Promise<ReferralStats> {
  const referrals = await getReferrals(userId).catch(() => []);
  const activeReferrals = referrals.filter(r => r.status === 'ACTIVE').length;
  
  let totalEarned = 0;
  let referralEarnings = 0;
  let weeklyEarnings = 0;
  
  const now = new Date();
  const weeks = Array.from({ length: 4 }).map((_, i) => {
    const end = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
    const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
    return { name: `Week ${4 - i}`, start, end, coins: 0 };
  }).reverse();
  
  // Fetch recent earn transactions — capped at 500 rows to prevent full table scans
  const { data: allTxs } = await db.from('coin_transactions').select('amount, type, created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(500);
  if (allTxs) {
    // All-time earnings (all positive/earn type transactions)
    totalEarned = allTxs
      .filter((tx: any) => ['earn', 'EARN', 'referral', 'REFERRAL', 'task', 'TASK', 'stream', 'STREAM'].includes(tx.type))
      .reduce((sum: number, tx: any) => sum + Number(tx.amount), 0);
    
    // Referral-specific earnings
    referralEarnings = allTxs
      .filter((tx: any) => ['referral', 'REFERRAL'].includes(tx.type))
      .reduce((sum: number, tx: any) => sum + Number(tx.amount), 0);

    const oneWeekAgo = weeks[3].start;
    weeklyEarnings = allTxs
      .filter((tx: any) => ['referral', 'REFERRAL'].includes(tx.type) && new Date(tx.created_at) >= oneWeekAgo)
      .reduce((sum: number, tx: any) => sum + Number(tx.amount), 0);
      
    // Group REFERRAL transactions into weekly buckets for the chart
    allTxs
      .filter((tx: any) => ['referral', 'REFERRAL'].includes(tx.type))
      .forEach((tx: any) => {
        const txDate = new Date(tx.created_at);
        const week = weeks.find(w => txDate >= w.start && txDate <= w.end);
        if (week) {
          week.coins += Number(tx.amount);
        }
      });
  }

  return {
    totalReferrals: referrals.length,
    activeReferrals,
    totalEarned,
    referralEarnings,
    weeklyEarnings,
    weeklyData: weeks.map(w => ({ name: w.name, coins: w.coins })),
  };
}

/* ----------------------------- MUSIC ----------------------------- */

export async function getSongs(opts: { genre?: string; search?: string; limit?: number } = {}): Promise<Song[]> {
  let q = db
    .from('user_posted_tasks')
    .select('*, creator:users!creator_id(id, full_name, avatar_url)')
    .eq('type', 'STREAM_MUSIC')
    .eq('is_active', true)
    .eq('status', 'ACTIVE')
    .order('created_at', { ascending: false })
    .limit(opts.limit ?? 50);

  if (opts.genre) q = q.eq('genre', opts.genre);
  if (opts.search) q = q.ilike('title', `%${opts.search}%`);

  const { data: tasks, error } = await q;
  if (error || !tasks) return [];

  return tasks.map((t: any) => {
    const creator = t.creator || {};
    const stageName = creator.full_name || 'Artist';
    return {
      id: t.id,
      artist_id: t.creator_id,
      title: t.title,
      slug: `task-track-${t.id}`,
      description: t.description,
      audio_url: t.audio_url,
      cover_url: t.cover_image_url || null,
      duration_seconds: t.duration_seconds || 180,
      genre: t.genre || null,
      coin_reward: t.coin_per_participant || 0,
      play_count: t.current_participants || 0,
      is_featured: false,
      artist: {
        id: t.creator_id,
        stage_name: stageName,
        slug: `user-${t.creator_id}`,
        avatar_url: creator.avatar_url || null,
        is_verified: false,
      },
      taskId: t.id,
      is_download_enabled: t.is_download_enabled || false,
    } as Song;
  });
}

export async function getFeaturedSongs(): Promise<Song[]> {
  const { data: tasks, error } = await db
    .from('user_posted_tasks')
    .select('*, creator:users!creator_id(id, full_name, avatar_url)')
    .eq('type', 'STREAM_MUSIC')
    .eq('is_active', true)
    .eq('status', 'ACTIVE')
    .order('current_participants', { ascending: false })
    .limit(12);

  if (error || !tasks) return [];

  return tasks.map((t: any) => {
    const creator = t.creator || {};
    const stageName = creator.full_name || 'Artist';
    return {
      id: t.id,
      artist_id: t.creator_id,
      title: t.title,
      slug: `task-track-${t.id}`,
      description: t.description,
      audio_url: t.audio_url,
      cover_url: t.cover_image_url || null,
      duration_seconds: t.duration_seconds || 180,
      genre: t.genre || null,
      coin_reward: t.coin_per_participant || 0,
      play_count: t.current_participants || 0,
      is_featured: true,
      artist: {
        id: t.creator_id,
        stage_name: stageName,
        slug: `user-${t.creator_id}`,
        avatar_url: creator.avatar_url || null,
        is_verified: false,
      },
      taskId: t.id,
      is_download_enabled: t.is_download_enabled || false,
    } as Song;
  });
}

export async function getArtists(limit = 20): Promise<Artist[]> {
  const { data: tasks, error } = await db
    .from('user_posted_tasks')
    .select('creator_id, genre, current_participants, cover_image_url, creator:users!creator_id(id, full_name, avatar_url, bio)')
    .eq('type', 'STREAM_MUSIC')
    .eq('is_active', true)
    .eq('status', 'ACTIVE')
    .order('created_at', { ascending: false });

  if (error || !tasks) return [];

  const artistMap = new Map<string, { creator: any; genres: Map<string, number>; totalStreams: number; coverUrl: string | null }>();
  for (const t of tasks) {
    if (!artistMap.has(t.creator_id)) {
      artistMap.set(t.creator_id, {
        creator: t.creator || {},
        genres: new Map(),
        totalStreams: 0,
        coverUrl: null,
      });
    }
    const entry = artistMap.get(t.creator_id)!;
    if (t.genre) {
      entry.genres.set(t.genre, (entry.genres.get(t.genre) || 0) + 1);
    }
    entry.totalStreams += t.current_participants || 0;
    if (!entry.coverUrl && t.cover_image_url) {
      entry.coverUrl = t.cover_image_url;
    }
  }

  return [...artistMap.entries()]
    .slice(0, limit)
    .map(([creatorId, entry]) => {
      const c = entry.creator;
      const topGenre = entry.genres.size > 0
        ? [...entry.genres.entries()].sort((a, b) => b[1] - a[1])[0][0]
        : null;
      return {
        id: creatorId,
        stage_name: c.full_name || 'Artist',
        slug: `user-${creatorId}`,
        bio: c.bio || null,
        avatar_url: c.avatar_url || null,
        cover_url: entry.coverUrl,
        genre: topGenre,
        is_verified: false,
        follower_count: 0,
        monthly_listeners: entry.totalStreams,
      } as Artist;
    });
}

export async function getArtistBySlug(slug: string): Promise<{ artist: Artist; songs: Song[] } | null> {
  const userId = slug.startsWith('user-') ? slug.replace('user-', '') : slug;
  if (!userId) return null;

  const { data: userData } = await db
    .from('users')
    .select('id, full_name, avatar_url, bio')
    .eq('id', userId)
    .single();

  if (!userData) return null;

  const { data: tasks } = await db
    .from('user_posted_tasks')
    .select('*')
    .eq('creator_id', userData.id)
    .eq('type', 'STREAM_MUSIC')
    .eq('is_active', true)
    .eq('status', 'ACTIVE')
    .order('created_at', { ascending: false });

  const taskList = tasks || [];
  const totalStreams = taskList.reduce((sum: number, t: any) => sum + (t.current_participants || 0), 0);

  const genreCounts = new Map<string, number>();
  taskList.forEach((t: any) => {
    if (t.genre) {
      genreCounts.set(t.genre, (genreCounts.get(t.genre) || 0) + 1);
    }
  });
  const topGenre = genreCounts.size > 0
    ? [...genreCounts.entries()].sort((a, b) => b[1] - a[1])[0][0]
    : null;

  const latestCover = taskList.length > 0 ? taskList[0].cover_image_url || null : null;

  const artist: Artist = {
    id: userData.id,
    stage_name: userData.full_name || 'Artist',
    slug: `user-${userData.id}`,
    bio: userData.bio || null,
    avatar_url: userData.avatar_url || null,
    cover_url: latestCover,
    genre: topGenre,
    is_verified: false,
    follower_count: 0,
    monthly_listeners: totalStreams,
  };

  const songs: Song[] = taskList.map((t: any) => ({
    id: t.id,
    artist_id: t.creator_id,
    title: t.title,
    slug: `task-track-${t.id}`,
    description: t.description,
    audio_url: t.audio_url,
    cover_url: t.cover_image_url || null,
    duration_seconds: t.duration_seconds || 180,
    genre: t.genre || null,
    coin_reward: t.coin_per_participant || 0,
    play_count: t.current_participants || 0,
    is_featured: false,
    artist: {
      id: t.creator_id,
      stage_name: artist.stage_name,
      slug: artist.slug,
      avatar_url: artist.avatar_url,
      is_verified: false,
    },
    taskId: t.id,
    is_download_enabled: t.is_download_enabled || false,
  }));

  return { artist, songs };
}

/* ---------------------------- ARTICLES --------------------------- */

export async function getArticles(opts: { category?: string; search?: string; limit?: number } = {}): Promise<Article[]> {
  let q = db
    .from('articles')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });
  if (opts.category) q = q.eq('category', opts.category);
  if (opts.search) q = q.ilike('title', `%${opts.search}%`);
  return unwrap<Article[]>(await q);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const res = (await db.from('articles').select('*').eq('slug', slug).eq('is_published', true).single()) as {
    data: Article | null;
    error: any;
  };
  if (res.error) return null;
  return res.data;
}

/* -------------------------- MARKETPLACE -------------------------- */

export async function getStores(): Promise<Store[]> {
  return unwrap<Store[]>(await db.from('stores').select('*').eq('is_active', true).order('name'));
}

export async function getStoreBySlug(slug: string): Promise<{ store: Store; products: Product[] } | null> {
  const store = (await db.from('stores').select('*').eq('slug', slug).eq('is_active', true).single()) as {
    data: Store | null;
    error: any;
  };
  if (store.error || !store.data) return null;
  const products = unwrap<Product[]>(
    await db.from('products').select('*').eq('store_id', store.data.id).eq('is_available', true).order('name')
  );
  return { store: store.data, products };
}

export async function getProducts(limit = 50): Promise<Product[]> {
  return unwrap<Product[]>(await db.from('products').select('*').eq('is_available', true).order('name').limit(limit));
}

/* ---------------------------- CONTESTS --------------------------- */

export async function getContests(): Promise<Contest[]> {
  return unwrap<Contest[]>(await db.from('contests').select('*').order('start_date', { ascending: false }));
}

/* ----------------------------- TASKS ----------------------------- */

export async function getTasks(): Promise<Task[]> {
  return unwrap<Task[]>(await db.from('tasks').select('*').eq('is_active', true).order('sort_order'));
}

/* ------------------------- STREAM TO EARN ------------------------ */

export async function logSongPlay(songId: string, secondsPlayed: number): Promise<void> {
  const { data: auth } = await supabase.auth.getUser();
  await db.from('song_plays').insert({
    song_id: songId,
    user_id: auth?.user?.id ?? null,
    seconds_played: Math.round(secondsPlayed),
    is_rewarded: secondsPlayed >= 30,
  });
}

/* ------------------------ NOTIFICATIONS ----------------------- */

export async function getNotifications(userId: string): Promise<AppNotification[]> {
  return unwrap<AppNotification[]>(
    await db
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)
  );
}

export async function getLatestAnnouncement(): Promise<Task | null> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const { data, error } = await db
    .from('tasks')
    .select('id, title, coin_reward')
    .eq('is_active', true)
    .gte('created_at', sevenDaysAgo.toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) return null;
  return data as Task;
}

export async function markNotificationRead(id: string): Promise<void> {
  const { error } = await db.from('notifications').update({ is_read: true }).eq('id', id);
  if (error) console.error('Failed to mark notification read:', error);
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  const { error } = await db.from('notifications').update({ is_read: true }).eq('user_id', userId).eq('is_read', false);
  if (error) console.error('Failed to mark all notifications read:', error);
}
