import { cn } from "@/lib/utils";
import { getKpiColor, getCompanyAverageKpis, mockCoachees } from "@/lib/mock-data";
import type { MockCompany } from "@/lib/mock-data";

interface EnterpriseKpisProps {
  companies: MockCompany[];
}

function KpiBar({ label, value }: { label: string; value: number }) {
  const color = getKpiColor(value);
  const colorClass = {
    danger: "bg-danger",
    warning: "bg-warning",
    success: "bg-success",
  }[color];
  const textColorClass = {
    danger: "text-danger",
    warning: "text-warning",
    success: "text-success",
  }[color];

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{label}</span>
        <span className={cn("text-xs font-bold", textColorClass)}>{value}/10</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", colorClass)}
          style={{ width: `${(value / 10) * 100}%` }}
        />
      </div>
    </div>
  );
}

const missionStatusLabels: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-success/10 text-success" },
  completed: { label: "Terminee", className: "bg-gray-100 text-gray-600" },
  paused: { label: "En pause", className: "bg-warning/10 text-warning" },
};

export function EnterpriseKpis({ companies }: EnterpriseKpisProps) {
  return (
    <div className="space-y-4">
      <h2 className="font-heading font-semibold text-lg text-dark">
        KPIs agreges par entreprise
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {companies.map((company) => {
          const kpis = getCompanyAverageKpis(company.id);
          const employees = mockCoachees.filter(
            (c) => c.company_id === company.id
          );
          const status = missionStatusLabels[company.mission_status];

          return (
            <div
              key={company.id}
              className="bg-white rounded-xl border border-gray-200 p-5 space-y-4"
            >
              {/* Company header */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary font-heading">
                  {company.logo_placeholder}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-semibold text-sm text-dark truncate">
                    {company.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {employees.length} collaborateur{employees.length > 1 ? "s" : ""}
                  </p>
                </div>
                <span
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-medium",
                    status.className
                  )}
                >
                  {status.label}
                </span>
              </div>

              {/* KPI bars */}
              <div className="space-y-2.5">
                <KpiBar label="Investissement" value={kpis.investissement} />
                <KpiBar label="Efficacite" value={kpis.efficacite} />
                <KpiBar label="Participation" value={kpis.participation} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
