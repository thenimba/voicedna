-- =========================================
-- profiles
-- =========================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  session_code TEXT NOT NULL UNIQUE,
  is_claimed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete their own profile"
  ON public.profiles FOR DELETE TO authenticated
  USING (auth.uid() = id);

-- Lookup by session_code (for restore-by-code flow) — done via a SECURITY DEFINER RPC, not direct SELECT
-- so we don't need a permissive policy on profiles.

-- =========================================
-- interview_sessions
-- =========================================
CREATE TABLE public.interview_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL DEFAULT '',
  mode TEXT NOT NULL DEFAULT 'quick-profile',
  status TEXT NOT NULL DEFAULT 'not_started',
  current_category_index INT NOT NULL DEFAULT 0,
  current_question_in_category INT NOT NULL DEFAULT 0,
  total_questions_answered INT NOT NULL DEFAULT 0,
  current_question TEXT NOT NULL DEFAULT '',
  is_follow_up BOOLEAN NOT NULL DEFAULT false,
  follow_up_count INT NOT NULL DEFAULT 0,
  qa_pairs JSONB NOT NULL DEFAULT '[]'::jsonb,
  draft_answer TEXT NOT NULL DEFAULT '',
  last_synced_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.interview_sessions TO authenticated;
GRANT ALL ON public.interview_sessions TO service_role;

ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own session"
  ON public.interview_sessions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own session"
  ON public.interview_sessions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own session"
  ON public.interview_sessions FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own session"
  ON public.interview_sessions FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- =========================================
-- updated_at trigger
-- =========================================
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER profiles_touch_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TRIGGER interview_sessions_touch_updated_at
  BEFORE UPDATE ON public.interview_sessions
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- =========================================
-- Session code generator (e.g. VD-7F3K-Q9XM)
-- =========================================
CREATE OR REPLACE FUNCTION public.generate_session_code()
RETURNS TEXT LANGUAGE plpgsql SET search_path = public AS $$
DECLARE
  alphabet TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- no 0/O/1/I
  code TEXT;
  i INT;
  attempt INT := 0;
BEGIN
  LOOP
    code := 'VD-';
    FOR i IN 1..4 LOOP
      code := code || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    END LOOP;
    code := code || '-';
    FOR i IN 1..4 LOOP
      code := code || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    END LOOP;
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.profiles WHERE session_code = code);
    attempt := attempt + 1;
    IF attempt > 10 THEN RAISE EXCEPTION 'Could not generate unique session code'; END IF;
  END LOOP;
  RETURN code;
END;
$$;

-- =========================================
-- Auto-create profile on signup (incl. anonymous)
-- =========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, session_code, is_claimed, display_name)
  VALUES (
    NEW.id,
    public.generate_session_code(),
    NEW.email IS NOT NULL,
    COALESCE(NEW.raw_user_meta_data->>'display_name', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================
-- Mark profile as claimed when email is added (anonymous -> claimed)
-- =========================================
CREATE OR REPLACE FUNCTION public.handle_user_email_update()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.email IS NOT NULL AND (OLD.email IS NULL OR OLD.email = '') THEN
    UPDATE public.profiles SET is_claimed = true WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_email_set
  AFTER UPDATE OF email ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_email_update();

-- =========================================
-- Restore-by-code RPC (returns the owning user_id for a session code)
-- Allows the client to discover that a code exists without exposing the profiles table.
-- Restoration still requires that user's auth session.
-- =========================================
CREATE OR REPLACE FUNCTION public.session_code_exists(_code TEXT)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE session_code = _code);
$$;

GRANT EXECUTE ON FUNCTION public.session_code_exists(TEXT) TO anon, authenticated;