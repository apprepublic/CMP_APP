'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getSongs,
  getFeaturedSongs,
  getArtists,
  getArtistBySlug,
  getArticles,
  getArticleBySlug,
  getStores,
  getStoreBySlug,
  getProducts,
  getContests,
  getTasks,
} from './queries';

/**
 * Thin React Query hooks. Pages call these instead of holding mock arrays.
 * Loading/empty/error states are derived from the returned status flags.
 */

export const useSongs = (opts: { genre?: string; search?: string } = {}) =>
  useQuery({ queryKey: ['songs', opts], queryFn: () => getSongs(opts) });

export const useFeaturedSongs = () =>
  useQuery({ queryKey: ['songs', 'featured'], queryFn: getFeaturedSongs });

export const useArtists = () => useQuery({ queryKey: ['artists'], queryFn: () => getArtists() });

export const useArtist = (slug: string) =>
  useQuery({ queryKey: ['artist', slug], queryFn: () => getArtistBySlug(slug), enabled: !!slug });

export const useArticles = () => useQuery({ queryKey: ['articles'], queryFn: () => getArticles() });

export const useArticle = (slug: string) =>
  useQuery({ queryKey: ['article', slug], queryFn: () => getArticleBySlug(slug), enabled: !!slug });

export const useStores = () => useQuery({ queryKey: ['stores'], queryFn: getStores });

export const useStore = (slug: string) =>
  useQuery({ queryKey: ['store', slug], queryFn: () => getStoreBySlug(slug), enabled: !!slug });

export const useProducts = () => useQuery({ queryKey: ['products'], queryFn: () => getProducts() });

export const useContests = () => useQuery({ queryKey: ['contests'], queryFn: getContests });

export const useTasks = () => useQuery({ queryKey: ['tasks'], queryFn: getTasks });