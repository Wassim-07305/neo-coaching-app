"use client";

import { cn } from "@/lib/utils";
import { Users, Clock, GripVertical, Edit, Trash2 } from "lucide-react";
import type { MockModule, ParcoursType } from "@/lib/mock-data";

interface ModuleListProps {
  modules: MockModule[];
  onEdit: (module: MockModule) => void;
}

const parcoursStyles: Record<ParcoursType, { label: string; className: string }> = {
  individuel: { label: "Individuel", className: "bg-blue-50 text-blue-700" },
  entreprise: { label: "Entreprise", className: "bg-success/10 text-success" },
  les_deux: { label: "Les deux", className: "bg-purple-50 text-purple-700" },
};

export function ModuleList({ modules, onEdit }: ModuleListProps) {
  return (
    <div className="space-y-3">
      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-10">
                  #
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Module
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Parcours
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Prix
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Duree
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Inscrits
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {modules.map((mod) => {
                const parcours = parcoursStyles[mod.parcours_type];
                return (
                  <tr key={mod.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <GripVertical className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
                        <span className="text-sm font-medium text-gray-400">
                          {mod.order_index}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-dark">{mod.title}</p>
                        <p className="text-xs text-gray-500 line-clamp-1 max-w-xs">
                          {mod.description}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full font-medium",
                          parcours.className
                        )}
                      >
                        {parcours.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {mod.price} EUR
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-3.5 h-3.5" />
                        {mod.duration_weeks} sem.
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                        <Users className="w-3.5 h-3.5" />
                        {mod.enrolled_count}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onEdit(mod)}
                          className="p-1.5 text-gray-400 hover:text-accent rounded-lg hover:bg-accent/10 transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 text-gray-400 hover:text-danger rounded-lg hover:bg-danger/10 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
        {modules.map((mod) => {
          const parcours = parcoursStyles[mod.parcours_type];
          return (
            <div
              key={mod.id}
              className="bg-white rounded-xl border border-gray-200 p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                    {mod.order_index}
                  </span>
                  <h3 className="font-heading font-semibold text-sm text-dark">
                    {mod.title}
                  </h3>
                </div>
                <button
                  onClick={() => onEdit(mod)}
                  className="p-1 text-gray-400 hover:text-accent"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-3 line-clamp-2">{mod.description}</p>
              <div className="flex items-center flex-wrap gap-2">
                <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", parcours.className)}>
                  {parcours.label}
                </span>
                <span className="text-xs text-gray-500">{mod.price} EUR</span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {mod.duration_weeks} sem.
                </span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Users className="w-3 h-3" /> {mod.enrolled_count} inscrits
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
