'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePostedTasks, useActivatePostedTask, useTaskCompletions, useApproveCompletion, useRejectCompletion } from '@/lib/hooks';

function CompletionReview({ taskId }: { taskId: string }) {
  const { data: resp, isLoading } = useTaskCompletions(taskId);
  const approveMutation = useApproveCompletion();
  const rejectMutation = useRejectCompletion();
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const completions = resp?.completions ?? [];
  const pending = completions.filter((c: any) => c.status === 'PENDING');
  const approved = completions.filter((c: any) => c.status === 'APPROVED');
  const rejected = completions.filter((c: any) => c.status === 'REJECTED');

  if (isLoading) return <div className="py-4 text-center text-on-surface-variant animate-pulse">Loading completions...</div>;
  if (completions.length === 0) return <div className="py-4 text-center text-on-surface-variant">No submissions yet</div>;

  const handleApprove = async (completionId: string) => {
    try {
      await approveMutation.mutateAsync({ completionId, postedTaskId: taskId });
    } catch (err: any) {
      alert(err.message || 'Failed to approve');
    }
  };

  const handleReject = async (completionId: string) => {
    try {
      await rejectMutation.mutateAsync({ completionId, postedTaskId: taskId, reason: rejectReason || 'Did not meet requirements' });
      setRejectingId(null);
      setRejectReason('');
    } catch (err: any) {
      alert(err.message || 'Failed to reject');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-surface-container-high text-on-surface-variant';
      case 'APPROVED': return 'bg-success-verified/10 text-success-verified';
      case 'REJECTED': return 'bg-error-alert/10 text-error-alert';
      default: return 'bg-surface-container-high text-on-surface-variant';
    }
  };

  const formatTimeLeft = (completedAt: string) => {
    const completed = new Date(completedAt);
    const autoApprove = new Date(completed.getTime() + 24 * 60 * 60 * 1000);
    const now = new Date();
    const diff = autoApprove.getTime() - now.getTime();
    if (diff <= 0) return 'Auto-approving...';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m left`;
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-4 mb-4">
        <span className="font-label-caps text-label-caps text-on-surface-variant">
          {pending.length} pending
        </span>
        <span className="font-label-caps text-label-caps text-success-verified">
          {approved.length} approved
        </span>
        <span className="font-label-caps text-label-caps text-error-alert">
          {rejected.length} rejected
        </span>
      </div>

      {completions.map((completion: any) => (
        <div key={completion.id} className="bg-surface-container rounded-xl p-4 border border-outline-variant/20">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-on-surface-variant text-sm">person</span>
              <span className="font-body-md text-body-md text-on-surface">
                {completion.user_id?.slice(0, 8)}...
              </span>
              <span className={`font-label-caps text-label-caps px-2 py-0.5 rounded-full ${getStatusBadge(completion.status)}`}>
                {completion.status}
              </span>
            </div>
            <span className="font-data-md text-data-md text-[#B8860B]">
              {completion.coins_earned} 🪙
            </span>
          </div>

          <div className="space-y-1 mb-3">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Submitted: {new Date(completion.completed_at).toLocaleString()}
            </p>
            {completion.status === 'PENDING' && (
              <p className="font-body-sm text-body-sm text-secondary">
                Auto-approves in: {formatTimeLeft(completion.completed_at)}
              </p>
            )}
          </div>

          {completion.proof_data && (
            <div className="bg-surface-container-low rounded-lg p-3 mb-3 space-y-1">
              {completion.proof_data.platform && (
                <p className="font-body-sm text-body-sm">
                  <span className="text-on-surface-variant">Platform:</span>{' '}
                  <span className="text-on-surface capitalize">{completion.proof_data.platform}</span>
                </p>
              )}
              {completion.proof_data.actionUrl && (
                <p className="font-body-sm text-body-sm">
                  <span className="text-on-surface-variant">Action:</span>{' '}
                  <a href={completion.proof_data.actionUrl} target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline break-all">
                    {completion.proof_data.actionUrl}
                  </a>
                </p>
              )}
              {completion.proof_data.screenshot && (
                <p className="font-body-sm text-body-sm">
                  <span className="text-on-surface-variant">Screenshot:</span>{' '}
                  <a href={completion.proof_data.screenshot} target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">
                    View
                  </a>
                </p>
              )}
              {completion.proof_data.comment && (
                <p className="font-body-sm text-body-sm">
                  <span className="text-on-surface-variant">Comment:</span>{' '}
                  <span className="text-on-surface">{completion.proof_data.comment}</span>
                </p>
              )}
            </div>
          )}

          {completion.status === 'REJECTED' && completion.rejection_reason && (
            <div className="bg-error-alert/5 rounded-lg p-3 mb-3">
              <p className="font-body-sm text-body-sm text-error-alert">
                Rejected: {completion.rejection_reason}
              </p>
            </div>
          )}

          {completion.status === 'PENDING' && (
            <div className="flex gap-2">
              {rejectingId === completion.id ? (
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Reason for rejection..."
                    className="w-full px-3 py-2 bg-surface-container rounded-lg border border-outline-variant text-on-surface text-sm outline-none focus:border-error-alert"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReject(completion.id)}
                      disabled={rejectMutation.isPending}
                      className="flex-1 py-2 rounded-lg font-body-sm text-body-sm bg-error-alert text-white hover:bg-error-alert/90 disabled:opacity-50"
                    >
                      Confirm Reject
                    </button>
                    <button
                      onClick={() => { setRejectingId(null); setRejectReason(''); }}
                      className="px-4 py-2 rounded-lg font-body-sm text-body-sm bg-surface-container-high text-on-surface-variant"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => handleApprove(completion.id)}
                    disabled={approveMutation.isPending}
                    className="flex-1 py-2 rounded-lg font-body-sm text-body-sm bg-success-verified text-white hover:bg-success-verified/90 disabled:opacity-50 flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">check</span>
                    Approve & Credit
                  </button>
                  <button
                    onClick={() => setRejectingId(completion.id)}
                    className="flex-1 py-2 rounded-lg font-body-sm text-body-sm bg-surface-container-high text-error-alert hover:bg-error-alert/10 flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                    Reject
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function PostedTasksPage() {
  const { data: resp, isLoading } = usePostedTasks();
  const activateTask = useActivatePostedTask();
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
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
            const progressPercent = Math.min(100, Math.round(
              (task.currentParticipants / task.participantThreshold) * 100
            ));
            const remainingBudget = task.totalBudget - (task.currentParticipants * task.coinPerParticipant);
            const isExpanded = expandedTaskId === task.id;

            return (
              <div
                key={task.id}
                className="bg-surface-alt rounded-xl border border-outline-variant/30 hover:border-outline-variant/50 transition-colors overflow-hidden"
              >
                <div className="p-6">
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
                      <p className="font-body-md text-body-md text-on-surface capitalize">{task.type?.replace?.(/_/g, ' ') || task.type}</p>
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
                      {task.expiresAt && ` · Expires ${new Date(task.expiresAt).toLocaleDateString()}`}
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
                      {task.status === 'ACTIVE' && (
                        <button
                          onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                          className="bg-secondary-container text-on-secondary-container font-body-md text-body-md px-4 py-2 rounded-lg hover:bg-secondary/20 transition-colors flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-sm">{isExpanded ? 'expand_less' : 'people'}</span>
                          <span>{isExpanded ? 'Hide' : 'Review'} Submissions</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-outline-variant/20">
                    <h4 className="font-h4 text-h4 text-on-surface mt-4 mb-3">Submissions</h4>
                    <CompletionReview taskId={task.id} />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}
