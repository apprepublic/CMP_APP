'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './api';
import {
  getSongs,
  getFeaturedSongs,
  getArtists,
  getArtistBySlug,
  getStores,
  getStoreBySlug,
  getProducts,
  getContests,
  getTransactions,
  getReferralStats,
  getReferrals,
  getNotifications,
  getLatestAnnouncement,
} from './queries';

export const useSongs = (opts: { genre?: string; search?: string } = {}) =>
  useQuery({ queryKey: ['songs', opts], queryFn: () => getSongs(opts), staleTime: 10 * 60 * 1000 });

export const useFeaturedSongs = () =>
  useQuery({ queryKey: ['songs', 'featured'], queryFn: getFeaturedSongs, staleTime: 10 * 60 * 1000 });

export const useArtists = () => useQuery({ queryKey: ['artists'], queryFn: () => getArtists(), staleTime: 10 * 60 * 1000 });

export const useArtist = (slug: string) =>
  useQuery({ queryKey: ['artist', slug], queryFn: () => getArtistBySlug(slug), enabled: !!slug });

export const useStores = () => useQuery({ queryKey: ['stores'], queryFn: getStores, staleTime: 10 * 60 * 1000 });

export const useStore = (slug: string) =>
  useQuery({ queryKey: ['store', slug], queryFn: () => getStoreBySlug(slug), enabled: !!slug, staleTime: 10 * 60 * 1000 });

export const useProducts = () => useQuery({ queryKey: ['products'], queryFn: () => getProducts(), staleTime: 10 * 60 * 1000 });

export const useContests = () => useQuery({ queryKey: ['contests'], queryFn: getContests, staleTime: 10 * 60 * 1000 });

export const useTasks = (category?: string) =>
  useQuery({ queryKey: ['tasks', category], queryFn: () => api.getTasks(undefined, category), staleTime: 5 * 60 * 1000 });

export const useDailyTasks = () =>
  useQuery({ queryKey: ['tasks', 'daily'], queryFn: () => api.getDailyTasks(), staleTime: 5 * 60 * 1000 });

export const useStreak = () =>
  useQuery({ queryKey: ['streak'], queryFn: () => api.getStreak(), staleTime: 5 * 60 * 1000 });

export const useCompleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, adWatched = true }: { taskId: string; adWatched?: boolean }) =>
      api.completeTask(taskId, adWatched),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['streak'] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
    },
  });
};

export const useClaimArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ articleId }: { articleId: string }) => api.claimArticle(articleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['streak'] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
    },
  });
};

export const useBuyStreakFreeze = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.buyStreakFreeze(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['streak'] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
    },
  });
};

export const usePostTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
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
    }) => api.createPostedTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['postedTasks'] });
      queryClient.invalidateQueries({ queryKey: ['streak'] });
    },
  });
};

export const usePostedTasks = () =>
  useQuery({ queryKey: ['postedTasks'], queryFn: () => api.getPostedTasks(), staleTime: 2 * 60 * 1000 });

export const useTogglePostedTaskStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, currentStatus }: { id: string, currentStatus: string }) => api.togglePostedTaskStatus(id, currentStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['postedTasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useCompletePostedTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, proofData }: { id: string; proofData?: any }) =>
      api.completePostedTask(id, proofData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['postedTasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['streak'] });
    },
  });
};

export const useTaskCompletions = (taskId: string) =>
  useQuery({ queryKey: ['taskCompletions', taskId], queryFn: () => api.getTaskCompletions(taskId), enabled: !!taskId, staleTime: 2 * 60 * 1000 });

export const useApproveCompletion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ completionId, postedTaskId }: { completionId: string; postedTaskId: string }) =>
      api.approveCompletion(completionId, postedTaskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskCompletions'] });
      queryClient.invalidateQueries({ queryKey: ['postedTasks'] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
    },
  });
};

export const useRejectCompletion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ completionId, postedTaskId, reason }: { completionId: string; postedTaskId: string; reason: string }) =>
      api.rejectCompletion(completionId, postedTaskId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskCompletions'] });
      queryClient.invalidateQueries({ queryKey: ['postedTasks'] });
    },
  });
};

export const useArticle = (slug: string) =>
  useQuery({ queryKey: ['article', slug], queryFn: () => api.getArticleBySlug(slug), enabled: !!slug, staleTime: 30 * 60 * 1000 });

export const useArticles = (opts: { category?: string; search?: string } = {}) =>
  useQuery({ queryKey: ['articles', opts], queryFn: () => api.getArticles(opts), staleTime: 10 * 60 * 1000 });

export const useTransactions = (walletId: string) => 
  useQuery({ queryKey: ['transactions', walletId], queryFn: () => getTransactions(walletId), enabled: !!walletId, staleTime: 2 * 60 * 1000 });

export const useReferralStats = (userId: string) =>
  useQuery({ queryKey: ['referralStats', userId], queryFn: () => getReferralStats(userId), enabled: !!userId, staleTime: 5 * 60 * 1000 });

export const useReferrals = (userId: string) =>
  useQuery({ queryKey: ['referrals', userId], queryFn: () => getReferrals(userId), enabled: !!userId, staleTime: 5 * 60 * 1000 });

export const useNotifications = (userId: string) =>
  useQuery({ queryKey: ['notifications', userId], queryFn: () => getNotifications(userId), enabled: !!userId, staleTime: 2 * 60 * 1000 });

export const useLatestAnnouncement = (enabled: boolean) =>
  useQuery({ queryKey: ['latestAnnouncement'], queryFn: () => getLatestAnnouncement(), enabled, staleTime: 60 * 60 * 1000 });