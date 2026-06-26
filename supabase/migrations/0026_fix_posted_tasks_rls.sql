-- Fix RLS policies for user_task_completions to allow task creators to view and update them

-- Allow task creators to view completions for their tasks
CREATE POLICY "Task creators can view completions"
  ON user_task_completions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_posted_tasks
      WHERE user_posted_tasks.id = user_task_completions.posted_task_id
      AND user_posted_tasks.creator_id = auth.uid()
    )
  );

-- Allow task creators to update completions for their tasks (needed for approve/reject)
CREATE POLICY "Task creators can update completions"
  ON user_task_completions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_posted_tasks
      WHERE user_posted_tasks.id = user_task_completions.posted_task_id
      AND user_posted_tasks.creator_id = auth.uid()
    )
  );
