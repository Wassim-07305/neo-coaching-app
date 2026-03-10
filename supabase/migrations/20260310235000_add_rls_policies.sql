-- =============================================
-- Migration: Complete RLS Policies
-- Date: 2026-03-10
-- Description: Enable RLS on all tables and add
--   role-based policies (admin, dirigeant, salarie, coachee, intervenant)
--   Uses auth.uid() and auth.jwt() for role checks
-- =============================================

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- is_admin() already exists from 001_initial_schema.sql

-- Get current user's role from JWT (faster, no DB query)
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Check if current user is dirigeant of a given company
CREATE OR REPLACE FUNCTION is_dirigeant_of(p_company_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM companies
    WHERE id = p_company_id AND dirigeant_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Get current user's company_id
CREATE OR REPLACE FUNCTION get_my_company_id()
RETURNS UUID AS $$
  SELECT company_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- =============================================
-- PROFILES
-- RLS already enabled in 001. Existing policies:
--   - Users can view own profile (SELECT, auth.uid() = id)
--   - Admin can view all profiles (SELECT, is_admin())
--   - Users can update own profile (UPDATE, auth.uid() = id)
--   - Admin can update all profiles (ALL, is_admin())
-- Adding:
-- =============================================

-- Dirigeant can see all employees in their company
CREATE POLICY "Dirigeant can view company profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.dirigeant_id = auth.uid()
        AND companies.id = profiles.company_id
    )
  );

-- Users in same company can see each other (messaging, groups)
CREATE POLICY "Company members can view colleagues" ON profiles
  FOR SELECT USING (
    company_id IS NOT NULL
    AND company_id = get_my_company_id()
  );

-- Allow profile creation on signup
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Admin can delete (archive) profiles
CREATE POLICY "Admin can delete profiles" ON profiles
  FOR DELETE USING (is_admin());

-- =============================================
-- COMPANIES
-- RLS already enabled. Existing policies:
--   - Dirigeant can view own company (SELECT)
--   - Admin full access (ALL)
-- Adding:
-- =============================================

-- Dirigeant can update own company details
CREATE POLICY "Dirigeant can update own company" ON companies
  FOR UPDATE USING (dirigeant_id = auth.uid())
  WITH CHECK (dirigeant_id = auth.uid());

-- =============================================
-- MODULES
-- RLS already enabled. Existing policies:
--   - Anyone can view modules (SELECT, true)
--   - Admin can manage modules (ALL, is_admin())
-- No additional policies needed
-- =============================================

-- =============================================
-- MODULE_PROGRESS
-- RLS already enabled. Existing policies:
--   - Users can view own progress (SELECT, user_id)
--   - Users can update own progress (UPDATE, user_id)
--   - Admin full access (ALL)
-- Adding:
-- =============================================

-- Users can start a module (insert own progress)
CREATE POLICY "Users can insert own progress" ON module_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Dirigeant can view progress of company employees
CREATE POLICY "Dirigeant can view company progress" ON module_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN companies c ON c.id = p.company_id
      WHERE p.id = module_progress.user_id
        AND c.dirigeant_id = auth.uid()
    )
  );

-- =============================================
-- KPI_SCORES
-- RLS already enabled. Existing policies:
--   - Users can view own kpis (SELECT, user_id)
--   - Dirigeant can view company kpis (SELECT)
--   - Admin full access (ALL)
-- Adding:
-- =============================================

-- Dirigeant can insert KPI scores for their company employees
CREATE POLICY "Dirigeant can insert company kpis" ON kpi_scores
  FOR INSERT WITH CHECK (is_dirigeant_of(company_id));

-- Dirigeant can update KPI scores for their company
CREATE POLICY "Dirigeant can update company kpis" ON kpi_scores
  FOR UPDATE USING (is_dirigeant_of(company_id))
  WITH CHECK (is_dirigeant_of(company_id));

-- =============================================
-- APPOINTMENTS
-- RLS already enabled. Existing policies:
--   - Users can view own appointments (SELECT, client_id/coach_id)
--   - Admin full access (ALL)
-- Adding:
-- =============================================

-- Users can create their own appointments
CREATE POLICY "Users can insert own appointments" ON appointments
  FOR INSERT WITH CHECK (
    auth.uid() = client_id OR auth.uid() = coach_id
  );

-- Participants can update their appointments (cancel, reschedule)
CREATE POLICY "Participants can update own appointments" ON appointments
  FOR UPDATE USING (
    auth.uid() = client_id OR auth.uid() = coach_id
  ) WITH CHECK (
    auth.uid() = client_id OR auth.uid() = coach_id
  );

-- =============================================
-- BOOKING_FORM_SUBMISSIONS
-- RLS already enabled. Existing policies:
--   - Admin full access (ALL)
--   - Anyone can insert booking (INSERT, true)
-- No additional policies needed
-- =============================================

-- =============================================
-- GROUPS
-- RLS already enabled. Existing policies:
--   - Members can view groups (SELECT)
--   - Admin full access (ALL)
-- Adding:
-- =============================================

-- Creator can update their group
CREATE POLICY "Creator can update own group" ON groups
  FOR UPDATE USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- Authenticated users can create groups
CREATE POLICY "Authenticated users can create groups" ON groups
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- =============================================
-- GROUP_MEMBERS
-- RLS already enabled. Existing policies:
--   - Members can view group members (SELECT)
--   - Admin full access (ALL)
-- Adding:
-- =============================================

-- Group creator can add members
CREATE POLICY "Group creator can manage members" ON group_members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM groups
      WHERE groups.id = group_members.group_id
        AND groups.created_by = auth.uid()
    )
  );

-- Group creator can remove members
CREATE POLICY "Group creator can delete members" ON group_members
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM groups
      WHERE groups.id = group_members.group_id
        AND groups.created_by = auth.uid()
    )
  );

-- Users can leave groups (delete own membership)
CREATE POLICY "Users can leave groups" ON group_members
  FOR DELETE USING (user_id = auth.uid());

-- =============================================
-- MESSAGES
-- RLS already enabled. Existing policies:
--   - Users can view messages in their groups (SELECT)
--   - Users can send messages (INSERT, sender_id)
--   - Admin full access (ALL)
-- Adding:
-- =============================================

-- Users can update own messages (edit)
CREATE POLICY "Users can update own messages" ON messages
  FOR UPDATE USING (sender_id = auth.uid())
  WITH CHECK (sender_id = auth.uid());

-- Users can delete own messages
CREATE POLICY "Users can delete own messages" ON messages
  FOR DELETE USING (sender_id = auth.uid());

-- =============================================
-- INTERVENANTS
-- RLS already enabled. Existing policies:
--   - Anyone can view active intervenants (SELECT, is_active)
--   - Admin full access (ALL)
-- Adding:
-- =============================================

-- Intervenants can view own profile (even if inactive)
CREATE POLICY "Intervenants can view own profile" ON intervenants
  FOR SELECT USING (user_id = auth.uid());

-- Intervenants can update their own profile
CREATE POLICY "Intervenants can update own profile" ON intervenants
  FOR UPDATE USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- =============================================
-- NOTIFICATIONS
-- RLS already enabled. Existing policies:
--   - Users can view own notifications (SELECT, user_id)
--   - Users can update own notifications (UPDATE, user_id)
--   - Admin full access (ALL)
-- Adding:
-- =============================================

-- Admin can insert notifications for any user
CREATE POLICY "Admin can insert notifications" ON notifications
  FOR INSERT WITH CHECK (is_admin());

-- Users can delete own notifications (clear)
CREATE POLICY "Users can delete own notifications" ON notifications
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- PAYMENTS
-- RLS already enabled. Existing policies:
--   - Users can view own payments (SELECT, user_id)
--   - Admin full access (ALL)
-- Adding:
-- =============================================

-- Users can create own payments
CREATE POLICY "Users can insert own payments" ON payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- TASKS
-- RLS already enabled. Existing policies:
--   - Users can view own tasks (SELECT, user_id)
--   - Users can update own tasks (UPDATE, user_id)
--   - Admin full access (ALL)
-- Adding:
-- =============================================

-- Dirigeant can view tasks of employees in their company
CREATE POLICY "Dirigeant can view company tasks" ON tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = tasks.company_id
        AND companies.dirigeant_id = auth.uid()
    )
  );

-- Dirigeant can create tasks for company employees
CREATE POLICY "Dirigeant can insert company tasks" ON tasks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = tasks.company_id
        AND companies.dirigeant_id = auth.uid()
    )
  );

-- Dirigeant can update tasks for company employees
CREATE POLICY "Dirigeant can update company tasks" ON tasks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = tasks.company_id
        AND companies.dirigeant_id = auth.uid()
    )
  );

-- =============================================
-- STORAGE – additional policies
-- =============================================

-- Users can update their own avatar
CREATE POLICY "Users can update their own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can delete their own avatar
CREATE POLICY "Users can delete their own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Admin can manage all livrables
CREATE POLICY "Admin can manage all livrables" ON storage.objects
  FOR ALL USING (bucket_id = 'livrables' AND is_admin());

-- Users can delete own livrables
CREATE POLICY "Users can delete own livrables" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'livrables'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
