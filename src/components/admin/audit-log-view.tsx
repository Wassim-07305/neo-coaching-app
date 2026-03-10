"use client";

import { useState, useEffect, useCallback } from "react";
import { Shield, Search, Download } from "lucide-react";
import { actionLabels, type AuditAction, type AuditEntry } from "@/lib/audit-log";
import { cn } from "@/lib/utils";

const actionColors: Record<string, string> = {
  user_login: "bg-blue-50 text-blue-600",
  user_created: "bg-green-50 text-green-600",
  user_updated: "bg-yellow-50 text-yellow-700",
  user_archived: "bg-red-50 text-red-600",
  module_created: "bg-purple-50 text-purple-600",
  module_updated: "bg-purple-50 text-purple-600",
  module_assigned: "bg-indigo-50 text-indigo-600",
  kpi_updated: "bg-orange-50 text-orange-600",
  kpi_manual_override: "bg-orange-50 text-orange-600",
  rdv_created: "bg-cyan-50 text-cyan-600",
  rdv_cancelled: "bg-red-50 text-red-600",
  report_generated: "bg-green-50 text-green-600",
  message_deleted: "bg-red-50 text-red-600",
  settings_changed: "bg-gray-100 text-gray-600",
  data_exported: "bg-blue-50 text-blue-600",
  csv_imported: "bg-teal-50 text-teal-600",
};

export function AuditLogView() {
  const [filter, setFilter] = useState<AuditAction | "">("");
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter) params.set("action", filter);
      params.set("limit", "50");
      const res = await fetch(`/api/audit-logs?${params}`);
      if (res.ok) {
        setEntries(await res.json());
      }
    } catch {
      setEntries([]);
    }
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const filtered = search
    ? entries.filter(
        (e) =>
          e.action.toLowerCase().includes(search.toLowerCase()) ||
          e.targetType?.toLowerCase().includes(search.toLowerCase()) ||
          e.userId.toLowerCase().includes(search.toLowerCase())
      )
    : entries;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Shield className="h-5 w-5 text-[#D4A843]" />
        <h3 className="font-heading text-lg font-bold text-dark">
          Journal d&apos;audit
        </h3>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm focus:border-[#D4A843] focus:outline-none"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as AuditAction | "")}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white focus:border-[#D4A843] focus:outline-none"
        >
          <option value="">Toutes les actions</option>
          {Object.entries(actionLabels).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
          <Download className="h-4 w-4" />
          Exporter
        </button>
      </div>

      <div className="space-y-2">
        {loading ? (
          <p className="py-8 text-center text-sm text-gray-400">
            Chargement...
          </p>
        ) : filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400">
            Aucune entree trouvee
          </p>
        ) : (
          filtered.map((entry) => (
            <div
              key={entry.id}
              className="flex items-start gap-3 rounded-lg border border-gray-100 bg-white p-3"
            >
              <span
                className={cn(
                  "mt-0.5 shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold",
                  actionColors[entry.action] || "bg-gray-100 text-gray-600"
                )}
              >
                {actionLabels[entry.action]}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">{entry.userId}</span>
                  {entry.targetType && (
                    <span className="text-gray-500">
                      {" → "}{entry.targetType}
                      {entry.targetId && ` (${entry.targetId.slice(0, 8)}…)`}
                    </span>
                  )}
                </p>
              </div>
              <span className="shrink-0 text-[10px] text-gray-400">
                {new Date(entry.createdAt).toLocaleString("fr-FR", {
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
