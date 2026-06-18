-- Fix Wallet table permissions for service_role
-- Grant service_role full access to Wallet table
GRANT ALL ON "Wallet" TO service_role;

-- Enable RLS if not already enabled
ALTER TABLE "Wallet" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Service role has full access" ON "Wallet";

-- Create policy for service role to bypass RLS
CREATE POLICY "Service role has full access" ON "Wallet"
  FOR ALL
  USING (true)
  WITH CHECK (true);