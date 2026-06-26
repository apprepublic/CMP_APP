-- Grant UPDATE permission on user_task_completions to authenticated users
-- This is required so task creators can approve/reject completions (which updates the status)

GRANT UPDATE ON user_task_completions TO authenticated;
