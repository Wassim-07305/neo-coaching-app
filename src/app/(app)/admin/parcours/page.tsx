"use client";

import { useState } from "react";
import { format, differenceInDays, isPast } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Route,
  Plus,
  User,
  Building2,
  Calendar,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  MoreVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getAllAssignedParcours,
  getParcoursStats,
  parcoursStatusConfig,
  type AssignedParcours,
  type ParcoursStatus,
} from "@/lib/mock-data-parcours";
import { AssignParcoursModal } from "@/components/admin/assign-parcours-modal";

type FilterStatus = "all" | ParcoursStatus;

export default function ParcoursPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedParcours, setSelectedParcours] = useState<AssignedParcours | null>(null);

  const allParcours = getAllAssignedParcours();
  const stats = getParcoursStats();

  const filteredParcours = allParcours.filter((p) => {
    const matchesSearch =
      search === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.assignedToName.toLowerCase().includes(search.toLowerCase()) ||
      (p.companyName?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchesStatus = filterStatus === "all" || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Route className="w-6 h-6 text-accent" />
          <div>
            <h1 className="font-heading text-2xl font-bold text-dark">
              Parcours
            </h1>
            <p className="text-sm text-gray-500">
              Assignez des parcours de formation aux salaries
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAssignModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Assigner un parcours
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Route className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark">{stats.total}</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark">{stats.inProgress}</p>
              <p className="text-xs text-gray-500">En cours</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark">{stats.completed}</p>
              <p className="text-xs text-gray-500">Termines</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-danger/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-danger" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark">{stats.overdue}</p>
              <p className="text-xs text-gray-500">En retard</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Route className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark">{stats.avgProgress}%</p>
              <p className="text-xs text-gray-500">Progression moy.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom, salarie ou entreprise..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/50"
            >
              <option value="all">Tous les statuts</option>
              <option value="not_started">Non commences</option>
              <option value="in_progress">En cours</option>
              <option value="completed">Termines</option>
              <option value="overdue">En retard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Parcours list */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filteredParcours.length === 0 ? (
          <div className="p-8 text-center">
            <Route className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm mb-3">
              Aucun parcours {filterStatus !== "all" ? "avec ce statut" : ""}.
            </p>
            <button
              onClick={() => setShowAssignModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Assigner un parcours
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredParcours.map((parcours) => (
              <ParcoursCard
                key={parcours.id}
                parcours={parcours}
                onClick={() => setSelectedParcours(parcours)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Assign modal */}
      {showAssignModal && (
        <AssignParcoursModal
          onClose={() => setShowAssignModal(false)}
          onAssigned={(data) => {
            console.log("Assigned:", data);
          }}
        />
      )}

      {/* Detail modal */}
      {selectedParcours && (
        <ParcoursDetailModal
          parcours={selectedParcours}
          onClose={() => setSelectedParcours(null)}
        />
      )}
    </div>
  );
}

// Parcours card component
function ParcoursCard({
  parcours,
  onClick,
}: {
  parcours: AssignedParcours;
  onClick: () => void;
}) {
  const statusConfig = parcoursStatusConfig[parcours.status];
  const daysLeft = differenceInDays(new Date(parcours.endDate), new Date());
  const isOverdue = isPast(new Date(parcours.endDate)) && parcours.status !== "completed";

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <div className="flex items-center gap-4 min-w-0">
        {/* Progress circle */}
        <div className="relative w-12 h-12 shrink-0">
          <svg className="w-12 h-12 -rotate-90">
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="4"
            />
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke={parcours.status === "completed" ? "#2D8C4E" : parcours.status === "overdue" ? "#E74C3C" : "#D4A843"}
              strokeWidth="4"
              strokeDasharray={`${parcours.progress * 1.256} 125.6`}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-dark">
            {parcours.progress}%
          </span>
        </div>

        {/* Info */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase",
                statusConfig.className
              )}
            >
              {statusConfig.label}
            </span>
            {isOverdue && (
              <span className="inline-flex items-center gap-1 text-[10px] text-danger">
                <AlertTriangle className="w-3 h-3" />
                Retard
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-dark truncate">
            {parcours.title}
          </p>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {parcours.assignedToName}
            </span>
            {parcours.companyName && (
              <span className="flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                {parcours.companyName}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {daysLeft > 0
                ? `${daysLeft}j restants`
                : parcours.status === "completed"
                ? "Termine"
                : `${Math.abs(daysLeft)}j de retard`}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs text-gray-400">
          {parcours.modules.filter((m) => m.status === "completed").length}/{parcours.modules.length} modules
        </span>
        <ChevronRight className="w-4 h-4 text-gray-400" />
      </div>
    </div>
  );
}

// Parcours detail modal
function ParcoursDetailModal({
  parcours,
  onClose,
}: {
  parcours: AssignedParcours;
  onClose: () => void;
}) {
  const statusConfig = parcoursStatusConfig[parcours.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-gray-100 p-5 sticky top-0 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold",
                    statusConfig.className
                  )}
                >
                  {statusConfig.label}
                </span>
              </div>
              <h2 className="font-heading font-semibold text-lg text-dark">
                {parcours.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Assignee info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-medium/10 flex items-center justify-center text-sm font-semibold text-primary-medium">
                {parcours.assignedToName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <p className="font-medium text-dark">{parcours.assignedToName}</p>
                {parcours.companyName && (
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    {parcours.companyName}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progression</span>
              <span className="text-sm font-bold text-accent">{parcours.progress}%</span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  parcours.status === "completed"
                    ? "bg-success"
                    : parcours.status === "overdue"
                    ? "bg-danger"
                    : "bg-accent"
                )}
                style={{ width: `${parcours.progress}%` }}
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 mb-1">Date de debut</p>
              <p className="font-medium text-dark">
                {format(new Date(parcours.startDate), "d MMMM yyyy", { locale: fr })}
              </p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Date limite</p>
              <p className={cn(
                "font-medium",
                isPast(new Date(parcours.endDate)) && parcours.status !== "completed"
                  ? "text-danger"
                  : "text-dark"
              )}>
                {format(new Date(parcours.endDate), "d MMMM yyyy", { locale: fr })}
              </p>
            </div>
          </div>

          {/* Modules */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Modules ({parcours.modules.filter((m) => m.status === "completed").length}/{parcours.modules.length})
            </h3>
            <div className="space-y-2">
              {parcours.modules.map((mod, idx) => (
                <div
                  key={mod.moduleId}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-xl border",
                    mod.status === "completed"
                      ? "bg-success/5 border-success/20"
                      : mod.status === "in_progress"
                      ? "bg-blue-50 border-blue-200"
                      : mod.status === "available"
                      ? "bg-white border-gray-200"
                      : "bg-gray-50 border-gray-100 opacity-60"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                        mod.status === "completed"
                          ? "bg-success text-white"
                          : mod.status === "in_progress"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-500"
                      )}
                    >
                      {mod.status === "completed" ? "✓" : idx + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-dark">
                        {mod.moduleTitle}
                      </p>
                      {mod.deadline && (
                        <p className="text-xs text-gray-500">
                          Deadline: {format(new Date(mod.deadline), "d MMM", { locale: fr })}
                          {mod.completedAt && (
                            <span className="text-success ml-2">
                              (termine le {format(new Date(mod.completedAt), "d MMM", { locale: fr })})
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                  <span
                    className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-medium",
                      mod.status === "completed"
                        ? "bg-success/10 text-success"
                        : mod.status === "in_progress"
                        ? "bg-blue-100 text-blue-700"
                        : mod.status === "available"
                        ? "bg-gray-100 text-gray-600"
                        : "bg-gray-100 text-gray-400"
                    )}
                  >
                    {mod.status === "completed"
                      ? "Termine"
                      : mod.status === "in_progress"
                      ? "En cours"
                      : mod.status === "available"
                      ? "Disponible"
                      : "Verrouille"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-5">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-accent hover:bg-accent/90 text-white rounded-lg font-medium transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
