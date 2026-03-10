import { cn } from "@/lib/utils";
import { Video, Clock, ExternalLink, Edit2, XCircle, Plus } from "lucide-react";
import type { MockAppointment, CallType } from "@/lib/mock-data";

interface UpcomingAppointmentsProps {
  appointments: MockAppointment[];
  onNewAppointment?: () => void;
  onEditAppointment?: (id: string) => void;
  onCancelAppointment?: (id: string) => void;
}

const typeStyles: Record<CallType, { label: string; className: string }> = {
  decouverte: { label: "Decouverte", className: "bg-blue-50 text-blue-700" },
  coaching: { label: "Coaching", className: "bg-success/10 text-success" },
  review: { label: "Review", className: "bg-accent/10 text-accent" },
};

export function UpcomingAppointments({
  appointments,
  onNewAppointment,
  onEditAppointment,
  onCancelAppointment,
}: UpcomingAppointmentsProps) {
  // Group by date
  const grouped = appointments.reduce(
    (acc, apt) => {
      if (!acc[apt.date]) acc[apt.date] = [];
      acc[apt.date].push(apt);
      return acc;
    },
    {} as Record<string, MockAppointment[]>
  );

  const sortedDates = Object.keys(grouped).sort();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-semibold text-sm text-dark">
          Prochains rendez-vous
        </h3>
        {onNewAppointment && (
          <button
            onClick={onNewAppointment}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/10 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Nouveau
          </button>
        )}
      </div>

      <div className="space-y-4">
        {sortedDates.map((date) => {
          const dateObj = new Date(date);
          const dayName = dateObj.toLocaleDateString("fr-FR", { weekday: "long" });
          const formattedDate = dateObj.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
          });

          return (
            <div key={date}>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {dayName} {formattedDate}
              </p>
              <div className="space-y-2">
                {grouped[date].map((apt) => {
                  const typeInfo = typeStyles[apt.type];
                  return (
                    <div
                      key={apt.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-accent/20 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                        <Video className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-medium text-dark truncate">
                            {apt.client_name}
                          </span>
                          <span
                            className={cn(
                              "text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0",
                              typeInfo.className
                            )}
                          >
                            {typeInfo.label}
                          </span>
                        </div>
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {apt.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {apt.zoom_link && apt.zoom_link !== "#" && (
                          <a
                            href={apt.zoom_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-accent hover:bg-accent/10 rounded-lg transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Zoom
                          </a>
                        )}
                        {onEditAppointment && (
                          <button
                            onClick={() => onEditAppointment(apt.id)}
                            className="p-1.5 text-gray-400 hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {onCancelAppointment && (
                          <button
                            onClick={() => onCancelAppointment(apt.id)}
                            className="p-1.5 text-gray-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                            title="Annuler"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
