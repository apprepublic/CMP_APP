-- Allow all authenticated users to view any user row.
-- This enables the artist page to display other users' name, avatar, etc.
-- The client-side query in getArtistBySlug selects only public columns
-- (id, full_name, avatar_url), so sensitive fields like email are
-- not sent to the browser even though RLS permits reading them.
CREATE POLICY "Authenticated users can view all profiles"
  ON public.users FOR SELECT
  USING (auth.role() = 'authenticated');
