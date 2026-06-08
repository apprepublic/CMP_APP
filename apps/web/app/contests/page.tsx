'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useUserStore } from '@/stores/userStore';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { formatNumber, formatDate } from '@/lib/utils';
import { Trophy, Vote, Loader2, Crown, Medal } from 'lucide-react';

interface Contest {
  id: string;
  title: string;
  description: string | null;
  type: string;
  coverImageUrl: string | null;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
  prizeDescription: string | null;
  entries: ContestEntry[];
}

interface ContestEntry {
  id: string;
  voteCount: number;
  status: string;
  artistProfile?: { stageName: string; avatarUrl: string | null };
  businessProfile?: { businessName: string; avatarUrl: string | null };
  description: string | null;
}

export default function ContestsPage() {
  const { user, isAuthenticated } = useUserStore();
  const { toast } = useToast();
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState<string | null>(null);

  useEffect(() => {
    loadContests();
  }, []);

  const loadContests = async () => {
    try {
      const data = await api.getContests();
      setContests(data.contests);
    } catch (error) {
      console.error('Failed to load contests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (contestId: string, entryId: string) => {
    if (!isAuthenticated) {
      toast({
        title: 'Login required',
        description: 'Please login to vote',
      });
      return;
    }

    setVoting(entryId);

    try {
      const result = await api.vote(contestId, entryId);

      toast({
        title: 'Vote recorded! 🗳️',
        description: `You earned ${result.coinsEarned} coins`,
      });

      loadContests();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Vote failed',
        description: error.message,
      });
    } finally {
      setVoting(null);
    }
  };

  const activeContests = contests.filter(c => c.isActive);
  const endedContests = contests.filter(c => !c.isActive);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold">Contests</h1>
      <p className="mt-2 text-muted-foreground">
        Vote for your favorites and win prizes!
      </p>

      {/* Earn Info */}
      <div className="mt-6 rounded-lg border bg-yellow-50 p-4 dark:bg-yellow-900/20">
        <p className="font-medium text-yellow-800 dark:text-yellow-200">
          🎉 Earn 20 coins for every vote!
        </p>
      </div>

      {/* Active Contests */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Active Contests
        </h2>

        {loading ? (
          <div className="mt-4 flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : activeContests.length > 0 ? (
          <div className="mt-4 space-y-6">
            {activeContests.map((contest) => (
              <div key={contest.id} className="rounded-lg border bg-card overflow-hidden">
                {/* Contest Header */}
                <div className="bg-gradient-to-r from-primary to-primary/80 p-4 text-primary-foreground">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{contest.title}</h3>
                      {contest.description && (
                        <p className="mt-1 text-sm opacity-80">{contest.description}</p>
                      )}
                    </div>
                    <div className="rounded-full bg-yellow-500 px-3 py-1 text-sm font-bold text-black">
                      LIVE
                    </div>
                  </div>
                  {contest.prizeDescription && (
                    <p className="mt-2 text-sm flex items-center gap-1">
                      <Crown className="h-4 w-4" />
                      {contest.prizeDescription}
                    </p>
                  )}
                  <p className="mt-2 text-xs opacity-70">
                    Ends: {formatDate(contest.endsAt)}
                  </p>
                </div>

                {/* Entries */}
                <div className="p-4">
                  <h4 className="font-semibold mb-4">Contestants</h4>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {contest.entries.map((entry) => (
                      <div
                        key={entry.id}
                        className="rounded-lg border p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium">
                            {entry.artistProfile?.stageName || entry.businessProfile?.businessName}
                          </h5>
                          <span className="flex items-center gap-1 text-sm font-bold">
                            <Vote className="h-4 w-4" />
                            {formatNumber(entry.voteCount)}
                          </span>
                        </div>
                        {entry.description && (
                          <p className="text-sm text-muted-foreground mb-3">
                            {entry.description}
                          </p>
                        )}
                        <Button
                          className="w-full"
                          size="sm"
                          onClick={() => handleVote(contest.id, entry.id)}
                          disabled={voting === entry.id}
                        >
                          {voting === entry.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Vote className="mr-2 h-4 w-4" />
                              Vote (+20 coins)
                            </>
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 text-center py-8">
            <Trophy className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No active contests</h3>
            <p className="text-muted-foreground">Check back soon for new contests!</p>
          </div>
        )}
      </div>

      {/* Past Contests */}
      {endedContests.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Medal className="h-5 w-5" />
            Past Contests
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {endedContests.map((contest) => (
              <div key={contest.id} className="rounded-lg border bg-card p-4 opacity-60">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{contest.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Ended: {formatDate(contest.endsAt)}
                    </p>
                  </div>
                  <span className="rounded-full bg-muted px-2 py-1 text-xs">
                    Ended
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}