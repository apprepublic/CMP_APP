-- Migration 0033: Add cover_image_url column to articles (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'articles'
      AND column_name = 'cover_image_url'
  ) THEN
    ALTER TABLE public.articles
      ADD COLUMN cover_image_url text;  -- allow NULL; change to NOT NULL DEFAULT '' if desired
  END IF;
END $$;
