-- Table pour les tokens d'invitation (liens d'inscription entreprise)
CREATE TABLE IF NOT EXISTS invitation_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT UNIQUE NOT NULL,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES profiles(id),
  email TEXT,
  role TEXT NOT NULL DEFAULT 'salarie' CHECK (role IN ('salarie', 'dirigeant', 'coachee', 'intervenant')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'revoked')),
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_by UUID REFERENCES profiles(id),
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index pour la recherche rapide par token
CREATE INDEX IF NOT EXISTS idx_invitation_tokens_token ON invitation_tokens(token);
-- Index pour lister les invitations d'une entreprise
CREATE INDEX IF NOT EXISTS idx_invitation_tokens_company ON invitation_tokens(company_id);

-- RLS
ALTER TABLE invitation_tokens ENABLE ROW LEVEL SECURITY;

-- Les admins peuvent tout voir et creer
CREATE POLICY "Admins can manage invitation tokens"
  ON invitation_tokens FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- Les dirigeants peuvent voir/creer pour leur entreprise
CREATE POLICY "Dirigeants can manage their company invitation tokens"
  ON invitation_tokens FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'dirigeant'
        AND EXISTS (
          SELECT 1 FROM companies
          WHERE companies.id = invitation_tokens.company_id
            AND companies.dirigeant_id = auth.uid()
        )
    )
  );

-- Lecture publique pour valider un token (necessaire pour la page d'invitation)
CREATE POLICY "Anyone can read pending tokens by token value"
  ON invitation_tokens FOR SELECT
  USING (status = 'pending' AND expires_at > now());
