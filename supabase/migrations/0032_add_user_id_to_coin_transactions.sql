-- Migration 0032: Add user_id column to coin_transactions with foreign key and index

-- Add the column if it does not exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'coin_transactions'
      AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.coin_transactions
      ADD COLUMN user_id uuid NOT NULL;
    -- Add foreign key constraint to auth.users
    ALTER TABLE public.coin_transactions
      ADD CONSTRAINT coin_transactions_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    -- Create index for performance
    CREATE INDEX IF NOT EXISTS idx_coin_transactions_user_id ON public.coin_transactions(user_id);
  END IF;
END $$;

-- Enable RLS if not already
ALTER TABLE public.coin_transactions ENABLE ROW LEVEL SECURITY;
