-- Fix wallets table permissions for service_role
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'wallets') THEN
    GRANT ALL ON wallets TO service_role;
    ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Service role has full access" ON wallets;
    CREATE POLICY "Service role has full access" ON wallets
      FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;