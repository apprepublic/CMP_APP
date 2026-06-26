ALTER TABLE public.user_posted_tasks ADD COLUMN IF NOT EXISTS vote_requirements jsonb DEFAULT NULL;
