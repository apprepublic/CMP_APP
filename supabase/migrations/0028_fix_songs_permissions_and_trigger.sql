-- Fix trigger function to run as SECURITY DEFINER so it has permission to update the songs table
-- Also grant basic permissions on the songs table so users can select/insert if needed

CREATE OR REPLACE FUNCTION public.sync_posted_task_song_publish()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.song_id IS NOT NULL THEN
    IF NEW.status = 'ACTIVE' AND NEW.is_active = true THEN
      UPDATE public.songs SET is_published = true WHERE id = NEW.song_id;
    ELSE
      UPDATE public.songs SET is_published = false WHERE id = NEW.song_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions to authenticated users for songs
GRANT SELECT, INSERT, UPDATE ON public.songs TO authenticated;
GRANT SELECT ON public.songs TO anon;
