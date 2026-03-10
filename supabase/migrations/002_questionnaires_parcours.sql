-- ============================================================================
-- Migration 002: Questionnaires Qualiopi & Parcours (Learning Paths)
-- ============================================================================

-- ============================================================================
-- 1. ENUM TYPES
-- ============================================================================

CREATE TYPE question_type AS ENUM ('text', 'textarea', 'slider', 'radio', 'checkbox');
CREATE TYPE questionnaire_phase AS ENUM ('amont', 'aval', 'mi-parcours');
CREATE TYPE parcours_status AS ENUM ('not_started', 'in_progress', 'completed', 'overdue');
CREATE TYPE parcours_module_status AS ENUM ('locked', 'available', 'in_progress', 'completed');

-- ============================================================================
-- 2. QUESTIONNAIRES TABLES
-- ============================================================================

-- Questionnaire definitions
CREATE TABLE questionnaires (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  badge text NOT NULL DEFAULT 'Questionnaire Qualiopi',
  phase questionnaire_phase NOT NULL,
  module_id uuid NULL REFERENCES modules(id) ON DELETE SET NULL,
  google_forms_url text NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Questions within questionnaires
CREATE TABLE questionnaire_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  questionnaire_id uuid NOT NULL REFERENCES questionnaires(id) ON DELETE CASCADE,
  label text NOT NULL,
  type question_type NOT NULL,
  required boolean NOT NULL DEFAULT true,
  placeholder text,
  min_value integer,
  max_value integer,
  options jsonb, -- Array of strings for radio/checkbox
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- User responses to questionnaires
CREATE TABLE questionnaire_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  questionnaire_id uuid NOT NULL REFERENCES questionnaires(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  module_progress_id uuid NULL REFERENCES module_progress(id) ON DELETE SET NULL,
  answers jsonb NOT NULL DEFAULT '{}',
  submitted_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(questionnaire_id, user_id, module_progress_id)
);

-- ============================================================================
-- 3. PARCOURS (LEARNING PATHS) TABLES
-- ============================================================================

-- Parcours templates (admin creates these)
CREATE TABLE parcours_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL,
  duration_weeks integer NOT NULL DEFAULT 8,
  module_ids jsonb NOT NULL DEFAULT '[]', -- Array of module UUIDs
  is_default boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Assigned parcours (to users)
CREATE TABLE assigned_parcours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid NULL REFERENCES parcours_templates(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  assigned_to uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  assigned_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_id uuid NULL REFERENCES companies(id) ON DELETE SET NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  status parcours_status NOT NULL DEFAULT 'not_started',
  progress integer NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Modules within an assigned parcours
CREATE TABLE parcours_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parcours_id uuid NOT NULL REFERENCES assigned_parcours(id) ON DELETE CASCADE,
  module_id uuid NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  order_index integer NOT NULL,
  deadline date,
  completed_at timestamptz,
  status parcours_module_status NOT NULL DEFAULT 'locked',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 4. CALENDLY INTEGRATION
-- ============================================================================

-- Calendly settings per user (for intervenants)
CREATE TABLE calendly_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  calendly_url text NOT NULL,
  api_key text, -- Encrypted Calendly API key
  event_types jsonb DEFAULT '[]', -- Cached event types
  is_active boolean NOT NULL DEFAULT true,
  last_synced_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Calendly bookings (synced from Calendly webhooks)
CREATE TABLE calendly_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  calendly_event_id text NOT NULL UNIQUE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  client_id uuid NULL REFERENCES profiles(id) ON DELETE SET NULL,
  client_name text,
  client_email text,
  event_type text NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  location text,
  status text NOT NULL DEFAULT 'scheduled',
  cancel_url text,
  reschedule_url text,
  raw_data jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 5. INDEXES
-- ============================================================================

CREATE INDEX idx_questionnaires_module ON questionnaires(module_id);
CREATE INDEX idx_questionnaires_phase ON questionnaires(phase);
CREATE INDEX idx_questionnaire_questions_questionnaire ON questionnaire_questions(questionnaire_id, order_index);
CREATE INDEX idx_questionnaire_responses_user ON questionnaire_responses(user_id, questionnaire_id);
CREATE INDEX idx_parcours_templates_category ON parcours_templates(category);
CREATE INDEX idx_assigned_parcours_user ON assigned_parcours(assigned_to, status);
CREATE INDEX idx_assigned_parcours_company ON assigned_parcours(company_id, status);
CREATE INDEX idx_parcours_modules_parcours ON parcours_modules(parcours_id, order_index);
CREATE INDEX idx_calendly_bookings_user ON calendly_bookings(user_id, start_time);
CREATE INDEX idx_calendly_bookings_status ON calendly_bookings(status, start_time);

-- ============================================================================
-- 6. ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaire_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaire_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE parcours_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE assigned_parcours ENABLE ROW LEVEL SECURITY;
ALTER TABLE parcours_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendly_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendly_bookings ENABLE ROW LEVEL SECURITY;

-- QUESTIONNAIRES policies
CREATE POLICY "admin_all_questionnaires" ON questionnaires
  FOR ALL USING (get_user_role() = 'admin');

CREATE POLICY "authenticated_select_questionnaires" ON questionnaires
  FOR SELECT USING (auth.uid() IS NOT NULL AND is_active = true);

-- QUESTIONNAIRE_QUESTIONS policies
CREATE POLICY "admin_all_questionnaire_questions" ON questionnaire_questions
  FOR ALL USING (get_user_role() = 'admin');

CREATE POLICY "authenticated_select_questions" ON questionnaire_questions
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- QUESTIONNAIRE_RESPONSES policies
CREATE POLICY "admin_all_questionnaire_responses" ON questionnaire_responses
  FOR ALL USING (get_user_role() = 'admin');

CREATE POLICY "user_select_own_responses" ON questionnaire_responses
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "user_insert_own_responses" ON questionnaire_responses
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "dirigeant_select_company_responses" ON questionnaire_responses
  FOR SELECT USING (
    get_user_role() = 'dirigeant'
    AND user_id IN (SELECT id FROM profiles WHERE company_id = get_user_company_id())
  );

-- PARCOURS_TEMPLATES policies
CREATE POLICY "admin_all_parcours_templates" ON parcours_templates
  FOR ALL USING (get_user_role() = 'admin');

CREATE POLICY "authenticated_select_templates" ON parcours_templates
  FOR SELECT USING (auth.uid() IS NOT NULL AND is_active = true);

-- ASSIGNED_PARCOURS policies
CREATE POLICY "admin_all_assigned_parcours" ON assigned_parcours
  FOR ALL USING (get_user_role() = 'admin');

CREATE POLICY "user_select_own_parcours" ON assigned_parcours
  FOR SELECT USING (assigned_to = auth.uid());

CREATE POLICY "dirigeant_select_company_parcours" ON assigned_parcours
  FOR SELECT USING (
    get_user_role() = 'dirigeant'
    AND company_id = get_user_company_id()
  );

-- PARCOURS_MODULES policies
CREATE POLICY "admin_all_parcours_modules" ON parcours_modules
  FOR ALL USING (get_user_role() = 'admin');

CREATE POLICY "user_select_own_parcours_modules" ON parcours_modules
  FOR SELECT USING (
    parcours_id IN (SELECT id FROM assigned_parcours WHERE assigned_to = auth.uid())
  );

CREATE POLICY "dirigeant_select_company_parcours_modules" ON parcours_modules
  FOR SELECT USING (
    parcours_id IN (
      SELECT id FROM assigned_parcours WHERE company_id = get_user_company_id()
    )
  );

-- CALENDLY_SETTINGS policies
CREATE POLICY "admin_all_calendly_settings" ON calendly_settings
  FOR ALL USING (get_user_role() = 'admin');

CREATE POLICY "user_manage_own_calendly_settings" ON calendly_settings
  FOR ALL USING (user_id = auth.uid());

-- CALENDLY_BOOKINGS policies
CREATE POLICY "admin_all_calendly_bookings" ON calendly_bookings
  FOR ALL USING (get_user_role() = 'admin');

CREATE POLICY "user_select_own_bookings" ON calendly_bookings
  FOR SELECT USING (user_id = auth.uid() OR client_id = auth.uid());

CREATE POLICY "intervenant_manage_own_bookings" ON calendly_bookings
  FOR ALL USING (
    get_user_role() = 'intervenant' AND user_id = auth.uid()
  );

-- ============================================================================
-- 7. TRIGGERS
-- ============================================================================

-- Auto-update updated_at
CREATE TRIGGER on_questionnaires_updated
  BEFORE UPDATE ON questionnaires
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_parcours_templates_updated
  BEFORE UPDATE ON parcours_templates
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_assigned_parcours_updated
  BEFORE UPDATE ON assigned_parcours
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_calendly_settings_updated
  BEFORE UPDATE ON calendly_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 8. SEED DEFAULT QUALIOPI QUESTIONNAIRES
-- ============================================================================

-- Insert default amont questionnaire template
INSERT INTO questionnaires (id, title, description, badge, phase, module_id) VALUES
  ('00000000-0000-0000-0000-000000000001',
   'Questionnaire pre-formation (Amont)',
   'Ce questionnaire permet d''evaluer vos attentes et votre niveau avant de debuter le module. Vos reponses nous aident a personnaliser votre accompagnement (conformite Qualiopi).',
   'Questionnaire Amont',
   'amont',
   NULL);

-- Insert default aval questionnaire template
INSERT INTO questionnaires (id, title, description, badge, phase, module_id) VALUES
  ('00000000-0000-0000-0000-000000000002',
   'Questionnaire post-formation (Aval)',
   'Ce questionnaire d''evaluation permet de mesurer votre satisfaction et vos acquis. Vos reponses contribuent a l''amelioration continue (conformite Qualiopi).',
   'Questionnaire Aval',
   'aval',
   NULL);

-- Insert amont questions
INSERT INTO questionnaire_questions (questionnaire_id, label, type, required, placeholder, order_index) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Quelles sont vos attentes principales pour cette formation ?', 'textarea', true, 'Decrivez vos attentes...', 1),
  ('00000000-0000-0000-0000-000000000001', 'Quel est votre niveau actuel dans ce domaine ?', 'radio', true, NULL, 2),
  ('00000000-0000-0000-0000-000000000001', 'Avez-vous deja suivi une formation similaire ?', 'radio', true, NULL, 3),
  ('00000000-0000-0000-0000-000000000001', 'Quels objectifs professionnels souhaitez-vous atteindre grace a cette formation ?', 'textarea', true, 'Decrivez vos objectifs...', 4),
  ('00000000-0000-0000-0000-000000000001', 'Niveau de motivation avant la formation', 'slider', true, NULL, 5),
  ('00000000-0000-0000-0000-000000000001', 'Y a-t-il des contraintes particulieres dont nous devrions tenir compte ?', 'textarea', false, 'Horaires, accessibilite, besoins specifiques...', 6);

-- Update options for radio questions (amont)
UPDATE questionnaire_questions SET options = '["Debutant", "Intermediaire", "Avance", "Expert"]'::jsonb
  WHERE questionnaire_id = '00000000-0000-0000-0000-000000000001' AND order_index = 2;
UPDATE questionnaire_questions SET options = '["Oui", "Non"]'::jsonb
  WHERE questionnaire_id = '00000000-0000-0000-0000-000000000001' AND order_index = 3;
UPDATE questionnaire_questions SET min_value = 1, max_value = 10
  WHERE questionnaire_id = '00000000-0000-0000-0000-000000000001' AND order_index = 5;

-- Insert aval questions
INSERT INTO questionnaire_questions (questionnaire_id, label, type, required, placeholder, order_index) VALUES
  ('00000000-0000-0000-0000-000000000002', 'Les objectifs de la formation ont-ils ete atteints ?', 'radio', true, NULL, 1),
  ('00000000-0000-0000-0000-000000000002', 'Comment evaluez-vous la qualite du contenu pedagogique ?', 'slider', true, NULL, 2),
  ('00000000-0000-0000-0000-000000000002', 'Comment evaluez-vous la qualite de l''accompagnement du formateur ?', 'slider', true, NULL, 3),
  ('00000000-0000-0000-0000-000000000002', 'Les moyens pedagogiques (supports, outils) etaient-ils adaptes ?', 'radio', true, NULL, 4),
  ('00000000-0000-0000-0000-000000000002', 'Quelles competences avez-vous acquises ou developpees ?', 'textarea', true, 'Listez les competences acquises...', 5),
  ('00000000-0000-0000-0000-000000000002', 'Comment comptez-vous appliquer ces acquis dans votre quotidien professionnel ?', 'textarea', true, 'Decrivez vos projets d''application...', 6),
  ('00000000-0000-0000-0000-000000000002', 'Satisfaction globale de la formation', 'slider', true, NULL, 7),
  ('00000000-0000-0000-0000-000000000002', 'Recommanderiez-vous cette formation a un collegue ?', 'radio', true, NULL, 8),
  ('00000000-0000-0000-0000-000000000002', 'Commentaires et suggestions d''amelioration', 'textarea', false, 'Partagez vos remarques...', 9);

-- Update options for radio/slider questions (aval)
UPDATE questionnaire_questions SET options = '["Oui, completement", "Partiellement", "Non"]'::jsonb
  WHERE questionnaire_id = '00000000-0000-0000-0000-000000000002' AND order_index = 1;
UPDATE questionnaire_questions SET min_value = 1, max_value = 10
  WHERE questionnaire_id = '00000000-0000-0000-0000-000000000002' AND order_index IN (2, 3, 7);
UPDATE questionnaire_questions SET options = '["Tres adaptes", "Adaptes", "Peu adaptes", "Pas du tout adaptes"]'::jsonb
  WHERE questionnaire_id = '00000000-0000-0000-0000-000000000002' AND order_index = 4;
UPDATE questionnaire_questions SET options = '["Oui, certainement", "Probablement", "Probablement pas", "Non"]'::jsonb
  WHERE questionnaire_id = '00000000-0000-0000-0000-000000000002' AND order_index = 8;
