"use client";

import { useState } from "react";
import {
  FileText,
  Download,
  Loader2,
  Building2,
  User,
  Calendar,
  Filter,
  ChevronDown,
  Award,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  mockCompanies,
  mockCoachees,
  getCompanyAverageKpis,
  type MockCoachee,
  type MockCompany,
} from "@/lib/mock-data";

// ---------- Report generation types ----------
type ReportType = "mensuel" | "individuel" | "fin_mission";

interface GeneratingState {
  [key: string]: boolean;
}

// ---------- Months for reports ----------
const reportMonths = [
  { label: "Fevrier 2026", value: "2026-02" },
  { label: "Janvier 2026", value: "2026-01" },
  { label: "Decembre 2025", value: "2025-12" },
  { label: "Novembre 2025", value: "2025-11" },
  { label: "Octobre 2025", value: "2025-10" },
  { label: "Septembre 2025", value: "2025-09" },
];

// ---------- Helper: build monthly report data ----------
function buildMonthlyData(company: MockCompany, monthValue: string) {
  const employees = mockCoachees.filter(
    (c) => c.company_id === company.id && c.status === "actif"
  );
  const avgKpis = getCompanyAverageKpis(company.id);

  // Previous month approximation
  const prevMonth = employees
    .flatMap((c) => c.kpi_history)
    .filter((h) => {
      const parts = h.month.split(" ");
      return parts.length === 2;
    });

  const lastTwo = prevMonth.slice(-2);
  const prevInv =
    lastTwo.length >= 2
      ? lastTwo[0].investissement
      : avgKpis.investissement - 0.5;
  const prevEff =
    lastTwo.length >= 2 ? lastTwo[0].efficacite : avgKpis.efficacite - 0.3;
  const prevPart =
    lastTwo.length >= 2
      ? lastTwo[0].participation
      : avgKpis.participation - 0.4;

  // Build evolution from the first employee (representative)
  const evolution =
    employees.length > 0
      ? employees[0].kpi_history.map((h) => ({
          month: h.month,
          investissement: h.investissement,
          efficacite: h.efficacite,
          participation: h.participation,
        }))
      : [];

  return {
    companyName: company.name,
    dateRange: monthValue,
    month: monthValue,
    executiveSummary: `Ce rapport presente les indicateurs cles de performance pour ${company.name} sur la periode ${monthValue}. L'equipe de ${employees.length} collaborateurs accompagnes montre une dynamique globalement positive avec des axes d'amelioration identifies. Les indicateurs agrages refletent l'engagement collectif dans le parcours de coaching.`,
    kpis: [
      {
        label: "Investissement",
        value: avgKpis.investissement,
        previousValue: prevInv,
      },
      {
        label: "Efficacite",
        value: avgKpis.efficacite,
        previousValue: prevEff,
      },
      {
        label: "Participation",
        value: avgKpis.participation,
        previousValue: prevPart,
      },
    ],
    evolution,
    pointsForts: [
      `Taux d'engagement moyen de ${((avgKpis.investissement / 10) * 100).toFixed(0)}% sur l'ensemble de l'equipe`,
      `${employees.filter((e) => e.kpis.investissement >= 7).length} collaborateurs avec un investissement superieur a 7/10`,
      "Progression constante des indicateurs de participation",
    ],
    pointsAttention: [
      ...(employees.filter((e) => e.kpis.investissement <= 3).length > 0
        ? [
            `${employees.filter((e) => e.kpis.investissement <= 3).length} collaborateur(s) en situation de decrochage`,
          ]
        : []),
      "Certains livrables sont en attente de validation",
      "Le rythme des seances de coaching pourrait etre intensifie",
    ],
    recommandations: [
      "Organiser une seance collective pour renforcer la cohesion d'equipe",
      "Planifier des points individuels avec les collaborateurs en difficulte",
      "Encourager la soumission reguliere des livrables",
    ],
  };
}

// ---------- Helper: build individual report data ----------
function buildIndividualData(coachee: MockCoachee) {
  const satisfactionScores = coachee.module_progress
    .filter((m) => m.satisfaction_score !== undefined)
    .map((m) => ({
      moduleTitle: m.module_title,
      score: m.satisfaction_score as number,
    }));

  const callNotes = coachee.calls.map((c) => c.notes).join(" | ");

  return {
    firstName: coachee.first_name,
    lastName: coachee.last_name,
    email: coachee.email,
    type: coachee.type,
    companyName: coachee.company_name,
    startDate: coachee.start_date,
    currentModule: coachee.current_module,
    kpis: coachee.kpis,
    kpiHistory: coachee.kpi_history,
    moduleProgress: coachee.module_progress.map((m) => ({
      moduleTitle: m.module_title,
      status: m.status,
      satisfactionScore: m.satisfaction_score,
    })),
    livrables: coachee.livrables.map((l) => ({
      moduleTitle: l.module_title,
      type: l.type,
      submissionDate: l.submission_date,
      status: l.status,
      fileName: l.file_name,
    })),
    satisfactionScores,
    coachNotes: callNotes || "Aucune note disponible.",
  };
}

// ---------- Component ----------
export default function AdminRapportsPage() {
  const [activeTab, setActiveTab] = useState<ReportType>("mensuel");
  const [generating, setGenerating] = useState<GeneratingState>({});
  const [companyFilter, setCompanyFilter] = useState<string>("all");
  const [monthFilter, setMonthFilter] = useState<string>(
    reportMonths[0].value
  );

  const activeCompanies = mockCompanies.filter(
    (c) => c.mission_status === "active"
  );
  const completedCompanies = mockCompanies.filter(
    (c) => c.mission_status === "completed"
  );

  const filteredCoachees =
    companyFilter === "all"
      ? mockCoachees
      : mockCoachees.filter((c) => c.company_id === companyFilter);

  // Dynamic import approach to avoid SSR issues with @react-pdf/renderer
  async function generateMonthlyReport(
    company: MockCompany,
    month: string
  ) {
    const key = `monthly-${company.id}-${month}`;
    setGenerating((prev) => ({ ...prev, [key]: true }));
    try {
      const [{ pdf }, { MonthlyReportPDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/reports/monthly-report-pdf"),
      ]);
      const data = buildMonthlyData(company, month);
      const blob = await pdf(<MonthlyReportPDF data={data} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `rapport-mensuel-${company.name.toLowerCase().replace(/\s+/g, "-")}-${month}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erreur generation rapport mensuel:", err);
    } finally {
      setGenerating((prev) => ({ ...prev, [key]: false }));
    }
  }

  async function generateIndividualReport(coachee: MockCoachee) {
    const key = `individual-${coachee.id}`;
    setGenerating((prev) => ({ ...prev, [key]: true }));
    try {
      const [{ pdf }, { IndividualReportPDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/reports/individual-report-pdf"),
      ]);
      const data = buildIndividualData(coachee);
      const blob = await pdf(
        <IndividualReportPDF data={data} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `rapport-individuel-${coachee.first_name.toLowerCase()}-${coachee.last_name.toLowerCase()}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erreur generation rapport individuel:", err);
    } finally {
      setGenerating((prev) => ({ ...prev, [key]: false }));
    }
  }

  async function generateCertificate(
    coacheeName: string,
    moduleTitle: string,
    earnedDate: string
  ) {
    const key = `cert-${coacheeName}-${moduleTitle}`;
    setGenerating((prev) => ({ ...prev, [key]: true }));
    try {
      const [{ pdf }, { CertificatePDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/reports/certificate-pdf"),
      ]);
      const blob = await pdf(
        <CertificatePDF
          data={{
            coacheeName,
            moduleTitle,
            completionDate: earnedDate,
          }}
        />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `certificat-${coacheeName.toLowerCase().replace(/\s+/g, "-")}-${moduleTitle.toLowerCase().replace(/\s+/g, "-")}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erreur generation certificat:", err);
    } finally {
      setGenerating((prev) => ({ ...prev, [key]: false }));
    }
  }

  const tabs: { key: ReportType; label: string; icon: React.ReactNode }[] = [
    {
      key: "mensuel",
      label: "Rapports Mensuels",
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      key: "individuel",
      label: "Rapports Individuels",
      icon: <User className="w-4 h-4" />,
    },
    {
      key: "fin_mission",
      label: "Fin de Mission",
      icon: <Award className="w-4 h-4" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <FileText className="w-6 h-6 text-accent" />
        <h1 className="font-heading text-2xl font-bold text-dark">Rapports</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all flex-1 justify-center",
              activeTab === tab.key
                ? "bg-white text-dark shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {activeTab !== "fin_mission" && (
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="appearance-none pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-white text-dark focus:outline-none focus:ring-2 focus:ring-accent/30"
            >
              <option value="all">Toutes les entreprises</option>
              {mockCompanies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        )}

        {activeTab === "mensuel" && (
          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="appearance-none pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-white text-dark focus:outline-none focus:ring-2 focus:ring-accent/30"
            >
              {reportMonths.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        )}
      </div>

      {/* Monthly Reports */}
      {activeTab === "mensuel" && (
        <div className="space-y-3">
          {(companyFilter === "all"
            ? activeCompanies
            : activeCompanies.filter((c) => c.id === companyFilter)
          ).map((company) => {
            const avgKpis = getCompanyAverageKpis(company.id);
            const employees = mockCoachees.filter(
              (c) => c.company_id === company.id && c.status === "actif"
            );
            const genKey = `monthly-${company.id}-${monthFilter}`;
            const isGenerating = generating[genKey] || false;

            return (
              <div
                key={company.id}
                className="bg-white rounded-xl border border-gray-200 p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark">
                        {company.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {employees.length} collaborateurs |{" "}
                        {reportMonths.find((m) => m.value === monthFilter)
                          ?.label || monthFilter}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Mini KPI summary */}
                    <div className="hidden md:flex items-center gap-3 text-xs">
                      <span className="text-gray-500">
                        Inv.{" "}
                        <span className="font-semibold text-dark">
                          {avgKpis.investissement}
                        </span>
                      </span>
                      <span className="text-gray-300">|</span>
                      <span className="text-gray-500">
                        Eff.{" "}
                        <span className="font-semibold text-dark">
                          {avgKpis.efficacite}
                        </span>
                      </span>
                      <span className="text-gray-300">|</span>
                      <span className="text-gray-500">
                        Part.{" "}
                        <span className="font-semibold text-dark">
                          {avgKpis.participation}
                        </span>
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        generateMonthlyReport(company, monthFilter)
                      }
                      disabled={isGenerating}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      {isGenerating ? "Generation..." : "Generer PDF"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {companyFilter !== "all" &&
            !activeCompanies.find((c) => c.id === companyFilter) && (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <p className="text-gray-500 text-sm">
                  Aucune entreprise active trouvee pour ce filtre.
                </p>
              </div>
            )}
        </div>
      )}

      {/* Individual Reports */}
      {activeTab === "individuel" && (
        <div className="space-y-3">
          {filteredCoachees.map((coachee) => {
            const genKey = `individual-${coachee.id}`;
            const isGenerating = generating[genKey] || false;
            const completedModules = coachee.module_progress.filter(
              (m) => m.status === "complete"
            ).length;
            const totalModules = coachee.module_progress.length;

            return (
              <div
                key={coachee.id}
                className="bg-white rounded-xl border border-gray-200 p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {coachee.first_name[0]}
                      {coachee.last_name[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark">
                        {coachee.first_name} {coachee.last_name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {coachee.type === "entreprise"
                          ? coachee.company_name
                          : "Individuel"}{" "}
                        | {completedModules}/{totalModules} modules |{" "}
                        <span
                          className={cn(
                            "font-medium",
                            coachee.status === "actif"
                              ? "text-success"
                              : coachee.status === "inactif"
                                ? "text-danger"
                                : "text-gray-400"
                          )}
                        >
                          {coachee.status}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Certificates count */}
                    {coachee.certificates.length > 0 && (
                      <span className="hidden sm:flex items-center gap-1 text-xs text-accent">
                        <Award className="w-3.5 h-3.5" />
                        {coachee.certificates.length} cert.
                      </span>
                    )}

                    <button
                      onClick={() => generateIndividualReport(coachee)}
                      disabled={isGenerating}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      {isGenerating ? "Generation..." : "Generer"}
                    </button>

                    {/* Certificate generation for completed modules */}
                    {coachee.certificates.length > 0 && (
                      <div className="relative group">
                        <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-accent/30 text-accent text-sm font-medium hover:bg-accent/5 transition-colors">
                          <Award className="w-4 h-4" />
                          <span className="hidden sm:inline">Certificats</span>
                          <ChevronDown className="w-3 h-3" />
                        </button>
                        <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 hidden group-hover:block">
                          {coachee.certificates.map((cert) => {
                            const certKey = `cert-${coachee.first_name} ${coachee.last_name}-${cert.module_title}`;
                            const isCertGen = generating[certKey] || false;
                            return (
                              <button
                                key={cert.id}
                                onClick={() =>
                                  generateCertificate(
                                    `${coachee.first_name} ${coachee.last_name}`,
                                    cert.module_title,
                                    cert.earned_date
                                  )
                                }
                                disabled={isCertGen}
                                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                              >
                                {isCertGen ? (
                                  <Loader2 className="w-4 h-4 animate-spin text-accent" />
                                ) : (
                                  <Award className="w-4 h-4 text-accent" />
                                )}
                                <div>
                                  <p className="text-sm font-medium text-dark">
                                    {cert.module_title}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {cert.earned_date}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* End of Mission Reports */}
      {activeTab === "fin_mission" && (
        <div className="space-y-3">
          {completedCompanies.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <Award className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">
                Aucune mission terminee pour le moment.
              </p>
            </div>
          ) : (
            completedCompanies.map((company) => {
              const employees = mockCoachees.filter(
                (c) => c.company_id === company.id
              );
              const genKey = `monthly-${company.id}-fin`;
              const isGenerating = generating[genKey] || false;

              return (
                <div
                  key={company.id}
                  className="bg-white rounded-xl border border-gray-200 p-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-lg bg-success/10 flex items-center justify-center">
                        <Award className="w-5 h-5 text-success" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-dark">
                          {company.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Mission terminee | {company.mission_start} -{" "}
                          {company.mission_end} | {employees.length}{" "}
                          collaborateurs
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        generateMonthlyReport(company, "bilan-final")
                      }
                      disabled={isGenerating}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-success text-white text-sm font-medium hover:bg-success/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      {isGenerating ? "Generation..." : "Bilan Final"}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
