-- ============================================
-- CMP App - Production Database Migration
-- Run this in Supabase SQL Editor
-- Fixed for Supabase auth schema
-- ============================================

-- ============================================
-- MIGRATION 1: Add slug to Articles
-- ============================================
ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "slug" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "articles_slug_key" ON "articles"("slug");

-- ============================================
-- MIGRATION 2: Add category and sortOrder to tasks
-- ============================================
ALTER TABLE "tasks" ADD COLUMN IF NOT EXISTS "category" TEXT DEFAULT 'ENGAGEMENT';
ALTER TABLE "tasks" ADD COLUMN IF NOT EXISTS "sort_order" INTEGER DEFAULT 0;

-- ============================================
-- MIGRATION 3: Make task_id optional in task_completions
-- ============================================
ALTER TABLE "task_completions" ALTER COLUMN "task_id" DROP NOT NULL;

-- ============================================
-- MIGRATION 4: Create user_posted_tasks table
-- ============================================
CREATE TABLE IF NOT EXISTS "user_posted_tasks" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "creator_id" UUID NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "category" TEXT DEFAULT 'USER_CREATED',
  "participant_threshold" INTEGER DEFAULT 100,
  "total_budget" INTEGER NOT NULL,
  "coin_per_participant" INTEGER NOT NULL,
  "creation_fee" INTEGER DEFAULT 500,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "current_participants" INTEGER DEFAULT 0,
  "is_active" BOOLEAN DEFAULT false,
  "expires_at" TIMESTAMPTZ,
  "created_at" TIMESTAMPTZ DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ DEFAULT NOW(),
  "social_requirements" JSONB
);

-- ============================================
-- MIGRATION 5: Create user_task_completions table
-- ============================================
CREATE TABLE IF NOT EXISTS "user_task_completions" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL,
  "posted_task_id" UUID NOT NULL REFERENCES "user_posted_tasks"("id") ON DELETE CASCADE,
  "completed_at" TIMESTAMPTZ DEFAULT NOW(),
  "coins_earned" INTEGER NOT NULL,
  "proof_data" JSONB,
  CONSTRAINT "user_task_completions_user_id_posted_task_id_key" UNIQUE ("user_id", "posted_task_id")
);

-- ============================================
-- MIGRATION 6: Create indexes
-- ============================================
CREATE INDEX IF NOT EXISTS "user_posted_tasks_creator_id_idx" ON "user_posted_tasks"("creator_id");
CREATE INDEX IF NOT EXISTS "user_posted_tasks_status_idx" ON "user_posted_tasks"("status");
CREATE INDEX IF NOT EXISTS "user_posted_tasks_is_active_idx" ON "user_posted_tasks"("is_active");
CREATE INDEX IF NOT EXISTS "user_task_completions_user_id_idx" ON "user_task_completions"("user_id");
CREATE INDEX IF NOT EXISTS "user_task_completions_posted_task_id_idx" ON "user_task_completions"("posted_task_id");

-- ============================================
-- MIGRATION 7: Enable RLS (Row Level Security)
-- ============================================
ALTER TABLE "user_posted_tasks" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "user_task_completions" ENABLE ROW LEVEL SECURITY;

-- ============================================
-- MIGRATION 8: Create RLS Policies
-- ============================================

-- UserPostedTasks policies
CREATE POLICY "Users can view all active posted tasks"
  ON "user_posted_tasks"
  FOR SELECT
  USING ("is_active" = true OR "creator_id" = auth.uid());

CREATE POLICY "Users can create posted tasks"
  ON "user_posted_tasks"
  FOR INSERT
  WITH CHECK ("creator_id" = auth.uid());

CREATE POLICY "Users can update their own posted tasks"
  ON "user_posted_tasks"
  FOR UPDATE
  USING ("creator_id" = auth.uid());

CREATE POLICY "Users can delete their own posted tasks"
  ON "user_posted_tasks"
  FOR DELETE
  USING ("creator_id" = auth.uid());

-- UserTaskCompletions policies
CREATE POLICY "Users can view their own completions"
  ON "user_task_completions"
  FOR SELECT
  USING ("user_id" = auth.uid());

CREATE POLICY "Users can create their own completions"
  ON "user_task_completions"
  FOR INSERT
  WITH CHECK ("user_id" = auth.uid());

-- ============================================
-- Add foreign key to auth.users separately (optional)
-- This ensures the creator_id references valid users
-- ============================================
-- Note: Cross-schema FKs require special handling in Supabase
-- For now, we rely on RLS policies for data integrity
-- If you need explicit FK, run this as superuser:
-- ALTER TABLE "user_posted_tasks" 
--   ADD CONSTRAINT "user_posted_tasks_creator_id_fkey" 
--   FOREIGN KEY ("creator_id") REFERENCES auth.users("id");