"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { creneauSchema, type CreneauData } from "@/lib/validations/booking";
import { format, addDays, isWeekend } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const timeSlots = ["9h00", "10h00", "11h00", "14h00", "15h00", "16h00"];

// Generate available days (next 14 weekdays)
function getAvailableDays(): Date[] {
  const days: Date[] = [];
  let current = addDays(new Date(), 1);
  while (days.length < 14) {
    if (!isWeekend(current)) {
      days.push(current);
    }
    current = addDays(current, 1);
  }
  return days;
}

interface StepCreneauProps {
  data: Partial<CreneauData>;
  onNext: (data: CreneauData) => void;
  onPrev: () => void;
}

export function StepCreneau({ data, onNext, onPrev }: StepCreneauProps) {
  const availableDays = getAvailableDays();
  const [weekOffset, setWeekOffset] = useState(0);
  const daysPerPage = 5;
  const visibleDays = availableDays.slice(
    weekOffset * daysPerPage,
    (weekOffset + 1) * daysPerPage
  );
  const totalPages = Math.ceil(availableDays.length / daysPerPage);

  const {
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<CreneauData>({
    resolver: zodResolver(creneauSchema),
    defaultValues: {
      selected_date: data.selected_date ?? "",
      selected_time: data.selected_time ?? "",
    },
  });

  const selectedDate = watch("selected_date");
  const selectedTime = watch("selected_time");

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div>
        <h3 className="font-heading text-xl font-bold text-dark mb-1">
          Choix du creneau
        </h3>
        <p className="text-gray-500 text-sm mb-6">
          Selectionnez une date et un horaire pour votre appel decouverte.
        </p>
      </div>

      {/* Date picker */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Date *
          </label>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={weekOffset === 0}
              onClick={() => setWeekOffset((o) => o - 1)}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={weekOffset >= totalPages - 1}
              onClick={() => setWeekOffset((o) => o + 1)}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {visibleDays.map((day) => {
            const dateStr = format(day, "yyyy-MM-dd");
            const isSelected = selectedDate === dateStr;
            return (
              <button
                key={dateStr}
                type="button"
                onClick={() => setValue("selected_date", dateStr, { shouldValidate: true })}
                className={cn(
                  "flex flex-col items-center rounded-lg border-2 py-3 px-1 text-center transition-all",
                  isSelected
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                )}
              >
                <span className="text-xs font-medium uppercase">
                  {format(day, "EEE", { locale: fr })}
                </span>
                <span className="text-lg font-bold mt-0.5">
                  {format(day, "d")}
                </span>
                <span className="text-xs">
                  {format(day, "MMM", { locale: fr })}
                </span>
              </button>
            );
          })}
        </div>
        {errors.selected_date && (
          <p className="text-danger text-xs mt-1">{errors.selected_date.message}</p>
        )}
      </div>

      {/* Time slots */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
          <Clock className="h-4 w-4" />
          Horaire *
        </label>
        <div className="grid grid-cols-3 gap-2">
          {timeSlots.map((time) => {
            const isSelected = selectedTime === time;
            return (
              <button
                key={time}
                type="button"
                onClick={() => setValue("selected_time", time, { shouldValidate: true })}
                className={cn(
                  "rounded-lg border-2 py-3 px-4 text-sm font-semibold transition-all",
                  isSelected
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                )}
              >
                {time}
              </button>
            );
          })}
        </div>
        {errors.selected_time && (
          <p className="text-danger text-xs mt-1">{errors.selected_time.message}</p>
        )}
      </div>

      {/* Selection summary */}
      {selectedDate && selectedTime && (
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
          <p className="text-sm font-medium text-dark">
            Creneau selectionne :{" "}
            <span className="text-accent font-bold">
              {format(new Date(selectedDate), "EEEE d MMMM yyyy", { locale: fr })} a {selectedTime}
            </span>
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="pt-2 flex gap-3">
        <button
          type="button"
          onClick={onPrev}
          className="flex-1 py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
        >
          Precedent
        </button>
        <button
          type="submit"
          className="flex-1 py-3 px-6 bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg transition-colors"
        >
          Confirmer
        </button>
      </div>
    </form>
  );
}
