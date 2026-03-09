import { cn } from "@/lib/utils";
import { Phone, Video, Users } from "lucide-react";
import type { MockCall, CallType } from "@/lib/mock-data";

interface CallHistoryProps {
  calls: MockCall[];
}

const typeConfig: Record<CallType, { icon: React.ElementType; label: string; className: string }> = {
  decouverte: { icon: Users, label: "Decouverte", className: "bg-blue-50 text-blue-700" },
  coaching: { icon: Phone, label: "Coaching", className: "bg-success/10 text-success" },
  review: { icon: Video, label: "Review", className: "bg-accent/10 text-accent" },
};

export function CallHistory({ calls }: CallHistoryProps) {
  if (calls.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-heading font-semibold text-sm text-dark mb-4">
          Historique des appels
        </h3>
        <p className="text-sm text-gray-400 text-center py-6">
          Aucun appel enregistre.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-heading font-semibold text-sm text-dark mb-4">
        Historique des appels
      </h3>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left pb-2 text-xs font-semibold text-gray-500 uppercase">Date</th>
              <th className="text-left pb-2 text-xs font-semibold text-gray-500 uppercase">Duree</th>
              <th className="text-left pb-2 text-xs font-semibold text-gray-500 uppercase">Type</th>
              <th className="text-left pb-2 text-xs font-semibold text-gray-500 uppercase">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {calls.map((call) => {
              const config = typeConfig[call.type];
              const Icon = config.icon;

              return (
                <tr key={call.id} className="hover:bg-gray-50/50">
                  <td className="py-3 text-sm text-dark">
                    {new Date(call.date).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="py-3 text-sm text-gray-600">{call.duration_minutes} min</td>
                  <td className="py-3">
                    <span className={cn("inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full font-medium", config.className)}>
                      <Icon className="w-3 h-3" />
                      {config.label}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-gray-500 max-w-xs truncate">
                    {call.notes}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile list */}
      <div className="md:hidden space-y-3">
        {calls.map((call) => {
          const config = typeConfig[call.type];
          const Icon = config.icon;

          return (
            <div key={call.id} className="py-2 border-b border-gray-50 last:border-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-dark">
                  {new Date(call.date).toLocaleDateString("fr-FR")}
                </span>
                <span className={cn("inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full font-medium", config.className)}>
                  <Icon className="w-3 h-3" />
                  {config.label}
                </span>
              </div>
              <p className="text-xs text-gray-500">{call.duration_minutes} min</p>
              <p className="text-xs text-gray-400 mt-1 line-clamp-2">{call.notes}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
