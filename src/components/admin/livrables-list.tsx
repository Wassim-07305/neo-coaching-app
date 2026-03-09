import { cn } from "@/lib/utils";
import { FileText, Headphones, Video, Download } from "lucide-react";
import type { MockLivrable, LivrableType, LivrableStatus } from "@/lib/mock-data";

interface LivrablesListProps {
  livrables: MockLivrable[];
}

const typeIcons: Record<LivrableType, { icon: React.ElementType; label: string }> = {
  ecrit: { icon: FileText, label: "Ecrit" },
  audio: { icon: Headphones, label: "Audio" },
  video: { icon: Video, label: "Video" },
};

const statusStyles: Record<LivrableStatus, { label: string; className: string }> = {
  soumis: { label: "Soumis", className: "bg-blue-50 text-blue-700" },
  en_attente: { label: "En attente", className: "bg-warning/10 text-warning" },
  valide: { label: "Valide", className: "bg-success/10 text-success" },
};

export function LivrablesList({ livrables }: LivrablesListProps) {
  if (livrables.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-heading font-semibold text-sm text-dark mb-4">
          Livrables
        </h3>
        <p className="text-sm text-gray-400 text-center py-6">
          Aucun livrable soumis pour le moment.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-heading font-semibold text-sm text-dark mb-4">
        Livrables
      </h3>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left pb-2 text-xs font-semibold text-gray-500 uppercase">Module</th>
              <th className="text-left pb-2 text-xs font-semibold text-gray-500 uppercase">Type</th>
              <th className="text-left pb-2 text-xs font-semibold text-gray-500 uppercase">Date</th>
              <th className="text-left pb-2 text-xs font-semibold text-gray-500 uppercase">Statut</th>
              <th className="text-right pb-2 text-xs font-semibold text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {livrables.map((livrable) => {
              const typeInfo = typeIcons[livrable.type];
              const statusInfo = statusStyles[livrable.status];
              const Icon = typeInfo.icon;

              return (
                <tr key={livrable.id} className="hover:bg-gray-50/50">
                  <td className="py-3 text-sm text-dark">{livrable.module_title}</td>
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs text-gray-600">
                      <Icon className="w-3.5 h-3.5" />
                      {typeInfo.label}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-gray-500">
                    {new Date(livrable.submission_date).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="py-3">
                    <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", statusInfo.className)}>
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button className="text-gray-400 hover:text-accent transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile list */}
      <div className="md:hidden space-y-3">
        {livrables.map((livrable) => {
          const typeInfo = typeIcons[livrable.type];
          const statusInfo = statusStyles[livrable.status];
          const Icon = typeInfo.icon;

          return (
            <div key={livrable.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                <Icon className="w-4 h-4 text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-dark truncate">{livrable.module_title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-400">
                    {new Date(livrable.submission_date).toLocaleDateString("fr-FR")}
                  </span>
                  <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium", statusInfo.className)}>
                    {statusInfo.label}
                  </span>
                </div>
              </div>
              <button className="text-gray-400 hover:text-accent transition-colors shrink-0">
                <Download className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
