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
  Award,
  Download,
  Loader2,
  Star,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { KpiGauge } from "@/components/ui/kpi-gauge";

// ---------- Mock user data (Isabelle Fontaine - individuel) ----------
const mockUser = {
  firstName: "Isabelle",
  lastName: "Fontaine",
  email: "isabelle.fontaine@email.fr",
  phone: "06 98 76 54 32",
  type: "individuel" as const,
  companyName: null as string | null,
  startDate: "2025-06-01",
  currentModule: "Confiance en soi",
  kpis: { investissement: 9, efficacite: 9, participation: 10 },
  moduleProgress: [
    {
      moduleTitle: "Intelligence Emotionnelle",
      status: "complete" as const,
      satisfactionScore: 10,
    },
    {
      moduleTitle: "Estime de soi",
      status: "complete" as const,
      satisfactionScore: 9,
    },
    {
      moduleTitle: "Confiance en soi",
      status: "en_cours" as const,
      satisfactionScore: undefined,
    },
  ],
  certificates: [
    {
      id: "cert-4",
      moduleTitle: "Intelligence Emotionnelle",
      earnedDate: "2025-08-01",
    },
    {
      id: "cert-5",
      moduleTitle: "Estime de soi",
      earnedDate: "2025-10-15",
    },
  ],
  satisfactionHistory: [
    { moduleTitle: "Intelligence Emotionnelle", score: 10 },
    { moduleTitle: "Estime de soi", score: 9 },
  ],
};

interface GeneratingState {
  [key: string]: boolean;
}

export default function CoachingProfilPage() {
  const [firstName, setFirstName] = useState(mockUser.firstName);
  const [lastName, setLastName] = useState(mockUser.lastName);
  const [phone, setPhone] = useState(mockUser.phone);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState<GeneratingState>({});

  function handleSave() {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 800);
  }

  async function handleDownloadCertificate(
    moduleTitle: string,
    earnedDate: string
  ) {
    const key = `cert-${moduleTitle}`;
    setGenerating((prev) => ({ ...prev, [key]: true }));
    try {
      const [{ pdf }, { CertificatePDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/reports/certificate-pdf"),
      ]);
      const blob = await pdf(
        <CertificatePDF
          data={{
            coacheeName: `${firstName} ${lastName}`,
            moduleTitle,
            completionDate: earnedDate,
          }}
        />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `certificat-${moduleTitle.toLowerCase().replace(/\s+/g, "-")}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erreur generation certificat:", err);
    } finally {
      setGenerating((prev) => ({ ...prev, [key]: false }));
    }
  }

  const initials = `${firstName[0] || ""}${lastName[0] || ""}`;
  const completedModules = mockUser.moduleProgress.filter(
    (m) => m.status === "complete"
  ).length;
  const totalModules = mockUser.moduleProgress.length;
  const completionPct =
    totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

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
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                <BookOpen className="w-3 h-3" />
                Coache {mockUser.type === "individuel" ? "Individuel" : "Entreprise"}
              </span>
              {mockUser.companyName && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  <Building2 className="w-3 h-3" />
                  {mockUser.companyName}
                </span>
              )}
              {mockUser.certificates.length > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                  <Award className="w-3 h-3" />
                  {mockUser.certificates.length} certificat
                  {mockUser.certificates.length > 1 ? "s" : ""}
                </span>
              )}
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
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-accent/30 transition-colors cursor-pointer">
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

      {/* Parcours Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-heading text-base font-semibold text-dark mb-4">
          Mon Parcours
        </h3>
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Progression globale</p>
              <span className="text-sm font-bold text-dark">
                {completionPct}%
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-accent rounded-full transition-all"
                style={{ width: `${completionPct}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mb-4">
              {completedModules}/{totalModules} modules termines
            </p>

            {/* Module list */}
            <div className="space-y-2">
              {mockUser.moduleProgress.map((mod) => (
                <div
                  key={mod.moduleTitle}
                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        mod.status === "complete"
                          ? "bg-success"
                          : mod.status === "en_cours"
                            ? "bg-accent"
                            : "bg-gray-300"
                      )}
                    />
                    <span className="text-sm text-dark">{mod.moduleTitle}</span>
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium",
                      mod.status === "complete"
                        ? "text-success"
                        : mod.status === "en_cours"
                          ? "text-accent"
                          : "text-gray-400"
                    )}
                  >
                    {mod.status === "complete"
                      ? "Termine"
                      : mod.status === "en_cours"
                        ? "En cours"
                        : "A venir"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* KPI Gauges */}
          <div className="flex sm:flex-col gap-4">
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
        </div>
      </div>

      {/* Certificates Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-heading text-base font-semibold text-dark mb-4">
          Mes Certificats
        </h3>
        {mockUser.certificates.length === 0 ? (
          <div className="text-center py-6">
            <Award className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">
              Aucun certificat obtenu pour le moment.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Completez un module pour obtenir votre certificat.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {mockUser.certificates.map((cert) => {
              const certKey = `cert-${cert.moduleTitle}`;
              const isGen = generating[certKey] || false;

              return (
                <div
                  key={cert.id}
                  className="relative border border-accent/20 rounded-xl p-4 bg-gradient-to-br from-accent/5 to-transparent"
                >
                  {/* Gold accent corner */}
                  <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden rounded-tr-xl">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-accent/10 -translate-x-4 translate-y-[-50%] rotate-45" />
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-dark truncate">
                        {cert.moduleTitle}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Obtenu le {cert.earnedDate}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      handleDownloadCertificate(
                        cert.moduleTitle,
                        cert.earnedDate
                      )
                    }
                    disabled={isGen}
                    className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-accent text-white text-xs font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGen ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                    {isGen ? "Generation..." : "Telecharger le certificat"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Satisfaction History */}
      {mockUser.satisfactionHistory.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-heading text-base font-semibold text-dark mb-4">
            Historique de Satisfaction
          </h3>
          <div className="space-y-3">
            {mockUser.satisfactionHistory.map((sat) => (
              <div
                key={sat.moduleTitle}
                className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-dark">{sat.moduleTitle}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-accent fill-accent" />
                  <span
                    className={cn(
                      "text-sm font-bold",
                      sat.score >= 8
                        ? "text-success"
                        : sat.score >= 5
                          ? "text-warning"
                          : "text-danger"
                    )}
                  >
                    {sat.score}/10
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
