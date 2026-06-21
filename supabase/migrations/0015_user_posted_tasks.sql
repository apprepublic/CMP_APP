-- ===========================================
-- USER POSTED TASKS TABLE
-- This table was referenced by the edge function
-- and frontend but never created in Supabase.
-- ===========================================

CREATE TABLE IF NOT EXISTS user_posted_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'USER_CREATED',
  participant_threshold INTEGER NOT NULL DEFAULT 100,
  total_budget INTEGER NOT NULL,
  coin_per_participant INTEGER NOT NULL,
  creation_fee INTEGER NOT NULL DEFAULT 500,
  status TEXT NOT NULL DEFAULT 'PENDING',
  current_participants INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT false,
  social_requirements JSONB,
  audio_url TEXT,
  cover_image_url TEXT,
  genre TEXT,
  duration_seconds INTEGER,
  is_download_enabled BOOLEAN NOT NULL DEFAULT false,
  song_id UUID,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_posted_tasks_creator ON user_posted_tasks(creator_id);
CREATE INDEX IF NOT EXISTS idx_user_posted_tasks_status ON user_posted_tasks(status);
CREATE INDEX IF NOT EXISTS idx_user_posted_tasks_active ON user_posted_tasks(is_active);
CREATE INDEX IF NOT EXISTS idx_user_posted_tasks_type ON user_posted_tasks(type);

-- ===========================================
-- USER TASK COMPLETIONS TABLE
-- Tracks who completed which posted task
-- ===========================================

CREATE TABLE IF NOT EXISTS user_task_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  posted_task_id UUID NOT NULL REFERENCES user_posted_tasks(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  coins_earned INTEGER NOT NULL,
  proof_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_task_completions_user_task ON user_task_completions(user_id, posted_task_id);
CREATE INDEX IF NOT EXISTS idx_user_task_completions_user ON user_task_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_task_completions_task ON user_task_completions(posted_task_id);

-- ===========================================
-- ROW LEVEL SECURITY
-- ===========================================

ALTER TABLE user_posted_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_task_completions ENABLE ROW LEVEL SECURITY;

-- user_posted_tasks: creators can CRUD their own, everyone can read active ones
CREATE POLICY "Users can view own posted tasks"
  ON user_posted_tasks FOR SELECT
  USING (auth.uid() = creator_id);

CREATE POLICY "Anyone can view active posted tasks"
  ON user_posted_tasks FOR SELECT
  USING (is_active = true AND status = 'ACTIVE');

CREATE POLICY "Users can insert own posted tasks"
  ON user_posted_tasks FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update own posted tasks"
  ON user_posted_tasks FOR UPDATE
  USING (auth.uid() = creator_id);

-- user_task_completions: users can read/insert own completions
CREATE POLICY "Users can view own task completions"
  ON user_task_completions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own task completions"
  ON user_task_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own task completions"
  ON user_task_completions FOR UPDATE
  USING (auth.uid() = user_id);

-- ===========================================
-- TRIGGERS
-- ===========================================

CREATE TRIGGER update_user_posted_tasks_updated_at
  BEFORE UPDATE ON user_posted_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant service_role full access
GRANT ALL ON user_posted_tasks TO service_role;
GRANT ALL ON user_task_completions TO service_role;

-- Grant anon and authenticated roles
GRANT SELECT ON user_posted_tasks TO anon;
GRANT SELECT ON user_posted_tasks TO authenticated;
GRANT INSERT ON user_posted_tasks TO authenticated;
GRANT UPDATE ON user_posted_tasks TO authenticated;
GRANT SELECT ON user_task_completions TO authenticated;
GRANT INSERT ON user_task_completions TO authenticated;
