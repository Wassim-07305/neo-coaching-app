// Audit log system (F36d) – Supabase-backed

import { createClient } from "@supabase/supabase-js";

export type AuditAction =
  | "user_login"
  | "user_created"
  | "user_updated"
  | "user_archived"
  | "module_created"
  | "module_updated"
  | "module_assigned"
  | "kpi_updated"
  | "kpi_manual_override"
  | "rdv_created"
  | "rdv_cancelled"
  | "report_generated"
  | "message_deleted"
  | "settings_changed"
  | "data_exported"
  | "csv_imported";

export interface AuditEntry {
  id: string;
  userId: string;
  action: AuditAction;
  targetType?: string;
  targetId?: string;
  beforeData?: Record<string, unknown>;
  afterData?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: string;
}

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase credentials not configured for audit logging");
  }
  return createClient(url, key);
}

function rowToEntry(row: Record<string, unknown>): AuditEntry {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    action: row.action as AuditAction,
    targetType: row.target_type as string | undefined,
    targetId: row.target_id as string | undefined,
    beforeData: row.before_data as Record<string, unknown> | undefined,
    afterData: row.after_data as Record<string, unknown> | undefined,
    ipAddress: row.ip_address as string | undefined,
    createdAt: row.created_at as string,
  };
}

export async function logAudit(
  entry: Omit<AuditEntry, "id" | "createdAt">
): Promise<AuditEntry> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("audit_logs")
    .insert({
      user_id: entry.userId,
      action: entry.action,
      target_type: entry.targetType || null,
      target_id: entry.targetId || null,
      before_data: entry.beforeData || null,
      after_data: entry.afterData || null,
      ip_address: entry.ipAddress || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to insert audit log:", error);
    return {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
  }

  return rowToEntry(data);
}

export async function getAuditLog(filters?: {
  action?: AuditAction;
  userId?: string;
  from?: string;
  to?: string;
  limit?: number;
}): Promise<AuditEntry[]> {
  const supabase = getSupabaseAdmin();

  let query = supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(filters?.limit || 50);

  if (filters?.action) {
    query = query.eq("action", filters.action);
  }
  if (filters?.userId) {
    query = query.eq("user_id", filters.userId);
  }
  if (filters?.from) {
    query = query.gte("created_at", filters.from);
  }
  if (filters?.to) {
    query = query.lte("created_at", filters.to);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch audit logs:", error);
    return [];
  }

  return (data || []).map(rowToEntry);
}

export const actionLabels: Record<AuditAction, string> = {
  user_login: "Connexion",
  user_created: "Creation utilisateur",
  user_updated: "Modification utilisateur",
  user_archived: "Archivage utilisateur",
  module_created: "Creation module",
  module_updated: "Modification module",
  module_assigned: "Assignation module",
  kpi_updated: "Mise a jour KPI",
  kpi_manual_override: "Ajustement manuel KPI",
  rdv_created: "Creation RDV",
  rdv_cancelled: "Annulation RDV",
  report_generated: "Generation rapport",
  message_deleted: "Suppression message",
  settings_changed: "Modification parametres",
  data_exported: "Export de donnees",
  csv_imported: "Import CSV",
};
