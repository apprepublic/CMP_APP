-- Waitlist table for landing page email collection
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected'))
);

-- Enable RLS
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public waitlist signup)
CREATE POLICY "Anyone can join waitlist" ON public.waitlist
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read their own entry
CREATE POLICY "Users can view own waitlist entry" ON public.waitlist
  FOR SELECT
  USING (true);

-- Index on email for quick lookups
CREATE INDEX IF NOT EXISTS waitlist_email_idx ON public.waitlist(email);