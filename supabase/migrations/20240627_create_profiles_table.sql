-- Migration: create profiles table if missing
DO $outer$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    CREATE TABLE public.profiles (
      id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      display_name text,
      avatar_url text,
      updated_at timestamptz DEFAULT now()
    );
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
    CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
    CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS trigger AS $func$
    BEGIN
      INSERT INTO public.profiles (id, display_name, avatar_url)
      VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url')
      ON CONFLICT (id) DO NOTHING;
      RETURN NEW;
    END;
    $func$ LANGUAGE plpgsql SECURITY DEFINER;
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $outer$;
