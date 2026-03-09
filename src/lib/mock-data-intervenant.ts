// Mock data for Intervenant portal
// Replace with Supabase queries when ready

export interface IntervenantReservation {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  package_hours: 2 | 4 | 6;
  datetime_start: string;
  datetime_end: string;
  status: "scheduled" | "completed" | "cancelled" | "no_show";
  zoom_link: string | null;
  notes: string | null;
}

export interface IntervenantDisponibilite {
  id: string;
  day_of_week: number; // 0 = Sunday, 1 = Monday, etc.
  start_time: string; // "09:00"
  end_time: string; // "12:00"
  is_active: boolean;
}

export interface IntervenantStats {
  total_reservations: number;
  completed_sessions: number;
  upcoming_sessions: number;
  total_hours: number;
  revenue_cents: number;
  average_rating: number;
}

export const mockIntervenantReservations: IntervenantReservation[] = [
  {
    id: "res-1",
    client_name: "Sophie Martin",
    client_email: "sophie.martin@email.com",
    client_phone: "06 12 34 56 78",
    package_hours: 2,
    datetime_start: "2026-03-12T10:00:00",
    datetime_end: "2026-03-12T12:00:00",
    status: "scheduled",
    zoom_link: "https://zoom.us/j/123456789",
    notes: "Premiere session - cours d'anglais debutant",
  },
  {
    id: "res-2",
    client_name: "Pierre Dubois",
    client_email: "p.dubois@entreprise.fr",
    client_phone: "06 98 76 54 32",
    package_hours: 4,
    datetime_start: "2026-03-14T14:00:00",
    datetime_end: "2026-03-14T18:00:00",
    status: "scheduled",
    zoom_link: "https://zoom.us/j/987654321",
    notes: "Preparation presentation en anglais",
  },
  {
    id: "res-3",
    client_name: "Marie Leroy",
    client_email: "marie.leroy@mail.com",
    client_phone: "06 11 22 33 44",
    package_hours: 2,
    datetime_start: "2026-03-05T09:00:00",
    datetime_end: "2026-03-05T11:00:00",
    status: "completed",
    zoom_link: null,
    notes: "Session terminee - bon progres",
  },
  {
    id: "res-4",
    client_name: "Jean Petit",
    client_email: "jean.petit@gmail.com",
    client_phone: "06 55 66 77 88",
    package_hours: 6,
    datetime_start: "2026-03-08T10:00:00",
    datetime_end: "2026-03-08T16:00:00",
    status: "completed",
    zoom_link: null,
    notes: "Journee intensive - tres satisfait",
  },
  {
    id: "res-5",
    client_name: "Claire Moreau",
    client_email: "claire.m@outlook.com",
    client_phone: "06 99 88 77 66",
    package_hours: 2,
    datetime_start: "2026-03-02T15:00:00",
    datetime_end: "2026-03-02T17:00:00",
    status: "no_show",
    zoom_link: null,
    notes: "Client absent - a replanifier",
  },
];

export const mockIntervenantDisponibilites: IntervenantDisponibilite[] = [
  { id: "dispo-1", day_of_week: 1, start_time: "09:00", end_time: "12:00", is_active: true },
  { id: "dispo-2", day_of_week: 1, start_time: "14:00", end_time: "18:00", is_active: true },
  { id: "dispo-3", day_of_week: 2, start_time: "09:00", end_time: "12:00", is_active: true },
  { id: "dispo-4", day_of_week: 2, start_time: "14:00", end_time: "17:00", is_active: true },
  { id: "dispo-5", day_of_week: 3, start_time: "10:00", end_time: "12:00", is_active: false },
  { id: "dispo-6", day_of_week: 4, start_time: "09:00", end_time: "12:00", is_active: true },
  { id: "dispo-7", day_of_week: 4, start_time: "14:00", end_time: "18:00", is_active: true },
  { id: "dispo-8", day_of_week: 5, start_time: "09:00", end_time: "13:00", is_active: true },
];

export const mockIntervenantStats: IntervenantStats = {
  total_reservations: 24,
  completed_sessions: 18,
  upcoming_sessions: 4,
  total_hours: 52,
  revenue_cents: 520000, // 5200 EUR
  average_rating: 4.8,
};

export function getIntervenantStats(): IntervenantStats {
  return mockIntervenantStats;
}

export function getIntervenantReservations(): IntervenantReservation[] {
  return mockIntervenantReservations;
}

export function getIntervenantDisponibilites(): IntervenantDisponibilite[] {
  return mockIntervenantDisponibilites;
}

export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export function getDayName(dayOfWeek: number): string {
  const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  return days[dayOfWeek];
}
