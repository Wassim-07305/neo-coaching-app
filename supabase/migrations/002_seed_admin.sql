-- =============================================
-- Neo-Coaching - Seed: Créer l'admin Jean-Claude YEKPE
-- Exécuter APRÈS 001_initial_schema.sql
-- =============================================

-- Note: Pour créer l'utilisateur admin, il y a 2 options :
--
-- OPTION A (recommandée) : Créer le compte via le Dashboard Supabase
--   1. Aller dans Authentication > Users > Add User
--   2. Email: jc@neo-coaching.fr / Mot de passe: choisir un mot de passe sécurisé
--   3. Cocher "Auto Confirm User"
--   4. Puis exécuter le UPDATE ci-dessous pour passer le rôle en admin
--
-- OPTION B : Créer via SQL (ci-dessous)
--   Exécuter tout ce fichier d'un coup

-- OPTION B: Créer l'utilisateur directement en SQL
-- (Remplacer le mot de passe par un mot de passe sécurisé)
DO $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Vérifier si l'utilisateur existe déjà
  SELECT id INTO new_user_id FROM auth.users WHERE email = 'jc@neo-coaching.fr';

  IF new_user_id IS NULL THEN
    -- Créer l'utilisateur dans auth.users
    new_user_id := gen_random_uuid();

    INSERT INTO auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      recovery_token
    ) VALUES (
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'jc@neo-coaching.fr',
      crypt('NeoCoach2026!', gen_salt('bf')),
      now(),
      '{"provider": "email", "providers": ["email"]}',
      '{"first_name": "Jean-Claude", "last_name": "YEKPE", "role": "admin"}',
      now(),
      now(),
      '',
      ''
    );

    -- Créer l'identité email
    INSERT INTO auth.identities (
      id,
      user_id,
      provider_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      new_user_id,
      new_user_id,
      'jc@neo-coaching.fr',
      jsonb_build_object('sub', new_user_id::text, 'email', 'jc@neo-coaching.fr'),
      'email',
      now(),
      now(),
      now()
    );

    RAISE NOTICE 'Utilisateur admin créé avec ID: %', new_user_id;
  ELSE
    RAISE NOTICE 'Utilisateur existe déjà avec ID: %', new_user_id;
  END IF;

  -- S'assurer que le profil a le rôle admin
  UPDATE profiles SET
    role = 'admin',
    first_name = 'Jean-Claude',
    last_name = 'YEKPE',
    status = 'active',
    onboarding_completed = true
  WHERE id = new_user_id;
END $$;

-- =============================================
-- Seed: Données de démonstration (modules)
-- =============================================
INSERT INTO modules (title, description, content, exercise, order_index, parcours_type, price_cents, is_free, duration_minutes) VALUES
(
  'Intelligence Emotionnelle',
  'Développer sa conscience émotionnelle et sa capacité à gérer ses émotions au quotidien.',
  '{"sections": [{"title": "Introduction", "content": "Ce module couvre la conscience de soi émotionnelle..."}, {"title": "La conscience de soi", "content": "Apprendre à identifier et nommer ses émotions..."}, {"title": "La régulation émotionnelle", "content": "Techniques pour gérer ses émotions au quotidien..."}]}',
  '{"exercises": [{"title": "Journal émotionnel", "type": "ecrit", "description": "Tenez un journal de vos émotions pendant 7 jours"}, {"title": "Scan corporel", "type": "audio", "description": "Enregistrez une méditation guidée de scan corporel"}]}',
  1, 'les_deux', 49000, false, 240
),
(
  'Estime de soi',
  'Renforcer l''image de soi et construire une estime solide et durable.',
  '{"sections": [{"title": "Introduction", "content": "Explorer les fondements de l''estime de soi..."}, {"title": "Croyances limitantes", "content": "Identifier et déconstruire ses croyances limitantes..."}, {"title": "Affirmation de soi", "content": "Exercices pratiques d''affirmation de soi..."}]}',
  '{"exercises": [{"title": "Lettre à soi-même", "type": "ecrit", "description": "Écrivez une lettre bienveillante à vous-même"}, {"title": "Méditation guidée", "type": "audio", "description": "Méditation sur l''acceptation de soi"}]}',
  2, 'individuel', 49000, false, 240
),
(
  'Confiance en soi',
  'Bâtir et maintenir une confiance solide face aux défis professionnels et personnels.',
  '{"sections": [{"title": "Introduction", "content": "La confiance en soi est un muscle qui se travaille..."}, {"title": "Identifier ses forces", "content": "Exercices pour reconnaître ses compétences et réussites..."}, {"title": "Le syndrome de l''imposteur", "content": "Comprendre et surmonter le syndrome de l''imposteur..."}]}',
  '{"exercises": [{"title": "Inventaire des forces", "type": "ecrit", "description": "Listez vos 10 plus grandes forces et réussites"}, {"title": "Défi de la semaine", "type": "video", "description": "Filmez-vous en relevant un défi qui vous fait peur"}]}',
  3, 'les_deux', 49000, false, 240
),
(
  'Prise de parole',
  'Maîtriser l''art de s''exprimer en public avec aisance et impact.',
  '{"sections": [{"title": "Introduction", "content": "La prise de parole en public est une compétence clé..."}, {"title": "Storytelling", "content": "Techniques de storytelling pour captiver son audience..."}, {"title": "Gestion du trac", "content": "Méthodes pour gérer le stress avant une présentation..."}]}',
  '{"exercises": [{"title": "Pitch 2 minutes", "type": "video", "description": "Préparez et filmez un pitch de 2 minutes"}, {"title": "Analyse de discours", "type": "ecrit", "description": "Analysez un discours inspirant et identifiez les techniques utilisées"}]}',
  4, 'entreprise', 59000, false, 360
);
