'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useUserStore } from '@/stores/userStore';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { formatNumber } from '@/lib/utils';
import { Coins, CheckCircle, Lock, Play, FileText, Share2, Download, Vote } from 'lucide-react';
import Link from 'next/link';

const taskTypeIcons: Record<string, any> = {
  READ_ARTICLE: FileText,
  WATCH_VIDEO: Play,
  SHARE_SOCIAL: Share2,
  APP_DOWNLOAD: Download,
  VOTE: Vote,
};

interface Task {
  id: string;
  title: string;
  description: string;
  type: string;
  coinReward: number;
  requiresAdGate: boolean;
  dailyLimit: number;
  completedToday: number;
  isLocked: boolean;
  canComplete: boolean;
}

export default function TasksPage() {
  const { user, isAuthenticated, updateWallet } = useUserStore();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await api.getDailyTasks();
      setTasks(data.tasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (task: Task) => {
    if (!isAuthenticated) {
      toast({
        title: 'Login required',
        description: 'Please login to complete tasks and earn coins',
      });
      return;
    }

    setCompleting(task.id);

    try {
      // If task requires ad gate, show ad first (simulated)
      if (task.requiresAdGate) {
        // In production, integrate Google AdMob here
        toast({
          title: 'Watching ad...',
          description: 'Ad would play here in production',
        });
      }

      const result = await api.completeTask(task.id, task.requiresAdGate);

      // Update local state
      setTasks(tasks.map(t =>
        t.id === task.id
          ? { ...t, completedToday: t.completedToday + 1, isLocked: t.completedToday + 1 >= t.dailyLimit }
          : t
      ));

      // Update wallet
      if (user?.wallet) {
        updateWallet({
          ...user.wallet,
          coinBalance: user.wallet.coinBalance + result.coinsEarned,
        });
      }

      toast({
        title: 'Task completed! 🎉',
        description: `You earned ${result.coinsEarned} coins`,
      });

      // Reload tasks to get fresh state
      loadTasks();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to complete task',
        description: error.message,
      });
    } finally {
      setCompleting(null);
    }
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Daily Tasks</h1>
        <p className="mt-2 text-muted-foreground">
          Complete tasks to earn CMP Coins
        </p>
      </div>

      {/* Wallet balance */}
      {isAuthenticated && user?.wallet && (
        <div className="mb-6 rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Your Balance</p>
              <p className="text-2xl font-bold flex items-center gap-2">
                <Coins className="h-6 w-6 text-yellow-600" />
                {formatNumber(user.wallet.coinBalance)}
              </p>
            </div>
            {user.streakRecord && (
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="text-2xl font-bold text-orange-500">
                  🔥 {user.streakRecord.currentStreak} days
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tasks List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => {
            const Icon = taskTypeIcons[task.type] || Coins;
            const isCompleting = completing === task.id;

            return (
              <div
                key={task.id}
                className={`rounded-lg border bg-card p-4 ${
                  task.isLocked ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{task.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {task.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Coins className="h-4 w-4 text-yellow-600" />
                        <span className="font-bold text-yellow-600">
                          +{task.coinReward}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          {task.completedToday}/{task.dailyLimit} completed today
                        </span>
                        {task.requiresAdGate && (
                          <span className="flex items-center gap-1">
                            <Play className="h-3 w-3" />
                            Ad required
                          </span>
                        )}
                      </div>

                      {task.isLocked ? (
                        <Button variant="outline" size="sm" disabled>
                          <Lock className="mr-2 h-4 w-4" />
                          Limit reached
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleCompleteTask(task)}
                          disabled={isCompleting}
                        >
                          {isCompleting ? (
                            <>
                              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                              Processing...
                            </>
                          ) : task.requiresAdGate ? (
                            <>
                              <Play className="mr-2 h-4 w-4" />
                              Watch & Complete
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Complete
                            </>
                          )}
                        </Button>
                      )}
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{
                          width: `${(task.completedToday / task.dailyLimit) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {tasks.length === 0 && (
            <div className="text-center py-12">
              <Coins className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No tasks available</h3>
              <p className="text-muted-foreground">Check back later for new tasks</p>
            </div>
          )}
        </div>
      )}

      {/* Login prompt */}
      {!isAuthenticated && (
        <div className="mt-8 rounded-lg border bg-muted p-6 text-center">
          <h3 className="font-semibold">Login to start earning!</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Create an account to complete tasks and earn CMP Coins
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Sign Up Free</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}