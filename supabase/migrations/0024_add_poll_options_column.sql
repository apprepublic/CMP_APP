ALTER TABLE public.user_posted_tasks ADD COLUMN IF NOT EXISTS poll_options jsonb DEFAULT NULL;
