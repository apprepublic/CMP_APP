-- Migration 0039: AI Article Agent — new tables, columns, and seed data
-- ===========================================
-- Part of the autonomous article generation pipeline
-- ===========================================

-- Enable pg_trgm for similarity-based deduplication
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ===========================================
-- ARTICLE GENERATION LOGS
-- Tracks every run of the agent for debugging
-- ===========================================
CREATE TABLE IF NOT EXISTS article_generation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  topic TEXT,
  status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'flagged_duplicate', 'flagged_quality')),
  article_id UUID REFERENCES articles(id),
  source_urls TEXT[],
  model_used TEXT,
  image_model_used TEXT,
  tokens_used INTEGER,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_article_gen_logs_status ON article_generation_logs(status);
CREATE INDEX IF NOT EXISTS idx_article_gen_logs_category ON article_generation_logs(category);
CREATE INDEX IF NOT EXISTS idx_article_gen_logs_created ON article_generation_logs(created_at);

-- ===========================================
-- ARTICLE CATEGORIES CONFIG
-- Controls which categories the agent writes for
-- ===========================================
CREATE TABLE IF NOT EXISTS article_categories_config (
  category TEXT PRIMARY KEY,
  daily_target INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_generated_at TIMESTAMPTZ
);

-- Seed categories (idempotent)
INSERT INTO article_categories_config (category, daily_target, is_active) VALUES
  ('Finance & Money Tips', 2, true),
  ('Tech & Gadgets', 1, true),
  ('Naija Trends & Entertainment', 1, true),
  ('Health & Wellness', 1, true),
  ('Career & Side Hustles', 1, true)
ON CONFLICT (category) DO NOTHING;

-- ===========================================
-- ADD COLUMNS TO ARTICLES TABLE
-- ===========================================

-- source_urls — provenance tracking for AI-generated articles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'articles'
      AND column_name = 'source_urls'
  ) THEN
    ALTER TABLE public.articles ADD COLUMN source_urls TEXT[];
  END IF;
END $$;

-- is_ai_generated — flag to distinguish AI vs human-written content
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'articles'
      AND column_name = 'is_ai_generated'
  ) THEN
    ALTER TABLE public.articles ADD COLUMN is_ai_generated BOOLEAN NOT NULL DEFAULT false;
  END IF;
END $$;

-- ===========================================
-- STORAGE BUCKET FOR ARTICLE COVERS
-- ===========================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'article-covers',
  'article-covers',
  true,
  5242880, -- 5MB
  ARRAY['image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to article covers
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'objects'
      AND schemaname = 'storage'
      AND policyname = 'Public Read Access for article-covers'
  ) THEN
    CREATE POLICY "Public Read Access for article-covers"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'article-covers');
  END IF;
END $$;

-- Allow service role to insert/update article covers
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'objects'
      AND schemaname = 'storage'
      AND policyname = 'Service Role Insert/Update for article-covers'
  ) THEN
    CREATE POLICY "Service Role Insert/Update for article-covers"
      ON storage.objects FOR INSERT
      WITH CHECK (bucket_id = 'article-covers');
  END IF;
END $$;

-- ===========================================
-- SYSTEM AUTHOR: CMP Editorial
-- Creates a user for the agent to use as author_id
-- NOTE: This user is NOT tied to Supabase Auth (no auth.uid() trigger)
-- It exists only in the public.users table for FK reference
-- ===========================================
DO $$
DECLARE
  existing_id UUID;
BEGIN
  SELECT id INTO existing_id FROM public.users WHERE email = 'editorial@cmpapp.ng';
  IF existing_id IS NULL THEN
    INSERT INTO public.users (id, email, full_name, is_active, created_at, updated_at)
    VALUES (
      gen_random_uuid(),
      'editorial@cmpapp.ng',
      'CMP Editorial',
      true,
      NOW(),
      NOW()
    );
  END IF;
END $$;