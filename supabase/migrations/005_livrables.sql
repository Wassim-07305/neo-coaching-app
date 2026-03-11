-- Migration: Create livrables table
-- Allows coachees/salaries to submit deliverables (written, audio, video) per module

-- Livrable type and status enums
CREATE TYPE livrable_type AS ENUM ('ecrit', 'audio', 'video');
CREATE TYPE livrable_status AS ENUM ('en_attente', 'soumis', 'valide', 'refuse');

-- Livrables table
CREATE TABLE livrables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  module_id uuid NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  module_progress_id uuid REFERENCES module_progress(id) ON DELETE SET NULL,
  type livrable_type NOT NULL,
  file_name text NOT NULL,
  file_url text NOT NULL,
  status livrable_status NOT NULL DEFAULT 'soumis',
  coach_feedback text NULL,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_livrables_user_module ON livrables (user_id, module_id);
CREATE INDEX idx_livrables_status ON livrables (status);

-- Enable RLS
ALTER TABLE livrables ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Admin: full access
CREATE POLICY "admin_all_livrables" ON livrables
  FOR ALL USING (get_user_role() = 'admin');

-- Users can view their own livrables
CREATE POLICY "user_select_own_livrables" ON livrables
  FOR SELECT USING (user_id = auth.uid());

-- Users can insert their own livrables
CREATE POLICY "user_insert_own_livrables" ON livrables
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can update their own livrables (only if still soumis or en_attente)
CREATE POLICY "user_update_own_livrables" ON livrables
  FOR UPDATE USING (
    user_id = auth.uid()
    AND status IN ('soumis', 'en_attente')
  );

-- Dirigeant: view livrables for users in their company
CREATE POLICY "dirigeant_select_company_livrables" ON livrables
  FOR SELECT USING (
    get_user_role() = 'dirigeant'
    AND user_id IN (
      SELECT p.id FROM profiles p
      WHERE p.company_id = (SELECT company_id FROM profiles WHERE id = auth.uid())
    )
  );
