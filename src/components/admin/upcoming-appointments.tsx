import { cn } from "@/lib/utils";
import { Video, Clock, ExternalLink } from "lucide-react";
import type { MockAppointment, CallType } from "@/lib/mock-data";

interface UpcomingAppointmentsProps {
  appointments: MockAppointment[];
}

const typeStyles: Record<CallType, { label: string; className: string }> = {
  decouverte: { label: "Decouverte", className: "bg-blue-50 text-blue-700" },
  coaching: { label: "Coaching", className: "bg-success/10 text-success" },
  review: { label: "Review", className: "bg-accent/10 text-accent" },
};

export function UpcomingAppointments({ appointments }: UpcomingAppointmentsProps) {
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
      <h3 className="font-heading font-semibold text-sm text-dark mb-4">
        Prochains rendez-vous
      </h3>

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
                      <a
                        href={apt.zoom_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-accent hover:bg-accent/10 rounded-lg transition-colors shrink-0"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Zoom
                      </a>
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
