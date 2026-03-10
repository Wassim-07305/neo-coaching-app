"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Users,
  Plus,
  Search,
  Filter,
  Building2,
  User,
  Loader2,
  Download,
  CheckSquare,
  Trash2,
  Mail,
  UserX,
  X,
} from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { EmptyState } from "@/components/ui/empty-state";
import { CoacheeTable } from "@/components/admin/coachee-table";
import { CreateCoacheeModal } from "@/components/admin/create-coachee-modal";
import { useProfiles, useCompanies, useModuleProgress, useKpiScores } from "@/hooks/use-supabase-data";
import { mockCoachees } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { createUntypedClient } from "@/lib/supabase/client";

type FilterType = "all" | "individuel" | "entreprise";
type StatusFilter = "all" | "actif" | "inactif" | "archive";

export default function CoacheesPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  // Fetch real data from Supabase
  const { data: profiles, loading: profilesLoading, refetch: refetchProfiles } = useProfiles();
  const { data: companies } = useCompanies();
  const { data: moduleProgressList } = useModuleProgress();
  const { data: allKpiScores } = useKpiScores();

  // Build a map of latest KPI scores per user
  const latestKpiByUser = useMemo(() => {
    const map: Record<string, { investissement: number; efficacite: number; participation: number }> = {};
    if (!allKpiScores) return map;

    for (const score of allKpiScores) {
      if (!map[score.user_id]) {
        // Scores are ordered by scored_at desc, so the first one per user is the latest
        map[score.user_id] = {
          investissement: score.investissement ?? 5,
          efficacite: score.efficacite ?? 5,
          participation: score.participation ?? 5,
        };
      }
    }
    return map;
  }, [allKpiScores]);

  // Transform Supabase data to match component props
  const coachees = useMemo(() => {
    if (profiles && profiles.length > 0) {
      return profiles
        .filter((p) => p.role === "coachee" || p.role === "salarie")
        .map((profile) => {
          const company = companies?.find((c) => c.id === profile.company_id);
          const userProgress = moduleProgressList?.filter((mp) => mp.user_id === profile.id) || [];
          const userKpis = latestKpiByUser[profile.id] || {
            investissement: 5,
            efficacite: 5,
            participation: 5,
          };

          return {
            id: profile.id,
            first_name: profile.first_name,
            last_name: profile.last_name,
            email: profile.email,
            avatar_url: profile.avatar_url,
            type: (profile.coaching_type || "individuel") as "individuel" | "entreprise",
            status: profile.status === "active" ? "actif" as const : profile.status === "inactive" ? "inactif" as const : "archive" as const,
            company_id: profile.company_id,
            company_name: company?.name || null,
            start_date: profile.created_at,
            current_module: null,
            kpis: userKpis,
            kpi_history: [],
            module_progress: userProgress.map((mp) => ({
              module_id: mp.module_id,
              module_title: mp.module?.title || "Module",
              status: mp.status === "validated" ? "complete" as const : mp.status === "in_progress" ? "en_cours" as const : "non_commence" as const,
              satisfaction_score: mp.satisfaction_score || undefined,
            })),
            livrables: [],
            calls: [],
            certificates: [],
            last_activity: profile.updated_at,
          };
        });
    }
    // Fallback to mock data
    return mockCoachees;
  }, [profiles, companies, moduleProgressList, latestKpiByUser]);

  // Filter coachees
  const filteredCoachees = coachees.filter((coachee) => {
    const matchesSearch =
      search === "" ||
      `${coachee.first_name} ${coachee.last_name}`
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      coachee.email.toLowerCase().includes(search.toLowerCase());

    const matchesType = typeFilter === "all" || coachee.type === typeFilter;
    const matchesStatus = statusFilter === "all" || coachee.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Stats
  const stats = {
    total: coachees.length,
    actifs: coachees.filter((c) => c.status === "actif").length,
    individuels: coachees.filter((c) => c.type === "individuel").length,
    entreprises: coachees.filter((c) => c.type === "entreprise").length,
  };

  // Bulk selection handlers
  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    if (selectedIds.size === filteredCoachees.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredCoachees.map((c) => c.id)));
    }
  }, [filteredCoachees, selectedIds.size]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  // Bulk actions
  const handleBulkAction = async (action: "archive" | "activate" | "email") => {
    if (selectedIds.size === 0) return;

    setBulkActionLoading(true);
    try {
      const supabase = createUntypedClient();
      const ids = Array.from(selectedIds);

      if (action === "archive") {
        const { error } = await supabase
          .from("profiles")
          .update({ status: "archived" })
          .in("id", ids);
        if (error) throw error;
        toast(`${ids.length} coachee(s) archive(s)`, "success");
      } else if (action === "activate") {
        const { error } = await supabase
          .from("profiles")
          .update({ status: "active" })
          .in("id", ids);
        if (error) throw error;
        toast(`${ids.length} coachee(s) reactive(s)`, "success");
      } else if (action === "email") {
        // Would integrate with email service
        toast(`Email envoye a ${ids.length} coachee(s)`, "success");
      }

      clearSelection();
      refetchProfiles();
    } catch (err) {
      console.error("Bulk action error:", err);
      toast("Erreur lors de l'action groupee", "error");
    } finally {
      setBulkActionLoading(false);
    }
  };

  // Export coachees to CSV
  const exportToCSV = () => {
    const headers = ["Prenom", "Nom", "Email", "Type", "Entreprise", "Statut", "Modules completes", "Date inscription"];
    const rows = filteredCoachees.map((c) => [
      c.first_name,
      c.last_name,
      c.email,
      c.type === "individuel" ? "Individuel" : "Entreprise",
      c.company_name || "",
      c.status,
      c.module_progress.filter((m) => m.status === "complete").length,
      c.start_date ? new Date(c.start_date).toLocaleDateString("fr-FR") : "",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `coachees-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast("Export CSV telecharge", "success");
  };

  if (profilesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-accent" />
          <div>
            <h1 className="font-heading text-2xl font-bold text-dark">Coachees</h1>
            <p className="text-sm text-gray-500">{stats.total} personnes accompagnees</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportToCSV}
            disabled={filteredCoachees.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exporter CSV</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouveau coachee
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark">{stats.total}</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark">{stats.actifs}</p>
              <p className="text-xs text-gray-500">Actifs</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark">{stats.individuels}</p>
              <p className="text-xs text-gray-500">Individuels</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark">{stats.entreprises}</p>
              <p className="text-xs text-gray-500">Entreprises</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <CheckSquare className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium text-dark">
                {selectedIds.size} coachee{selectedIds.size > 1 ? "s" : ""} selectionne{selectedIds.size > 1 ? "s" : ""}
              </span>
              <button
                onClick={clearSelection}
                className="text-xs text-gray-500 hover:text-dark flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Deselectionner
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkAction("email")}
                disabled={bulkActionLoading}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <Mail className="w-4 h-4" />
                Envoyer email
              </button>
              <button
                onClick={() => handleBulkAction("activate")}
                disabled={bulkActionLoading}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-success bg-success/10 border border-success/20 rounded-lg hover:bg-success/20 transition-colors disabled:opacity-50"
              >
                <User className="w-4 h-4" />
                Reactiver
              </button>
              <button
                onClick={() => handleBulkAction("archive")}
                disabled={bulkActionLoading}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-danger bg-danger/10 border border-danger/20 rounded-lg hover:bg-danger/20 transition-colors disabled:opacity-50"
              >
                <UserX className="w-4 h-4" />
                Archiver
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom ou email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>

          {/* Type filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as FilterType)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/50"
            >
              <option value="all">Tous les types</option>
              <option value="individuel">Individuels</option>
              <option value="entreprise">Entreprises</option>
            </select>
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/50"
          >
            <option value="all">Tous les statuts</option>
            <option value="actif">Actifs</option>
            <option value="inactif">Inactifs</option>
            <option value="archive">Archives</option>
          </select>
        </div>
      </div>

      {/* Coachee list */}
      {filteredCoachees.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Aucun coachee trouve"
          description={
            search || typeFilter !== "all" || statusFilter !== "all"
              ? "Essayez de modifier vos filtres de recherche."
              : "Commencez par ajouter votre premier client."
          }
          actionLabel={
            !search && typeFilter === "all" && statusFilter === "all"
              ? "Ajouter un coachee"
              : undefined
          }
          onAction={
            !search && typeFilter === "all" && statusFilter === "all"
              ? () => setShowCreateModal(true)
              : undefined
          }
        />
      ) : (
        <CoacheeTable
          coachees={filteredCoachees}
          selectedIds={selectedIds}
          onToggleSelection={toggleSelection}
          onSelectAll={selectAll}
        />
      )}

      {/* Create modal */}
      {showCreateModal && (
        <CreateCoacheeModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}
