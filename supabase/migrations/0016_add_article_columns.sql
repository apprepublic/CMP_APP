-- Add coin_reward column to articles if not exists
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'articles' AND column_name = 'coin_reward'
  ) THEN
    ALTER TABLE articles ADD COLUMN coin_reward INTEGER NOT NULL DEFAULT 50;
  END IF;
END $$;

-- Add linked_task_id column to articles if not exists
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'articles' AND column_name = 'linked_task_id'
  ) THEN
    ALTER TABLE articles ADD COLUMN linked_task_id UUID REFERENCES tasks(id);
    CREATE INDEX IF NOT EXISTS idx_articles_linked_task ON articles(linked_task_id);
  END IF;
END $$;

-- Update existing articles with default coin_reward
UPDATE articles SET coin_reward = 50 WHERE coin_reward IS NULL;