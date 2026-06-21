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

export interface Streak {
  id: string;
  user_id: string;
  streak_type: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string;
  next_reset_at: string;
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
  weeklyEarnings: number;
}

function unwrap<T>(res: { data: T | null; error: any }): T {
  if (res.error) throw new Error(res.error.message || 'Query failed');
  return (res.data ?? ([] as unknown)) as T;
}

/* ----------------------------- WALLET ---------------------------- */

export async function getTransactions(walletId: string): Promise<CoinTransaction[]> {
  return unwrap<CoinTransaction[]>(
    await db.from('coin_transactions').select('*').eq('user_id', walletId).order('created_at', { ascending: false })
  );
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
  
  const currentBalance = parseFloat(wallet.balance || '0');
  if (currentBalance < amountCoins) throw new Error('Insufficient balance');
  
  const newBalance = currentBalance - amountCoins;

  // 2. Update wallet balance
  const { error: updateError } = await db.from('wallets').update({ balance: newBalance.toString() }).eq('id', walletId);
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

  return txn.id;
}

/* ----------------------------- STREAKS --------------------------- */

export async function getStreak(userId: string): Promise<Streak | null> {
  const res = await db.from('streaks').select('*').eq('user_id', userId).eq('streak_type', 'DAILY_LOGIN').single();
  if (res.error) return null;
  return res.data as Streak;
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
  let weeklyEarnings = 0;
  
  const { data: txs } = await db.from('coin_transactions').select('amount, created_at').eq('user_id', userId).eq('type', 'earn');
  if (txs) {
    totalEarned = txs.reduce((sum: number, tx: any) => sum + Number(tx.amount), 0);
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const oneWeekAgoStr = oneWeekAgo.toISOString();
    
    weeklyEarnings = txs
      .filter((tx: any) => tx.created_at >= oneWeekAgoStr)
      .reduce((sum: number, tx: any) => sum + Number(tx.amount), 0);
  }

  return {
    totalReferrals: referrals.length,
    activeReferrals,
    totalEarned,
    weeklyEarnings,
  };
}

/* ----------------------------- MUSIC ----------------------------- */

export async function getSongs(opts: { genre?: string; search?: string; limit?: number } = {}): Promise<Song[]> {
  let q = db
    .from('Song')
    .select('*, artist:ArtistProfile(id, stage_name, slug, avatar_url, is_verified)')
    .eq('isPublished', true)
    .order('playCount', { ascending: false })
    .limit(opts.limit ?? 50);
  if (opts.genre) q = q.eq('genre', opts.genre);
  if (opts.search) q = q.ilike('title', `%${opts.search}%`);
  return unwrap<Song[]>(await q);
}

export async function getFeaturedSongs(): Promise<Song[]> {
  return unwrap<Song[]>(
    await db
      .from('Song')
      .select('*, artist:ArtistProfile(id, stage_name, slug, avatar_url, is_verified)')
      .eq('isPublished', true)
      .eq('isFeatured', true)
      .order('playCount', { ascending: false })
      .limit(12)
  );
}

export async function getArtists(limit = 20): Promise<Artist[]> {
  return unwrap<Artist[]>(
    await db.from('artists').select('*').order('monthly_listeners', { ascending: false }).limit(limit)
  );
}

export async function getArtistBySlug(slug: string): Promise<{ artist: Artist; songs: Song[] } | null> {
  const artist = (await db.from('artists').select('*').eq('slug', slug).single()) as { data: Artist | null; error: any };
  if (artist.error || !artist.data) return null;
  const songs = unwrap<Song[]>(
    await db.from('songs').select('*').eq('artist_id', artist.data.id).eq('is_published', true).order('play_count', { ascending: false })
  );
  return { artist: artist.data, songs };
}

/* ---------------------------- ARTICLES --------------------------- */

export async function getArticles(opts: { category?: string; search?: string; limit?: number } = {}): Promise<Article[]> {
  let q = db
    .from('articles')
    .select('*, author:users(id, display_name)')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(opts.limit ?? 50);
  if (opts.category) q = q.eq('category', opts.category);
  if (opts.search) q = q.ilike('title', `%${opts.search}%`);
  return unwrap<Article[]>(await q);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const res = (await db.from('articles').select('*, author:users(id, display_name)').eq('slug', slug).eq('is_published', true).single()) as {
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

export async function markNotificationRead(id: string): Promise<void> {
  const { error } = await db.from('notifications').update({ is_read: true }).eq('id', id);
  if (error) console.error('Failed to mark notification read:', error);
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  const { error } = await db.from('notifications').update({ is_read: true }).eq('user_id', userId).eq('is_read', false);
  if (error) console.error('Failed to mark all notifications read:', error);
}