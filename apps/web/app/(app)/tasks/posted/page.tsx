'use client';

import Link from 'next/link';
import { usePostedTasks, useActivatePostedTask } from '@/lib/hooks';

export default function PostedTasksPage() {
  const { data: resp, isLoading } = usePostedTasks();
  const activateTask = useActivatePostedTask();
  const tasks = resp?.tasks ?? [];

  const handleActivate = async (id: string) => {
    try {
      await activateTask.mutateAsync(id);
    } catch (err) {
      console.error('Failed to activate task:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-surface-container-high text-on-surface-variant';
      case 'ACTIVE': return 'bg-success-verified/10 text-success-verified';
      case 'COMPLETED': return 'bg-primary-container/20 text-primary';
      case 'EXPIRED':
      case 'CANCELLED': return 'bg-error-alert/10 text-error-alert';
      default: return 'bg-surface-container-high text-on-surface-variant';
    }
  };

  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 w-full">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-primary">My Posted Tasks</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">
            Manage and track your custom tasks
          </p>
        </div>
        <Link
          href="/tasks/post"
          className="bg-[#B8860B] text-primary font-body-md text-body-md px-6 py-3 rounded-lg hover:bg-[#8B6914] transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined">add_task</span>
          <span>Post New Task</span>
        </Link>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-surface-alt rounded-xl p-6 h-48 animate-pulse border border-outline-variant/20" />
          ))
        ) : tasks.length === 0 ? (
          <div className="bg-surface-alt rounded-xl p-12 text-center border border-outline-variant/20">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">task_alt</span>
            <h3 className="font-h3 text-h3 text-on-surface mb-2">No Tasks Yet</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              Create your first task to start engaging users
            </p>
            <Link
              href="/tasks/post"
              className="inline-flex items-center gap-2 bg-[#B8860B] text-primary font-body-md text-body-md px-6 py-3 rounded-lg hover:bg-[#8B6914] transition-colors"
            >
              <span className="material-symbols-outlined">add</span>
              <span>Post Your First Task</span>
            </Link>
          </div>
        ) : (
          tasks.map((task: any) => {
            const progressPercent = Math.round(
              (task.currentParticipants / task.participantThreshold) * 100
            );
            const remainingBudget = task.totalBudget - (task.currentParticipants * task.coinPerParticipant);

            return (
              <div
                key={task.id}
                className="bg-surface-alt rounded-xl p-6 border border-outline-variant/30 hover:border-outline-variant/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-h3 text-h3 text-on-surface">{task.title}</h3>
                      <span className={`font-label-caps text-label-caps px-3 py-1 rounded-full ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">
                      {task.description}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-data-lg text-data-lg text-[#B8860B]">{task.coinPerParticipant.toLocaleString()} 🪙</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">per participant</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-surface rounded-lg p-4">
                    <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Participants</p>
                    <p className="font-h3 text-h3 text-primary">{task.currentParticipants} / {task.participantThreshold}</p>
                  </div>
                  <div className="bg-surface rounded-lg p-4">
                    <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Budget Used</p>
                    <p className="font-h3 text-h3 text-primary">{(task.totalBudget - remainingBudget).toLocaleString()}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">/ {task.totalBudget.toLocaleString()} 🪙</p>
                  </div>
                  <div className="bg-surface rounded-lg p-4">
                    <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Remaining</p>
                    <p className="font-h3 text-h3 text-success-verified">{remainingBudget.toLocaleString()} 🪙</p>
                  </div>
                  <div className="bg-surface rounded-lg p-4">
                    <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Type</p>
                    <p className="font-body-md text-body-md text-on-surface capitalize">{task.type.replace('_', ' ')}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Progress</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">{progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#B8860B] to-secondary rounded-full transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20">
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Created {new Date(task.createdAt).toLocaleDateString()}
                    {task.expiresAt && ` • Expires ${new Date(task.expiresAt).toLocaleDateString()}`}
                  </p>
                  <div className="flex gap-3">
                    {task.status === 'PENDING' && (
                      <button
                        onClick={() => handleActivate(task.id)}
                        disabled={activateTask.isPending}
                        className="bg-success-verified text-white font-body-md text-body-md px-4 py-2 rounded-lg hover:bg-success-verified/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm">play_arrow</span>
                        <span>{activateTask.isPending ? 'Activating...' : 'Activate'}</span>
                      </button>
                    )}
                    <Link
                      href={`/tasks/posted/${task.id}`}
                      className="bg-primary text-on-primary font-body-md text-body-md px-4 py-2 rounded-lg hover:bg-on-primary-fixed transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}