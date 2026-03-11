"use client";

import { useState, useMemo } from "react";
import {
  UserCheck,
  Plus,
  Search,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Edit3,
  ExternalLink,
  Loader2,
  Mail,
  Globe,
  DollarSign,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import {
  useIntervenants,
  useProfiles,
  upsertIntervenant,
  toggleIntervenantActive,
  deleteIntervenant,
} from "@/hooks/use-supabase-data";
import type { Intervenant, Profile } from "@/lib/supabase/types";

function formatEuros(cents: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

// Fallback mock data
const mockIntervenants = [
  {
    id: "mock-1",
    user_id: "mock-u1",
    domain: "Communication",
    bio: "Experte en communication non-violente et gestion des conflits en entreprise.",
    video_url: null,
    hourly_rate_cents: 8000,
    packages: { "2h": 15000, "4h": 28000 },
    is_active: true,
    created_at: "2025-06-01",
    user: { id: "mock-u1", first_name: "Sophie", last_name: "Bertrand", email: "sophie@neo-coaching.fr" } as Profile,
  },
  {
    id: "mock-2",
    user_id: "mock-u2",
    domain: "Anglais professionnel",
    bio: "Formateur certifie en anglais des affaires.",
    video_url: null,
    hourly_rate_cents: 6000,
    packages: { "2h": 11000, "4h": 20000 },
    is_active: true,
    created_at: "2025-07-15",
    user: { id: "mock-u2", first_name: "Marc", last_name: "Lefevre", email: "marc@neo-coaching.fr" } as Profile,
  },
  {
    id: "mock-3",
    user_id: "mock-u3",
    domain: "Leadership",
    bio: "Coach certifie en leadership transformationnel.",
    video_url: null,
    hourly_rate_cents: 10000,
    packages: { "2h": 18000, "6h": 50000 },
    is_active: false,
    created_at: "2025-08-01",
    user: { id: "mock-u3", first_name: "Philippe", last_name: "Durand", email: "philippe@neo-coaching.fr" } as Profile,
  },
];

export default function AdminIntervenantsPage() {
  const { toast } = useToast();
  const { data: supabaseIntervenants, loading, refetch } = useIntervenants(false);
  const { data: intervenantProfiles } = useProfiles({ role: "intervenant" });

  const intervenants = useMemo(() => {
    if (supabaseIntervenants && supabaseIntervenants.length > 0) {
      return supabaseIntervenants;
    }
    return mockIntervenants as (Intervenant & { user: Profile })[];
  }, [supabaseIntervenants]);

  const [search, setSearch] = useState("");
  const [filterActive, setFilterActive] = useState<"all" | "active" | "inactive">("all");
  const [showModal, setShowModal] = useState(false);
  const [editingIntervenant, setEditingIntervenant] = useState<(Intervenant & { user: Profile }) | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return intervenants.filter((i) => {
      const name = `${i.user?.first_name || ""} ${i.user?.last_name || ""}`.toLowerCase();
      const matchSearch = !search || name.includes(search.toLowerCase()) || i.domain.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filterActive === "all" || (filterActive === "active" ? i.is_active : !i.is_active);
      return matchSearch && matchFilter;
    });
  }, [intervenants, search, filterActive]);

  const activeCount = intervenants.filter((i) => i.is_active).length;

  async function handleToggle(id: string, currentActive: boolean) {
    setToggling(id);
    const { error } = await toggleIntervenantActive(id, !currentActive);
    if (error) {
      toast("Erreur lors de la modification", "error");
    } else {
      toast(currentActive ? "Intervenant desactive" : "Intervenant active", "success");
      refetch();
    }
    setToggling(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cet intervenant ? Cette action est irreversible.")) return;
    setDeleting(id);
    const { error } = await deleteIntervenant(id);
    if (error) {
      toast("Erreur lors de la suppression", "error");
    } else {
      toast("Intervenant supprime", "success");
      refetch();
    }
    setDeleting(null);
  }

  function handleEdit(intervenant: Intervenant & { user: Profile }) {
    setEditingIntervenant(intervenant);
    setShowModal(true);
  }

  function handleAdd() {
    setEditingIntervenant(null);
    setShowModal(true);
  }

  function exportToCSV() {
    if (intervenants.length === 0) {
      toast("Aucun intervenant a exporter", "warning");
      return;
    }

    const headers = ["Nom", "Prenom", "Email", "Domaine", "Taux horaire (EUR)", "Actif", "Packages"];
    const rows = filtered.map((i) => [
      i.user?.last_name || "",
      i.user?.first_name || "",
      i.user?.email || "",
      i.domain,
      (i.hourly_rate_cents / 100).toFixed(2),
      i.is_active ? "Oui" : "Non",
      i.packages ? Object.entries(i.packages).map(([k, v]) => `${k}: ${typeof v === "number" ? (v / 100).toFixed(2) : v}EUR`).join(" | ") : "",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `intervenants-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast("Export CSV telecharge", "success");
  }

  if (loading) {
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
          <UserCheck className="w-6 h-6 text-accent" />
          <div>
            <h1 className="font-heading text-2xl font-bold text-dark">Intervenants</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {intervenants.length} intervenant{intervenants.length > 1 ? "s" : ""} ({activeCount} actif{activeCount > 1 ? "s" : ""})
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportToCSV}
            disabled={filtered.length === 0}
            className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 text-gray-600 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exporter</span>
          </button>
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-lg font-medium transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Ajouter un intervenant
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom ou domaine..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 text-dark"
          />
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {(["all", "active", "inactive"] as const).map((val) => (
            <button
              key={val}
              onClick={() => setFilterActive(val)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                filterActive === val ? "bg-white text-dark shadow-sm" : "text-gray-500 hover:text-dark"
              )}
            >
              {val === "all" ? "Tous" : val === "active" ? "Actifs" : "Inactifs"}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <UserCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Aucun intervenant trouve.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((intervenant) => {
            const name = `${intervenant.user?.first_name || ""} ${intervenant.user?.last_name || ""}`.trim();
            const initials = `${intervenant.user?.first_name?.charAt(0) || ""}${intervenant.user?.last_name?.charAt(0) || ""}`.toUpperCase();
            const isToggling = toggling === intervenant.id;
            const isDeleting = deleting === intervenant.id;

            return (
              <div
                key={intervenant.id}
                className={cn(
                  "bg-white rounded-xl border p-5 transition-all",
                  intervenant.is_active ? "border-gray-200" : "border-gray-200 opacity-60"
                )}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-accent/10 flex items-center justify-center text-accent text-sm font-bold">
                      {initials}
                    </div>
                    <div>
                      <p className="font-semibold text-dark text-sm">{name || "Sans nom"}</p>
                      <p className="text-xs text-accent font-medium">{intervenant.domain}</p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-medium",
                      intervenant.is_active ? "bg-success/10 text-success" : "bg-gray-100 text-gray-500"
                    )}
                  >
                    {intervenant.is_active ? "Actif" : "Inactif"}
                  </span>
                </div>

                {/* Bio */}
                {intervenant.bio && (
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">{intervenant.bio}</p>
                )}

                {/* Details */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Mail className="w-3.5 h-3.5" />
                    <span className="truncate">{intervenant.user?.email || "-"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>{formatEuros(intervenant.hourly_rate_cents)}/h</span>
                  </div>
                  {intervenant.video_url && (
                    <div className="flex items-center gap-2 text-xs text-accent">
                      <Globe className="w-3.5 h-3.5" />
                      <a href={intervenant.video_url} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                        Video de presentation <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Packages */}
                {intervenant.packages && Object.keys(intervenant.packages).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {Object.entries(intervenant.packages).map(([key, val]) => (
                      <span key={key} className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                        {key}: {typeof val === "number" ? formatEuros(val) : String(val)}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleEdit(intervenant)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-dark bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleToggle(intervenant.id, intervenant.is_active)}
                    disabled={isToggling}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-dark disabled:opacity-50"
                    title={intervenant.is_active ? "Desactiver" : "Activer"}
                  >
                    {isToggling ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : intervenant.is_active ? (
                      <ToggleRight className="w-4 h-4 text-success" />
                    ) : (
                      <ToggleLeft className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(intervenant.id)}
                    disabled={isDeleting}
                    className="p-2 rounded-lg hover:bg-danger/10 transition-colors text-gray-400 hover:text-danger disabled:opacity-50"
                    title="Supprimer"
                  >
                    {isDeleting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <IntervenantFormModal
          intervenant={editingIntervenant}
          availableProfiles={intervenantProfiles || []}
          onClose={() => {
            setShowModal(false);
            setEditingIntervenant(null);
          }}
          onSaved={() => {
            refetch();
            setShowModal(false);
            setEditingIntervenant(null);
          }}
        />
      )}
    </div>
  );
}

// ============================================================
// Form Modal
// ============================================================

function IntervenantFormModal({
  intervenant,
  availableProfiles,
  onClose,
  onSaved,
}: {
  intervenant: (Intervenant & { user: Profile }) | null;
  availableProfiles: Profile[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const { toast } = useToast();
  const isEdit = !!intervenant;

  const [userId, setUserId] = useState(intervenant?.user_id || "");
  const [domain, setDomain] = useState(intervenant?.domain || "");
  const [bio, setBio] = useState(intervenant?.bio || "");
  const [videoUrl, setVideoUrl] = useState(intervenant?.video_url || "");
  const [hourlyRate, setHourlyRate] = useState(
    intervenant ? String(intervenant.hourly_rate_cents / 100) : ""
  );
  const [packagesText, setPackagesText] = useState(
    intervenant?.packages ? JSON.stringify(intervenant.packages, null, 2) : "{}"
  );
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId || !domain || !hourlyRate) {
      toast("Veuillez remplir tous les champs obligatoires", "warning");
      return;
    }

    let packages: Record<string, unknown> = {};
    try {
      packages = JSON.parse(packagesText);
    } catch {
      toast("Le format des packages est invalide (JSON attendu)", "error");
      return;
    }

    setSaving(true);
    try {
      const { error } = await upsertIntervenant({
        id: intervenant?.id,
        user_id: userId,
        domain,
        bio: bio || undefined,
        video_url: videoUrl || undefined,
        hourly_rate_cents: Math.round(parseFloat(hourlyRate) * 100),
        packages,
        is_active: intervenant?.is_active ?? true,
      });

      if (error) {
        toast(`Erreur: ${error.message}`, "error");
      } else {
        toast(isEdit ? "Intervenant mis a jour" : "Intervenant cree", "success");
        onSaved();
      }
    } catch {
      toast("Erreur lors de la sauvegarde", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="border-b border-gray-100 p-5">
          <h2 className="font-heading font-semibold text-lg text-dark">
            {isEdit ? "Modifier l'intervenant" : "Ajouter un intervenant"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* User selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profil utilisateur *
            </label>
            {isEdit ? (
              <input
                type="text"
                value={`${intervenant?.user?.first_name || ""} ${intervenant?.user?.last_name || ""} (${intervenant?.user?.email || ""})`}
                disabled
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
              />
            ) : (
              <select
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 text-dark"
              >
                <option value="">Selectionner un profil intervenant</option>
                {availableProfiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.first_name} {p.last_name} ({p.email})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Domain */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Domaine d&apos;expertise *
            </label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="Ex: Communication, Leadership, Anglais..."
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 text-dark"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Biographie
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Description de l'intervenant..."
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 text-dark resize-none"
            />
          </div>

          {/* Hourly rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Taux horaire (EUR) *
            </label>
            <input
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              placeholder="80"
              min="0"
              step="0.01"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 text-dark"
            />
          </div>

          {/* Video URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL video de presentation
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 text-dark"
            />
          </div>

          {/* Packages JSON */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Packages (JSON)
            </label>
            <textarea
              value={packagesText}
              onChange={(e) => setPackagesText(e.target.value)}
              rows={3}
              placeholder='{"2h": 15000, "4h": 28000}'
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 text-dark font-mono resize-none"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              Cles = label du package, valeurs = prix en centimes
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-lg font-medium transition-colors disabled:opacity-60 text-sm flex items-center justify-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEdit ? "Mettre a jour" : "Creer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
