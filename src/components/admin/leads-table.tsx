"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Mail, ChevronUp, ChevronDown } from "lucide-react";
import type { MockBookingSubmission, BookingStep } from "@/lib/mock-data";

interface LeadsTableProps {
  leads: MockBookingSubmission[];
}

const stepLabels: Record<BookingStep, string> = {
  formulaire_vu: "Formulaire vu",
  commence: "Commence",
  complete: "Complete",
  rdv_pris: "RDV pris",
};

const stepColors: Record<BookingStep, string> = {
  formulaire_vu: "bg-gray-100 text-gray-600",
  commence: "bg-warning/10 text-warning",
  complete: "bg-blue-50 text-blue-700",
  rdv_pris: "bg-success/10 text-success",
};

type SortField = "name" | "date" | "step";
type SortDir = "asc" | "desc";

export function LeadsTable({ leads }: LeadsTableProps) {
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sorted = useMemo(() => {
    const list = [...leads];
    const stepOrder: BookingStep[] = ["formulaire_vu", "commence", "complete", "rdv_pris"];
    list.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "name":
          cmp = `${a.last_name} ${a.first_name}`.localeCompare(`${b.last_name} ${b.first_name}`);
          break;
        case "date":
          cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case "step":
          cmp = stepOrder.indexOf(a.step_reached) - stepOrder.indexOf(b.step_reached);
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [leads, sortField, sortDir]);

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <ChevronUp className="w-3 h-3 text-gray-300" />;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3 h-3 text-accent" />
    ) : (
      <ChevronDown className="w-3 h-3 text-accent" />
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-heading font-semibold text-sm text-dark mb-4">
        Leads ({leads.length})
      </h3>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th
                className="text-left pb-2 text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:text-accent"
                onClick={() => toggleSort("name")}
              >
                <span className="flex items-center gap-1">
                  Nom <SortIcon field="name" />
                </span>
              </th>
              <th className="text-left pb-2 text-xs font-semibold text-gray-500 uppercase">
                Email
              </th>
              <th
                className="text-left pb-2 text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:text-accent"
                onClick={() => toggleSort("step")}
              >
                <span className="flex items-center gap-1">
                  Etape <SortIcon field="step" />
                </span>
              </th>
              <th className="text-left pb-2 text-xs font-semibold text-gray-500 uppercase">
                Complete
              </th>
              <th
                className="text-left pb-2 text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:text-accent"
                onClick={() => toggleSort("date")}
              >
                <span className="flex items-center gap-1">
                  Date <SortIcon field="date" />
                </span>
              </th>
              <th className="text-left pb-2 text-xs font-semibold text-gray-500 uppercase">
                Source
              </th>
              <th className="text-right pb-2 text-xs font-semibold text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sorted.map((lead) => (
              <tr
                key={lead.id}
                className={cn(
                  "hover:bg-gray-50/50 transition-colors",
                  !lead.is_complete && "bg-warning/5"
                )}
              >
                <td className="py-3 text-sm font-medium text-dark">
                  {lead.first_name} {lead.last_name}
                </td>
                <td className="py-3 text-sm text-gray-600">{lead.email}</td>
                <td className="py-3">
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full font-medium",
                      stepColors[lead.step_reached]
                    )}
                  >
                    {stepLabels[lead.step_reached]}
                  </span>
                </td>
                <td className="py-3">
                  <span
                    className={cn(
                      "text-xs font-medium",
                      lead.is_complete ? "text-success" : "text-warning"
                    )}
                  >
                    {lead.is_complete ? "Oui" : "Non"}
                  </span>
                </td>
                <td className="py-3 text-sm text-gray-500">
                  {new Date(lead.date).toLocaleDateString("fr-FR")}
                </td>
                <td className="py-3 text-sm text-gray-500">{lead.source}</td>
                <td className="py-3 text-right">
                  <button className="p-1.5 text-gray-400 hover:text-accent rounded-lg hover:bg-accent/10 transition-colors">
                    <Mail className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {sorted.map((lead) => (
          <div
            key={lead.id}
            className={cn(
              "p-3 rounded-lg border",
              lead.is_complete
                ? "border-gray-100 bg-white"
                : "border-warning/20 bg-warning/5"
            )}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-dark">
                {lead.first_name} {lead.last_name}
              </span>
              <span
                className={cn(
                  "text-[10px] px-2 py-0.5 rounded-full font-medium",
                  stepColors[lead.step_reached]
                )}
              >
                {stepLabels[lead.step_reached]}
              </span>
            </div>
            <p className="text-xs text-gray-500">{lead.email}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-400">
                {new Date(lead.date).toLocaleDateString("fr-FR")} - {lead.source}
              </span>
              <span
                className={cn(
                  "text-[10px] font-medium",
                  lead.is_complete ? "text-success" : "text-warning"
                )}
              >
                {lead.is_complete ? "Complete" : "Partiel"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
