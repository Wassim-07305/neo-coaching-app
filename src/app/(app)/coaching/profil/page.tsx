"use client";

import { useState, useEffect, useMemo } from "react";
import {
  User,
  Mail,
  Phone,
  Building2,
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
import { useAuth } from "@/components/providers/auth-provider";
import {
  useCompany,
  useLatestKpiScore,
  useUserModuleProgress,
  updateProfile,
} from "@/hooks/use-supabase-data";
import { useToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface GeneratingState {
  [key: string]: boolean;
}

export default function CoachingProfilPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  const { data: company } = useCompany(profile?.company_id || undefined);
  const { data: latestKpi } = useLatestKpiScore(user?.id);
  const { data: moduleProgress } = useUserModuleProgress(user?.id);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState<GeneratingState>({});

  // Sync form fields when profile loads
  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
      setPhone(profile.phone || "");
    }
  }, [profile]);

  const kpis = useMemo(() => {
    if (latestKpi) {
      return {
        investissement: latestKpi.investissement,
        efficacite: latestKpi.efficacite,
        participation: latestKpi.participation,
      };
    }
    return { investissement: 7, efficacite: 7, participation: 7 };
  }, [latestKpi]);

  const modules = useMemo(() => {
    if (moduleProgress && moduleProgress.length > 0) {
      return moduleProgress.map((mp) => ({
        moduleTitle: mp.module?.title || "Module",
        status: mp.status === "validated"
          ? ("complete" as const)
          : mp.status === "in_progress"
            ? ("en_cours" as const)
            : ("non_commence" as const),
        satisfactionScore: mp.satisfaction_score || undefined,
      }));
    }
    return [];
  }, [moduleProgress]);

  const completedModules = modules.filter((m) => m.status === "complete").length;
  const totalModules = modules.length;
  const completionPct = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  // Certificates from completed modules
  const certificates = useMemo(() => {
    if (moduleProgress) {
      return moduleProgress
        .filter((mp) => mp.status === "validated")
        .map((mp) => ({
          id: mp.id || mp.module_id,
          moduleTitle: mp.module?.title || "Module",
          earnedDate: mp.validated_at || mp.created_at || new Date().toISOString(),
        }));
    }
    return [];
  }, [moduleProgress]);

  const satisfactionHistory = modules
    .filter((m) => m.satisfactionScore != null)
    .map((m) => ({ moduleTitle: m.moduleTitle, score: m.satisfactionScore! }));

  async function handleSave() {
    if (!user?.id) return;

    setSaving(true);
    try {
      const { error } = await updateProfile(user.id, {
        first_name: firstName,
        last_name: lastName,
        phone: phone || undefined,
      });

      if (error) {
        toast("Erreur lors de la sauvegarde", "error");
      } else {
        setSaved(true);
        toast("Profil mis a jour avec succes", "success");
        setTimeout(() => setSaved(false), 2000);
      }
    } catch {
      toast("Erreur lors de la sauvegarde", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/connexion");
  }

  async function handleDownloadCertificate(moduleTitle: string, earnedDate: string) {
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
      toast("Erreur lors de la generation du certificat", "error");
    } finally {
      setGenerating((prev) => ({ ...prev, [key]: false }));
    }
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  const email = profile?.email || user?.email || "";
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  const coachingType = profile?.coaching_type || "individuel";
  const companyName = company?.name || null;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <User className="w-6 h-6 text-accent" />
        <h1 className="font-heading text-2xl font-bold text-dark">Mon Profil</h1>
      </div>

      {/* Profile header card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
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
            <p className="text-sm text-gray-500 mt-0.5">{email}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                <BookOpen className="w-3 h-3" />
                Coache {coachingType === "individuel" ? "Individuel" : "Entreprise"}
              </span>
              {companyName && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  <Building2 className="w-3 h-3" />
                  {companyName}
                </span>
              )}
              {certificates.length > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                  <Award className="w-3 h-3" />
                  {certificates.length} certificat{certificates.length > 1 ? "s" : ""}
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
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Prenom</label>
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
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Nom</label>
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
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Telephone</label>
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
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                disabled
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Photo de profil</label>
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-accent/30 transition-colors cursor-pointer">
            <Camera className="w-5 h-5 text-gray-400 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Cliquer pour telecharger une photo</p>
            <p className="text-[10px] text-gray-400 mt-0.5">JPG, PNG - Max 2 Mo</p>
          </div>
        </div>
      </div>

      {/* Parcours Summary */}
      {modules.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-heading text-base font-semibold text-dark mb-4">Mon Parcours</h3>
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="flex-1 w-full">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">Progression globale</p>
                <span className="text-sm font-bold text-dark">{completionPct}%</span>
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

              <div className="space-y-2">
                {modules.map((mod) => (
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

            <div className="flex sm:flex-col gap-4">
              <KpiGauge value={kpis.investissement} label="Investissement" size="sm" />
              <KpiGauge value={kpis.efficacite} label="Efficacite" size="sm" />
              <KpiGauge value={kpis.participation} label="Participation" size="sm" />
            </div>
          </div>
        </div>
      )}

      {/* Certificates Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-heading text-base font-semibold text-dark mb-4">Mes Certificats</h3>
        {certificates.length === 0 ? (
          <div className="text-center py-6">
            <Award className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Aucun certificat obtenu pour le moment.</p>
            <p className="text-xs text-gray-400 mt-1">
              Completez un module pour obtenir votre certificat.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {certificates.map((cert) => {
              const certKey = `cert-${cert.moduleTitle}`;
              const isGen = generating[certKey] || false;

              return (
                <div
                  key={cert.id}
                  className="relative border border-accent/20 rounded-xl p-4 bg-gradient-to-br from-accent/5 to-transparent"
                >
                  <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden rounded-tr-xl">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-accent/10 -translate-x-4 translate-y-[-50%] rotate-45" />
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-dark truncate">{cert.moduleTitle}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Obtenu le{" "}
                        {new Date(cert.earnedDate).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownloadCertificate(cert.moduleTitle, cert.earnedDate)}
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
      {satisfactionHistory.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-heading text-base font-semibold text-dark mb-4">
            Historique de Satisfaction
          </h3>
          <div className="space-y-3">
            {satisfactionHistory.map((sat) => (
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
        <h3 className="font-heading text-base font-semibold text-dark mb-4">Mon compte</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-dark hover:bg-gray-50 transition-colors">
            <Lock className="w-4 h-4 text-gray-500" />
            Changer le mot de passe
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-danger/20 text-sm font-medium text-danger hover:bg-danger/5 transition-colors"
          >
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
