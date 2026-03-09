-- =============================================
-- Neo-Coaching - Migration initiale
-- Exécuter dans Supabase SQL Editor
-- =============================================

-- 1. Types enum personnalisés
CREATE TYPE user_role AS ENUM ('admin', 'dirigeant', 'salarie', 'coachee', 'intervenant');
CREATE TYPE coaching_type AS ENUM ('individuel', 'entreprise');
CREATE TYPE profile_status AS ENUM ('active', 'inactive', 'archived');
CREATE TYPE mission_status AS ENUM ('active', 'completed', 'paused');
CREATE TYPE module_parcours_type AS ENUM ('individuel', 'entreprise', 'les_deux');
CREATE TYPE module_progress_status AS ENUM ('not_started', 'in_progress', 'submitted', 'validated', 'failed');
CREATE TYPE appointment_type AS ENUM ('discovery', 'coaching', 'module_review', 'intervenant');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');
CREATE TYPE payment_type AS ENUM ('module', 'intervenant_session');
CREATE TYPE payment_status AS ENUM ('pending', 'succeeded', 'failed', 'refunded');
CREATE TYPE task_status AS ENUM ('pending', 'completed');
CREATE TYPE completion_speed AS ENUM ('same_day', 'next_day', 'on_time', 'late', 'not_done');
CREATE TYPE group_type AS ENUM ('entreprise', 'coaching_individuel', 'general');
CREATE TYPE notification_type AS ENUM ('module_complete', 'module_reminder', 'kpi_alert', 'message', 'rdv_reminder', 'task_reminder');

-- 2. Table: profiles (liée à auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'coachee',
  company_id UUID,
  coaching_type coaching_type,
  status profile_status NOT NULL DEFAULT 'active',
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Table: companies
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  mission_start_date DATE,
  mission_end_date DATE,
  mission_status mission_status NOT NULL DEFAULT 'active',
  kpi_objectives JSONB,
  dirigeant_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ajouter la FK company_id sur profiles maintenant que companies existe
ALTER TABLE profiles ADD CONSTRAINT fk_profiles_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL;

-- 4. Table: modules
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  content JSONB NOT NULL DEFAULT '{}',
  exercise JSONB,
  order_index INTEGER NOT NULL,
  parcours_type module_parcours_type NOT NULL,
  price_cents INTEGER NOT NULL DEFAULT 0,
  is_free BOOLEAN NOT NULL DEFAULT false,
  duration_minutes INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Table: module_progress
CREATE TABLE module_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  status module_progress_status NOT NULL DEFAULT 'not_started',
  started_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ,
  validated_at TIMESTAMPTZ,
  written_summary_url TEXT,
  audio_url TEXT,
  video_url TEXT,
  satisfaction_score SMALLINT CHECK (satisfaction_score BETWEEN 1 AND 10),
  certificate_url TEXT,
  coach_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, module_id)
);

-- 6. Table: kpi_scores
CREATE TABLE kpi_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  investissement SMALLINT NOT NULL DEFAULT 5 CHECK (investissement BETWEEN 0 AND 10),
  efficacite SMALLINT NOT NULL DEFAULT 5 CHECK (efficacite BETWEEN 0 AND 10),
  participation SMALLINT NOT NULL DEFAULT 5 CHECK (participation BETWEEN 0 AND 10),
  notes TEXT,
  scored_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Table: appointments
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  prospect_data JSONB,
  coach_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  datetime_start TIMESTAMPTZ NOT NULL,
  datetime_end TIMESTAMPTZ NOT NULL,
  type appointment_type NOT NULL,
  status appointment_status NOT NULL DEFAULT 'scheduled',
  zoom_link TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Table: booking_form_submissions
CREATE TABLE booking_form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  responses JSONB,
  step_reached SMALLINT NOT NULL DEFAULT 1,
  completed BOOLEAN NOT NULL DEFAULT false,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. Table: groups (communauté)
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type group_type NOT NULL,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. Table: group_members
CREATE TABLE group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- 11. Table: messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  attachment_url TEXT,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. Table: intervenants
CREATE TABLE intervenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  bio TEXT,
  video_url TEXT,
  hourly_rate_cents INTEGER NOT NULL DEFAULT 0,
  packages JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 13. Table: notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 14. Table: payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount_cents INTEGER NOT NULL,
  type payment_type NOT NULL,
  stripe_payment_id TEXT NOT NULL,
  status payment_status NOT NULL DEFAULT 'pending',
  module_id UUID REFERENCES modules(id) ON DELETE SET NULL,
  intervenant_id UUID REFERENCES intervenants(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 15. Table: tasks
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  due_date DATE,
  status task_status NOT NULL DEFAULT 'pending',
  completed_at TIMESTAMPTZ,
  completion_speed completion_speed,
  coach_rating SMALLINT CHECK (coach_rating BETWEEN 1 AND 10),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- INDEX pour les requêtes fréquentes
-- =============================================
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_company ON profiles(company_id);
CREATE INDEX idx_profiles_status ON profiles(status);
CREATE INDEX idx_module_progress_user ON module_progress(user_id);
CREATE INDEX idx_module_progress_module ON module_progress(module_id);
CREATE INDEX idx_kpi_scores_user ON kpi_scores(user_id);
CREATE INDEX idx_kpi_scores_scored_at ON kpi_scores(scored_at);
CREATE INDEX idx_appointments_coach ON appointments(coach_id);
CREATE INDEX idx_appointments_client ON appointments(client_id);
CREATE INDEX idx_appointments_datetime ON appointments(datetime_start);
CREATE INDEX idx_messages_group ON messages(group_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, is_read);
CREATE INDEX idx_tasks_user ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);

-- =============================================
-- TRIGGER: auto-update updated_at sur profiles
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- TRIGGER: créer un profil automatiquement à l'inscription
-- =============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'coachee')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================
-- RLS (Row Level Security)
-- =============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE intervenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Helper: vérifier si l'utilisateur est admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- PROFILES: chacun voit son profil, admin voit tout
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admin can view all profiles" ON profiles
  FOR SELECT USING (is_admin());
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin can update all profiles" ON profiles
  FOR ALL USING (is_admin());

-- COMPANIES: dirigeant voit sa company, admin voit tout
CREATE POLICY "Dirigeant can view own company" ON companies
  FOR SELECT USING (
    dirigeant_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND company_id = companies.id)
  );
CREATE POLICY "Admin full access companies" ON companies
  FOR ALL USING (is_admin());

-- MODULES: tout le monde peut lire
CREATE POLICY "Anyone can view modules" ON modules
  FOR SELECT USING (true);
CREATE POLICY "Admin can manage modules" ON modules
  FOR ALL USING (is_admin());

-- MODULE_PROGRESS: user voit le sien, admin voit tout
CREATE POLICY "Users can view own progress" ON module_progress
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON module_progress
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admin full access progress" ON module_progress
  FOR ALL USING (is_admin());

-- KPI_SCORES: user voit le sien, dirigeant voit sa company, admin voit tout
CREATE POLICY "Users can view own kpis" ON kpi_scores
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Dirigeant can view company kpis" ON kpi_scores
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = kpi_scores.company_id
      AND companies.dirigeant_id = auth.uid()
    )
  );
CREATE POLICY "Admin full access kpis" ON kpi_scores
  FOR ALL USING (is_admin());

-- APPOINTMENTS: participants voient leurs rdv, admin voit tout
CREATE POLICY "Users can view own appointments" ON appointments
  FOR SELECT USING (auth.uid() = client_id OR auth.uid() = coach_id);
CREATE POLICY "Admin full access appointments" ON appointments
  FOR ALL USING (is_admin());

-- BOOKING: admin uniquement
CREATE POLICY "Admin full access bookings" ON booking_form_submissions
  FOR ALL USING (is_admin());
CREATE POLICY "Anyone can insert booking" ON booking_form_submissions
  FOR INSERT WITH CHECK (true);

-- GROUPS: membres peuvent voir
CREATE POLICY "Members can view groups" ON groups
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM group_members WHERE group_members.group_id = groups.id AND group_members.user_id = auth.uid())
    OR created_by = auth.uid()
  );
CREATE POLICY "Admin full access groups" ON groups
  FOR ALL USING (is_admin());

-- GROUP_MEMBERS: membres voient les membres
CREATE POLICY "Members can view group members" ON group_members
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM group_members gm WHERE gm.group_id = group_members.group_id AND gm.user_id = auth.uid())
  );
CREATE POLICY "Admin full access group members" ON group_members
  FOR ALL USING (is_admin());

-- MESSAGES: participants voient les messages
CREATE POLICY "Users can view messages in their groups" ON messages
  FOR SELECT USING (
    sender_id = auth.uid()
    OR recipient_id = auth.uid()
    OR EXISTS (SELECT 1 FROM group_members WHERE group_members.group_id = messages.group_id AND group_members.user_id = auth.uid())
  );
CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Admin full access messages" ON messages
  FOR ALL USING (is_admin());

-- INTERVENANTS: lecture publique
CREATE POLICY "Anyone can view active intervenants" ON intervenants
  FOR SELECT USING (is_active = true);
CREATE POLICY "Admin full access intervenants" ON intervenants
  FOR ALL USING (is_admin());

-- NOTIFICATIONS: user voit les siennes
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admin full access notifications" ON notifications
  FOR ALL USING (is_admin());

-- PAYMENTS: user voit les siens, admin voit tout
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admin full access payments" ON payments
  FOR ALL USING (is_admin());

-- TASKS: user voit les siennes, admin voit tout
CREATE POLICY "Users can view own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own tasks" ON tasks
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admin full access tasks" ON tasks
  FOR ALL USING (is_admin());

-- =============================================
-- STORAGE: bucket pour les fichiers
-- =============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('livrables', 'livrables', false)
ON CONFLICT DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('certificates', 'certificates', false)
ON CONFLICT DO NOTHING;

-- Storage policies
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can upload livrables" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'livrables' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can view own livrables" ON storage.objects
  FOR SELECT USING (bucket_id = 'livrables' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Admin can view all livrables" ON storage.objects
  FOR SELECT USING (bucket_id = 'livrables' AND is_admin());

CREATE POLICY "Users can view own certificates" ON storage.objects
  FOR SELECT USING (bucket_id = 'certificates' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Admin can manage certificates" ON storage.objects
  FOR ALL USING (bucket_id = 'certificates' AND is_admin());
