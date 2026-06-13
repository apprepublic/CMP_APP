'use client';

import { PageTransition, StaggerContainer, StaggerItem } from '@/components/ui/page-transition';
import { NeuCard } from '@/components/ui/neu-card';
import { NeuIconBadge } from '@/components/ui/neu-icon-badge';
import { Button } from '@/components/ui/button';
import { Trophy, Crown, Users } from 'lucide-react';
import { useContests } from '@/lib/hooks';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'ACTIVE':
      return (
        <NeuCard
          padding="none"
          className="bg-neo-secondary text-neo-primary font-label-caps text-label-caps px-3 py-1 rounded-full font-semibold shadow-neu-raised-sm"
        >
          LIVE
        </NeuCard>
      );
    case 'UPCOMING':
      return (
        <NeuCard
          padding="none"
          className="bg-neo-success/20 text-neo-success font-label-caps text-label-caps px-3 py-1 rounded-full font-semibold shadow-neu-raised-sm"
        >
          UPCOMING
        </NeuCard>
      );
    case 'COMPLETED':
      return (
        <NeuCard
          padding="none"
          className="bg-neo-text-muted/20 text-neo-text-muted font-label-caps text-label-caps px-3 py-1 rounded-full font-semibold shadow-neu-raised-sm"
        >
          ENDED
        </NeuCard>
      );
    default:
      return null;
  }
}

export default function ContestsPage() {
  const { data: contests = [], isLoading } = useContests();

  return (
    <PageTransition className="container py-8 space-y-gutter">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-neo-primary mb-4">Contests</h1>
        <p className="font-body-lg text-body-lg text-neo-text-secondary">
          Vote for your favorites and win prizes!
        </p>
      </div>

      {/* Earn Info */}
      <NeuCard padding="md" className="bg-gradient-to-r from-neo-secondary/20 to-neo-secondary/10 border border-neo-secondary/30 shadow-neu-flat">
        <div className="flex items-center gap-3">
          <NeuIconBadge size="md" active className="bg-neo-secondary/20">
            <Trophy className="w-5 h-5 text-neo-secondary" />
          </NeuIconBadge>
          <p className="font-body-md text-body-md text-neo-text-primary">
            <span className="font-semibold">🎉 Earn 20 coins</span> for every vote!
          </p>
        </div>
      </NeuCard>

      {/* Contests List */}
      <div className="mt-8">
        <h2 className="font-h3 text-h3 text-neo-text-primary flex items-center gap-2 mb-6">
          <NeuIconBadge size="md" active className="bg-neo-secondary/20">
            <Trophy className="w-5 h-5 text-neo-secondary" />
          </NeuIconBadge>
          All Contests
        </h2>

        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-64 rounded-neo neo-skeleton" />
            ))}
          </div>
        ) : contests.length === 0 ? (
          <NeuCard padding="lg" className="text-center py-12 shadow-neu-flat">
            <NeuIconBadge size="lg" active className="mx-auto mb-4 bg-neo-text-muted/20">
              <Trophy className="w-8 h-8 text-neo-text-muted" />
            </NeuIconBadge>
            <h3 className="font-h3 text-h3 text-neo-text-primary mb-2">No contests right now</h3>
            <p className="font-body-md text-body-md text-neo-text-secondary">Check back soon for new contests!</p>
          </NeuCard>
        ) : (
          <div className="space-y-6">
            <StaggerContainer stagger={0.1}>
              {contests.map((contest) => (
                <StaggerItem key={contest.id}>
                  <NeuCard padding="none" interactive className="overflow-hidden shadow-neu-flat">
                    {/* Contest Header */}
                    <div className="bg-gradient-to-r from-neo-primary to-neo-primary/80 p-6 text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                      <div className="relative z-10 flex items-start justify-between">
                        <div>
                          <h3 className="font-h3 text-h3 text-white mb-2">{contest.title}</h3>
                          {contest.description && (
                            <p className="font-body-sm text-body-sm text-white/80 mb-4">{contest.description}</p>
                          )}
                        </div>
                        {getStatusBadge(contest.status)}
                      </div>
                      {contest.prize_pool_coins && (
                        <div className="flex items-center gap-2 mt-4 text-white/90">
                          <NeuIconBadge size="sm" active className="bg-white/20">
                            <Crown className="w-4 h-4 text-neo-secondary" />
                          </NeuIconBadge>
                          <p className="font-body-sm text-body-sm">{contest.prize_pool_coins.toLocaleString()} Coins</p>
                        </div>
                      )}
                      <div className="mt-4 pt-4 border-t border-white/20">
                        <p className="font-label-caps text-label-caps text-white/70">
                          Ends: {formatDate(contest.end_date)}
                        </p>
                      </div>
                    </div>

                    {/* Contest Info */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-neo-text-secondary">
                        <Users className="w-4 h-4" />
                        <span className="font-body-sm text-body-sm">Category: {contest.category}</span>
                      </div>
                    </div>
                  </NeuCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        )}
      </div>
    </PageTransition>
  );
}