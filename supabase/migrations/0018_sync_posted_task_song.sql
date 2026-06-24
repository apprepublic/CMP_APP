-- ===========================================
-- SYNC POSTED TASK SONG PUBLISH STATUS
-- Trigger to automatically publish/unpublish a song
-- when its associated user task status changes.
-- ===========================================

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

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_user_posted_task_status_change ON public.user_posted_tasks;

-- Create trigger
CREATE TRIGGER on_user_posted_task_status_change
  AFTER INSERT OR UPDATE ON public.user_posted_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_posted_task_song_publish();
