"use client";

import { Calendar } from "lucide-react";
import { BookingFunnel } from "@/components/admin/booking-funnel";
import { LeadsTable } from "@/components/admin/leads-table";
import { UpcomingAppointments } from "@/components/admin/upcoming-appointments";
import {
  mockFunnelData,
  mockBookingSubmissions,
  mockAppointments,
} from "@/lib/mock-data";

// Replace with Supabase query when ready
function getBookingData() {
  return {
    funnel: mockFunnelData,
    leads: mockBookingSubmissions,
    appointments: mockAppointments,
  };
}

export default function RdvPage() {
  const data = getBookingData();

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <Calendar className="w-6 h-6 text-accent" />
        <h1 className="font-heading text-2xl font-bold text-dark">
          RDV / Booking
        </h1>
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

      {/* Main content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Funnel + Leads */}
        <div className="xl:col-span-2 space-y-6">
          <BookingFunnel data={data.funnel} />
          <LeadsTable leads={data.leads} />
        </div>

        {/* Upcoming appointments */}
        <div className="xl:col-span-1">
          <UpcomingAppointments appointments={data.appointments} />
        </div>
      </div>
    </div>
  );
}
