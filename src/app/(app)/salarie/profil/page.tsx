"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  Camera,
  Lock,
  LogOut,
  Save,
  Check,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { KpiGauge } from "@/components/ui/kpi-gauge";

// ---------- Mock user data ----------
const mockUser = {
  firstName: "Marie",
  lastName: "Dupont",
  email: "marie.dupont@email.fr",
  phone: "06 12 34 56 78",
  role: "salarie" as const,
  companyName: "Alpha Corp",
  jobTitle: "Responsable Marketing",
  startDate: "2025-09-15",
  kpis: { investissement: 8, efficacite: 7, participation: 9 },
  completionRate: 50,
  modulesCompleted: 2,
  totalModules: 4,
};

export default function SalarieProfilPage() {
  const [firstName, setFirstName] = useState(mockUser.firstName);
  const [lastName, setLastName] = useState(mockUser.lastName);
  const [phone, setPhone] = useState(mockUser.phone);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  function handleSave() {
    setSaving(true);
    // Simulate save
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 800);
  }

  const initials = `${firstName[0] || ""}${lastName[0] || ""}`;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <User className="w-6 h-6 text-accent" />
        <h1 className="font-heading text-2xl font-bold text-dark">
          Mon Profil
        </h1>
      </div>

      {/* Profile header card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-2xl font-bold text-white">
              {initials}
            </div>
            <button
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center hover:bg-accent/90 transition-colors shadow-sm"
              title="Changer la photo"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center sm:text-left flex-1">
            <h2 className="text-xl font-bold text-dark">
              {firstName} {lastName}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">{mockUser.email}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                <Briefcase className="w-3 h-3" />
                Salarie
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                <Building2 className="w-3 h-3" />
                {mockUser.companyName}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Personal info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-heading text-base font-semibold text-dark mb-4">
          Informations personnelles
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Prenom
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 text-dark"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Nom
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 text-dark"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Telephone
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 text-dark"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={mockUser.email}
                disabled
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Avatar upload placeholder */}
        <div className="mt-4">
          <label className="block text-xs font-medium text-gray-500 mb-1.5">
            Photo de profil
          </label>
          <div className="flex items-center gap-3">
            <div className="flex-1 border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-accent/30 transition-colors cursor-pointer">
              <Camera className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <p className="text-xs text-gray-500">
                Cliquer pour telecharger une photo
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                JPG, PNG - Max 2 Mo
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Company Info (read-only) */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-heading text-base font-semibold text-dark mb-4">
          Informations entreprise
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">
              Entreprise
            </p>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-dark">
                {mockUser.companyName}
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Poste</p>
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-dark">
                {mockUser.jobTitle}
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">
              Date de debut
            </p>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-dark">
                {mockUser.startDate}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-heading text-base font-semibold text-dark mb-4">
          Mes statistiques
        </h3>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* KPI Gauges */}
          <div className="flex gap-4">
            <KpiGauge
              value={mockUser.kpis.investissement}
              label="Investissement"
              size="sm"
            />
            <KpiGauge
              value={mockUser.kpis.efficacite}
              label="Efficacite"
              size="sm"
            />
            <KpiGauge
              value={mockUser.kpis.participation}
              label="Participation"
              size="sm"
            />
          </div>

          {/* Completion rate */}
          <div className="flex-1 w-full sm:w-auto">
            <p className="text-xs font-medium text-gray-500 mb-2 text-center sm:text-left">
              Progression globale
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all"
                  style={{ width: `${mockUser.completionRate}%` }}
                />
              </div>
              <span className="text-sm font-bold text-dark">
                {mockUser.completionRate}%
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center sm:text-left">
              {mockUser.modulesCompleted}/{mockUser.totalModules} modules
              termines
            </p>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-heading text-base font-semibold text-dark mb-4">
          Mon compte
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-dark hover:bg-gray-50 transition-colors">
            <Lock className="w-4 h-4 text-gray-500" />
            Changer le mot de passe
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-danger/20 text-sm font-medium text-danger hover:bg-danger/5 transition-colors">
            <LogOut className="w-4 h-4" />
            Se deconnecter
          </button>
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all",
            saved
              ? "bg-success text-white"
              : "bg-accent text-white hover:bg-accent/90",
            saving && "opacity-70 cursor-not-allowed"
          )}
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              Enregistre !
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {saving ? "Enregistrement..." : "Enregistrer les modifications"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
