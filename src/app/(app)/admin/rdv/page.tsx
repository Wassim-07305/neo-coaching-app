"use client";

import { useMemo } from "react";
import { Calendar, Loader2 } from "lucide-react";
import { BookingFunnel } from "@/components/admin/booking-funnel";
import { LeadsTable } from "@/components/admin/leads-table";
import { UpcomingAppointments } from "@/components/admin/upcoming-appointments";
import {
  useAppointments,
} from "@/hooks/use-supabase-data";
import { useBookingSubmissions } from "@/hooks/use-supabase-data";
import {
  mockFunnelData,
  mockBookingSubmissions,
  mockAppointments,
} from "@/lib/mock-data";
import type {
  MockFunnelStep,
  MockBookingSubmission,
  MockAppointment,
  BookingStep,
  CallType,
} from "@/lib/mock-data";
import type { Appointment, BookingFormSubmission } from "@/lib/supabase/types";

function mapAppointmentsToMock(appointments: Appointment[]): MockAppointment[] {
  const typeMap: Record<string, CallType> = {
    discovery: "decouverte",
    coaching: "coaching",
    module_review: "review",
    intervenant: "review",
  };

  return appointments
    .filter((a) => a.status === "scheduled")
    .map((a) => ({
      id: a.id,
      date: a.datetime_start.split("T")[0],
      time: new Date(a.datetime_start).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      client_name:
        ((a as unknown as Record<string, unknown>).client_name as string) ||
        `Client ${a.client_id?.slice(0, 6) || "inconnu"}`,
      type: typeMap[a.type] || "coaching",
      zoom_link: a.zoom_link || "#",
    }));
}

function mapSubmissionsToLeads(submissions: BookingFormSubmission[]): MockBookingSubmission[] {
  const stepMap: Record<number, BookingStep> = {
    1: "formulaire_vu",
    2: "commence",
    3: "commence",
    4: "complete",
    5: "rdv_pris",
  };

  return submissions.map((s) => ({
    id: s.id,
    first_name: s.first_name || "Inconnu",
    last_name: s.last_name || "",
    email: s.email || "",
    step_reached: s.completed ? "rdv_pris" : (stepMap[s.step_reached] || "formulaire_vu"),
    is_complete: s.completed,
    date: s.created_at,
    source: s.source || "site",
    phone: s.phone || undefined,
  }));
}

function buildFunnelFromSubmissions(submissions: BookingFormSubmission[]): MockFunnelStep[] {
  const total = submissions.length;
  const started = submissions.filter((s) => s.step_reached >= 2).length;
  const completed = submissions.filter((s) => s.completed).length;
  const withRdv = submissions.filter((s) => s.appointment_id !== null).length;

  return [
    { label: "Formulaire vu", count: total },
    { label: "Commence", count: started },
    { label: "Complete", count: completed },
    { label: "RDV pris", count: withRdv },
  ];
}

export default function RdvPage() {
  const { data: appointmentsData, loading: loadingAppointments } = useAppointments();
  const { data: submissionsData, loading: loadingSubmissions } = useBookingSubmissions();

  const loading = loadingAppointments || loadingSubmissions;

  const appointments = useMemo(() => {
    if (appointmentsData && appointmentsData.length > 0) {
      return mapAppointmentsToMock(appointmentsData);
    }
    return mockAppointments;
  }, [appointmentsData]);

  const leads = useMemo(() => {
    if (submissionsData && submissionsData.length > 0) {
      return mapSubmissionsToLeads(submissionsData);
    }
    return mockBookingSubmissions;
  }, [submissionsData]);

  const funnel = useMemo(() => {
    if (submissionsData && submissionsData.length > 0) {
      return buildFunnelFromSubmissions(submissionsData);
    }
    return mockFunnelData;
  }, [submissionsData]);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <Calendar className="w-6 h-6 text-accent" />
        <h1 className="font-heading text-2xl font-bold text-dark">
          RDV / Booking
        </h1>
        {loading && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Formulaires vus</p>
          <p className="text-xl font-bold font-heading text-dark">
            {funnel[0]?.count || 0}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">RDV pris</p>
          <p className="text-xl font-bold font-heading text-success">
            {funnel[funnel.length - 1]?.count || 0}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Leads partiels</p>
          <p className="text-xl font-bold font-heading text-warning">
            {leads.filter((l) => !l.is_complete).length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Prochains RDV</p>
          <p className="text-xl font-bold font-heading text-dark">
            {appointments.length}
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Funnel + Leads */}
        <div className="xl:col-span-2 space-y-6">
          <BookingFunnel data={funnel} />
          <LeadsTable leads={leads} />
        </div>

        {/* Upcoming appointments */}
        <div className="xl:col-span-1">
          <UpcomingAppointments appointments={appointments} />
        </div>
      </div>
    </div>
  );
}
