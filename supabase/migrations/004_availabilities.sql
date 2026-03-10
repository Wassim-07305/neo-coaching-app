-- Table pour les disponibilites des intervenants
CREATE TABLE IF NOT EXISTS availabilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT valid_time_range CHECK (start_time < end_time)
);

-- Index pour les requetes par user
CREATE INDEX IF NOT EXISTS idx_availabilities_user_id ON availabilities(user_id);

-- RLS
ALTER TABLE availabilities ENABLE ROW LEVEL SECURITY;

-- Les intervenants peuvent voir et gerer leurs propres disponibilites
CREATE POLICY "Users can view own availabilities"
  ON availabilities FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own availabilities"
  ON availabilities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own availabilities"
  ON availabilities FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own availabilities"
  ON availabilities FOR DELETE
  USING (auth.uid() = user_id);

-- Les admins peuvent voir toutes les disponibilites
CREATE POLICY "Admins can view all availabilities"
  ON availabilities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Lecture publique pour la reservation (creneaux actifs uniquement)
CREATE POLICY "Public can view active availabilities"
  ON availabilities FOR SELECT
  USING (is_active = true);
