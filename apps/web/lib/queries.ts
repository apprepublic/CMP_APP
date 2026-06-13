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
  view_count: number;
  published_at: string | null;
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

function unwrap<T>(res: { data: T | null; error: any }): T {
  if (res.error) throw new Error(res.error.message || 'Query failed');
  return (res.data ?? ([] as unknown)) as T;
}

/* ----------------------------- MUSIC ----------------------------- */

export async function getSongs(opts: { genre?: string; search?: string; limit?: number } = {}): Promise<Song[]> {
  let q = db
    .from('songs')
    .select('*, artist:artists(id, stage_name, slug, avatar_url, is_verified)')
    .eq('is_published', true)
    .order('play_count', { ascending: false })
    .limit(opts.limit ?? 50);
  if (opts.genre) q = q.eq('genre', opts.genre);
  if (opts.search) q = q.ilike('title', `%${opts.search}%`);
  return unwrap<Song[]>(await q);
}

export async function getFeaturedSongs(): Promise<Song[]> {
  return unwrap<Song[]>(
    await db
      .from('songs')
      .select('*, artist:artists(id, stage_name, slug, avatar_url, is_verified)')
      .eq('is_published', true)
      .eq('is_featured', true)
      .order('play_count', { ascending: false })
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

export async function getArticles(limit = 20): Promise<Article[]> {
  return unwrap<Article[]>(
    await db.from('articles').select('*').eq('is_published', true).order('published_at', { ascending: false }).limit(limit)
  );
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