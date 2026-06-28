/*
  Migration: add RLS policies for frontend tables
*/

-- Enable row level security on tables that need it
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Wallets: users can SELECT their own wallet row only
CREATE POLICY "Allow wallet select for owner"
  ON public.wallets
  FOR SELECT
  USING (auth.uid() = user_id);

-- Notifications: users can SELECT only their own notifications
CREATE POLICY "Allow notifications select for owner"
  ON public.notifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Ensure the policies are active
ALTER TABLE public.wallets FORCE ROW LEVEL SECURITY;
ALTER TABLE public.notifications FORCE ROW LEVEL SECURITY;

-- Grant the anon and authenticated roles SELECT on the tables
GRANT SELECT ON public.wallets TO anon, authenticated;
GRANT SELECT ON public.notifications TO anon, authenticated;
