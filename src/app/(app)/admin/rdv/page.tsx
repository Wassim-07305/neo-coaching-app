"use client";

import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { BookingFunnel } from "@/components/admin/booking-funnel";
import { LeadsTable } from "@/components/admin/leads-table";
import { UpcomingAppointments } from "@/components/admin/upcoming-appointments";
import { CalendarView } from "@/components/admin/calendar-view";
import { cn } from "@/lib/utils";
import { useUpcomingAppointments, useBookingSubmissions } from "@/lib/supabase/hooks";
import { adaptAppointment } from "@/lib/supabase/adapters";
import type { MockAppointment } from "@/lib/mock-data";
import {
  mockFunnelData,
  mockBookingSubmissions,
  mockAppointments,
} from "@/lib/mock-data";

type Tab = "calendrier" | "pipeline";

export default function RdvPage() {
  const { data: supaAppointments } = useUpcomingAppointments();
  const { data: supaSubmissions } = useBookingSubmissions();

  const appointments = supaAppointments
    ? supaAppointments.map((a) => adaptAppointment(a as Parameters<typeof adaptAppointment>[0])) as unknown as MockAppointment[]
    : mockAppointments;
  const leads = supaSubmissions || mockBookingSubmissions;
  const data = {
    funnel: mockFunnelData,
    leads,
    appointments,
  };
  const [activeTab, setActiveTab] = useState<Tab>("calendrier");

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <CalendarIcon className="w-6 h-6 text-accent" />
        <h1 className="font-heading text-2xl font-bold text-dark">
          RDV / Booking
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {(
          [
            { key: "calendrier", label: "Calendrier" },
            { key: "pipeline", label: "Pipeline" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-colors relative",
              activeTab === tab.key
                ? "text-[#D4A843]"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {tab.label}
            {activeTab === tab.key && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4A843]" />
            )}
          </button>
        ))}
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Formulaires vus</p>
          <p className="text-xl font-bold font-heading text-dark">
            {data.funnel[0]?.count || 0}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">RDV pris</p>
          <p className="text-xl font-bold font-heading text-success">
            {data.funnel[data.funnel.length - 1]?.count || 0}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Leads partiels</p>
          <p className="text-xl font-bold font-heading text-warning">
            {data.leads.filter((l) => !l.is_complete).length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Prochains RDV</p>
          <p className="text-xl font-bold font-heading text-dark">
            {data.appointments.length}
          </p>
        </div>
      </div>

      {/* Tab content */}
      {activeTab === "calendrier" && (
        <CalendarView appointments={data.appointments} />
      )}

      {activeTab === "pipeline" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <BookingFunnel data={data.funnel} />
            <LeadsTable leads={data.leads} />
          </div>
          <div className="xl:col-span-1">
            <UpcomingAppointments appointments={data.appointments} />
          </div>
        </div>
      )}
    </div>
  );
}
