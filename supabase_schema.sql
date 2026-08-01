-- PIXEL Community - Supabase Database Schema & RLS Security Rules

-- 1. Profiles Table with Role Based Access Control
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('founder', 'admin', 'lead', 'instructor_uiux', 'media', 'hr', 'student')),
  team_title TEXT DEFAULT 'طالب شغوف',
  avatar_url TEXT,
  camp_name TEXT DEFAULT 'Pixel Camp - Round 1',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins and Founders can update any profile role or team_title"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('founder', 'admin')
    )
  );

-- 2. Camps & Rounds Table
CREATE TABLE IF NOT EXISTS public.camps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.camps (name, description)
VALUES ('Pixel Camp - Round 1', 'المعسكر التدريبي المكثف لدفعة التصميم وتجربة المستخدم الأولى')
ON CONFLICT (name) DO NOTHING;

-- 3. User Progress Table
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  topic_id TEXT NOT NULL,
  track_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  score INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, topic_id)
);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own progress"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('founder', 'admin', 'lead', 'instructor_uiux')
  ));

CREATE POLICY "Users can update or insert their own progress"
  ON public.user_progress FOR ALL
  USING (auth.uid() = user_id);

-- 4. Quiz Submissions Table
CREATE TABLE IF NOT EXISTS public.quiz_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  topic_id TEXT NOT NULL,
  score INT NOT NULL,
  total_questions INT NOT NULL,
  passed BOOLEAN NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.quiz_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own quiz submissions or admins view all"
  ON public.quiz_submissions FOR SELECT
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('founder', 'admin', 'lead', 'instructor_uiux')
  ));

CREATE POLICY "Users can submit their own quiz"
  ON public.quiz_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 5. Achievements Table
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  badge_title TEXT NOT NULL,
  badge_icon TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view achievements"
  ON public.achievements FOR SELECT
  USING (true);

CREATE POLICY "Users can unlock achievements"
  ON public.achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);
