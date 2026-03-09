"use client";

import { useState, useMemo } from "react";
import {
  UserCheck,
  UserPlus,
  Search,
  Star,
  Calendar,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminExpert {
  id: string;
  initials: string;
  name: string;
  domain: string;
  bio: string;
  email: string;
  rating: number;
  rdvThisMonth: number;
  totalRdv: number;
  active: boolean;
}

const experts: AdminExpert[] = [
  {
    id: "1",
    initials: "SB",
    name: "Sophie Bertrand",
    domain: "Communication",
    bio: "Experte en communication non-violente et gestion des conflits en entreprise.",
    email: "sophie.bertrand@email.fr",
    rating: 5,
    rdvThisMonth: 8,
    totalRdv: 45,
    active: true,
  },
  {
    id: "2",
    initials: "ML",
    name: "Marc Lefevre",
    domain: "Anglais professionnel",
    bio: "Formateur certifie en anglais des affaires et certifications internationales.",
    email: "marc.lefevre@email.fr",
    rating: 5,
    rdvThisMonth: 5,
    totalRdv: 32,
    active: true,
  },
  {
    id: "3",
    initials: "AC",
    name: "Amina Chertier",
    domain: "Espagnol",
    bio: "Enseignante native, specialisee dans l'espagnol commercial.",
    email: "amina.chertier@email.fr",
    rating: 4,
    rdvThisMonth: 3,
    totalRdv: 18,
    active: true,
  },
  {
    id: "4",
    initials: "PD",
    name: "Philippe Durand",
    domain: "Leadership",
    bio: "Coach certifie en leadership transformationnel. Ancien dirigeant de PME.",
    email: "philippe.durand@email.fr",
    rating: 5,
    rdvThisMonth: 10,
    totalRdv: 67,
    active: true,
  },
  {
    id: "5",
    initials: "LM",
    name: "Lucie Martin",
    domain: "Gestion du stress",
    bio: "Psychologue du travail et sophrologue.",
    email: "lucie.martin@email.fr",
    rating: 5,
    rdvThisMonth: 6,
    totalRdv: 38,
    active: true,
  },
  {
    id: "6",
    initials: "KN",
    name: "Karim Nasser",
    domain: "Prise de parole",
    bio: "Ancien comedien devenu coach en prise de parole et storytelling.",
    email: "karim.nasser@email.fr",
    rating: 4,
    rdvThisMonth: 0,
    totalRdv: 22,
    active: false,
  },
];

export default function AdminIntervenantsPage() {
  const [search, setSearch] = useState("");
  const [filterActive, setFilterActive] = useState<"tous" | "actifs" | "inactifs">("tous");

  const filtered = useMemo(() => {
    let list = [...experts];
    if (filterActive === "actifs") list = list.filter((e) => e.active);
    if (filterActive === "inactifs") list = list.filter((e) => !e.active);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.domain.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q)
      );
    }
    return list;
  }, [search, filterActive]);

  const totalActive = experts.filter((e) => e.active).length;
  const totalRdvMonth = experts.reduce((s, e) => s + e.rdvThisMonth, 0);
  const avgRating = (experts.reduce((s, e) => s + e.rating, 0) / experts.length).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <UserCheck className="w-6 h-6 text-accent" />
          <h1 className="font-heading text-2xl font-bold text-dark">Intervenants</h1>
          <span className="text-sm text-gray-400">({experts.length})</span>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors">
          <UserPlus className="w-4 h-4" />
          <span className="hidden sm:inline">Ajouter un intervenant</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="text-xl font-bold font-heading text-dark">{totalActive}</p>
            <p className="text-xs text-gray-500">Actifs</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-xl font-bold font-heading text-dark">{totalRdvMonth}</p>
            <p className="text-xs text-gray-500">RDV ce mois</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 text-warning" />
          </div>
          <div>
            <p className="text-xl font-bold font-heading text-dark">{avgRating}/5</p>
            <p className="text-xs text-gray-500">Note moyenne</p>
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, domaine ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-dark placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {(["tous", "actifs", "inactifs"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilterActive(f)}
              className={cn(
                "px-3 py-2 rounded-lg text-xs font-medium border transition-colors capitalize",
                filterActive === f
                  ? "bg-accent text-white border-accent"
                  : "bg-white text-gray-600 border-gray-200 hover:border-accent/50"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table desktop */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Intervenant</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Domaine</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Note</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">RDV ce mois</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total RDV</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((expert) => (
              <tr key={expert.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary-medium/10 flex items-center justify-center text-xs font-semibold text-primary-medium">
                      {expert.initials}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-dark">{expert.name}</p>
                      <p className="text-xs text-gray-400">{expert.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-600">{expert.domain}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                    <span className="text-sm text-dark font-medium">{expert.rating}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{expert.rdvThisMonth}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{expert.totalRdv}</td>
                <td className="px-4 py-3">
                  <button className="flex items-center gap-1.5">
                    {expert.active ? (
                      <>
                        <ToggleRight className="w-5 h-5 text-success" />
                        <span className="text-xs text-success font-medium">Actif</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-5 h-5 text-gray-400" />
                        <span className="text-xs text-gray-400 font-medium">Inactif</span>
                      </>
                    )}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <a
                    href={`/intervenants/${expert.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
                  >
                    Profil public
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-sm text-gray-500">Aucun intervenant ne correspond a la recherche.</p>
          </div>
        )}
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((expert) => (
          <div key={expert.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-full bg-primary-medium/10 flex items-center justify-center text-sm font-semibold text-primary-medium shrink-0">
                {expert.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-medium text-dark truncate">{expert.name}</p>
                  {expert.active ? (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-success/10 text-success font-medium shrink-0">Actif</span>
                  ) : (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-400 font-medium shrink-0">Inactif</span>
                  )}
                </div>
                <p className="text-xs text-accent font-medium">{expert.domain}</p>
                <p className="text-xs text-gray-400 mt-0.5">{expert.email}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-accent fill-accent" />
                    <span className="text-xs text-dark">{expert.rating}/5</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{expert.rdvThisMonth} RDV ce mois</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <p className="text-sm text-gray-500">Aucun intervenant ne correspond a la recherche.</p>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 text-right">
        {filtered.length} intervenant{filtered.length > 1 ? "s" : ""} affiche{filtered.length > 1 ? "s" : ""}
      </p>
    </div>
  );
}
