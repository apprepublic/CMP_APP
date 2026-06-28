-- Fix Wallet table permissions for service_role
-- Wrapped in DO block so it skips gracefully on fresh projects where "Wallet" may not exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'Wallet') THEN
    GRANT ALL ON "Wallet" TO service_role;
    ALTER TABLE "Wallet" ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Service role has full access" ON "Wallet";
    CREATE POLICY "Service role has full access" ON "Wallet"
      FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;