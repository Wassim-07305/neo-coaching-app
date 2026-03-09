-- ============================================================================
-- Neo-Coaching App - Complete Database Migration
-- Run this file in Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- 1. ENUM TYPES
-- ============================================================================

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

-- ============================================================================
-- 2. TABLES
-- ============================================================================

-- Companies (created before profiles because profiles references companies)
CREATE TABLE companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text NULL,
  mission_start_date date NULL,
  mission_end_date date NULL,
  mission_status mission_status NOT NULL DEFAULT 'active',
  kpi_objectives jsonb NULL,
  dirigeant_id uuid NULL, -- FK added after profiles table is created
  notes text NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Profiles (extension of auth.users)
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text NULL,
  avatar_url text NULL,
  role user_role NOT NULL DEFAULT 'coachee',
  company_id uuid NULL REFERENCES companies(id) ON DELETE SET NULL,
  coaching_type coaching_type NULL,
  status profile_status NOT NULL DEFAULT 'active',
  onboarding_completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Add the deferred FK from companies.dirigeant_id -> profiles
ALTER TABLE companies
  ADD CONSTRAINT companies_dirigeant_id_fkey
  FOREIGN KEY (dirigeant_id) REFERENCES profiles(id) ON DELETE SET NULL;

-- Modules
CREATE TABLE modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NULL,
  content jsonb NOT NULL DEFAULT '{}',
  exercise jsonb NULL,
  order_index integer NOT NULL,
  parcours_type module_parcours_type NOT NULL,
  price_cents integer NOT NULL DEFAULT 0,
  is_free boolean NOT NULL DEFAULT false,
  duration_minutes integer NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Module Progress
CREATE TABLE module_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  module_id uuid NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  status module_progress_status NOT NULL DEFAULT 'not_started',
  started_at timestamptz NULL,
  submitted_at timestamptz NULL,
  validated_at timestamptz NULL,
  written_summary_url text NULL,
  audio_url text NULL,
  video_url text NULL,
  satisfaction_score integer NULL,
  certificate_url text NULL,
  coach_notes text NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- KPI Scores
CREATE TABLE kpi_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_id uuid NULL REFERENCES companies(id) ON DELETE SET NULL,
  investissement integer NOT NULL DEFAULT 0,
  efficacite integer NOT NULL DEFAULT 0,
  participation integer NOT NULL DEFAULT 0,
  notes text NULL,
  scored_at date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Appointments
CREATE TABLE appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NULL REFERENCES profiles(id) ON DELETE SET NULL,
  prospect_data jsonb NULL,
  coach_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  datetime_start timestamptz NOT NULL,
  datetime_end timestamptz NOT NULL,
  type appointment_type NOT NULL,
  status appointment_status NOT NULL DEFAULT 'scheduled',
  zoom_link text NULL,
  notes text NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Booking Form Submissions
CREATE TABLE booking_form_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NULL,
  last_name text NULL,
  email text NULL,
  phone text NULL,
  responses jsonb NULL,
  step_reached integer NOT NULL DEFAULT 1,
  completed boolean NOT NULL DEFAULT false,
  appointment_id uuid NULL REFERENCES appointments(id) ON DELETE SET NULL,
  source text NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Groups
CREATE TABLE groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type group_type NOT NULL,
  company_id uuid NULL REFERENCES companies(id) ON DELETE SET NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Group Members
CREATE TABLE group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at timestamptz NOT NULL DEFAULT now()
);

-- Messages
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NULL REFERENCES groups(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id uuid NULL REFERENCES profiles(id) ON DELETE SET NULL,
  content text NOT NULL,
  attachment_url text NULL,
  is_pinned boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Intervenants
CREATE TABLE intervenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  domain text NOT NULL,
  bio text NULL,
  video_url text NULL,
  hourly_rate_cents integer NOT NULL,
  packages jsonb NOT NULL DEFAULT '[]',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Notifications
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  link text NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Payments
CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount_cents integer NOT NULL,
  type payment_type NOT NULL,
  stripe_payment_id text NOT NULL,
  status payment_status NOT NULL,
  module_id uuid NULL REFERENCES modules(id) ON DELETE SET NULL,
  intervenant_id uuid NULL REFERENCES intervenants(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Tasks
CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_id uuid NULL REFERENCES companies(id) ON DELETE SET NULL,
  title text NOT NULL,
  due_date date NULL,
  status task_status NOT NULL DEFAULT 'pending',
  completed_at timestamptz NULL,
  completion_speed completion_speed NULL,
  coach_rating integer NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 3. INDEXES
-- ============================================================================

CREATE INDEX idx_profiles_role_company_status ON profiles (role, company_id, status);
CREATE INDEX idx_kpi_scores_user_company_date ON kpi_scores (user_id, company_id, scored_at);
CREATE INDEX idx_module_progress_user_module_status ON module_progress (user_id, module_id, status);
CREATE INDEX idx_messages_group_created ON messages (group_id, created_at DESC);
CREATE INDEX idx_appointments_coach_start_status ON appointments (coach_id, datetime_start, status);
CREATE INDEX idx_notifications_user_read_created ON notifications (user_id, is_read, created_at DESC);
CREATE INDEX idx_tasks_user_status_due ON tasks (user_id, status, due_date);
CREATE INDEX idx_booking_form_email_completed_created ON booking_form_submissions (email, completed, created_at);

-- ============================================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on ALL tables
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

-- -------------------------------------------------------
-- Helper function: get current user's role
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Helper function: get current user's company_id
CREATE OR REPLACE FUNCTION public.get_user_company_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT company_id FROM public.profiles WHERE id = auth.uid();
$$;

-- -------------------------------------------------------
-- PROFILES policies
-- -------------------------------------------------------

-- Admin: full access
CREATE POLICY "admin_all_profiles" ON profiles
  FOR ALL USING (get_user_role() = 'admin');

-- Dirigeant: view profiles in their company
CREATE POLICY "dirigeant_select_profiles" ON profiles
  FOR SELECT USING (
    get_user_role() = 'dirigeant'
    AND (
      id = auth.uid()
      OR company_id = get_user_company_id()
    )
  );

-- Salarie: view own profile
CREATE POLICY "salarie_select_own_profile" ON profiles
  FOR SELECT USING (
    get_user_role() = 'salarie' AND id = auth.uid()
  );

-- Salarie: update own profile
CREATE POLICY "salarie_update_own_profile" ON profiles
  FOR UPDATE USING (
    get_user_role() = 'salarie' AND id = auth.uid()
  );

-- Coachee: view own profile
CREATE POLICY "coachee_select_own_profile" ON profiles
  FOR SELECT USING (
    get_user_role() = 'coachee' AND id = auth.uid()
  );

-- Coachee: update own profile
CREATE POLICY "coachee_update_own_profile" ON profiles
  FOR UPDATE USING (
    get_user_role() = 'coachee' AND id = auth.uid()
  );

-- Intervenant: view own profile and booked client profiles
CREATE POLICY "intervenant_select_profiles" ON profiles
  FOR SELECT USING (
    get_user_role() = 'intervenant'
    AND (
      id = auth.uid()
      OR id IN (
        SELECT client_id FROM appointments
        WHERE coach_id = (SELECT user_id FROM intervenants WHERE user_id = auth.uid())
          AND client_id IS NOT NULL
      )
    )
  );

-- -------------------------------------------------------
-- COMPANIES policies
-- -------------------------------------------------------

CREATE POLICY "admin_all_companies" ON companies
  FOR ALL USING (get_user_role() = 'admin');

CREATE POLICY "dirigeant_select_own_company" ON companies
  FOR SELECT USING (
    get_user_role() = 'dirigeant'
    AND id = get_user_company_id()
  );

CREATE POLICY "salarie_select_own_company" ON companies
  FOR SELECT USING (
    get_user_role() = 'salarie'
    AND id = get_user_company_id()
  );

-- -------------------------------------------------------
-- MODULES policies
-- -------------------------------------------------------

CREATE POLICY "admin_all_modules" ON modules
  FOR ALL USING (get_user_role() = 'admin');

-- All authenticated users can view modules (catalog)
CREATE POLICY "authenticated_select_modules" ON modules
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- -------------------------------------------------------
-- MODULE_PROGRESS policies
-- -------------------------------------------------------

CREATE POLICY "admin_all_module_progress" ON module_progress
  FOR ALL USING (get_user_role() = 'admin');

-- Dirigeant: view module_progress for users in their company (without coach_notes)
CREATE POLICY "dirigeant_select_module_progress" ON module_progress
  FOR SELECT USING (
    get_user_role() = 'dirigeant'
    AND user_id IN (
      SELECT id FROM profiles WHERE company_id = get_user_company_id()
    )
  );

-- Salarie: view own module_progress
CREATE POLICY "salarie_select_own_module_progress" ON module_progress
  FOR SELECT USING (
    get_user_role() = 'salarie' AND user_id = auth.uid()
  );

-- Coachee: view own module_progress
CREATE POLICY "coachee_select_own_module_progress" ON module_progress
  FOR SELECT USING (
    get_user_role() = 'coachee' AND user_id = auth.uid()
  );

-- Coachee: update own module_progress (submit deliverables, etc.)
CREATE POLICY "coachee_update_own_module_progress" ON module_progress
  FOR UPDATE USING (
    get_user_role() = 'coachee' AND user_id = auth.uid()
  );

-- -------------------------------------------------------
-- KPI_SCORES policies
-- -------------------------------------------------------

CREATE POLICY "admin_all_kpi_scores" ON kpi_scores
  FOR ALL USING (get_user_role() = 'admin');

-- Dirigeant: view kpi_scores for their company
CREATE POLICY "dirigeant_select_kpi_scores" ON kpi_scores
  FOR SELECT USING (
    get_user_role() = 'dirigeant'
    AND company_id = get_user_company_id()
  );

-- Salarie: view own kpi_scores
CREATE POLICY "salarie_select_own_kpi_scores" ON kpi_scores
  FOR SELECT USING (
    get_user_role() = 'salarie' AND user_id = auth.uid()
  );

-- Coachee: view own kpi_scores
CREATE POLICY "coachee_select_own_kpi_scores" ON kpi_scores
  FOR SELECT USING (
    get_user_role() = 'coachee' AND user_id = auth.uid()
  );

-- -------------------------------------------------------
-- APPOINTMENTS policies
-- -------------------------------------------------------

CREATE POLICY "admin_all_appointments" ON appointments
  FOR ALL USING (get_user_role() = 'admin');

-- Users can view their own appointments (as client)
CREATE POLICY "user_select_own_appointments" ON appointments
  FOR SELECT USING (client_id = auth.uid());

-- Intervenant: view own appointments (as coach)
CREATE POLICY "intervenant_select_own_appointments" ON appointments
  FOR SELECT USING (
    get_user_role() = 'intervenant' AND coach_id = auth.uid()
  );

-- -------------------------------------------------------
-- BOOKING_FORM_SUBMISSIONS policies
-- -------------------------------------------------------

CREATE POLICY "admin_all_booking_submissions" ON booking_form_submissions
  FOR ALL USING (get_user_role() = 'admin');

-- Allow anonymous inserts for booking form (public form)
CREATE POLICY "anon_insert_booking_submissions" ON booking_form_submissions
  FOR INSERT WITH CHECK (true);

-- -------------------------------------------------------
-- GROUPS policies
-- -------------------------------------------------------

CREATE POLICY "admin_all_groups" ON groups
  FOR ALL USING (get_user_role() = 'admin');

-- Members can view groups they belong to
CREATE POLICY "member_select_groups" ON groups
  FOR SELECT USING (
    id IN (SELECT group_id FROM group_members WHERE user_id = auth.uid())
  );

-- -------------------------------------------------------
-- GROUP_MEMBERS policies
-- -------------------------------------------------------

CREATE POLICY "admin_all_group_members" ON group_members
  FOR ALL USING (get_user_role() = 'admin');

-- Users can see members of groups they belong to
CREATE POLICY "member_select_group_members" ON group_members
  FOR SELECT USING (
    group_id IN (SELECT group_id FROM group_members WHERE user_id = auth.uid())
  );

-- -------------------------------------------------------
-- MESSAGES policies
-- -------------------------------------------------------

CREATE POLICY "admin_all_messages" ON messages
  FOR ALL USING (get_user_role() = 'admin');

-- Users can view messages in groups they belong to, or direct messages to/from them
CREATE POLICY "user_select_messages" ON messages
  FOR SELECT USING (
    (group_id IN (SELECT group_id FROM group_members WHERE user_id = auth.uid()))
    OR sender_id = auth.uid()
    OR recipient_id = auth.uid()
  );

-- Salarie: insert messages in their group
CREATE POLICY "salarie_insert_messages" ON messages
  FOR INSERT WITH CHECK (
    get_user_role() = 'salarie'
    AND sender_id = auth.uid()
    AND (
      group_id IN (SELECT group_id FROM group_members WHERE user_id = auth.uid())
      OR group_id IS NULL
    )
  );

-- Coachee: insert messages
CREATE POLICY "coachee_insert_messages" ON messages
  FOR INSERT WITH CHECK (
    get_user_role() = 'coachee'
    AND sender_id = auth.uid()
  );

-- Intervenant: insert messages
CREATE POLICY "intervenant_insert_messages" ON messages
  FOR INSERT WITH CHECK (
    get_user_role() = 'intervenant'
    AND sender_id = auth.uid()
  );

-- Dirigeant: insert messages
CREATE POLICY "dirigeant_insert_messages" ON messages
  FOR INSERT WITH CHECK (
    get_user_role() = 'dirigeant'
    AND sender_id = auth.uid()
  );

-- -------------------------------------------------------
-- INTERVENANTS policies
-- -------------------------------------------------------

CREATE POLICY "admin_all_intervenants" ON intervenants
  FOR ALL USING (get_user_role() = 'admin');

-- Public read access for intervenants catalog
CREATE POLICY "public_select_intervenants" ON intervenants
  FOR SELECT USING (is_active = true);

-- Intervenant: update own profile
CREATE POLICY "intervenant_update_own" ON intervenants
  FOR UPDATE USING (
    get_user_role() = 'intervenant' AND user_id = auth.uid()
  );

-- -------------------------------------------------------
-- NOTIFICATIONS policies
-- -------------------------------------------------------

CREATE POLICY "admin_all_notifications" ON notifications
  FOR ALL USING (get_user_role() = 'admin');

-- Users can view and update their own notifications
CREATE POLICY "user_select_own_notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "user_update_own_notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

-- -------------------------------------------------------
-- PAYMENTS policies
-- -------------------------------------------------------

CREATE POLICY "admin_all_payments" ON payments
  FOR ALL USING (get_user_role() = 'admin');

-- Users can view their own payments
CREATE POLICY "user_select_own_payments" ON payments
  FOR SELECT USING (user_id = auth.uid());

-- -------------------------------------------------------
-- TASKS policies
-- -------------------------------------------------------

CREATE POLICY "admin_all_tasks" ON tasks
  FOR ALL USING (get_user_role() = 'admin');

-- Dirigeant: view tasks for users in their company
CREATE POLICY "dirigeant_select_tasks" ON tasks
  FOR SELECT USING (
    get_user_role() = 'dirigeant'
    AND company_id = get_user_company_id()
  );

-- Salarie: view own tasks
CREATE POLICY "salarie_select_own_tasks" ON tasks
  FOR SELECT USING (
    get_user_role() = 'salarie' AND user_id = auth.uid()
  );

-- Salarie: update own tasks (mark complete)
CREATE POLICY "salarie_update_own_tasks" ON tasks
  FOR UPDATE USING (
    get_user_role() = 'salarie' AND user_id = auth.uid()
  );

-- Coachee: view own tasks
CREATE POLICY "coachee_select_own_tasks" ON tasks
  FOR SELECT USING (
    get_user_role() = 'coachee' AND user_id = auth.uid()
  );

-- Coachee: update own tasks
CREATE POLICY "coachee_update_own_tasks" ON tasks
  FOR UPDATE USING (
    get_user_role() = 'coachee' AND user_id = auth.uid()
  );

-- ============================================================================
-- 5. TRIGGERS
-- ============================================================================

-- -------------------------------------------------------
-- Auto-update updated_at on profiles
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- -------------------------------------------------------
-- Auto-create profile on new auth.users sign-up
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', ''),
    COALESCE(
      (NEW.raw_user_meta_data ->> 'role')::user_role,
      'coachee'::user_role
    )
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 6. STORAGE BUCKETS
-- ============================================================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('livrables', 'livrables', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('certificates', 'certificates', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('attachments', 'attachments', false);

-- Storage policies for avatars (public read, authenticated upload)
CREATE POLICY "public_read_avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "authenticated_upload_avatars" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND auth.uid() IS NOT NULL
  );

CREATE POLICY "user_update_own_avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "user_delete_own_avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage policies for livrables (private, authenticated users only)
CREATE POLICY "authenticated_read_livrables" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'livrables' AND auth.uid() IS NOT NULL
  );

CREATE POLICY "authenticated_upload_livrables" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'livrables' AND auth.uid() IS NOT NULL
  );

CREATE POLICY "user_update_own_livrables" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'livrables' AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage policies for certificates (public read, admin upload)
CREATE POLICY "public_read_certificates" ON storage.objects
  FOR SELECT USING (bucket_id = 'certificates');

CREATE POLICY "admin_upload_certificates" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'certificates'
    AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

-- Storage policies for attachments (private, group members can access)
CREATE POLICY "authenticated_read_attachments" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'attachments' AND auth.uid() IS NOT NULL
  );

CREATE POLICY "authenticated_upload_attachments" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'attachments' AND auth.uid() IS NOT NULL
  );

CREATE POLICY "user_delete_own_attachments" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'attachments' AND (storage.foldername(name))[1] = auth.uid()::text
  );
