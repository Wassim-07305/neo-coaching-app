-- =============================================
-- Migration: Audit Logs Table
-- Date: 2026-03-10
-- Description: Immutable audit_logs table for tracking
--   all admin and system actions in Neo-Coaching
-- =============================================

-- Enum for audit actions
CREATE TYPE audit_action AS ENUM (
  'user_login',
  'user_created',
  'user_updated',
  'user_archived',
  'module_created',
  'module_updated',
  'module_assigned',
  'kpi_updated',
  'kpi_manual_override',
  'rdv_created',
  'rdv_cancelled',
  'report_generated',
  'message_deleted',
  'settings_changed',
  'data_exported',
  'csv_imported'
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  action      audit_action NOT NULL,
  target_type TEXT,
  target_id   UUID,
  before_data JSONB,
  after_data  JSONB,
  ip_address  INET,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX idx_audit_logs_user_id    ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action     ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_target     ON audit_logs(target_type, target_id);

-- Enable RLS – only admins can read, no one can update/delete (immutable)
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can read audit logs" ON audit_logs
  FOR SELECT USING (is_admin());

-- Service-role key bypasses RLS automatically for server-side inserts
-- No INSERT policy for regular users – only server-side code can write

-- No UPDATE or DELETE policies – audit logs are immutable

COMMENT ON TABLE audit_logs IS 'Immutable audit trail – admin read-only, server-side insert via service_role';
