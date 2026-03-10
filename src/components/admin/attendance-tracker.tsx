"use client";

import { useState, useMemo } from "react";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Users,
  TrendingUp,
  Filter,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

type AttendanceStatus = "present" | "absent" | "excused" | "late";

interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  moduleId: string;
  moduleName: string;
  sessionDate: string;
  status: AttendanceStatus;
  duration?: number;
  notes?: string;
}

interface AttendanceTrackerProps {
  records: AttendanceRecord[];
  moduleId?: string;
  onStatusChange?: (recordId: string, newStatus: AttendanceStatus) => void;
  onAddRecord?: (record: Omit<AttendanceRecord, "id">) => void;
  className?: string;
  editable?: boolean;
}

const STATUS_CONFIG: Record<
  AttendanceStatus,
  { label: string; icon: typeof CheckCircle2; color: string; bgColor: string }
> = {
  present: {
    label: "Present",
    icon: CheckCircle2,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  absent: {
    label: "Absent",
    icon: XCircle,
    color: "text-danger",
    bgColor: "bg-danger/10",
  },
  late: {
    label: "Retard",
    icon: Clock,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  excused: {
    label: "Excuse",
    icon: AlertTriangle,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
};

export function AttendanceTracker({
  records,
  moduleId,
  onStatusChange,
  className,
  editable = false,
}: AttendanceTrackerProps) {
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus | "all">("all");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Calculate stats
  const stats = useMemo(() => {
    const filtered = moduleId
      ? records.filter((r) => r.moduleId === moduleId)
      : records;

    const total = filtered.length;
    const present = filtered.filter((r) => r.status === "present").length;
    const absent = filtered.filter((r) => r.status === "absent").length;
    const late = filtered.filter((r) => r.status === "late").length;
    const excused = filtered.filter((r) => r.status === "excused").length;

    const attended = present + late + excused;
    const rate = total > 0 ? Math.round((attended / total) * 100) : 0;

    return { total, present, absent, late, excused, rate };
  }, [records, moduleId]);

  // Get unique dates
  const dates = useMemo(() => {
    const uniqueDates = [...new Set(records.map((r) => r.sessionDate))];
    return uniqueDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  }, [records]);

  // Filter records
  const filteredRecords = useMemo(() => {
    let filtered = moduleId
      ? records.filter((r) => r.moduleId === moduleId)
      : records;

    if (statusFilter !== "all") {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }

    if (selectedDate) {
      filtered = filtered.filter((r) => r.sessionDate === selectedDate);
    }

    return filtered;
  }, [records, moduleId, statusFilter, selectedDate]);

  // Group by date
  const groupedByDate = useMemo(() => {
    const groups: Record<string, AttendanceRecord[]> = {};
    for (const record of filteredRecords) {
      if (!groups[record.sessionDate]) {
        groups[record.sessionDate] = [];
      }
      groups[record.sessionDate].push(record);
    }
    return groups;
  }, [filteredRecords]);

  const handleStatusClick = (recordId: string, currentStatus: AttendanceStatus) => {
    if (!editable || !onStatusChange) return;

    const statusOrder: AttendanceStatus[] = ["present", "late", "excused", "absent"];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
    onStatusChange(recordId, nextStatus);
  };

  return (
    <div className={cn("bg-white rounded-xl border border-gray-200", className)}>
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-heading font-semibold text-dark text-base">
                Suivi de presence
              </h2>
              <p className="text-xs text-gray-500">{stats.total} seances enregistrees</p>
            </div>
          </div>

          {/* Attendance rate badge */}
          <div
            className={cn(
              "px-4 py-2 rounded-lg text-center",
              stats.rate >= 80
                ? "bg-success/10 text-success"
                : stats.rate >= 60
                  ? "bg-warning/10 text-warning"
                  : "bg-danger/10 text-danger"
            )}
          >
            <p className="text-2xl font-bold">{stats.rate}%</p>
            <p className="text-xs">Taux presence</p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-4 gap-3">
          {(["present", "late", "excused", "absent"] as const).map((status) => {
            const config = STATUS_CONFIG[status];
            const Icon = config.icon;
            const count = stats[status];

            return (
              <button
                key={status}
                onClick={() => setStatusFilter(statusFilter === status ? "all" : status)}
                className={cn(
                  "p-3 rounded-lg text-center transition-all",
                  statusFilter === status
                    ? `${config.bgColor} ring-2 ring-offset-1 ring-current ${config.color}`
                    : "bg-gray-50 hover:bg-gray-100"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 mx-auto mb-1",
                    statusFilter === status ? config.color : "text-gray-400"
                  )}
                />
                <p className="text-lg font-bold">{count}</p>
                <p className="text-xs text-gray-500">{config.label}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-3">
        <Filter className="w-4 h-4 text-gray-400" />
        <select
          value={selectedDate || ""}
          onChange={(e) => setSelectedDate(e.target.value || null)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white"
        >
          <option value="">Toutes les dates</option>
          {dates.map((date) => (
            <option key={date} value={date}>
              {format(new Date(date), "d MMMM yyyy", { locale: fr })}
            </option>
          ))}
        </select>

        {(statusFilter !== "all" || selectedDate) && (
          <button
            onClick={() => {
              setStatusFilter("all");
              setSelectedDate(null);
            }}
            className="text-xs text-accent hover:underline"
          >
            Reinitialiser filtres
          </button>
        )}
      </div>

      {/* Records list */}
      <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
        {Object.entries(groupedByDate).map(([date, dateRecords]) => (
          <div key={date}>
            {/* Date header */}
            <div className="px-5 py-2 bg-gray-50 sticky top-0">
              <p className="text-xs font-medium text-gray-500">
                {format(new Date(date), "EEEE d MMMM yyyy", { locale: fr })}
              </p>
            </div>

            {/* Records for this date */}
            {dateRecords.map((record) => {
              const config = STATUS_CONFIG[record.status];
              const Icon = config.icon;

              return (
                <div
                  key={record.id}
                  className="px-5 py-3 flex items-center justify-between hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {record.userName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-dark">{record.userName}</p>
                      <p className="text-xs text-gray-500">{record.moduleName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {record.duration && (
                      <span className="text-xs text-gray-400">{record.duration} min</span>
                    )}
                    <button
                      onClick={() => handleStatusClick(record.id, record.status)}
                      disabled={!editable}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                        config.bgColor,
                        config.color,
                        editable && "cursor-pointer hover:opacity-80"
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {config.label}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Aucune presence enregistree</p>
          </div>
        )}
      </div>

      {/* Footer with trend */}
      {stats.total > 0 && (
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {stats.present + stats.late} presences sur {stats.total} seances
            </span>
            <span className="flex items-center gap-1 text-success">
              <TrendingUp className="w-3.5 h-3.5" />
              Tendance positive
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
