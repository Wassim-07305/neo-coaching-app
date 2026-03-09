/**
 * Adapters to transform Supabase data into mock data shapes
 * that existing UI components expect.
 *
 * These allow incremental migration: fetch from Supabase,
 * transform to the shape components already use.
 */

import type { Module, Profile, Company, Appointment } from "./types";
import type { MockModule, MockCompany, ParcoursType } from "@/lib/mock-data";

// ─── Module adapter ──────────────────────────────────────────

export function adaptModule(m: Module): MockModule {
  return {
    id: m.id,
    title: m.title,
    description: m.description || "",
    parcours_type: m.parcours_type as ParcoursType,
    price: Math.round(m.price_cents / 100),
    order_index: m.order_index,
    duration_weeks: m.duration_minutes ? Math.round(m.duration_minutes / (60 * 40)) : 4, // ~40h/week
    enrolled_count: 0, // Will need a count query
    content_summary: typeof m.content === "object" ? JSON.stringify(m.content) : "",
    exercise_json: m.exercise ? JSON.stringify(m.exercise) : "",
  };
}

export function adaptModules(modules: Module[]): MockModule[] {
  return modules.map(adaptModule);
}

// ─── Company adapter ─────────────────────────────────────────

export function adaptCompany(
  c: Company & { profiles?: { first_name: string; last_name: string; email?: string } | null },
  employeeCount = 0
): MockCompany {
  return {
    id: c.id,
    name: c.name,
    dirigeant_name: c.profiles
      ? `${c.profiles.first_name} ${c.profiles.last_name}`
      : "N/A",
    dirigeant_email: c.profiles?.email || "",
    employee_count: employeeCount,
    mission_start: c.mission_start_date || "",
    mission_end: c.mission_end_date || "",
    mission_status: c.mission_status as MockCompany["mission_status"],
    objectives: [],
    logo_placeholder: c.name.substring(0, 2).toUpperCase(),
  };
}

// ─── Appointment adapter ─────────────────────────────────────

export function adaptAppointment(
  a: Appointment & {
    profiles?: { first_name: string; last_name: string; email: string } | null;
  }
) {
  return {
    id: a.id,
    client_name: a.profiles
      ? `${a.profiles.first_name} ${a.profiles.last_name}`
      : "Prospect",
    client_email: a.profiles?.email || "",
    date: a.datetime_start,
    time: new Date(a.datetime_start).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    type: a.type,
    status: a.status,
    zoom_link: a.zoom_link,
    notes: a.notes,
  };
}
