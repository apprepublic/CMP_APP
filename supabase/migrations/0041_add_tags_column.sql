-- Migration 0041: Add tags column to articles table
-- The Prisma schema already defines tags, but the column was never added to the Supabase DB

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'articles'
      AND column_name = 'tags'
  ) THEN
    ALTER TABLE public.articles ADD COLUMN tags TEXT[] NOT NULL DEFAULT '{}';
  END IF;
END $$;
