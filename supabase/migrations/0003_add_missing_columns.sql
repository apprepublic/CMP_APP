-- Add missing columns to existing tables

-- Add referral_code to wallets if not exists
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wallets' AND column_name = 'referral_code'
  ) THEN
    ALTER TABLE wallets ADD COLUMN referral_code TEXT UNIQUE NOT NULL DEFAULT CONCAT('REF', UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6)));
    CREATE UNIQUE INDEX idx_wallets_referral_code ON wallets(referral_code);
  END IF;
END $$;

-- Add lifetime_earned and lifetime_spent to wallets if not exists
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wallets' AND column_name = 'lifetime_earned'
  ) THEN
    ALTER TABLE wallets ADD COLUMN lifetime_earned BIGINT NOT NULL DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wallets' AND column_name = 'lifetime_spent'
  ) THEN
    ALTER TABLE wallets ADD COLUMN lifetime_spent BIGINT NOT NULL DEFAULT 0;
  END IF;
END $$;

-- Ensure coin_balance is TEXT type (for big numbers)
DO $$ 
BEGIN 
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wallets' AND column_name = 'coin_balance' AND data_type = 'bigint'
  ) THEN
    ALTER TABLE wallets ALTER COLUMN coin_balance TYPE TEXT USING coin_balance::TEXT;
  END IF;
END $$;