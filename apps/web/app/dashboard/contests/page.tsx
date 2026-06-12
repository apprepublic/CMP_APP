'use client';

import { useEffect, useState } from 'react';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/ui/page-transition';
import { NeuCard } from '@/components/ui/neu-card';
import { NeuIconBadge } from '@/components/ui/neu-icon-badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Trophy, Vote, Loader2, Crown, Medal, Users } from 'lucide-react';

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

const mockContests: Contest[] = [
  {
    id: '1',
    title: 'Best Afrobeats Track 2024',
    description: 'Vote for your favorite Afrobeats track of the year',
    type: 'MUSIC',
    coverImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8OSK1AVqLwjxErFcz0X28Us6hsXiGyla-3hJXrKqo_G-X2XAggYBPd30RAcEm94IVf8PcgAj27N1Fw-TpQAcoXhQ5wpLtLkQkWthlFnsVrx85YNxcDJWc7bg0w1i0Z05_dnRH5B-ZIkY-VngvWIXmhdiuTEeAhVBhNh2ATPr6btUKVUYrRt1Ui9A4uEF8iIzHKRrOM2iOhgRTpuKC9GULviNJ6p38G_5rJ7ZSPGk0oIVGhGNTvoaFPJKMQUP0XJaKqJSFOx8TjTEY',
    startsAt: '2024-01-01T00:00:00Z',
    endsAt: '2024-12-31T23:59:59Z',
    isActive: true,
    prizeDescription: '₦500,000 + Featured Playlist Spot',
    entries: [
      { id: '1a', voteCount: 1240, status: 'ACTIVE', artistProfile: { stageName: 'Burna Boy', avatarUrl: null }, description: 'Last Last' },
      { id: '1b', voteCount: 980, status: 'ACTIVE', artistProfile: { stageName: 'Wizkid', avatarUrl: null }, description: 'Essence' },
      { id: '1c', voteCount: 756, status: 'ACTIVE', artistProfile: { stageName: 'Tems', avatarUrl: null }, description: 'Free Mind' },
    ],
  },
];

export default function ContestsPage() {
  const [voting, setVoting] = useState<string | null>(null);

  const handleVote = async (contestId: string, entryId: string) => {
    setVoting(entryId);
    setTimeout(() => setVoting(null), 1000);
  };

  const activeContests = mockContests.filter(c => c.isActive);

  return (
    <PageTransition className="space-y-gutter">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-neo-primary mb-4">Contests</h1>
        <p className="font-body-lg text-body-lg text-neo-text-secondary max-w-2xl">
          Vote for your favorites and earn rewards! Each vote earns you 20 coins.
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

      {/* Active Contests */}
      <div>
        <h2 className="font-h3 text-h3 text-neo-text-primary flex items-center gap-2 mb-6">
          <NeuIconBadge size="md" active className="bg-neo-secondary/20">
            <Trophy className="w-5 h-5 text-neo-secondary" />
          </NeuIconBadge>
          Active Contests
        </h2>

        {activeContests.length > 0 ? (
          <div className="space-y-6">
            <StaggerContainer stagger={0.1}>
              {activeContests.map((contest) => (
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
                        <NeuCard padding="none" className="bg-neo-secondary text-neo-primary font-label-caps text-label-caps px-3 py-1 rounded-full font-semibold shadow-neu-raised-sm">
                          LIVE
                        </NeuCard>
                      </div>
                      {contest.prizeDescription && (
                        <div className="flex items-center gap-2 mt-4 text-white/90">
                          <NeuIconBadge size="sm" active className="bg-white/20">
                            <Crown className="w-4 h-4 text-neo-secondary" />
                          </NeuIconBadge>
                          <p className="font-body-sm text-body-sm">{contest.prizeDescription}</p>
                        </div>
                      )}
                    </div>

                    {/* Entries */}
                    <div className="p-6">
                      <h4 className="font-body-md text-body-md font-semibold text-neo-text-primary mb-4 flex items-center gap-2">
                        <Users className="w-4 h-4 text-neo-text-secondary" />
                        Contestants
                      </h4>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {contest.entries.map((entry) => (
                          <motion.div key={entry.id} whileHover={{ y: -2 }}>
                            <NeuCard padding="md" interactive className="shadow-neu-flat h-full flex flex-col">
                              <div className="flex items-center justify-between mb-3">
                                <h5 className="font-body-md text-body-md font-semibold text-neo-text-primary">
                                  {entry.artistProfile?.stageName || entry.businessProfile?.businessName}
                                </h5>
                                <div className="flex items-center gap-1 text-neo-secondary font-semibold">
                                  <Vote className="w-4 h-4" />
                                  <span className="font-data-md text-data-md">{entry.voteCount.toLocaleString()}</span>
                                </div>
                              </div>
                              {entry.description && (
                                <p className="font-body-sm text-body-sm text-neo-text-secondary mb-4 flex-1">
                                  {entry.description}
                                </p>
                              )}
                              <Button
                                size="lg"
                                className="w-full gap-2"
                                onClick={() => handleVote(contest.id, entry.id)}
                                disabled={voting === entry.id}
                              >
                                {voting === entry.id ? (
                                  <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Voting...
                                  </>
                                ) : (
                                  <>
                                    <Vote className="w-4 h-4" />
                                    Vote (+20 coins)
                                  </>
                                )}
                              </Button>
                            </NeuCard>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </NeuCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        ) : (
          <NeuCard padding="lg" className="text-center py-12 shadow-neu-flat">
            <NeuIconBadge size="lg" active className="mx-auto mb-4 bg-neo-text-muted/20">
              <Trophy className="w-8 h-8 text-neo-text-muted" />
            </NeuIconBadge>
            <h3 className="font-h3 text-h3 text-neo-text-primary mb-2">No active contests</h3>
            <p className="font-body-md text-body-md text-neo-text-secondary">Check back soon for new contests!</p>
          </NeuCard>
        )}
      </div>
    </PageTransition>
  );
}