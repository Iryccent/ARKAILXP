-- ============================================
-- ARKAI LXP - DATABASE SCHEMA (Safe Migration)
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. DROP EXISTING USERS TABLE IF IT EXISTS WITH WRONG SCHEMA
-- ============================================
DROP TABLE IF EXISTS public.users CASCADE;

-- ============================================
-- 2. CREATE USERS TABLE (LXP Users)
-- ============================================
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  asl_level INTEGER DEFAULT 1 CHECK (asl_level BETWEEN 1 AND 4),
  role TEXT DEFAULT 'User' CHECK (role IN ('User', 'Manager')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_auth_id ON public.users(auth_user_id);

-- ============================================
-- 3. COURSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  structured_content TEXT,
  image_url TEXT,
  quiz JSONB,
  quiz_level TEXT DEFAULT 'initial' CHECK (quiz_level IN ('initial', 'advanced', 'pro')),
  due_date DATE,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_courses_created_by ON public.courses(created_by);

-- ============================================
-- 4. COURSE ASSIGNMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.course_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  status TEXT DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'completed')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_assignments_user ON public.course_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_assignments_course ON public.course_assignments(course_id);
CREATE INDEX IF NOT EXISTS idx_assignments_status ON public.course_assignments(status);

-- ============================================
-- 5. QUIZ ATTEMPTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  assignment_id UUID REFERENCES public.course_assignments(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  percentage DECIMAL(5,2) GENERATED ALWAYS AS ((score::DECIMAL / total_questions::DECIMAL) * 100) STORED,
  answers JSONB,
  time_taken_seconds INTEGER,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON public.quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_course ON public.quiz_attempts(course_id);

-- ============================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- USERS POLICIES
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = auth_user_id);

DROP POLICY IF EXISTS "Managers can view all users" ON public.users;
CREATE POLICY "Managers can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND role IN ('Manager', 'admin')
    )
  );

DROP POLICY IF EXISTS "Managers can create users" ON public.users;
CREATE POLICY "Managers can create users" ON public.users
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND role IN ('Manager', 'admin')
    )
  );

DROP POLICY IF EXISTS "Managers can update users" ON public.users;
CREATE POLICY "Managers can update users" ON public.users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND role IN ('Manager', 'admin')
    )
  );

DROP POLICY IF EXISTS "Managers can delete users" ON public.users;
CREATE POLICY "Managers can delete users" ON public.users
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND role IN ('Manager', 'admin')
    )
  );

-- COURSES POLICIES
DROP POLICY IF EXISTS "Authenticated users can view courses" ON public.courses;
CREATE POLICY "Authenticated users can view courses" ON public.courses
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Managers can create courses" ON public.courses;
CREATE POLICY "Managers can create courses" ON public.courses
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND role IN ('Manager', 'admin')
    )
  );

DROP POLICY IF EXISTS "Managers can update courses" ON public.courses;
CREATE POLICY "Managers can update courses" ON public.courses
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND role IN ('Manager', 'admin')
    )
  );

DROP POLICY IF EXISTS "Managers can delete courses" ON public.courses;
CREATE POLICY "Managers can delete courses" ON public.courses
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND role IN ('Manager', 'admin')
    )
  );

-- COURSE ASSIGNMENTS POLICIES
DROP POLICY IF EXISTS "Users can view own assignments" ON public.course_assignments;
CREATE POLICY "Users can view own assignments" ON public.course_assignments
  FOR SELECT USING (
    user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Managers can view all assignments" ON public.course_assignments;
CREATE POLICY "Managers can view all assignments" ON public.course_assignments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND role IN ('Manager', 'admin')
    )
  );

DROP POLICY IF EXISTS "Managers can create assignments" ON public.course_assignments;
CREATE POLICY "Managers can create assignments" ON public.course_assignments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND role IN ('Manager', 'admin')
    )
  );

DROP POLICY IF EXISTS "Users can update own assignment progress" ON public.course_assignments;
CREATE POLICY "Users can update own assignment progress" ON public.course_assignments
  FOR UPDATE USING (
    user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Managers can update all assignments" ON public.course_assignments;
CREATE POLICY "Managers can update all assignments" ON public.course_assignments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND role IN ('Manager', 'admin')
    )
  );

DROP POLICY IF EXISTS "Managers can delete assignments" ON public.course_assignments;
CREATE POLICY "Managers can delete assignments" ON public.course_assignments
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND role IN ('Manager', 'admin')
    )
  );

-- QUIZ ATTEMPTS POLICIES
DROP POLICY IF EXISTS "Users can view own quiz attempts" ON public.quiz_attempts;
CREATE POLICY "Users can view own quiz attempts" ON public.quiz_attempts
  FOR SELECT USING (
    user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Managers can view all quiz attempts" ON public.quiz_attempts;
CREATE POLICY "Managers can view all quiz attempts" ON public.quiz_attempts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND role IN ('Manager', 'admin')
    )
  );

DROP POLICY IF EXISTS "Users can submit quiz attempts" ON public.quiz_attempts;
CREATE POLICY "Users can submit quiz attempts" ON public.quiz_attempts
  FOR INSERT WITH CHECK (
    user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
  );

-- ============================================
-- 7. FUNCTIONS & TRIGGERS
-- ============================================

DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_courses_updated_at ON public.courses;
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 8. USEFUL VIEWS
-- ============================================

DROP VIEW IF EXISTS user_course_dashboard;
CREATE OR REPLACE VIEW user_course_dashboard AS
SELECT 
  u.id as user_id,
  u.name as user_name,
  u.email,
  u.asl_level,
  c.id as course_id,
  c.title as course_title,
  c.image_url,
  ca.progress,
  ca.status,
  ca.assigned_at,
  ca.started_at,
  ca.completed_at
FROM public.users u
LEFT JOIN public.course_assignments ca ON u.id = ca.user_id
LEFT JOIN public.courses c ON ca.course_id = c.id;

-- ============================================
-- END OF MIGRATION
-- ============================================

