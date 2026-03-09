// ===========================================================================
// Mock Data for Calendly Integration
// Replace with real Calendly API calls when API key is configured.
// ===========================================================================

export type CalendlyEventStatus = "active" | "canceled" | "rescheduled";

export interface CalendlyInvitee {
  name: string;
  email: string;
  phone?: string;
  timezone: string;
  questions_and_answers?: {
    question: string;
    answer: string;
  }[];
}

export interface CalendlyEvent {
  id: string;
  uri: string;
  name: string; // Event type name
  status: CalendlyEventStatus;
  start_time: string;
  end_time: string;
  location?: {
    type: "physical" | "outbound_call" | "inbound_call" | "google_conference" | "zoom" | "teams";
    location?: string;
    join_url?: string;
  };
  invitee: CalendlyInvitee;
  created_at: string;
  updated_at: string;
  cancel_url?: string;
  reschedule_url?: string;
}

// Mock Calendly events for demo
export const mockCalendlyEvents: CalendlyEvent[] = [
  {
    id: "cal-1",
    uri: "https://calendly.com/scheduled_events/cal-1",
    name: "Seance de coaching individuel - 1h",
    status: "active",
    start_time: "2026-03-12T10:00:00+01:00",
    end_time: "2026-03-12T11:00:00+01:00",
    location: {
      type: "zoom",
      join_url: "https://zoom.us/j/123456789",
    },
    invitee: {
      name: "Marie Dupont",
      email: "marie.dupont@email.com",
      phone: "+33612345678",
      timezone: "Europe/Paris",
      questions_and_answers: [
        {
          question: "Quel est l'objectif principal de cette seance ?",
          answer: "Ameliorer ma gestion du temps et mes priorites au travail",
        },
        {
          question: "Avez-vous des sujets specifiques a aborder ?",
          answer: "Je souhaite travailler sur la delegation et la confiance envers mon equipe",
        },
      ],
    },
    created_at: "2026-03-05T14:30:00Z",
    updated_at: "2026-03-05T14:30:00Z",
    reschedule_url: "https://calendly.com/reschedule/cal-1",
  },
  {
    id: "cal-2",
    uri: "https://calendly.com/scheduled_events/cal-2",
    name: "Seance de coaching individuel - 1h",
    status: "active",
    start_time: "2026-03-14T14:00:00+01:00",
    end_time: "2026-03-14T15:00:00+01:00",
    location: {
      type: "google_conference",
      join_url: "https://meet.google.com/abc-defg-hij",
    },
    invitee: {
      name: "Pierre Martin",
      email: "pierre.martin@entreprise.fr",
      phone: "+33698765432",
      timezone: "Europe/Paris",
      questions_and_answers: [
        {
          question: "Quel est l'objectif principal de cette seance ?",
          answer: "Preparer mon entretien de promotion avec ma hierarchie",
        },
      ],
    },
    created_at: "2026-03-06T09:15:00Z",
    updated_at: "2026-03-06T09:15:00Z",
  },
  {
    id: "cal-3",
    uri: "https://calendly.com/scheduled_events/cal-3",
    name: "Appel decouverte - 30min",
    status: "active",
    start_time: "2026-03-10T16:00:00+01:00",
    end_time: "2026-03-10T16:30:00+01:00",
    location: {
      type: "outbound_call",
    },
    invitee: {
      name: "Sophie Bernard",
      email: "sophie.bernard@gmail.com",
      phone: "+33687654321",
      timezone: "Europe/Paris",
      questions_and_answers: [
        {
          question: "Comment avez-vous entendu parler de NEO Coaching ?",
          answer: "Recommandation d'un collegue",
        },
        {
          question: "Quels sont vos objectifs de developpement ?",
          answer: "Developper mon leadership et mieux gerer le stress",
        },
      ],
    },
    created_at: "2026-03-04T11:20:00Z",
    updated_at: "2026-03-04T11:20:00Z",
  },
  {
    id: "cal-4",
    uri: "https://calendly.com/scheduled_events/cal-4",
    name: "Seance de coaching individuel - 1h",
    status: "canceled",
    start_time: "2026-03-08T09:00:00+01:00",
    end_time: "2026-03-08T10:00:00+01:00",
    location: {
      type: "zoom",
      join_url: "https://zoom.us/j/987654321",
    },
    invitee: {
      name: "Lucas Petit",
      email: "lucas.petit@company.com",
      timezone: "Europe/Paris",
    },
    created_at: "2026-03-01T15:45:00Z",
    updated_at: "2026-03-07T08:30:00Z",
  },
  {
    id: "cal-5",
    uri: "https://calendly.com/scheduled_events/cal-5",
    name: "Bilan mi-parcours - 1h30",
    status: "active",
    start_time: "2026-03-18T11:00:00+01:00",
    end_time: "2026-03-18T12:30:00+01:00",
    location: {
      type: "physical",
      location: "12 rue de la Paix, 75002 Paris",
    },
    invitee: {
      name: "Amelie Rousseau",
      email: "amelie.rousseau@startup.io",
      phone: "+33611223344",
      timezone: "Europe/Paris",
      questions_and_answers: [
        {
          question: "Souhaitez-vous preparer des documents pour cette seance ?",
          answer: "Oui, j'apporterai mon journal de bord et mes objectifs SMART",
        },
      ],
    },
    created_at: "2026-03-02T10:00:00Z",
    updated_at: "2026-03-02T10:00:00Z",
  },
];

// Helper to get upcoming events
export function getUpcomingCalendlyEvents(): CalendlyEvent[] {
  const now = new Date();
  return mockCalendlyEvents
    .filter((e) => e.status === "active" && new Date(e.start_time) > now)
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
}

// Helper to get past events
export function getPastCalendlyEvents(): CalendlyEvent[] {
  const now = new Date();
  return mockCalendlyEvents
    .filter((e) => new Date(e.start_time) <= now || e.status === "canceled")
    .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());
}

// Helper to get event by ID
export function getCalendlyEventById(id: string): CalendlyEvent | undefined {
  return mockCalendlyEvents.find((e) => e.id === id);
}

// Stats for dashboard
export function getCalendlyStats() {
  const now = new Date();
  const upcoming = mockCalendlyEvents.filter(
    (e) => e.status === "active" && new Date(e.start_time) > now
  ).length;
  const thisMonth = mockCalendlyEvents.filter((e) => {
    const eventDate = new Date(e.start_time);
    return (
      eventDate.getMonth() === now.getMonth() &&
      eventDate.getFullYear() === now.getFullYear()
    );
  }).length;
  const canceled = mockCalendlyEvents.filter((e) => e.status === "canceled").length;

  return {
    upcoming,
    thisMonth,
    total: mockCalendlyEvents.length,
    canceled,
  };
}

// Location type labels
export const locationTypeLabels: Record<string, string> = {
  physical: "En presentiel",
  outbound_call: "Appel telephonique",
  inbound_call: "Appel entrant",
  google_conference: "Google Meet",
  zoom: "Zoom",
  teams: "Microsoft Teams",
};
