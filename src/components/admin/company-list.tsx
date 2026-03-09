import Link from "next/link";
import { cn } from "@/lib/utils";
import { Eye } from "lucide-react";
import { KpiDotGroup } from "@/components/ui/kpi-badge";
import { getCompanyAverageKpis } from "@/lib/mock-data";
import type { MockCompany } from "@/lib/mock-data";

interface CompanyListProps {
  companies: MockCompany[];
}

const missionStatusStyles: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-success/10 text-success" },
  completed: { label: "Terminee", className: "bg-gray-100 text-gray-600" },
  paused: { label: "En pause", className: "bg-warning/10 text-warning" },
};

export function CompanyList({ companies }: CompanyListProps) {
  return (
    <div className="space-y-4">
      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Entreprise
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Collaborateurs
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Debut mission
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Dirigeant
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  KPIs moyens
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {companies.map((company) => {
                const kpis = getCompanyAverageKpis(company.id);
                const status = missionStatusStyles[company.mission_status];

                return (
                  <tr key={company.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary font-heading">
                          {company.logo_placeholder}
                        </div>
                        <span className="text-sm font-medium text-dark">{company.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {company.employee_count}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(company.mission_start).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", status.className)}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {company.dirigeant_name}
                    </td>
                    <td className="px-4 py-3">
                      <KpiDotGroup
                        investissement={kpis.investissement}
                        efficacite={kpis.efficacite}
                        participation={kpis.participation}
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/entreprises/${company.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/10 rounded-lg transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Voir
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {companies.map((company) => {
          const kpis = getCompanyAverageKpis(company.id);
          const status = missionStatusStyles[company.mission_status];

          return (
            <Link
              key={company.id}
              href={`/admin/entreprises/${company.id}`}
              className="block bg-white rounded-xl border border-gray-200 p-4 hover:border-accent/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary font-heading">
                  {company.logo_placeholder}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-semibold text-sm text-dark truncate">
                    {company.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {company.employee_count} collaborateurs
                  </p>
                </div>
                <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0", status.className)}>
                  {status.label}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Dirigeant: {company.dirigeant_name}</span>
                <KpiDotGroup
                  investissement={kpis.investissement}
                  efficacite={kpis.efficacite}
                  participation={kpis.participation}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
