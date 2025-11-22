-- ESQUEMA DE BASE DE DATOS PARA ARKAI LXP (SUPABASE / POSTGRESQL)
-- Copia y pega todo este contenido en el "SQL Editor" de tu proyecto en Supabase.

-- ==========================================
-- 0. LIMPIEZA (CUIDADO: Borra datos existentes)
-- ==========================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS public.quiz_options CASCADE;
DROP TABLE IF EXISTS public.quiz_questions CASCADE;
DROP TABLE IF EXISTS public.quizzes CASCADE;
DROP TABLE IF EXISTS public.chat_histories CASCADE;
DROP TABLE IF EXISTS public.course_assignments CASCADE;
DROP TABLE IF EXISTS public.courses CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- ==========================================
-- 1. TABLA DE PERFILES (PROFILES)
-- ==========================================
-- Se sincroniza automáticamente con auth.users
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT CHECK (role IN ('Manager', 'User')) DEFAULT 'User',
  asl_level INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Seguridad (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Perfiles públicos visibles por todos"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Usuarios pueden insertar su propio perfil"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Usuarios pueden actualizar su propio perfil"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- ==========================================
-- 2. TABLA DE CURSOS (COURSES)
-- ==========================================
CREATE TABLE public.courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  structured_content TEXT, -- Contenido Markdown generado por IA
  image_url TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seguridad (RLS)
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cursos visibles por todos"
  ON courses FOR SELECT USING (true);

CREATE POLICY "Solo Managers pueden crear cursos"
  ON courses FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Manager')
  );

CREATE POLICY "Solo Managers pueden editar cursos"
  ON courses FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Manager')
  );

-- ==========================================
-- 3. ASIGNACIONES DE CURSOS (COURSE_ASSIGNMENTS)
-- ==========================================
CREATE TABLE public.course_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'in_progress', 'completed')) DEFAULT 'pending',
  due_date TIMESTAMPTZ,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, user_id)
);

-- Seguridad (RLS)
ALTER TABLE public.course_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios ven sus propias asignaciones"
  ON course_assignments FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Managers ven todas las asignaciones"
  ON course_assignments FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Manager')
  );

CREATE POLICY "Managers pueden asignar cursos"
  ON course_assignments FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Manager')
  );

CREATE POLICY "Usuarios actualizan estado de sus asignaciones"
  ON course_assignments FOR UPDATE USING (auth.uid() = user_id);

-- ==========================================
-- 4. HISTORIAL DE CHAT CON KAI (CHAT_HISTORIES)
-- ==========================================
-- Permite que Kai tenga "memoria" por curso y usuario
CREATE TABLE public.chat_histories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  messages JSONB DEFAULT '[]'::jsonb, -- Array de objetos {role, content}
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Seguridad (RLS)
ALTER TABLE public.chat_histories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios ven y editan su propio historial"
  ON chat_histories FOR ALL USING (auth.uid() = user_id);

-- ==========================================
-- 5. SISTEMA DE QUIZZES (RELACIONAL)
-- ==========================================

-- 5.1 Tabla Principal de Quizzes
CREATE TABLE public.quizzes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  creation_mode TEXT CHECK (creation_mode IN ('manual', 'ai')) DEFAULT 'manual',
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Quizzes visibles por todos (o restringir según lógica)"
  ON quizzes FOR SELECT USING (true);

CREATE POLICY "Managers pueden crear quizzes"
  ON quizzes FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Manager')
  );

-- 5.2 Tabla de Preguntas
CREATE TABLE public.quiz_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  order_index INT DEFAULT 0 -- Para mantener el orden de las preguntas
);

ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Preguntas visibles por todos" ON quiz_questions FOR SELECT USING (true);
CREATE POLICY "Managers gestionan preguntas" ON quiz_questions FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Manager')
);

-- 5.3 Tabla de Opciones
CREATE TABLE public.quiz_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT false,
  explanation TEXT -- Explicación opcional (útil para feedback educativo)
);

ALTER TABLE public.quiz_options ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Opciones visibles por todos" ON quiz_options FOR SELECT USING (true);
CREATE POLICY "Managers gestionan opciones" ON quiz_options FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Manager')
);

-- ==========================================
-- 6. AUTOMATIZACIÓN (TRIGGERS)
-- ==========================================

-- Función para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, asl_level)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'Usuario Nuevo'), 
    'User', 
    1
  );
  RETURN new;
END;
$$;

-- Trigger que se dispara cada vez que un usuario se crea en auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==========================================
-- FIN DEL SCRIPT
-- ==========================================
