"use client";

import { useState } from "react";
import {
  Users,
  Plus,
  Search,
  Filter,
  Building2,
  User,
} from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { CoacheeTable } from "@/components/admin/coachee-table";
import { CreateCoacheeModal } from "@/components/admin/create-coachee-modal";
import { mockCoachees } from "@/lib/mock-data";

type FilterType = "all" | "individuel" | "entreprise";
type StatusFilter = "all" | "actif" | "inactif" | "archive";

export default function CoacheesPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filter coachees
  const filteredCoachees = mockCoachees.filter((coachee) => {
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
    total: mockCoachees.length,
    actifs: mockCoachees.filter((c) => c.status === "actif").length,
    individuels: mockCoachees.filter((c) => c.type === "individuel").length,
    entreprises: mockCoachees.filter((c) => c.type === "entreprise").length,
  };

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
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouveau coachee
        </button>
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
        <CoacheeTable coachees={filteredCoachees} />
      )}

      {/* Create modal */}
      {showCreateModal && (
        <CreateCoacheeModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}
