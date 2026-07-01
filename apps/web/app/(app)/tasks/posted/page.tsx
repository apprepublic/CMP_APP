'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePostedTasks, useTogglePostedTaskStatus, useTaskCompletions, useApproveCompletion, useRejectCompletion } from '@/lib/hooks';

function MobileCompletionReview({ taskId }: { taskId: string }) {
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
      case 'APPROVED': return 'bg-success/10 text-success';
      case 'REJECTED': return 'bg-error/10 text-error';
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
      <div className="flex gap-4 mb-3">
        <span className="font-label-caps text-label-caps text-on-surface-variant">{pending.length} pending</span>
        <span className="font-label-caps text-label-caps text-success">{approved.length} approved</span>
        <span className="font-label-caps text-label-caps text-error">{rejected.length} rejected</span>
      </div>

      {completions.map((completion: any) => (
        <div key={completion.id} className="bg-white shadow-[inset_2px_2px_4px_rgba(13,27,53,0.04),inset_-2px_-2px_4px_rgba(255,255,255,1)] rounded-xl p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-on-surface-variant text-sm">person</span>
              <span className="font-body-md text-body-md text-on-surface">{completion.user_id?.slice(0, 8)}...</span>
              <span className={`font-label-caps text-label-caps px-2 py-0.5 rounded-full ${getStatusBadge(completion.status)}`}>{completion.status}</span>
            </div>
            <span className="font-data-md text-data-md text-gold-metallic">{completion.coins_earned} CMP</span>
          </div>

          <div className="space-y-1 mb-3">
            <p className="font-body-sm text-body-sm text-on-surface-variant">Submitted: {new Date(completion.completed_at).toLocaleString()}</p>
            {completion.status === 'PENDING' && (
              <p className="font-body-sm text-body-sm text-gold-metallic">Auto-approves in: {formatTimeLeft(completion.completed_at)}</p>
            )}
          </div>

          {completion.proof_data && (
            <div className="bg-surface-container-low shadow-[inset_2px_2px_4px_rgba(13,27,53,0.04)] rounded-lg p-3 mb-3 space-y-1">
              {completion.proof_data.platform && (
                <p className="font-body-sm text-body-sm"><span className="text-on-surface-variant">Platform:</span> <span className="text-on-surface capitalize">{completion.proof_data.platform}</span></p>
              )}
              {completion.proof_data.actionUrl && (
                <p className="font-body-sm text-body-sm"><span className="text-on-surface-variant">Action:</span> <a href={completion.proof_data.actionUrl} target="_blank" rel="noopener noreferrer" className="text-gold-metallic hover:underline break-all">{completion.proof_data.actionUrl}</a></p>
              )}
              {completion.proof_data.screenshot && (
                <div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-1">Screenshot:</p>
                  <a href={completion.proof_data.screenshot} target="_blank" rel="noopener noreferrer">
                    <img src={completion.proof_data.screenshot} alt="Proof screenshot" className="max-h-40 rounded-lg border border-outline-variant/30 object-cover hover:opacity-80 transition-opacity" />
                  </a>
                </div>
              )}
              {completion.proof_data.comment && (
                <p className="font-body-sm text-body-sm"><span className="text-on-surface-variant">Comment:</span> <span className="text-on-surface">{completion.proof_data.comment}</span></p>
              )}
            </div>
          )}

          {completion.status === 'REJECTED' && completion.rejection_reason && (
            <div className="bg-error/5 rounded-lg p-3 mb-3">
              <p className="font-body-sm text-body-sm text-error">Rejected: {completion.rejection_reason}</p>
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
                    className="w-full px-3 py-2 bg-white shadow-[inset_2px_2px_4px_rgba(13,27,53,0.06)] rounded-lg text-on-surface text-sm outline-none focus:ring-2 focus:ring-error/40"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => handleReject(completion.id)} disabled={rejectMutation.isPending} className="flex-1 py-2 rounded-lg font-body-sm text-body-sm bg-error text-white hover:bg-error/90 disabled:opacity-50">Confirm Reject</button>
                    <button onClick={() => { setRejectingId(null); setRejectReason(''); }} className="px-4 py-2 rounded-lg font-body-sm text-body-sm bg-surface-container-high text-on-surface-variant">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <button onClick={() => handleApprove(completion.id)} disabled={approveMutation.isPending} className="flex-1 py-2 rounded-lg font-body-sm text-body-sm bg-success text-white hover:bg-success/90 disabled:opacity-50 flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-sm">check</span> Approve & Credit
                  </button>
                  <button onClick={() => setRejectingId(completion.id)} className="flex-1 py-2 rounded-lg font-body-sm text-body-sm bg-surface-container-high text-error hover:bg-error/10 flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-sm">close</span> Reject
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
        <span className="font-label-caps text-label-caps text-on-surface-variant">{pending.length} pending</span>
        <span className="font-label-caps text-label-caps text-success-verified">{approved.length} approved</span>
        <span className="font-label-caps text-label-caps text-error-alert">{rejected.length} rejected</span>
      </div>

      {completions.map((completion: any) => (
        <div key={completion.id} className="bg-surface-container rounded-xl p-4 border border-outline-variant/20">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-on-surface-variant text-sm">person</span>
              <span className="font-body-md text-body-md text-on-surface">{completion.user_id?.slice(0, 8)}...</span>
              <span className={`font-label-caps text-label-caps px-2 py-0.5 rounded-full ${getStatusBadge(completion.status)}`}>{completion.status}</span>
            </div>
            <span className="font-data-md text-data-md text-[#B8860B]">{completion.coins_earned} 🪙</span>
          </div>

          <div className="space-y-1 mb-3">
            <p className="font-body-sm text-body-sm text-on-surface-variant">Submitted: {new Date(completion.completed_at).toLocaleString()}</p>
            {completion.status === 'PENDING' && (
              <p className="font-body-sm text-body-sm text-secondary">Auto-approves in: {formatTimeLeft(completion.completed_at)}</p>
            )}
          </div>

          {completion.proof_data && (
            <div className="bg-surface-container-low rounded-lg p-3 mb-3 space-y-1">
              {completion.proof_data.platform && (
                <p className="font-body-sm text-body-sm"><span className="text-on-surface-variant">Platform:</span> <span className="text-on-surface capitalize">{completion.proof_data.platform}</span></p>
              )}
              {completion.proof_data.actionUrl && (
                <p className="font-body-sm text-body-sm"><span className="text-on-surface-variant">Action:</span> <a href={completion.proof_data.actionUrl} target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline break-all">{completion.proof_data.actionUrl}</a></p>
              )}
              {completion.proof_data.screenshot && (
                <div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-1">Screenshot:</p>
                  <a href={completion.proof_data.screenshot} target="_blank" rel="noopener noreferrer">
                    <img src={completion.proof_data.screenshot} alt="Proof screenshot" className="max-h-40 rounded-lg border border-outline-variant/30 object-cover hover:opacity-80 transition-opacity" />
                  </a>
                </div>
              )}
              {completion.proof_data.comment && (
                <p className="font-body-sm text-body-sm"><span className="text-on-surface-variant">Comment:</span> <span className="text-on-surface">{completion.proof_data.comment}</span></p>
              )}
            </div>
          )}

          {completion.status === 'REJECTED' && completion.rejection_reason && (
            <div className="bg-error-alert/5 rounded-lg p-3 mb-3">
              <p className="font-body-sm text-body-sm text-error-alert">Rejected: {completion.rejection_reason}</p>
            </div>
          )}

          {completion.status === 'PENDING' && (
            <div className="flex gap-2">
              {rejectingId === completion.id ? (
                <div className="flex-1 space-y-2">
                  <input type="text" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Reason for rejection..." className="w-full px-3 py-2 bg-surface-container rounded-lg border border-outline-variant text-on-surface text-sm outline-none focus:border-error-alert" />
                  <div className="flex gap-2">
                    <button onClick={() => handleReject(completion.id)} disabled={rejectMutation.isPending} className="flex-1 py-2 rounded-lg font-body-sm text-body-sm bg-error-alert text-white hover:bg-error-alert/90 disabled:opacity-50">Confirm Reject</button>
                    <button onClick={() => { setRejectingId(null); setRejectReason(''); }} className="px-4 py-2 rounded-lg font-body-sm text-body-sm bg-surface-container-high text-on-surface-variant">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <button onClick={() => handleApprove(completion.id)} disabled={approveMutation.isPending} className="flex-1 py-2 rounded-lg font-body-sm text-body-sm bg-success-verified text-white hover:bg-success-verified/90 disabled:opacity-50 flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-sm">check</span> Approve & Credit
                  </button>
                  <button onClick={() => setRejectingId(completion.id)} className="flex-1 py-2 rounded-lg font-body-sm text-body-sm bg-surface-container-high text-error-alert hover:bg-error-alert/10 flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-sm">close</span> Reject
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
  const toggleTask = useTogglePostedTaskStatus();
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const tasks = resp?.tasks ?? [];

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      await toggleTask.mutateAsync({ id, currentStatus });
    } catch (err: any) {
      alert(err.message || 'Failed to toggle task status');
      console.error('Failed to toggle task status:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-surface-container-high text-on-surface-variant';
      case 'PAUSED': return 'bg-warning/10 text-warning';
      case 'ACTIVE': return 'bg-success/10 text-success';
      case 'COMPLETED': return 'bg-primary-container/20 text-primary';
      case 'EXPIRED':
      case 'CANCELLED': return 'bg-error/10 text-error';
      default: return 'bg-surface-container-high text-on-surface-variant';
    }
  };

  const totalTasks = tasks.length;
  const activeTasks = tasks.filter((t: any) => t.status === 'ACTIVE').length;
  const pausedTasks = tasks.filter((t: any) => t.status === 'PAUSED').length;
  const completedTasks = tasks.filter((t: any) => t.status === 'COMPLETED').length;

  return (
    <>
      {/* ==================== MOBILE LAYOUT ==================== */}
      <div className="block md:hidden bg-background min-h-screen flex flex-col">
        <header className="fixed top-0 w-full z-50 bg-primary-container h-16 flex items-center justify-between px-margin-mobile shadow shadow-black/15">
          <div className="flex items-center">
            <button className="p-2 -ml-2 active:scale-95 transition-transform" onClick={() => window.history.back()}>
              <span className="material-symbols-outlined text-gold-metallic">arrow_back</span>
            </button>
            <h1 className="ml-2 font-headline-md text-headline-md-mobile text-on-primary-fixed">My Tasks</h1>
          </div>
          <Link href="/tasks/post" className="bg-on-primary-fixed text-primary-container px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1 active:scale-95 transition-transform shadow-md">
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>New</span>
          </Link>
        </header>

        <main className="flex-grow pt-20 pb-8 px-margin-mobile w-full mx-auto">
          {/* Stats Cards - Bento Grid */}
          <div className="grid grid-cols-2 gap-stack-sm mb-stack-lg">
            <div className="bg-white shadow-[8px_8px_16px_rgba(13,27,53,0.05),-4px_-4px_12px_rgba(255,255,255,0.9)] rounded-xl p-stack-md border-t-2 border-gold-metallic">
              <p className="font-label-caps text-label-caps text-on-surface-muted uppercase mb-1">Total</p>
              <p className="font-numeric-display text-numeric-display text-primary-container">{totalTasks}</p>
            </div>
            <div className="bg-white shadow-[8px_8px_16px_rgba(13,27,53,0.05),-4px_-4px_12px_rgba(255,255,255,0.9)] rounded-xl p-stack-md">
              <p className="font-label-caps text-label-caps text-on-surface-muted uppercase mb-1">Active</p>
              <p className="font-numeric-display text-numeric-display text-success">{activeTasks}</p>
            </div>
            <div className="bg-white shadow-[8px_8px_16px_rgba(13,27,53,0.05),-4px_-4px_12px_rgba(255,255,255,0.9)] rounded-xl p-stack-md">
              <p className="font-label-caps text-label-caps text-on-surface-muted uppercase mb-1">Paused</p>
              <p className="font-numeric-display text-numeric-display text-warning">{pausedTasks}</p>
            </div>
            <div className="bg-white shadow-[8px_8px_16px_rgba(13,27,53,0.05),-4px_-4px_12px_rgba(255,255,255,0.9)] rounded-xl p-stack-md">
              <p className="font-label-caps text-label-caps text-on-surface-muted uppercase mb-1">Completed</p>
              <p className="font-numeric-display text-numeric-display text-primary">{completedTasks}</p>
            </div>
          </div>

          <div className="space-y-stack-md">
            {isLoading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="bg-white shadow-[8px_8px_16px_rgba(13,27,53,0.05),-4px_-4px_12px_rgba(255,255,255,0.9)] rounded-xl p-stack-lg h-48 animate-pulse" />
              ))
            ) : tasks.length === 0 ? (
              <div className="bg-white shadow-[8px_8px_16px_rgba(13,27,53,0.05),-4px_-4px_12px_rgba(255,255,255,0.9)] rounded-xl p-stack-xl text-center">
                <div className="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center mx-auto mb-stack-md shadow-[inset_4px_4px_8px_rgba(13,27,53,0.06)]">
                  <span className="material-symbols-outlined text-4xl text-on-surface-muted">task_alt</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2">No Tasks Yet</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-stack-lg">Create your first task to start engaging users</p>
                <Link href="/tasks/post" className="inline-flex items-center gap-2 bg-primary-container text-on-primary font-bold py-4 px-8 rounded-xl shadow-lg hover:opacity-90 transition-all active:scale-95">
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  <span>Post Your First Task</span>
                </Link>
              </div>
            ) : (
              tasks.map((task: any) => {
                const progressPercent = Math.min(100, Math.round((task.currentParticipants / task.participantThreshold) * 100));
                const remainingBudget = task.totalBudget - (task.currentParticipants * task.coinPerParticipant);
                const isExpanded = expandedTaskId === task.id;

                return (
                  <div key={task.id} className="bg-white shadow-[8px_8px_16px_rgba(13,27,53,0.05),-4px_-4px_12px_rgba(255,255,255,0.9)] rounded-xl overflow-hidden border-t-2 border-transparent" style={{ borderTopColor: task.status === 'ACTIVE' ? '#22c55e' : task.status === 'PAUSED' ? '#eab308' : task.status === 'COMPLETED' ? '#B8860B' : 'transparent' }}>
                    <div className="p-stack-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-headline-md text-headline-md text-on-surface truncate">{task.title}</h3>
                            <span className={`font-label-caps text-label-caps px-2 py-0.5 rounded-full shrink-0 ${getStatusColor(task.status)}`}>{task.status}</span>
                          </div>
                          <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">{task.description}</p>
                        </div>
                      </div>

                      <div className="bg-surface-container-low shadow-[inset_2px_2px_4px_rgba(13,27,53,0.04)] rounded-xl p-stack-md mb-stack-md">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="font-label-caps text-label-caps text-on-surface-muted uppercase text-[10px]">Participants</p>
                            <p className="font-data-md text-data-md text-on-surface">{task.currentParticipants} / {task.participantThreshold}</p>
                          </div>
                          <div>
                            <p className="font-label-caps text-label-caps text-on-surface-muted uppercase text-[10px]">Budget Used</p>
                            <p className="font-data-md text-data-md text-on-surface">{(task.totalBudget - remainingBudget).toLocaleString()} / {task.totalBudget.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="font-label-caps text-label-caps text-on-surface-muted uppercase text-[10px]">Remaining</p>
                            <p className="font-data-md text-data-md text-success">{remainingBudget.toLocaleString()} CMP</p>
                          </div>
                          <div>
                            <p className="font-label-caps text-label-caps text-on-surface-muted uppercase text-[10px]">Type</p>
                            <p className="font-data-md text-data-md text-on-surface capitalize">{task.type?.replace?.(/_/g, ' ') || task.type}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mb-stack-md">
                        <div className="flex justify-between mb-1">
                          <span className="font-body-sm text-body-sm text-on-surface-variant">Progress</span>
                          <span className="font-body-sm text-body-sm text-gold-metallic font-semibold">{progressPercent}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-surface-container-high shadow-[inset_2px_2px_4px_rgba(13,27,53,0.08)] rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-gold-metallic to-gold-light rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-outline-variant/20">
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          {new Date(task.createdAt).toLocaleDateString()}
                          {task.expiresAt && ` · ${new Date(task.expiresAt).toLocaleDateString()}`}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="font-data-md text-data-md text-gold-metallic">{task.coinPerParticipant.toLocaleString()} CMP</span>
                          <span className="text-on-surface-variant text-[10px] font-label-caps">each</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-stack-md">
                        {(task.status === 'PENDING' || task.status === 'ACTIVE' || task.status === 'PAUSED') && (
                          <button
                            onClick={() => handleToggleStatus(task.id, task.status)}
                            disabled={toggleTask.isPending}
                            className={`flex-1 py-3 rounded-xl font-body-md text-body-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 ${
                              task.status === 'ACTIVE'
                                ? 'bg-surface-container-high text-on-surface-variant shadow-neu-flat'
                                : 'bg-success text-white shadow-md'
                            }`}
                          >
                            <span className="material-symbols-outlined text-sm">{task.status === 'ACTIVE' ? 'pause' : 'play_arrow'}</span>
                            <span>{toggleTask.isPending && toggleTask.variables?.id === task.id ? 'Processing...' : task.status === 'ACTIVE' ? 'Pause' : 'Activate'}</span>
                          </button>
                        )}
                        {task.status === 'ACTIVE' && (
                          <button
                            onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                            className="flex-1 py-3 rounded-xl font-body-md text-body-md bg-gold-metallic/10 text-gold-deep shadow-neu-flat transition-all active:scale-95 flex items-center justify-center gap-2"
                          >
                            <span className="material-symbols-outlined text-sm">{isExpanded ? 'expand_less' : 'people'}</span>
                            <span>{isExpanded ? 'Hide' : 'Review'}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-stack-lg pb-stack-lg border-t border-outline-variant/20">
                        <h4 className="font-headline-md text-headline-md text-on-surface mt-4 mb-3">Submissions</h4>
                        <MobileCompletionReview taskId={task.id} />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>

      {/* ==================== DESKTOP/TABLET LAYOUT ==================== */}
      <div className="hidden md:block">
        <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 w-full">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-primary">My Posted Tasks</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">Manage and track your custom tasks</p>
            </div>
            <Link href="/tasks/post" className="bg-[#B8860B] text-primary font-body-md text-body-md px-6 py-3 rounded-lg hover:bg-[#8B6914] transition-colors flex items-center gap-2">
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
                <p className="font-body-md text-body-md text-on-surface-variant mb-6">Create your first task to start engaging users</p>
                <Link href="/tasks/post" className="inline-flex items-center gap-2 bg-[#B8860B] text-primary font-body-md text-body-md px-6 py-3 rounded-lg hover:bg-[#8B6914] transition-colors">
                  <span className="material-symbols-outlined">add</span>
                  <span>Post Your First Task</span>
                </Link>
              </div>
            ) : (
              tasks.map((task: any) => {
                const progressPercent = Math.min(100, Math.round((task.currentParticipants / task.participantThreshold) * 100));
                const remainingBudget = task.totalBudget - (task.currentParticipants * task.coinPerParticipant);
                const isExpanded = expandedTaskId === task.id;

                return (
                  <div key={task.id} className="bg-surface-alt rounded-xl border border-outline-variant/30 hover:border-outline-variant/50 transition-colors overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-h3 text-h3 text-on-surface">{task.title}</h3>
                            <span className={`font-label-caps text-label-caps px-3 py-1 rounded-full ${getStatusColor(task.status)}`}>{task.status}</span>
                          </div>
                          <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">{task.description}</p>
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
                          <div className="h-full bg-gradient-to-r from-[#B8860B] to-secondary rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20">
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Created {new Date(task.createdAt).toLocaleDateString()}
                          {task.expiresAt && ` · Expires ${new Date(task.expiresAt).toLocaleDateString()}`}
                        </p>
                        <div className="flex gap-3">
                          {(task.status === 'PENDING' || task.status === 'ACTIVE' || task.status === 'PAUSED') && (
                            <button
                              onClick={() => handleToggleStatus(task.id, task.status)}
                              disabled={toggleTask.isPending}
                              className={`${task.status === 'ACTIVE' ? 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest' : 'bg-success-verified text-white hover:bg-success-verified/90'} font-body-md text-body-md px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2`}
                            >
                              <span className="material-symbols-outlined text-sm">{task.status === 'ACTIVE' ? 'pause' : 'play_arrow'}</span>
                              <span>{toggleTask.isPending && toggleTask.variables?.id === task.id ? 'Processing...' : task.status === 'ACTIVE' ? 'Pause' : 'Activate'}</span>
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
      </div>
    </>
  );
}
