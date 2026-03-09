"use client";

import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Video,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
} from "date-fns";
import { fr } from "date-fns/locale";

interface CalendarAppointment {
  id: string;
  date: string;
  time: string;
  client_name: string;
  type: string;
  zoom_link: string;
}

interface CalendarViewProps {
  appointments: CalendarAppointment[];
}

const typeConfig: Record<string, { color: string; label: string }> = {
  coaching: { color: "bg-[#2D8C4E]", label: "Coaching" },
  decouverte: { color: "bg-blue-500", label: "Decouverte" },
  review: { color: "bg-[#F39C12]", label: "Review" },
};

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export function CalendarView({ appointments }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1, 26));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const appointmentsByDate = useMemo(() => {
    const map: Record<string, CalendarAppointment[]> = {};
    appointments.forEach((apt) => {
      if (!map[apt.date]) map[apt.date] = [];
      map[apt.date].push(apt);
    });
    return map;
  }, [appointments]);

  const selectedDateStr = selectedDate
    ? format(selectedDate, "yyyy-MM-dd")
    : null;
  const selectedAppts = selectedDateStr
    ? appointmentsByDate[selectedDateStr] || []
    : [];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="rounded-lg p-2 hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h3 className="font-heading text-lg font-bold text-dark min-w-[160px] text-center capitalize">
            {format(currentMonth, "MMMM yyyy", { locale: fr })}
          </h3>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="rounded-lg p-2 hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        <button
          onClick={() => {
            setCurrentMonth(new Date());
            setSelectedDate(new Date());
          }}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
        >
          Aujourd&apos;hui
        </button>
      </div>

      {/* Calendar grid */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-gray-100">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="py-2 text-center text-xs font-semibold text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7">
          {days.map((day) => {
            const dateStr = format(day, "yyyy-MM-dd");
            const dayAppts = appointmentsByDate[dateStr] || [];
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const today = isToday(day);

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "relative flex flex-col items-center gap-1 border-b border-r border-gray-50 py-2 min-h-[60px] transition-colors",
                  isCurrentMonth
                    ? "hover:bg-gray-50"
                    : "opacity-30",
                  isSelected && "bg-[#D4A843]/10"
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-sm",
                    today && !isSelected && "bg-[#D4A843] text-white font-bold",
                    isSelected && "bg-[#D4A843] text-white font-bold",
                    !today && !isSelected && "text-gray-700"
                  )}
                >
                  {format(day, "d")}
                </span>
                {dayAppts.length > 0 && (
                  <div className="flex gap-0.5">
                    {dayAppts.slice(0, 3).map((apt) => (
                      <div
                        key={apt.id}
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          typeConfig[apt.type]?.color || "bg-gray-400"
                        )}
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        {Object.entries(typeConfig).map(([key, config]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className={cn("h-2 w-2 rounded-full", config.color)} />
            {config.label}
          </div>
        ))}
      </div>

      {/* Selected day detail */}
      {selectedDate && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-heading font-bold text-dark capitalize">
              {format(selectedDate, "EEEE d MMMM", { locale: fr })}
            </h4>
            <button className="flex items-center gap-1 rounded-lg bg-[#D4A843] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#c49a3a]">
              <Plus className="h-3.5 w-3.5" />
              Ajouter
            </button>
          </div>

          {selectedAppts.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">
              Aucun rendez-vous ce jour
            </p>
          ) : (
            <div className="space-y-2">
              {selectedAppts
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-sm font-medium text-dark min-w-[50px]">
                      <Clock className="h-3.5 w-3.5 text-gray-400" />
                      {apt.time}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-dark">
                        {apt.client_name}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-semibold text-white",
                        typeConfig[apt.type]?.color || "bg-gray-400"
                      )}
                    >
                      {typeConfig[apt.type]?.label || apt.type}
                    </span>
                    <a
                      href={apt.zoom_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-blue-50 p-1.5 text-blue-600 hover:bg-blue-100"
                    >
                      <Video className="h-4 w-4" />
                    </a>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
