-- tracker_data: one row per user, full app state as JSONB
CREATE TABLE IF NOT EXISTS public.tracker_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT tracker_data_user_id_unique UNIQUE (user_id)
);
ALTER TABLE public.tracker_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own" ON public.tracker_data FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own" ON public.tracker_data FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own" ON public.tracker_data FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own" ON public.tracker_data FOR DELETE USING (auth.uid() = user_id);
CREATE OR REPLACE FUNCTION public.handle_updated_at() RETURNS trigger AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql;
CREATE TRIGGER tracker_data_updated_at BEFORE UPDATE ON public.tracker_data FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();