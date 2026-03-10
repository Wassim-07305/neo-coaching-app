-- =============================================
-- Neo-Coaching - Seed complet de données de test
-- Exécuter APRÈS 001_initial_schema.sql et 002_seed_admin.sql
-- =============================================

-- =============================================
-- 0. Récupérer l'ID admin (Jean-Claude)
-- =============================================
DO $$
DECLARE
  admin_id UUID;
  -- Dirigeants
  dir_techvision_id UUID := gen_random_uuid();
  dir_greenleaf_id UUID := gen_random_uuid();
  dir_mediapulse_id UUID := gen_random_uuid();
  dir_urbancraft_id UUID := gen_random_uuid();
  dir_solulogis_id UUID := gen_random_uuid();
  -- Entreprises
  comp_techvision_id UUID := gen_random_uuid();
  comp_greenleaf_id UUID := gen_random_uuid();
  comp_mediapulse_id UUID := gen_random_uuid();
  comp_urbancraft_id UUID := gen_random_uuid();
  comp_solulogis_id UUID := gen_random_uuid();
  -- Salariés TechVision
  sal_tv_1 UUID := gen_random_uuid();
  sal_tv_2 UUID := gen_random_uuid();
  sal_tv_3 UUID := gen_random_uuid();
  sal_tv_4 UUID := gen_random_uuid();
  -- Salariés GreenLeaf
  sal_gl_1 UUID := gen_random_uuid();
  sal_gl_2 UUID := gen_random_uuid();
  sal_gl_3 UUID := gen_random_uuid();
  -- Salariés MediaPulse
  sal_mp_1 UUID := gen_random_uuid();
  sal_mp_2 UUID := gen_random_uuid();
  -- Salariés UrbanCraft
  sal_uc_1 UUID := gen_random_uuid();
  sal_uc_2 UUID := gen_random_uuid();
  -- Salariés SoluLogis
  sal_sl_1 UUID := gen_random_uuid();
  sal_sl_2 UUID := gen_random_uuid();
  -- Coachées B2C
  coachee_1 UUID := gen_random_uuid();
  coachee_2 UUID := gen_random_uuid();
  coachee_3 UUID := gen_random_uuid();
  coachee_4 UUID := gen_random_uuid();
  coachee_5 UUID := gen_random_uuid();
  coachee_6 UUID := gen_random_uuid();
  coachee_7 UUID := gen_random_uuid();
  coachee_8 UUID := gen_random_uuid();
  -- Intervenants
  interv_1 UUID := gen_random_uuid();
  interv_2 UUID := gen_random_uuid();
  interv_3 UUID := gen_random_uuid();
  -- Modules (récupérer les existants)
  mod_1 UUID;
  mod_2 UUID;
  mod_3 UUID;
  mod_4 UUID;
  -- Modules supplémentaires
  mod_5 UUID := gen_random_uuid();
  mod_6 UUID := gen_random_uuid();
  mod_7 UUID := gen_random_uuid();
  mod_8 UUID := gen_random_uuid();
  -- Groups
  grp_tv UUID := gen_random_uuid();
  grp_gl UUID := gen_random_uuid();
  grp_coachees UUID := gen_random_uuid();
  grp_general UUID := gen_random_uuid();

BEGIN
  -- Récupérer l'admin
  SELECT id INTO admin_id FROM profiles WHERE role = 'admin' LIMIT 1;
  IF admin_id IS NULL THEN
    RAISE EXCEPTION 'Admin non trouvé. Exécuter 002_seed_admin.sql d''abord.';
  END IF;

  -- Récupérer les modules existants
  SELECT id INTO mod_1 FROM modules WHERE order_index = 1 LIMIT 1;
  SELECT id INTO mod_2 FROM modules WHERE order_index = 2 LIMIT 1;
  SELECT id INTO mod_3 FROM modules WHERE order_index = 3 LIMIT 1;
  SELECT id INTO mod_4 FROM modules WHERE order_index = 4 LIMIT 1;

  -- =============================================
  -- 1. CRÉER LES UTILISATEURS (auth.users + profiles)
  -- =============================================

  -- Helper: Créer un utilisateur complet
  -- On insère directement dans auth.users puis le trigger crée le profil

  -- --- DIRIGEANTS ---
  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token)
  VALUES
    (dir_techvision_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'marc.dupont@techvision.fr', crypt('Test1234!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"first_name":"Marc","last_name":"DUPONT","role":"dirigeant"}', now() - interval '8 months', now(), '', ''),
    (dir_greenleaf_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'sophie.martin@greenleaf.fr', crypt('Test1234!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"first_name":"Sophie","last_name":"MARTIN","role":"dirigeant"}', now() - interval '6 months', now(), '', ''),
    (dir_mediapulse_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'thomas.bernard@mediapulse.fr', crypt('Test1234!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"first_name":"Thomas","last_name":"BERNARD","role":"dirigeant"}', now() - interval '4 months', now(), '', ''),
    (dir_urbancraft_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'nathalie.roux@urbancraft.fr', crypt('Test1234!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"first_name":"Nathalie","last_name":"ROUX","role":"dirigeant"}', now() - interval '3 months', now(), '', ''),
    (dir_solulogis_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'pierre.lefevre@solulogis.fr', crypt('Test1234!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"first_name":"Pierre","last_name":"LEFÈVRE","role":"dirigeant"}', now() - interval '2 months', now(), '', '');

  -- Identités email pour dirigeants
  INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  VALUES
    (dir_techvision_id, dir_techvision_id, 'marc.dupont@techvision.fr', jsonb_build_object('sub', dir_techvision_id::text, 'email', 'marc.dupont@techvision.fr'), 'email', now(), now(), now()),
    (dir_greenleaf_id, dir_greenleaf_id, 'sophie.martin@greenleaf.fr', jsonb_build_object('sub', dir_greenleaf_id::text, 'email', 'sophie.martin@greenleaf.fr'), 'email', now(), now(), now()),
    (dir_mediapulse_id, dir_mediapulse_id, 'thomas.bernard@mediapulse.fr', jsonb_build_object('sub', dir_mediapulse_id::text, 'email', 'thomas.bernard@mediapulse.fr'), 'email', now(), now(), now()),
    (dir_urbancraft_id, dir_urbancraft_id, 'nathalie.roux@urbancraft.fr', jsonb_build_object('sub', dir_urbancraft_id::text, 'email', 'nathalie.roux@urbancraft.fr'), 'email', now(), now(), now()),
    (dir_solulogis_id, dir_solulogis_id, 'pierre.lefevre@solulogis.fr', jsonb_build_object('sub', dir_solulogis_id::text, 'email', 'pierre.lefevre@solulogis.fr'), 'email', now(), now(), now());

  -- --- SALARIÉS ---
  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token)
  VALUES
    -- TechVision
    (sal_tv_1, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'alice.morel@techvision.fr', crypt('Test1234!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"first_name":"Alice","last_name":"MOREL","role":"salarie"}', now() - interval '7 months', now(), '', ''),
    (sal_tv_2, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'julien.petit@techvision.fr', crypt('Test1234!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"first_name":"Julien","last_name":"PETIT","role":"salarie"}', now() - interval '7 months', now(), '', ''),
    (sal_tv_3, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'emma.garcia@techvision.fr', crypt('Test1234!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"first_name":"Emma","last_name":"GARCIA","role":"salarie"}', now() - interval '6 months', now(), '', ''),
    (sal_tv_4, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'lucas.henry@techvision.fr', crypt('Test1234!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"first_name":"Lucas","last_name":"HENRY","role":"salarie"}', now() - interval '5 months', now(), '', ''),
    -- GreenLeaf
    (sal_gl_1, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'camille.dubois@greenleaf.fr', crypt('Test1234!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"first_name":"Camille","last_name":"DUBOIS","role":"salarie"}', now() - interval '5 months', now(), '', ''),
    (sal_gl_2, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'hugo.lambert@greenleaf.fr', crypt('Test1234!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"first_name":"Hugo","last_name":"LAMBERT","role":"salarie"}', now() - interval '5 months', now(), '', ''),
    (sal_gl_3, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'lea.moreau@greenleaf.fr', crypt('Test1234!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"first_name":"Léa","last_name":"MOREAU","role":"salarie"}', now() - interval '4 months', now(), '', ''),
    -- MediaPulse
    (sal_mp_1, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'nathan.rousseau@mediapulse.fr', crypt('Test1234!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"first_name":"Nathan","last_name":"ROUSSEAU","role":"salarie"}', now() - interval '3 months', now(), '', ''),
    (sal_mp_2, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'chloe.girard@mediapulse.fr', crypt('Test1234!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"first_name":"Chloé","last_name":"GIRARD","role":"salarie"}', now() - interval '3 months', now(), '', ''),
    -- UrbanCraft
    (sal_uc_1, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'maxime.faure@urbancraft.fr', crypt('Test1234!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"first_name":"Maxime","last_name":"FAURE","role":"salarie"}', now() - interval '2 months', now(), '', ''),
    (sal_uc_2, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'manon.clement@urbancraft.fr', crypt('Test1234!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"first_name":"Manon","last_name":"CLÉMENT","role":"salarie"}', now() - interval '2 months', now(), '', ''),
    -- SoluLogis
    (sal_sl_1, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'alexandre.mercier@solulogis.fr', crypt('Test1234!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"first_name":"Alexandre","last_name":"MERCIER","role":"salarie"}', now() - interval '1 month', now(), '', ''),
    (sal_sl_2, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'sarah.bonnet@solulogis.fr', crypt('Test1234!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"first_name":"Sarah","last_name":"BONNET","role":"salarie"}', now() - interval '1 month', now(), '', '');

  -- Identités salariés
  INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  VALUES
    (sal_tv_1, sal_tv_1, 'alice.morel@techvision.fr', jsonb_build_object('sub', sal_tv_1::text, 'email', 'alice.morel@techvision.fr'), 'email', now(), now(), now()),
    (sal_tv_2, sal_tv_2, 'julien.petit@techvision.fr', jsonb_build_object('sub', sal_tv_2::text, 'email', 'julien.petit@techvision.fr'), 'email', now(), now(), now()),
    (sal_tv_3, sal_tv_3, 'emma.garcia@techvision.fr', jsonb_build_object('sub', sal_tv_3::text, 'email', 'emma.garcia@techvision.fr'), 'email', now(), now(), now()),
    (sal_tv_4, sal_tv_4, 'lucas.henry@techvision.fr', jsonb_build_object('sub', sal_tv_4::text, 'email', 'lucas.henry@techvision.fr'), 'email', now(), now(), now()),
    (sal_gl_1, sal_gl_1, 'camille.dubois@greenleaf.fr', jsonb_build_object('sub', sal_gl_1::text, 'email', 'camille.dubois@greenleaf.fr'), 'email', now(), now(), now()),
    (sal_gl_2, sal_gl_2, 'hugo.lambert@greenleaf.fr', jsonb_build_object('sub', sal_gl_2::text, 'email', 'hugo.lambert@greenleaf.fr'), 'email', now(), now(), now()),
    (sal_gl_3, sal_gl_3, 'lea.moreau@greenleaf.fr', jsonb_build_object('sub', sal_gl_3::text, 'email', 'lea.moreau@greenleaf.fr'), 'email', now(), now(), now()),
    (sal_mp_1, sal_mp_1, 'nathan.rousseau@mediapulse.fr', jsonb_build_object('sub', sal_mp_1::text, 'email', 'nathan.rousseau@mediapulse.fr'), 'email', now(), now(), now()),
    (sal_mp_2, sal_mp_2, 'chloe.girard@mediapulse.fr', jsonb_build_object('sub', sal_mp_2::text, 'email', 'chloe.girard@mediapulse.fr'), 'email', now(), now(), now()),
    (sal_uc_1, sal_uc_1, 'maxime.faure@urbancraft.fr', jsonb_build_object('sub', sal_uc_1::text, 'email', 'maxime.faure@urbancraft.fr'), 'email', now(), now(), now()),
    (sal_uc_2, sal_uc_2, 'manon.clement@urbancraft.fr', jsonb_build_object('sub', sal_uc_2::text, 'email', 'manon.clement@urbancraft.fr'), 'email', now(), now(), now()),
    (sal_sl_1, sal_sl_1, 'alexandre.mercier@solulogis.fr', jsonb_build_object('sub', sal_sl_1::text, 'email', 'alexandre.mercier@solulogis.fr'), 'email', now(), now(), now()),
    (sal_sl_2, sal_sl_2, 'sarah.bonnet@solulogis.fr', jsonb_build_object('sub', sal_sl_2::text, 'email', 'sarah.bonnet@solulogis.fr'), 'email', now(), now(), now());

  -- --- COACHÉES B2C ---
  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token)
  VALUES
    (coachee_1, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'marie.leclerc@gmail.com', crypt('Test1234!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"first_name":"Marie","last_name":"LECLERC","role":"coachee"}', now() - interval '9 months', now(), '', ''),
    (coachee_2, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'fatima.benali@outlook.com', crypt('Test1234!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"first_name":"Fatima","last_name":"BENALI","role":"coachee"}', now() - interval '7 months', now(), '', ''),
    (coachee_3, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'isabelle.meyer@gmail.com', crypt('Test1234!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"first_name":"Isabelle","last_name":"MEYER","role":"coachee"}', now() - interval '6 months', now(), '', ''),
    (coachee_4, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'amina.diallo@yahoo.fr', crypt('Test1234!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"first_name":"Amina","last_name":"DIALLO","role":"coachee"}', now() - interval '5 months', now(), '', ''),
    (coachee_5, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'claire.fontaine@gmail.com', crypt('Test1234!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"first_name":"Claire","last_name":"FONTAINE","role":"coachee"}', now() - interval '4 months', now(), '', ''),
    (coachee_6, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'nadia.kone@outlook.com', crypt('Test1234!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"first_name":"Nadia","last_name":"KONÉ","role":"coachee"}', now() - interval '3 months', now(), '', ''),
    (coachee_7, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'virginie.blanc@gmail.com', crypt('Test1234!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"first_name":"Virginie","last_name":"BLANC","role":"coachee"}', now() - interval '2 months', now(), '', ''),
    (coachee_8, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'aissatou.ba@gmail.com', crypt('Test1234!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"first_name":"Aïssatou","last_name":"BA","role":"coachee"}', now() - interval '1 month', now(), '', '');

  INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  VALUES
    (coachee_1, coachee_1, 'marie.leclerc@gmail.com', jsonb_build_object('sub', coachee_1::text, 'email', 'marie.leclerc@gmail.com'), 'email', now(), now(), now()),
    (coachee_2, coachee_2, 'fatima.benali@outlook.com', jsonb_build_object('sub', coachee_2::text, 'email', 'fatima.benali@outlook.com'), 'email', now(), now(), now()),
    (coachee_3, coachee_3, 'isabelle.meyer@gmail.com', jsonb_build_object('sub', coachee_3::text, 'email', 'isabelle.meyer@gmail.com'), 'email', now(), now(), now()),
    (coachee_4, coachee_4, 'amina.diallo@yahoo.fr', jsonb_build_object('sub', coachee_4::text, 'email', 'amina.diallo@yahoo.fr'), 'email', now(), now(), now()),
    (coachee_5, coachee_5, 'claire.fontaine@gmail.com', jsonb_build_object('sub', coachee_5::text, 'email', 'claire.fontaine@gmail.com'), 'email', now(), now(), now()),
    (coachee_6, coachee_6, 'nadia.kone@outlook.com', jsonb_build_object('sub', coachee_6::text, 'email', 'nadia.kone@outlook.com'), 'email', now(), now(), now()),
    (coachee_7, coachee_7, 'virginie.blanc@gmail.com', jsonb_build_object('sub', coachee_7::text, 'email', 'virginie.blanc@gmail.com'), 'email', now(), now(), now()),
    (coachee_8, coachee_8, 'aissatou.ba@gmail.com', jsonb_build_object('sub', coachee_8::text, 'email', 'aissatou.ba@gmail.com'), 'email', now(), now(), now());

  -- --- INTERVENANTS ---
  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token)
  VALUES
    (interv_1, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'dr.rachel.simon@coaching.fr', crypt('Test1234!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"first_name":"Rachel","last_name":"SIMON","role":"intervenant"}', now() - interval '10 months', now(), '', ''),
    (interv_2, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'karim.hassan@pnl-expert.fr', crypt('Test1234!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"first_name":"Karim","last_name":"HASSAN","role":"intervenant"}', now() - interval '8 months', now(), '', ''),
    (interv_3, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'catherine.duval@leadership.fr', crypt('Test1234!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"first_name":"Catherine","last_name":"DUVAL","role":"intervenant"}', now() - interval '6 months', now(), '', '');

  INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  VALUES
    (interv_1, interv_1, 'dr.rachel.simon@coaching.fr', jsonb_build_object('sub', interv_1::text, 'email', 'dr.rachel.simon@coaching.fr'), 'email', now(), now(), now()),
    (interv_2, interv_2, 'karim.hassan@pnl-expert.fr', jsonb_build_object('sub', interv_2::text, 'email', 'karim.hassan@pnl-expert.fr'), 'email', now(), now(), now()),
    (interv_3, interv_3, 'catherine.duval@leadership.fr', jsonb_build_object('sub', interv_3::text, 'email', 'catherine.duval@leadership.fr'), 'email', now(), now(), now());

  -- =============================================
  -- 2. ENTREPRISES
  -- =============================================
  INSERT INTO companies (id, name, mission_start_date, mission_end_date, mission_status, kpi_objectives, dirigeant_id, notes) VALUES
    (comp_techvision_id, 'TechVision', '2025-07-01', '2026-06-30', 'active', '{"investissement_target": 8, "efficacite_target": 7, "participation_target": 7, "ca_increase_target": 25}', dir_techvision_id, 'ESN 120 salariés, objectif +25% CA. Focus leadership managers.'),
    (comp_greenleaf_id, 'GreenLeaf Bio', '2025-09-01', '2026-08-31', 'active', '{"investissement_target": 7, "efficacite_target": 8, "participation_target": 6, "ca_increase_target": 15}', dir_greenleaf_id, 'Start-up cosmétiques bio, 45 salariés. Accompagnement croissance.'),
    (comp_mediapulse_id, 'MediaPulse', '2025-11-01', '2026-10-31', 'active', '{"investissement_target": 7, "efficacite_target": 7, "participation_target": 8, "ca_increase_target": 20}', dir_mediapulse_id, 'Agence digitale, 30 salariés. Renforcement cohésion équipe.'),
    (comp_urbancraft_id, 'UrbanCraft', '2026-01-01', '2026-12-31', 'active', '{"investissement_target": 8, "efficacite_target": 8, "participation_target": 7, "ca_increase_target": 30}', dir_urbancraft_id, 'Cabinet architecture, 25 salariés. Transformation managériale.'),
    (comp_solulogis_id, 'SoluLogis', '2026-02-01', '2027-01-31', 'active', '{"investissement_target": 7, "efficacite_target": 7, "participation_target": 7, "ca_increase_target": 10}', dir_solulogis_id, 'Logistique, 80 salariés. Programme motivation équipes terrain.');

  -- =============================================
  -- 3. METTRE À JOUR LES PROFILS (company_id, onboarding, coaching_type)
  -- =============================================

  -- Dirigeants
  UPDATE profiles SET company_id = comp_techvision_id, onboarding_completed = true, phone = '06 12 34 56 78' WHERE id = dir_techvision_id;
  UPDATE profiles SET company_id = comp_greenleaf_id, onboarding_completed = true, phone = '06 23 45 67 89' WHERE id = dir_greenleaf_id;
  UPDATE profiles SET company_id = comp_mediapulse_id, onboarding_completed = true, phone = '06 34 56 78 90' WHERE id = dir_mediapulse_id;
  UPDATE profiles SET company_id = comp_urbancraft_id, onboarding_completed = true, phone = '06 45 67 89 01' WHERE id = dir_urbancraft_id;
  UPDATE profiles SET company_id = comp_solulogis_id, onboarding_completed = true, phone = '06 56 78 90 12' WHERE id = dir_solulogis_id;

  -- Salariés TechVision
  UPDATE profiles SET company_id = comp_techvision_id, coaching_type = 'entreprise', onboarding_completed = true WHERE id IN (sal_tv_1, sal_tv_2, sal_tv_3, sal_tv_4);
  -- Salariés GreenLeaf
  UPDATE profiles SET company_id = comp_greenleaf_id, coaching_type = 'entreprise', onboarding_completed = true WHERE id IN (sal_gl_1, sal_gl_2, sal_gl_3);
  -- Salariés MediaPulse
  UPDATE profiles SET company_id = comp_mediapulse_id, coaching_type = 'entreprise', onboarding_completed = true WHERE id IN (sal_mp_1, sal_mp_2);
  -- Salariés UrbanCraft
  UPDATE profiles SET company_id = comp_urbancraft_id, coaching_type = 'entreprise', onboarding_completed = true WHERE id IN (sal_uc_1, sal_uc_2);
  -- Salariés SoluLogis
  UPDATE profiles SET company_id = comp_solulogis_id, coaching_type = 'entreprise', onboarding_completed = true WHERE id IN (sal_sl_1, sal_sl_2);

  -- Coachées B2C
  UPDATE profiles SET coaching_type = 'individuel', onboarding_completed = true WHERE id IN (coachee_1, coachee_2, coachee_3, coachee_4, coachee_5, coachee_6);
  UPDATE profiles SET coaching_type = 'individuel', onboarding_completed = false WHERE id IN (coachee_7, coachee_8); -- nouvelles, pas encore onboardées

  -- =============================================
  -- 4. MODULES SUPPLÉMENTAIRES
  -- =============================================
  INSERT INTO modules (id, title, description, content, exercise, order_index, parcours_type, price_cents, is_free, duration_minutes) VALUES
  (mod_5, 'Leadership Authentique', 'Développer un style de leadership aligné avec ses valeurs et sa personnalité.',
    '{"sections": [{"title": "Introduction", "content": "Le leadership authentique repose sur la connaissance de soi..."}, {"title": "Valeurs et vision", "content": "Identifier ses valeurs profondes pour guider ses actions..."}, {"title": "Communication de leader", "content": "S''exprimer avec clarté et conviction..."}]}',
    '{"exercises": [{"title": "Ma vision de leader", "type": "ecrit", "description": "Rédigez votre manifeste de leadership en 500 mots"}, {"title": "Feedback 360", "type": "ecrit", "description": "Recueillez le feedback de 3 collègues sur votre style de leadership"}]}',
    5, 'entreprise', 69000, false, 300),
  (mod_6, 'Gestion du Stress', 'Techniques avancées pour gérer le stress professionnel et personnel.',
    '{"sections": [{"title": "Comprendre le stress", "content": "Les mécanismes du stress et son impact..."}, {"title": "Techniques de relaxation", "content": "Respiration, méditation, relaxation progressive..."}, {"title": "Organisation anti-stress", "content": "Méthodes d''organisation pour réduire le stress quotidien..."}]}',
    '{"exercises": [{"title": "Carnet de stress", "type": "ecrit", "description": "Identifiez vos sources de stress pendant 1 semaine"}, {"title": "Routine bien-être", "type": "audio", "description": "Créez et pratiquez votre routine de 10 minutes"}]}',
    6, 'les_deux', 39000, false, 180),
  (mod_7, 'Communication Non-Violente', 'Apprendre la CNV pour des relations professionnelles harmonieuses.',
    '{"sections": [{"title": "Les bases de la CNV", "content": "Observation, sentiment, besoin, demande..."}, {"title": "Écoute empathique", "content": "Développer une écoute profonde et bienveillante..."}, {"title": "Expression authentique", "content": "S''exprimer sans agressivité ni passivité..."}]}',
    '{"exercises": [{"title": "Journal CNV", "type": "ecrit", "description": "Reformulez 5 situations conflictuelles en langage CNV"}, {"title": "Jeu de rôle", "type": "video", "description": "Filmez un dialogue CNV avec un partenaire"}]}',
    7, 'les_deux', 49000, false, 240),
  (mod_8, 'Découverte - Introduction au coaching', 'Module gratuit d''introduction pour découvrir le coaching NEO.',
    '{"sections": [{"title": "Bienvenue", "content": "Bienvenue dans l''univers NEO-FORMATIONS..."}, {"title": "Qu''est-ce que le coaching ?", "content": "Le coaching professionnel selon Jean-Claude YEKPE..."}, {"title": "Votre parcours", "content": "Comment tirer le meilleur de votre accompagnement..."}]}',
    null,
    0, 'les_deux', 0, true, 30);

  -- =============================================
  -- 5. INTERVENANTS (fiches experts)
  -- =============================================
  INSERT INTO intervenants (user_id, domain, bio, hourly_rate_cents, packages, is_active) VALUES
  (interv_1, 'Process Communication & PNL',
    'Docteure en psychologie, certifiée PCM et PNL. 15 ans d''expérience en accompagnement individuel et collectif. Spécialiste des profils de personnalité et de la communication interpersonnelle.',
    15000, '[{"name": "Séance découverte", "sessions": 1, "price_cents": 8000, "duration_minutes": 45}, {"name": "Pack 5 séances", "sessions": 5, "price_cents": 65000, "duration_minutes": 60}, {"name": "Pack 10 séances", "sessions": 10, "price_cents": 120000, "duration_minutes": 60}]',
    true),
  (interv_2, 'Leadership & Management',
    'Coach certifié ICF PCC, ancien directeur commercial de grands groupes. Expert en leadership situationnel et management de la performance. Intervient en français et en arabe.',
    18000, '[{"name": "Séance individuelle", "sessions": 1, "price_cents": 18000, "duration_minutes": 60}, {"name": "Pack Leadership", "sessions": 8, "price_cents": 128000, "duration_minutes": 60}]',
    true),
  (interv_3, 'Prise de parole & Confiance',
    'Ancienne journaliste TV, coach en prise de parole depuis 10 ans. Accompagne les femmes dirigeantes à s''affirmer en public. Certifiée REP-7 et CDPM-I.',
    12000, '[{"name": "Atelier groupe (max 8)", "sessions": 1, "price_cents": 5000, "duration_minutes": 120}, {"name": "Coaching individuel", "sessions": 1, "price_cents": 12000, "duration_minutes": 60}, {"name": "Pack Confiance 6 séances", "sessions": 6, "price_cents": 60000, "duration_minutes": 60}]',
    true);

  -- =============================================
  -- 6. MODULE PROGRESS
  -- =============================================

  -- Coachées avec progression variée
  -- Marie (9 mois, très active) - a complété 3 modules
  INSERT INTO module_progress (user_id, module_id, status, started_at, submitted_at, validated_at, satisfaction_score) VALUES
    (coachee_1, mod_1, 'validated', now() - interval '8 months', now() - interval '7 months', now() - interval '7 months', 9),
    (coachee_1, mod_2, 'validated', now() - interval '6 months', now() - interval '5 months', now() - interval '5 months', 8),
    (coachee_1, mod_3, 'validated', now() - interval '4 months', now() - interval '3 months', now() - interval '3 months', 9),
    (coachee_1, mod_6, 'in_progress', now() - interval '1 month', null, null, null);

  -- Fatima (7 mois) - 2 modules complétés, 1 en cours
  INSERT INTO module_progress (user_id, module_id, status, started_at, submitted_at, validated_at, satisfaction_score) VALUES
    (coachee_2, mod_1, 'validated', now() - interval '6 months', now() - interval '5 months', now() - interval '5 months', 8),
    (coachee_2, mod_2, 'validated', now() - interval '4 months', now() - interval '3 months', now() - interval '3 months', 7),
    (coachee_2, mod_7, 'in_progress', now() - interval '2 weeks', null, null, null);

  -- Isabelle (6 mois) - 1 complété, 1 soumis
  INSERT INTO module_progress (user_id, module_id, status, started_at, submitted_at, validated_at, satisfaction_score) VALUES
    (coachee_3, mod_1, 'validated', now() - interval '5 months', now() - interval '4 months', now() - interval '4 months', 7),
    (coachee_3, mod_3, 'submitted', now() - interval '2 months', now() - interval '1 week', null, null);

  -- Amina, Claire, Nadia - progression variée
  INSERT INTO module_progress (user_id, module_id, status, started_at, submitted_at, validated_at, satisfaction_score) VALUES
    (coachee_4, mod_1, 'validated', now() - interval '4 months', now() - interval '3 months', now() - interval '3 months', 9),
    (coachee_4, mod_2, 'in_progress', now() - interval '1 month', null, null, null),
    (coachee_5, mod_1, 'in_progress', now() - interval '2 months', null, null, null),
    (coachee_6, mod_8, 'validated', now() - interval '2 months', now() - interval '2 months', now() - interval '2 months', 8),
    (coachee_6, mod_1, 'in_progress', now() - interval '1 month', null, null, null);

  -- Salariés TechVision (les plus anciens ont plus de progression)
  INSERT INTO module_progress (user_id, module_id, status, started_at, submitted_at, validated_at, satisfaction_score) VALUES
    (sal_tv_1, mod_1, 'validated', now() - interval '6 months', now() - interval '5 months', now() - interval '5 months', 8),
    (sal_tv_1, mod_4, 'validated', now() - interval '4 months', now() - interval '3 months', now() - interval '3 months', 9),
    (sal_tv_1, mod_5, 'in_progress', now() - interval '1 month', null, null, null),
    (sal_tv_2, mod_1, 'validated', now() - interval '6 months', now() - interval '5 months', now() - interval '5 months', 7),
    (sal_tv_2, mod_4, 'in_progress', now() - interval '2 months', null, null, null),
    (sal_tv_3, mod_1, 'validated', now() - interval '5 months', now() - interval '4 months', now() - interval '4 months', 8),
    (sal_tv_3, mod_4, 'submitted', now() - interval '2 months', now() - interval '3 weeks', null, null),
    (sal_tv_4, mod_1, 'in_progress', now() - interval '3 months', null, null, null);

  -- Salariés GreenLeaf
  INSERT INTO module_progress (user_id, module_id, status, started_at, submitted_at, validated_at, satisfaction_score) VALUES
    (sal_gl_1, mod_1, 'validated', now() - interval '4 months', now() - interval '3 months', now() - interval '3 months', 9),
    (sal_gl_1, mod_6, 'in_progress', now() - interval '1 month', null, null, null),
    (sal_gl_2, mod_1, 'in_progress', now() - interval '3 months', null, null, null),
    (sal_gl_3, mod_8, 'validated', now() - interval '3 months', now() - interval '3 months', now() - interval '3 months', 7);

  -- =============================================
  -- 7. KPI SCORES (historique mensuel)
  -- =============================================

  -- Marie (coachee_1) - progression très positive sur 8 mois
  INSERT INTO kpi_scores (user_id, investissement, efficacite, participation, scored_at) VALUES
    (coachee_1, 4, 3, 3, now() - interval '8 months'),
    (coachee_1, 5, 4, 4, now() - interval '7 months'),
    (coachee_1, 6, 5, 5, now() - interval '6 months'),
    (coachee_1, 7, 6, 6, now() - interval '5 months'),
    (coachee_1, 7, 7, 6, now() - interval '4 months'),
    (coachee_1, 8, 7, 7, now() - interval '3 months'),
    (coachee_1, 8, 8, 8, now() - interval '2 months'),
    (coachee_1, 9, 8, 8, now() - interval '1 month'),
    (coachee_1, 9, 9, 8, CURRENT_DATE);

  -- Fatima (coachee_2) - bonne progression
  INSERT INTO kpi_scores (user_id, investissement, efficacite, participation, scored_at) VALUES
    (coachee_2, 5, 4, 3, now() - interval '6 months'),
    (coachee_2, 6, 5, 4, now() - interval '5 months'),
    (coachee_2, 6, 5, 5, now() - interval '4 months'),
    (coachee_2, 7, 6, 5, now() - interval '3 months'),
    (coachee_2, 7, 6, 6, now() - interval '2 months'),
    (coachee_2, 8, 7, 6, now() - interval '1 month'),
    (coachee_2, 8, 7, 7, CURRENT_DATE);

  -- Isabelle (coachee_3) - progression moyenne avec un creux
  INSERT INTO kpi_scores (user_id, investissement, efficacite, participation, scored_at) VALUES
    (coachee_3, 5, 5, 4, now() - interval '5 months'),
    (coachee_3, 6, 5, 5, now() - interval '4 months'),
    (coachee_3, 5, 4, 4, now() - interval '3 months'),  -- creux
    (coachee_3, 6, 5, 5, now() - interval '2 months'),
    (coachee_3, 7, 6, 5, now() - interval '1 month'),
    (coachee_3, 7, 6, 6, CURRENT_DATE);

  -- Amina (coachee_4) - excellente
  INSERT INTO kpi_scores (user_id, investissement, efficacite, participation, scored_at) VALUES
    (coachee_4, 6, 5, 5, now() - interval '4 months'),
    (coachee_4, 7, 6, 6, now() - interval '3 months'),
    (coachee_4, 8, 7, 7, now() - interval '2 months'),
    (coachee_4, 8, 8, 7, now() - interval '1 month'),
    (coachee_4, 9, 8, 8, CURRENT_DATE);

  -- Claire (coachee_5) - début récent
  INSERT INTO kpi_scores (user_id, investissement, efficacite, participation, scored_at) VALUES
    (coachee_5, 4, 3, 3, now() - interval '3 months'),
    (coachee_5, 5, 4, 3, now() - interval '2 months'),
    (coachee_5, 5, 4, 4, now() - interval '1 month'),
    (coachee_5, 6, 5, 4, CURRENT_DATE);

  -- Nadia (coachee_6) - en danger (KPI faible)
  INSERT INTO kpi_scores (user_id, investissement, efficacite, participation, scored_at) VALUES
    (coachee_6, 5, 4, 4, now() - interval '2 months'),
    (coachee_6, 4, 3, 3, now() - interval '1 month'),
    (coachee_6, 3, 3, 2, CURRENT_DATE);  -- alerte !

  -- Salariés TechVision avec KPI (liés à l'entreprise)
  INSERT INTO kpi_scores (user_id, company_id, investissement, efficacite, participation, scored_at) VALUES
    (sal_tv_1, comp_techvision_id, 5, 5, 4, now() - interval '6 months'),
    (sal_tv_1, comp_techvision_id, 6, 6, 5, now() - interval '5 months'),
    (sal_tv_1, comp_techvision_id, 7, 7, 6, now() - interval '4 months'),
    (sal_tv_1, comp_techvision_id, 7, 7, 7, now() - interval '3 months'),
    (sal_tv_1, comp_techvision_id, 8, 8, 7, now() - interval '2 months'),
    (sal_tv_1, comp_techvision_id, 8, 8, 8, now() - interval '1 month'),
    (sal_tv_1, comp_techvision_id, 9, 8, 8, CURRENT_DATE),
    (sal_tv_2, comp_techvision_id, 4, 4, 3, now() - interval '6 months'),
    (sal_tv_2, comp_techvision_id, 5, 5, 4, now() - interval '4 months'),
    (sal_tv_2, comp_techvision_id, 6, 5, 5, now() - interval '2 months'),
    (sal_tv_2, comp_techvision_id, 6, 6, 5, CURRENT_DATE),
    (sal_tv_3, comp_techvision_id, 6, 5, 5, now() - interval '4 months'),
    (sal_tv_3, comp_techvision_id, 7, 6, 6, now() - interval '2 months'),
    (sal_tv_3, comp_techvision_id, 7, 7, 6, CURRENT_DATE),
    (sal_tv_4, comp_techvision_id, 3, 3, 2, now() - interval '3 months'),
    (sal_tv_4, comp_techvision_id, 4, 3, 3, now() - interval '1 month'),
    (sal_tv_4, comp_techvision_id, 4, 4, 3, CURRENT_DATE);

  -- Salariés GreenLeaf
  INSERT INTO kpi_scores (user_id, company_id, investissement, efficacite, participation, scored_at) VALUES
    (sal_gl_1, comp_greenleaf_id, 6, 5, 5, now() - interval '4 months'),
    (sal_gl_1, comp_greenleaf_id, 7, 6, 6, now() - interval '2 months'),
    (sal_gl_1, comp_greenleaf_id, 8, 7, 7, CURRENT_DATE),
    (sal_gl_2, comp_greenleaf_id, 4, 4, 3, now() - interval '4 months'),
    (sal_gl_2, comp_greenleaf_id, 5, 5, 4, now() - interval '2 months'),
    (sal_gl_2, comp_greenleaf_id, 5, 5, 4, CURRENT_DATE),
    (sal_gl_3, comp_greenleaf_id, 5, 4, 4, now() - interval '3 months'),
    (sal_gl_3, comp_greenleaf_id, 6, 5, 5, CURRENT_DATE);

  -- =============================================
  -- 8. RENDEZ-VOUS (passés et futurs)
  -- =============================================

  -- RDV passés (coaching sessions avec admin = Jean-Claude)
  INSERT INTO appointments (client_id, coach_id, datetime_start, datetime_end, type, status, zoom_link, notes) VALUES
    -- Marie - 6 sessions passées
    (coachee_1, admin_id, now() - interval '8 months', now() - interval '8 months' + interval '1 hour', 'discovery', 'completed', 'https://zoom.us/j/1234567890', 'Première rencontre. Marie est motivée, objectif estime de soi.'),
    (coachee_1, admin_id, now() - interval '7 months', now() - interval '7 months' + interval '1 hour', 'coaching', 'completed', 'https://zoom.us/j/1234567891', 'Travail sur les croyances limitantes. Bonne prise de conscience.'),
    (coachee_1, admin_id, now() - interval '5 months', now() - interval '5 months' + interval '1 hour', 'coaching', 'completed', 'https://zoom.us/j/1234567892', 'Module estime de soi terminé. Excellente progression.'),
    (coachee_1, admin_id, now() - interval '3 months', now() - interval '3 months' + interval '1 hour', 'coaching', 'completed', 'https://zoom.us/j/1234567893', 'Confiance en soi : travail sur le syndrome de l''imposteur.'),
    (coachee_1, admin_id, now() - interval '1 month', now() - interval '1 month' + interval '1 hour', 'coaching', 'completed', 'https://zoom.us/j/1234567894', 'Point mi-parcours. KPIs excellents. Marie rayonne.'),
    -- Fatima - 4 sessions
    (coachee_2, admin_id, now() - interval '6 months', now() - interval '6 months' + interval '1 hour', 'discovery', 'completed', 'https://zoom.us/j/2234567890', 'Découverte. Fatima souhaite gagner en confiance au travail.'),
    (coachee_2, admin_id, now() - interval '4 months', now() - interval '4 months' + interval '1 hour', 'coaching', 'completed', 'https://zoom.us/j/2234567891', 'Module intelligence émotionnelle validé. Bon travail.'),
    (coachee_2, admin_id, now() - interval '2 months', now() - interval '2 months' + interval '1 hour', 'coaching', 'completed', 'https://zoom.us/j/2234567892', 'Progrès notables. Fatima prend plus la parole en réunion.'),
    (coachee_2, admin_id, now() - interval '2 weeks', now() - interval '2 weeks' + interval '1 hour', 'coaching', 'completed', 'https://zoom.us/j/2234567893', 'CNV en cours. Applications concrètes au quotidien.'),
    -- Isabelle
    (coachee_3, admin_id, now() - interval '5 months', now() - interval '5 months' + interval '1 hour', 'discovery', 'completed', 'https://zoom.us/j/3234567890', 'Découverte. Isabelle en transition professionnelle.'),
    (coachee_3, admin_id, now() - interval '3 months', now() - interval '3 months' + interval '45 minutes', 'coaching', 'completed', null, 'Période difficile, baisse de motivation. Soutien.'),
    -- Amina
    (coachee_4, admin_id, now() - interval '4 months', now() - interval '4 months' + interval '1 hour', 'discovery', 'completed', 'https://zoom.us/j/4234567890', 'Amina très engagée dès le départ. Objectif prise de parole.'),
    (coachee_4, admin_id, now() - interval '2 months', now() - interval '2 months' + interval '1 hour', 'coaching', 'completed', 'https://zoom.us/j/4234567891', 'Progression fulgurante. Module IE validé avec brio.'),
    -- Nadia (alerte)
    (coachee_6, admin_id, now() - interval '2 months', now() - interval '2 months' + interval '1 hour', 'discovery', 'completed', 'https://zoom.us/j/6234567890', 'Nadia stressée. Beaucoup de pression au travail.'),
    (coachee_6, admin_id, now() - interval '3 weeks', now() - interval '3 weeks' + interval '1 hour', 'coaching', 'no_show', null, 'Nadia ne s''est pas présentée. Envoyer message de suivi.');

  -- RDV futurs
  INSERT INTO appointments (client_id, coach_id, datetime_start, datetime_end, type, status, zoom_link) VALUES
    (coachee_1, admin_id, now() + interval '3 days', now() + interval '3 days' + interval '1 hour', 'coaching', 'scheduled', 'https://zoom.us/j/9234567890'),
    (coachee_2, admin_id, now() + interval '5 days', now() + interval '5 days' + interval '1 hour', 'coaching', 'scheduled', 'https://zoom.us/j/9234567891'),
    (coachee_3, admin_id, now() + interval '1 week', now() + interval '1 week' + interval '1 hour', 'coaching', 'scheduled', 'https://zoom.us/j/9234567892'),
    (coachee_4, admin_id, now() + interval '10 days', now() + interval '10 days' + interval '1 hour', 'module_review', 'scheduled', 'https://zoom.us/j/9234567893'),
    (coachee_6, admin_id, now() + interval '2 days', now() + interval '2 days' + interval '1 hour', 'coaching', 'scheduled', 'https://zoom.us/j/9234567894'),
    -- Sessions intervenant
    (coachee_1, interv_3, now() + interval '1 week' + interval '2 hours', now() + interval '1 week' + interval '3 hours', 'intervenant', 'scheduled', 'https://zoom.us/j/9234567895'),
    (coachee_4, interv_1, now() + interval '2 weeks', now() + interval '2 weeks' + interval '1 hour', 'intervenant', 'scheduled', 'https://zoom.us/j/9234567896'),
    -- RDV entreprise
    (sal_tv_1, admin_id, now() + interval '4 days', now() + interval '4 days' + interval '1 hour', 'coaching', 'scheduled', 'https://zoom.us/j/9234567897'),
    (sal_gl_1, admin_id, now() + interval '6 days', now() + interval '6 days' + interval '1 hour', 'coaching', 'scheduled', 'https://zoom.us/j/9234567898');

  -- =============================================
  -- 9. BOOKING FORM SUBMISSIONS (prospects)
  -- =============================================
  INSERT INTO booking_form_submissions (first_name, last_name, email, phone, responses, step_reached, completed, source) VALUES
    ('Laure', 'PETIT', 'laure.petit@orange.fr', '06 78 12 34 56', '{"type": "individuel", "challenge": "confiance", "situation": "En poste depuis 3 ans, pas de promotion. Je veux oser demander.", "motivation": "Arrêter de me sous-estimer", "budget": "B", "duration": "6m"}', 5, true, 'landing_page'),
    ('Rachid', 'MANSOURI', 'r.mansouri@entreprise.com', '06 89 23 45 67', '{"type": "entreprise", "challenge": "performance", "situation": "DG PME 50 salariés, turnover élevé", "motivation": "Fidéliser et motiver les équipes", "budget": "C", "duration": "12m"}', 5, true, 'landing_page'),
    ('Sandrine', 'VIDAL', 'sandrine.v@free.fr', '06 90 34 56 78', '{"type": "individuel", "challenge": "prise_de_parole", "situation": "Je tremble quand je dois parler en réunion"}', 3, false, 'google_ads'),
    ('Olivia', 'CHEN', 'olivia.chen@startup.io', '07 01 45 67 89', '{"type": "individuel", "challenge": "estime"}', 2, false, 'instagram'),
    ('Antoine', 'MOREAU', 'a.moreau@industrie.fr', '06 12 56 78 90', '{"type": "entreprise", "challenge": "leadership"}', 1, false, 'referral');

  -- =============================================
  -- 10. GROUPES & MEMBRES
  -- =============================================

  -- Groupe TechVision
  INSERT INTO groups (id, name, type, company_id, created_by) VALUES
    (grp_tv, 'Équipe TechVision', 'entreprise', comp_techvision_id, admin_id),
    (grp_gl, 'Équipe GreenLeaf', 'entreprise', comp_greenleaf_id, admin_id),
    (grp_coachees, 'Coachées Individuelles', 'coaching_individuel', null, admin_id),
    (grp_general, 'Communauté NEO', 'general', null, admin_id);

  -- Membres
  INSERT INTO group_members (group_id, user_id) VALUES
    -- TechVision
    (grp_tv, admin_id), (grp_tv, dir_techvision_id), (grp_tv, sal_tv_1), (grp_tv, sal_tv_2), (grp_tv, sal_tv_3), (grp_tv, sal_tv_4),
    -- GreenLeaf
    (grp_gl, admin_id), (grp_gl, dir_greenleaf_id), (grp_gl, sal_gl_1), (grp_gl, sal_gl_2), (grp_gl, sal_gl_3),
    -- Coachées
    (grp_coachees, admin_id), (grp_coachees, coachee_1), (grp_coachees, coachee_2), (grp_coachees, coachee_3), (grp_coachees, coachee_4), (grp_coachees, coachee_5), (grp_coachees, coachee_6),
    -- Général (tout le monde)
    (grp_general, admin_id), (grp_general, coachee_1), (grp_general, coachee_2), (grp_general, coachee_4), (grp_general, sal_tv_1), (grp_general, sal_gl_1);

  -- =============================================
  -- 11. MESSAGES
  -- =============================================
  INSERT INTO messages (group_id, sender_id, content, created_at) VALUES
    (grp_coachees, admin_id, 'Bienvenue dans la communauté des coachées NEO ! Cet espace est le vôtre pour échanger, partager vos victoires et vous soutenir mutuellement.', now() - interval '8 months'),
    (grp_coachees, coachee_1, 'Merci Jean-Claude ! Ravie de rejoindre ce groupe. J''ai hâte de commencer le parcours.', now() - interval '8 months' + interval '2 hours'),
    (grp_coachees, coachee_2, 'Bonjour à toutes ! Fatima ici, j''ai commencé le module Intelligence Émotionnelle et c''est passionnant.', now() - interval '5 months'),
    (grp_coachees, coachee_4, 'Le module IE m''a énormément aidée au travail. Je recommande de prendre le temps de faire les exercices.', now() - interval '3 months'),
    (grp_coachees, coachee_1, 'Je viens de terminer le module Confiance en soi ! Le passage sur le syndrome de l''imposteur m''a vraiment parlé. Quelqu''un d''autre l''a fait ?', now() - interval '2 months'),
    (grp_coachees, coachee_2, '@Marie Oui ! C''est celui qui m''a le plus marquée aussi. L''exercice de l''inventaire des forces est très puissant.', now() - interval '2 months' + interval '3 hours'),
    (grp_coachees, admin_id, 'Bravo à toutes pour votre engagement ! Rappel : les questionnaires de satisfaction sont disponibles après chaque module. Vos retours sont précieux.', now() - interval '1 month'),
    (grp_coachees, coachee_5, 'Bonjour ! Claire ici, nouvelle dans le groupe. J''ai un peu peur de ne pas y arriver...', now() - interval '2 weeks'),
    (grp_coachees, coachee_1, '@Claire Bienvenue ! On est toutes passées par là. Fais-toi confiance, le parcours est très bien structuré.', now() - interval '2 weeks' + interval '1 hour'),
    (grp_tv, admin_id, 'Bonjour équipe TechVision ! Votre espace d''échange est prêt. N''hésitez pas à partager vos retours sur les modules.', now() - interval '6 months'),
    (grp_tv, sal_tv_1, 'Super initiative ! Le module sur la prise de parole m''a beaucoup aidé pour ma dernière présentation client.', now() - interval '3 months'),
    (grp_tv, sal_tv_3, 'Quelqu''un a des astuces pour mieux gérer le stress avant les deadlines ? Le module gestion du stress est génial mais j''aimerais des tips concrets.', now() - interval '1 month'),
    (grp_general, admin_id, 'Bienvenue dans la communauté NEO-FORMATIONS ! Ici on partage des ressources, des articles et des bonnes pratiques.', now() - interval '6 months');

  -- =============================================
  -- 12. TÂCHES
  -- =============================================
  INSERT INTO tasks (user_id, company_id, title, due_date, status, completed_at, completion_speed) VALUES
    -- Marie
    (coachee_1, null, 'Compléter le journal émotionnel (7 jours)', (now() - interval '7 months')::date, 'completed', now() - interval '7 months', 'on_time'),
    (coachee_1, null, 'Rédiger la lettre à soi-même', (now() - interval '5 months')::date, 'completed', now() - interval '5 months' + interval '2 days', 'next_day'),
    (coachee_1, null, 'Pratiquer la routine bien-être quotidienne', (now() + interval '2 weeks')::date, 'pending', null, null),
    -- Fatima
    (coachee_2, null, 'Compléter le scan corporel', (now() - interval '4 months')::date, 'completed', now() - interval '4 months', 'same_day'),
    (coachee_2, null, 'Reformuler 5 situations en CNV', (now() + interval '1 week')::date, 'pending', null, null),
    -- Nadia (tâches en retard)
    (coachee_6, null, 'Terminer le module découverte', (now() - interval '1 month')::date, 'completed', now() - interval '3 weeks', 'late'),
    (coachee_6, null, 'Planifier sa routine anti-stress', (now() - interval '1 week')::date, 'pending', null, null),
    -- Salariés
    (sal_tv_1, comp_techvision_id, 'Préparer le pitch projet Q2', (now() + interval '5 days')::date, 'pending', null, null),
    (sal_tv_2, comp_techvision_id, 'Compléter module Prise de Parole - Leçon 2', (now() + interval '10 days')::date, 'pending', null, null),
    (sal_tv_3, comp_techvision_id, 'Soumettre le livrable module Prise de Parole', (now() - interval '1 week')::date, 'pending', null, null),
    (sal_gl_1, comp_greenleaf_id, 'Finir le carnet de stress (exercice semaine)', (now() + interval '3 days')::date, 'pending', null, null);

  -- =============================================
  -- 13. NOTIFICATIONS
  -- =============================================
  INSERT INTO notifications (user_id, type, title, body, link, is_read, created_at) VALUES
    -- Marie
    (coachee_1, 'rdv_reminder', 'Rappel RDV', 'Votre séance de coaching est dans 24h.', '/coaching/dashboard', false, now() - interval '1 day'),
    (coachee_1, 'module_complete', 'Module validé !', 'Félicitations ! Le module "Confiance en soi" est validé.', '/coaching/modules', true, now() - interval '3 months'),
    (coachee_1, 'message', 'Nouveau message', 'Claire a répondu dans la communauté.', '/coaching/communaute', false, now() - interval '2 weeks'),
    -- Fatima
    (coachee_2, 'rdv_reminder', 'Rappel RDV', 'Votre séance de coaching est dans 24h.', '/coaching/dashboard', false, now() - interval '1 day'),
    (coachee_2, 'module_reminder', 'Module en cours', 'N''oubliez pas de terminer le module CNV !', '/coaching/modules', false, now() - interval '3 days'),
    -- Nadia (alertes)
    (coachee_6, 'kpi_alert', 'Alerte KPI', 'Votre score d''investissement a baissé. Besoin d''aide ?', '/coaching/dashboard', false, now() - interval '1 week'),
    (coachee_6, 'rdv_reminder', 'Nouveau RDV planifié', 'Jean-Claude vous a programmé une session de suivi.', '/coaching/dashboard', false, now() - interval '2 days'),
    -- Admin
    (admin_id, 'kpi_alert', 'Alerte KPI - Nadia KONÉ', 'KPI investissement en dessous de 4. Action requise.', '/admin/coachees', false, now() - interval '1 week'),
    (admin_id, 'message', '5 nouveaux messages', 'Activité dans la communauté Coachées Individuelles.', '/admin/communaute', false, now() - interval '2 days'),
    (admin_id, 'rdv_reminder', '3 RDV cette semaine', 'Vous avez 3 séances planifiées cette semaine.', '/admin/rdv', false, now() - interval '1 day'),
    -- Salariés
    (sal_tv_1, 'rdv_reminder', 'Rappel RDV', 'Votre session coaching est prévue dans 4 jours.', '/salarie/agenda', false, now()),
    (sal_tv_3, 'task_reminder', 'Tâche en retard', 'Le livrable du module Prise de Parole est en retard.', '/salarie/modules', false, now() - interval '2 days'),
    -- Dirigeant
    (dir_techvision_id, 'module_complete', 'Module validé', 'Alice MOREL a complété le module "Prise de Parole".', '/dirigeant/equipe', true, now() - interval '3 months');

  RAISE NOTICE '✅ Seed complet ! Créés : 5 entreprises, 5 dirigeants, 13 salariés, 8 coachées, 3 intervenants, 8 modules, KPIs historiques, RDV, messages, tâches, notifications.';
END $$;
