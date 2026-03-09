// Audit log system (F36d)

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
  action: AuditAction;
  userId: string;
  userName: string;
  targetType?: string;
  targetId?: string;
  targetName?: string;
  detail?: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  timestamp: string;
  ip?: string;
}

// In-memory store for demo. Replace with Supabase table in production.
const auditStore: AuditEntry[] = [];

let counter = 0;

export function logAudit(
  entry: Omit<AuditEntry, "id" | "timestamp">
): AuditEntry {
  const full: AuditEntry = {
    ...entry,
    id: `audit-${++counter}`,
    timestamp: new Date().toISOString(),
  };
  auditStore.unshift(full);
  // Keep max 1000 entries in memory
  if (auditStore.length > 1000) auditStore.pop();
  return full;
}

export function getAuditLog(filters?: {
  action?: AuditAction;
  userId?: string;
  from?: string;
  to?: string;
  limit?: number;
}): AuditEntry[] {
  let results = [...auditStore];

  if (filters?.action) {
    results = results.filter((e) => e.action === filters.action);
  }
  if (filters?.userId) {
    results = results.filter((e) => e.userId === filters.userId);
  }
  if (filters?.from) {
    results = results.filter((e) => e.timestamp >= filters.from!);
  }
  if (filters?.to) {
    results = results.filter((e) => e.timestamp <= filters.to!);
  }

  return results.slice(0, filters?.limit || 50);
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

// Seed some demo entries
[
  { action: "user_login" as const, userName: "Jean-Claude YEKPE", detail: "Connexion admin" },
  { action: "module_assigned" as const, userName: "Jean-Claude YEKPE", targetName: "Marie Dupont", detail: "Module: Confiance en soi" },
  { action: "kpi_manual_override" as const, userName: "Jean-Claude YEKPE", targetName: "Pierre Leclerc", detail: "Investissement: 4 → 3 (decrochage observe)" },
  { action: "report_generated" as const, userName: "Systeme", detail: "Rapport mensuel Alpha Corp - Fevrier 2026" },
  { action: "rdv_created" as const, userName: "Jean-Claude YEKPE", targetName: "Laura Chevalier", detail: "Decouverte - 27/02 09:00" },
  { action: "csv_imported" as const, userName: "Jean-Claude YEKPE", detail: "4 salaries importes pour Alpha Corp" },
  { action: "message_deleted" as const, userName: "Jean-Claude YEKPE", targetName: "Communaute Alpha Corp", detail: "Message inapproprie supprime" },
  { action: "data_exported" as const, userName: "Jean-Claude YEKPE", detail: "Export CSV coachees" },
].forEach((entry) => {
  logAudit({
    ...entry,
    userId: "admin-1",
  });
});
