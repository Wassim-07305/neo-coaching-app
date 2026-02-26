// ===========================================================================
// Mock Data for Admin Pages
// This file centralizes all mock data. Replace getData() functions with
// actual Supabase queries when the database is ready.
// ===========================================================================

export type CoacheeType = "individuel" | "entreprise";
export type CoacheeStatus = "actif" | "inactif" | "archive";
export type ModuleStatus = "complete" | "en_cours" | "non_commence" | "a_venir";
export type MissionStatus = "active" | "completed" | "paused";
export type LivrableType = "ecrit" | "audio" | "video";
export type LivrableStatus = "soumis" | "en_attente" | "valide";
export type CallType = "decouverte" | "coaching" | "review";
export type ParcoursType = "individuel" | "entreprise" | "les_deux";
export type BookingStep = "formulaire_vu" | "commence" | "complete" | "rdv_pris";

// ---------- KPI helpers ----------
export function getKpiColor(value: number): "danger" | "warning" | "success" {
  if (value <= 3) return "danger";
  if (value <= 6) return "warning";
  return "success";
}

export function getKpiLabel(value: number): string {
  if (value <= 3) return "Decrochage";
  if (value <= 6) return "Attention";
  return "En regle";
}

// ---------- Modules ----------
export interface MockModule {
  id: string;
  title: string;
  description: string;
  parcours_type: ParcoursType;
  price: number;
  order_index: number;
  duration_weeks: number;
  enrolled_count: number;
  content_summary: string;
  exercise_json: string;
}

export const mockModules: MockModule[] = [
  {
    id: "mod-1",
    title: "Intelligence Emotionnelle",
    description:
      "Developper sa conscience emotionnelle et sa capacite a gerer ses emotions au quotidien.",
    parcours_type: "les_deux",
    price: 490,
    order_index: 1,
    duration_weeks: 4,
    enrolled_count: 18,
    content_summary:
      "Ce module couvre la conscience de soi emotionnelle, la regulation des emotions, l'empathie et les competences sociales.",
    exercise_json:
      '{"exercises":[{"title":"Journal emotionnel","type":"ecrit"},{"title":"Scan corporel","type":"audio"}]}',
  },
  {
    id: "mod-2",
    title: "Estime de soi",
    description:
      "Renforcer l'image de soi et construire une estime solide et durable.",
    parcours_type: "individuel",
    price: 490,
    order_index: 2,
    duration_weeks: 4,
    enrolled_count: 12,
    content_summary:
      "Exploration des croyances limitantes, exercices d'affirmation de soi, techniques de valorisation personnelle.",
    exercise_json:
      '{"exercises":[{"title":"Lettre a soi-meme","type":"ecrit"},{"title":"Meditation guidee","type":"audio"}]}',
  },
  {
    id: "mod-3",
    title: "Confiance en soi",
    description:
      "Batir et maintenir une confiance solide face aux defis professionnels et personnels.",
    parcours_type: "les_deux",
    price: 490,
    order_index: 3,
    duration_weeks: 4,
    enrolled_count: 15,
    content_summary:
      "Identification des forces, gestion du syndrome de l'imposteur, prise de risques calculee.",
    exercise_json:
      '{"exercises":[{"title":"Inventaire des forces","type":"ecrit"},{"title":"Defi de la semaine","type":"video"}]}',
  },
  {
    id: "mod-4",
    title: "Prise de parole",
    description:
      "Maitriser l'art de s'exprimer en public avec aisance et impact.",
    parcours_type: "entreprise",
    price: 590,
    order_index: 4,
    duration_weeks: 6,
    enrolled_count: 8,
    content_summary:
      "Techniques de storytelling, gestion du trac, exercices pratiques de presentation devant un public.",
    exercise_json:
      '{"exercises":[{"title":"Pitch 2 minutes","type":"video"},{"title":"Analyse de discours","type":"ecrit"}]}',
  },
];

// ---------- Companies ----------
export interface MockCompany {
  id: string;
  name: string;
  dirigeant_name: string;
  dirigeant_email: string;
  employee_count: number;
  mission_start: string;
  mission_end: string;
  mission_status: MissionStatus;
  objectives: string[];
  logo_placeholder: string;
}

export const mockCompanies: MockCompany[] = [
  {
    id: "comp-1",
    name: "Alpha Corp",
    dirigeant_name: "Laurent Martin",
    dirigeant_email: "l.martin@alphacorp.fr",
    employee_count: 4,
    mission_start: "2025-09-01",
    mission_end: "2026-06-30",
    mission_status: "active",
    objectives: [
      "Ameliorer la cohesion d'equipe",
      "Developper le leadership des managers",
      "Reduire le turnover de 15%",
    ],
    logo_placeholder: "AC",
  },
  {
    id: "comp-2",
    name: "Beta SA",
    dirigeant_name: "Catherine Dubois",
    dirigeant_email: "c.dubois@betasa.fr",
    employee_count: 3,
    mission_start: "2025-11-15",
    mission_end: "2026-05-15",
    mission_status: "active",
    objectives: [
      "Accompagner la transformation digitale",
      "Renforcer la confiance des equipes",
    ],
    logo_placeholder: "BS",
  },
  {
    id: "comp-3",
    name: "Gamma Industries",
    dirigeant_name: "Michel Lefevre",
    dirigeant_email: "m.lefevre@gamma-ind.fr",
    employee_count: 2,
    mission_start: "2025-03-01",
    mission_end: "2025-12-31",
    mission_status: "completed",
    objectives: [
      "Formation des cadres a l'intelligence emotionnelle",
      "Mise en place d'un programme de bien-etre",
    ],
    logo_placeholder: "GI",
  },
];

// ---------- Coachees ----------
export interface MockKpiScores {
  investissement: number;
  efficacite: number;
  participation: number;
}

export interface MockKpiHistory {
  month: string;
  investissement: number;
  efficacite: number;
  participation: number;
}

export interface MockModuleProgress {
  module_id: string;
  module_title: string;
  status: ModuleStatus;
  satisfaction_score?: number;
}

export interface MockLivrable {
  id: string;
  module_title: string;
  type: LivrableType;
  submission_date: string;
  status: LivrableStatus;
  file_name: string;
}

export interface MockCall {
  id: string;
  date: string;
  duration_minutes: number;
  type: CallType;
  notes: string;
}

export interface MockCertificate {
  id: string;
  module_title: string;
  earned_date: string;
}

export interface MockCoachee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url: string | null;
  type: CoacheeType;
  company_id: string | null;
  company_name: string | null;
  status: CoacheeStatus;
  start_date: string;
  current_module: string | null;
  kpis: MockKpiScores;
  kpi_history: MockKpiHistory[];
  module_progress: MockModuleProgress[];
  livrables: MockLivrable[];
  calls: MockCall[];
  certificates: MockCertificate[];
  last_activity: string;
}

export const mockCoachees: MockCoachee[] = [
  {
    id: "coach-1",
    first_name: "Marie",
    last_name: "Dupont",
    email: "marie.dupont@email.fr",
    avatar_url: null,
    type: "entreprise",
    company_id: "comp-1",
    company_name: "Alpha Corp",
    status: "actif",
    start_date: "2025-09-15",
    current_module: "Confiance en soi",
    kpis: { investissement: 8, efficacite: 7, participation: 9 },
    kpi_history: [
      { month: "Sep 2025", investissement: 5, efficacite: 4, participation: 6 },
      { month: "Oct 2025", investissement: 6, efficacite: 5, participation: 7 },
      { month: "Nov 2025", investissement: 7, efficacite: 6, participation: 8 },
      { month: "Dec 2025", investissement: 7, efficacite: 7, participation: 8 },
      { month: "Jan 2026", investissement: 8, efficacite: 7, participation: 9 },
      { month: "Fev 2026", investissement: 8, efficacite: 7, participation: 9 },
    ],
    module_progress: [
      { module_id: "mod-1", module_title: "Intelligence Emotionnelle", status: "complete", satisfaction_score: 9 },
      { module_id: "mod-2", module_title: "Estime de soi", status: "complete", satisfaction_score: 8 },
      { module_id: "mod-3", module_title: "Confiance en soi", status: "en_cours", satisfaction_score: undefined },
      { module_id: "mod-4", module_title: "Prise de parole", status: "a_venir", satisfaction_score: undefined },
    ],
    livrables: [
      { id: "l-1", module_title: "Intelligence Emotionnelle", type: "ecrit", submission_date: "2025-10-10", status: "valide", file_name: "journal_emotionnel.pdf" },
      { id: "l-2", module_title: "Estime de soi", type: "audio", submission_date: "2025-11-20", status: "valide", file_name: "meditation_reflexion.mp3" },
      { id: "l-3", module_title: "Confiance en soi", type: "video", submission_date: "2026-01-15", status: "en_attente", file_name: "presentation_defi.mp4" },
    ],
    calls: [
      { id: "c-1", date: "2025-09-15", duration_minutes: 45, type: "decouverte", notes: "Premiere seance. Marie est motivee, objectifs clairs." },
      { id: "c-2", date: "2025-10-20", duration_minutes: 60, type: "coaching", notes: "Progres sur le journal emotionnel. Debut module estime de soi." },
      { id: "c-3", date: "2026-01-10", duration_minutes: 55, type: "coaching", notes: "Bon avancement module confiance. Exercice de prise de parole." },
    ],
    certificates: [
      { id: "cert-1", module_title: "Intelligence Emotionnelle", earned_date: "2025-10-30" },
      { id: "cert-2", module_title: "Estime de soi", earned_date: "2025-12-15" },
    ],
    last_activity: "2026-02-24",
  },
  {
    id: "coach-2",
    first_name: "Pierre",
    last_name: "Leclerc",
    email: "pierre.leclerc@email.fr",
    avatar_url: null,
    type: "entreprise",
    company_id: "comp-1",
    company_name: "Alpha Corp",
    status: "actif",
    start_date: "2025-09-15",
    current_module: "Intelligence Emotionnelle",
    kpis: { investissement: 3, efficacite: 4, participation: 2 },
    kpi_history: [
      { month: "Sep 2025", investissement: 5, efficacite: 5, participation: 4 },
      { month: "Oct 2025", investissement: 4, efficacite: 4, participation: 3 },
      { month: "Nov 2025", investissement: 4, efficacite: 4, participation: 3 },
      { month: "Dec 2025", investissement: 3, efficacite: 4, participation: 3 },
      { month: "Jan 2026", investissement: 3, efficacite: 4, participation: 2 },
      { month: "Fev 2026", investissement: 3, efficacite: 4, participation: 2 },
    ],
    module_progress: [
      { module_id: "mod-1", module_title: "Intelligence Emotionnelle", status: "en_cours", satisfaction_score: undefined },
      { module_id: "mod-3", module_title: "Confiance en soi", status: "a_venir", satisfaction_score: undefined },
    ],
    livrables: [
      { id: "l-4", module_title: "Intelligence Emotionnelle", type: "ecrit", submission_date: "2025-12-01", status: "soumis", file_name: "reflexion_ie.pdf" },
    ],
    calls: [
      { id: "c-4", date: "2025-09-15", duration_minutes: 45, type: "decouverte", notes: "Pierre semble reserve. A besoin d'accompagnement rapproche." },
      { id: "c-5", date: "2025-11-10", duration_minutes: 50, type: "coaching", notes: "Difficultes avec les exercices. Risque de decrochage." },
    ],
    certificates: [],
    last_activity: "2026-02-21",
  },
  {
    id: "coach-3",
    first_name: "Sophie",
    last_name: "Martin",
    email: "sophie.martin@email.fr",
    avatar_url: null,
    type: "entreprise",
    company_id: "comp-1",
    company_name: "Alpha Corp",
    status: "actif",
    start_date: "2025-09-15",
    current_module: "Estime de soi",
    kpis: { investissement: 7, efficacite: 8, participation: 7 },
    kpi_history: [
      { month: "Sep 2025", investissement: 6, efficacite: 6, participation: 5 },
      { month: "Oct 2025", investissement: 6, efficacite: 7, participation: 6 },
      { month: "Nov 2025", investissement: 7, efficacite: 7, participation: 6 },
      { month: "Dec 2025", investissement: 7, efficacite: 7, participation: 7 },
      { month: "Jan 2026", investissement: 7, efficacite: 8, participation: 7 },
      { month: "Fev 2026", investissement: 7, efficacite: 8, participation: 7 },
    ],
    module_progress: [
      { module_id: "mod-1", module_title: "Intelligence Emotionnelle", status: "complete", satisfaction_score: 8 },
      { module_id: "mod-2", module_title: "Estime de soi", status: "en_cours", satisfaction_score: undefined },
      { module_id: "mod-3", module_title: "Confiance en soi", status: "a_venir", satisfaction_score: undefined },
    ],
    livrables: [
      { id: "l-5", module_title: "Intelligence Emotionnelle", type: "ecrit", submission_date: "2025-10-25", status: "valide", file_name: "journal_ie_sophie.pdf" },
      { id: "l-6", module_title: "Estime de soi", type: "ecrit", submission_date: "2026-01-20", status: "en_attente", file_name: "lettre_a_soi.pdf" },
    ],
    calls: [
      { id: "c-6", date: "2025-09-15", duration_minutes: 40, type: "decouverte", notes: "Sophie est tres engagee, bons echanges." },
      { id: "c-7", date: "2025-12-05", duration_minutes: 55, type: "coaching", notes: "Bon travail sur l'intelligence emotionnelle." },
    ],
    certificates: [
      { id: "cert-3", module_title: "Intelligence Emotionnelle", earned_date: "2025-11-15" },
    ],
    last_activity: "2026-02-25",
  },
  {
    id: "coach-4",
    first_name: "Antoine",
    last_name: "Bernard",
    email: "antoine.bernard@email.fr",
    avatar_url: null,
    type: "entreprise",
    company_id: "comp-1",
    company_name: "Alpha Corp",
    status: "actif",
    start_date: "2025-10-01",
    current_module: "Intelligence Emotionnelle",
    kpis: { investissement: 6, efficacite: 5, participation: 6 },
    kpi_history: [
      { month: "Oct 2025", investissement: 5, efficacite: 4, participation: 5 },
      { month: "Nov 2025", investissement: 5, efficacite: 5, participation: 5 },
      { month: "Dec 2025", investissement: 6, efficacite: 5, participation: 6 },
      { month: "Jan 2026", investissement: 6, efficacite: 5, participation: 6 },
      { month: "Fev 2026", investissement: 6, efficacite: 5, participation: 6 },
    ],
    module_progress: [
      { module_id: "mod-1", module_title: "Intelligence Emotionnelle", status: "en_cours", satisfaction_score: undefined },
      { module_id: "mod-4", module_title: "Prise de parole", status: "a_venir", satisfaction_score: undefined },
    ],
    livrables: [],
    calls: [
      { id: "c-8", date: "2025-10-01", duration_minutes: 45, type: "decouverte", notes: "Premier contact. Antoine est dans une phase de transition." },
    ],
    certificates: [],
    last_activity: "2026-02-20",
  },
  {
    id: "coach-5",
    first_name: "Camille",
    last_name: "Rousseau",
    email: "camille.rousseau@betasa.fr",
    avatar_url: null,
    type: "entreprise",
    company_id: "comp-2",
    company_name: "Beta SA",
    status: "actif",
    start_date: "2025-11-20",
    current_module: "Intelligence Emotionnelle",
    kpis: { investissement: 9, efficacite: 8, participation: 9 },
    kpi_history: [
      { month: "Nov 2025", investissement: 7, efficacite: 6, participation: 7 },
      { month: "Dec 2025", investissement: 8, efficacite: 7, participation: 8 },
      { month: "Jan 2026", investissement: 9, efficacite: 8, participation: 9 },
      { month: "Fev 2026", investissement: 9, efficacite: 8, participation: 9 },
    ],
    module_progress: [
      { module_id: "mod-1", module_title: "Intelligence Emotionnelle", status: "en_cours", satisfaction_score: undefined },
      { module_id: "mod-3", module_title: "Confiance en soi", status: "a_venir", satisfaction_score: undefined },
    ],
    livrables: [
      { id: "l-7", module_title: "Intelligence Emotionnelle", type: "ecrit", submission_date: "2026-01-05", status: "valide", file_name: "reflexion_camille.pdf" },
    ],
    calls: [
      { id: "c-9", date: "2025-11-20", duration_minutes: 50, type: "decouverte", notes: "Tres motivee. Profil tres receptif." },
      { id: "c-10", date: "2026-01-15", duration_minutes: 60, type: "coaching", notes: "Excellent travail. Progression rapide." },
    ],
    certificates: [],
    last_activity: "2026-02-26",
  },
  {
    id: "coach-6",
    first_name: "Thomas",
    last_name: "Petit",
    email: "thomas.petit@betasa.fr",
    avatar_url: null,
    type: "entreprise",
    company_id: "comp-2",
    company_name: "Beta SA",
    status: "actif",
    start_date: "2025-11-20",
    current_module: "Intelligence Emotionnelle",
    kpis: { investissement: 5, efficacite: 6, participation: 5 },
    kpi_history: [
      { month: "Nov 2025", investissement: 4, efficacite: 5, participation: 4 },
      { month: "Dec 2025", investissement: 5, efficacite: 5, participation: 5 },
      { month: "Jan 2026", investissement: 5, efficacite: 6, participation: 5 },
      { month: "Fev 2026", investissement: 5, efficacite: 6, participation: 5 },
    ],
    module_progress: [
      { module_id: "mod-1", module_title: "Intelligence Emotionnelle", status: "en_cours", satisfaction_score: undefined },
    ],
    livrables: [],
    calls: [
      { id: "c-11", date: "2025-11-20", duration_minutes: 40, type: "decouverte", notes: "Thomas est timide mais ouvert au processus." },
    ],
    certificates: [],
    last_activity: "2026-02-18",
  },
  {
    id: "coach-7",
    first_name: "Julie",
    last_name: "Moreau",
    email: "julie.moreau@betasa.fr",
    avatar_url: null,
    type: "entreprise",
    company_id: "comp-2",
    company_name: "Beta SA",
    status: "actif",
    start_date: "2025-11-20",
    current_module: "Intelligence Emotionnelle",
    kpis: { investissement: 7, efficacite: 7, participation: 8 },
    kpi_history: [
      { month: "Nov 2025", investissement: 6, efficacite: 5, participation: 6 },
      { month: "Dec 2025", investissement: 7, efficacite: 6, participation: 7 },
      { month: "Jan 2026", investissement: 7, efficacite: 7, participation: 8 },
      { month: "Fev 2026", investissement: 7, efficacite: 7, participation: 8 },
    ],
    module_progress: [
      { module_id: "mod-1", module_title: "Intelligence Emotionnelle", status: "en_cours", satisfaction_score: undefined },
      { module_id: "mod-3", module_title: "Confiance en soi", status: "a_venir", satisfaction_score: undefined },
    ],
    livrables: [
      { id: "l-8", module_title: "Intelligence Emotionnelle", type: "video", submission_date: "2026-02-01", status: "soumis", file_name: "video_reflexion.mp4" },
    ],
    calls: [
      { id: "c-12", date: "2025-11-20", duration_minutes: 45, type: "decouverte", notes: "Julie a une bonne energie. Objectifs bien definis." },
    ],
    certificates: [],
    last_activity: "2026-02-23",
  },
  {
    id: "coach-8",
    first_name: "Isabelle",
    last_name: "Fontaine",
    email: "isabelle.fontaine@email.fr",
    avatar_url: null,
    type: "individuel",
    company_id: null,
    company_name: null,
    status: "actif",
    start_date: "2025-06-01",
    current_module: "Confiance en soi",
    kpis: { investissement: 9, efficacite: 9, participation: 10 },
    kpi_history: [
      { month: "Jun 2025", investissement: 6, efficacite: 5, participation: 7 },
      { month: "Jul 2025", investissement: 7, efficacite: 6, participation: 8 },
      { month: "Aou 2025", investissement: 7, efficacite: 7, participation: 8 },
      { month: "Sep 2025", investissement: 8, efficacite: 8, participation: 9 },
      { month: "Oct 2025", investissement: 8, efficacite: 8, participation: 9 },
      { month: "Nov 2025", investissement: 9, efficacite: 9, participation: 10 },
      { month: "Dec 2025", investissement: 9, efficacite: 9, participation: 10 },
      { month: "Jan 2026", investissement: 9, efficacite: 9, participation: 10 },
      { month: "Fev 2026", investissement: 9, efficacite: 9, participation: 10 },
    ],
    module_progress: [
      { module_id: "mod-1", module_title: "Intelligence Emotionnelle", status: "complete", satisfaction_score: 10 },
      { module_id: "mod-2", module_title: "Estime de soi", status: "complete", satisfaction_score: 9 },
      { module_id: "mod-3", module_title: "Confiance en soi", status: "en_cours", satisfaction_score: undefined },
    ],
    livrables: [
      { id: "l-9", module_title: "Intelligence Emotionnelle", type: "ecrit", submission_date: "2025-07-15", status: "valide", file_name: "journal_ie_isabelle.pdf" },
      { id: "l-10", module_title: "Intelligence Emotionnelle", type: "audio", submission_date: "2025-07-25", status: "valide", file_name: "scan_corporel.mp3" },
      { id: "l-11", module_title: "Estime de soi", type: "ecrit", submission_date: "2025-09-10", status: "valide", file_name: "lettre_isabelle.pdf" },
      { id: "l-12", module_title: "Confiance en soi", type: "video", submission_date: "2026-01-28", status: "soumis", file_name: "pitch_confiance.mp4" },
    ],
    calls: [
      { id: "c-13", date: "2025-06-01", duration_minutes: 45, type: "decouverte", notes: "Isabelle est tres determinee. Objectif: retrouver confiance apres licenciement." },
      { id: "c-14", date: "2025-08-15", duration_minutes: 60, type: "coaching", notes: "Gros progres. Le journal emotionnel a ete un declencheur." },
      { id: "c-15", date: "2025-10-20", duration_minutes: 55, type: "coaching", notes: "Module estime de soi en bonne voie." },
      { id: "c-16", date: "2026-01-10", duration_minutes: 60, type: "coaching", notes: "Confiance en soi. Presentation defi reussie." },
    ],
    certificates: [
      { id: "cert-4", module_title: "Intelligence Emotionnelle", earned_date: "2025-08-01" },
      { id: "cert-5", module_title: "Estime de soi", earned_date: "2025-10-15" },
    ],
    last_activity: "2026-02-26",
  },
  {
    id: "coach-9",
    first_name: "Nicolas",
    last_name: "Garcia",
    email: "nicolas.garcia@email.fr",
    avatar_url: null,
    type: "individuel",
    company_id: null,
    company_name: null,
    status: "actif",
    start_date: "2025-10-01",
    current_module: "Intelligence Emotionnelle",
    kpis: { investissement: 5, efficacite: 4, participation: 5 },
    kpi_history: [
      { month: "Oct 2025", investissement: 6, efficacite: 5, participation: 6 },
      { month: "Nov 2025", investissement: 5, efficacite: 5, participation: 5 },
      { month: "Dec 2025", investissement: 5, efficacite: 4, participation: 5 },
      { month: "Jan 2026", investissement: 5, efficacite: 4, participation: 5 },
      { month: "Fev 2026", investissement: 5, efficacite: 4, participation: 5 },
    ],
    module_progress: [
      { module_id: "mod-1", module_title: "Intelligence Emotionnelle", status: "en_cours", satisfaction_score: undefined },
      { module_id: "mod-2", module_title: "Estime de soi", status: "a_venir", satisfaction_score: undefined },
    ],
    livrables: [],
    calls: [
      { id: "c-17", date: "2025-10-01", duration_minutes: 45, type: "decouverte", notes: "Nicolas cherche a mieux gerer son stress professionnel." },
      { id: "c-18", date: "2025-12-15", duration_minutes: 50, type: "coaching", notes: "Progres lent mais regulier." },
    ],
    certificates: [],
    last_activity: "2026-02-15",
  },
  {
    id: "coach-10",
    first_name: "Emilie",
    last_name: "Leroy",
    email: "emilie.leroy@email.fr",
    avatar_url: null,
    type: "individuel",
    company_id: null,
    company_name: null,
    status: "inactif",
    start_date: "2025-04-01",
    current_module: null,
    kpis: { investissement: 2, efficacite: 3, participation: 1 },
    kpi_history: [
      { month: "Avr 2025", investissement: 7, efficacite: 6, participation: 7 },
      { month: "Mai 2025", investissement: 5, efficacite: 5, participation: 5 },
      { month: "Jun 2025", investissement: 4, efficacite: 4, participation: 3 },
      { month: "Jul 2025", investissement: 3, efficacite: 3, participation: 2 },
      { month: "Aou 2025", investissement: 2, efficacite: 3, participation: 1 },
    ],
    module_progress: [
      { module_id: "mod-1", module_title: "Intelligence Emotionnelle", status: "complete", satisfaction_score: 6 },
      { module_id: "mod-2", module_title: "Estime de soi", status: "non_commence", satisfaction_score: undefined },
    ],
    livrables: [
      { id: "l-13", module_title: "Intelligence Emotionnelle", type: "ecrit", submission_date: "2025-05-20", status: "valide", file_name: "journal_emilie.pdf" },
    ],
    calls: [
      { id: "c-19", date: "2025-04-01", duration_minutes: 45, type: "decouverte", notes: "Emilie est motivee mais a des contraintes de temps." },
      { id: "c-20", date: "2025-06-10", duration_minutes: 40, type: "coaching", notes: "Difficulte a maintenir le rythme. Risque d'abandon." },
    ],
    certificates: [
      { id: "cert-6", module_title: "Intelligence Emotionnelle", earned_date: "2025-06-01" },
    ],
    last_activity: "2025-08-10",
  },
];

// ---------- Activity feed ----------
export interface MockActivity {
  id: string;
  message: string;
  time_ago: string;
  type: "module_complete" | "kpi_alert" | "rdv" | "livrable" | "certificate";
  coachee_id?: string;
}

export const mockActivities: MockActivity[] = [
  {
    id: "act-1",
    message: "Marie D. a termine le module 'Intelligence Emotionnelle'",
    time_ago: "Il y a 2 heures",
    type: "module_complete",
    coachee_id: "coach-1",
  },
  {
    id: "act-2",
    message: "Pierre L. a un indicateur passe au rouge",
    time_ago: "Il y a 5 heures",
    type: "kpi_alert",
    coachee_id: "coach-2",
  },
  {
    id: "act-3",
    message: "Nouveau RDV reserve par Sophie M.",
    time_ago: "Il y a 1 jour",
    type: "rdv",
    coachee_id: "coach-3",
  },
  {
    id: "act-4",
    message: "Camille R. a soumis un livrable pour 'Intelligence Emotionnelle'",
    time_ago: "Il y a 1 jour",
    type: "livrable",
    coachee_id: "coach-5",
  },
  {
    id: "act-5",
    message: "Isabelle F. a obtenu son certificat 'Estime de soi'",
    time_ago: "Il y a 2 jours",
    type: "certificate",
    coachee_id: "coach-8",
  },
  {
    id: "act-6",
    message: "Julie M. a soumis une video pour 'Intelligence Emotionnelle'",
    time_ago: "Il y a 3 jours",
    type: "livrable",
    coachee_id: "coach-7",
  },
  {
    id: "act-7",
    message: "Nicolas G. n'a pas ete actif depuis 10 jours",
    time_ago: "Il y a 4 jours",
    type: "kpi_alert",
    coachee_id: "coach-9",
  },
  {
    id: "act-8",
    message: "Emilie L. est passee en statut inactif",
    time_ago: "Il y a 1 semaine",
    type: "kpi_alert",
    coachee_id: "coach-10",
  },
];

// ---------- Booking submissions ----------
export interface MockBookingSubmission {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  step_reached: BookingStep;
  is_complete: boolean;
  date: string;
  source: string;
  phone?: string;
}

export const mockBookingSubmissions: MockBookingSubmission[] = [
  { id: "bs-1", first_name: "Laura", last_name: "Chevalier", email: "laura.c@email.fr", step_reached: "rdv_pris", is_complete: true, date: "2026-02-25", source: "Google Ads" },
  { id: "bs-2", first_name: "Marc", last_name: "Dupuis", email: "marc.d@email.fr", step_reached: "rdv_pris", is_complete: true, date: "2026-02-24", source: "Instagram" },
  { id: "bs-3", first_name: "Celine", last_name: "Blanc", email: "celine.b@email.fr", step_reached: "complete", is_complete: true, date: "2026-02-24", source: "Bouche a oreille" },
  { id: "bs-4", first_name: "Hugo", last_name: "Perrot", email: "hugo.p@email.fr", step_reached: "complete", is_complete: true, date: "2026-02-23", source: "LinkedIn" },
  { id: "bs-5", first_name: "Amelie", last_name: "Renard", email: "amelie.r@email.fr", step_reached: "commence", is_complete: false, date: "2026-02-23", source: "Google Ads" },
  { id: "bs-6", first_name: "David", last_name: "Simon", email: "david.s@email.fr", step_reached: "commence", is_complete: false, date: "2026-02-22", source: "Site web" },
  { id: "bs-7", first_name: "Nathalie", last_name: "Morel", email: "nathalie.m@email.fr", step_reached: "formulaire_vu", is_complete: false, date: "2026-02-22", source: "Google Ads" },
  { id: "bs-8", first_name: "Paul", last_name: "Girard", email: "paul.g@email.fr", step_reached: "rdv_pris", is_complete: true, date: "2026-02-21", source: "Bouche a oreille" },
  { id: "bs-9", first_name: "Marine", last_name: "Lambert", email: "marine.l@email.fr", step_reached: "complete", is_complete: true, date: "2026-02-20", source: "Instagram" },
  { id: "bs-10", first_name: "Romain", last_name: "Faure", email: "romain.f@email.fr", step_reached: "commence", is_complete: false, date: "2026-02-19", source: "Google Ads" },
  { id: "bs-11", first_name: "Claire", last_name: "Andre", email: "claire.a@email.fr", step_reached: "formulaire_vu", is_complete: false, date: "2026-02-19", source: "Site web" },
  { id: "bs-12", first_name: "Julien", last_name: "Robert", email: "julien.r@email.fr", step_reached: "rdv_pris", is_complete: true, date: "2026-02-18", source: "LinkedIn" },
];

// ---------- Upcoming appointments ----------
export interface MockAppointment {
  id: string;
  date: string;
  time: string;
  client_name: string;
  type: CallType;
  zoom_link: string;
}

export const mockAppointments: MockAppointment[] = [
  { id: "apt-1", date: "2026-02-27", time: "09:00", client_name: "Marie Dupont", type: "coaching", zoom_link: "https://zoom.us/j/123456789" },
  { id: "apt-2", date: "2026-02-27", time: "14:00", client_name: "Laura Chevalier", type: "decouverte", zoom_link: "https://zoom.us/j/987654321" },
  { id: "apt-3", date: "2026-02-28", time: "10:00", client_name: "Camille Rousseau", type: "coaching", zoom_link: "https://zoom.us/j/111222333" },
  { id: "apt-4", date: "2026-02-28", time: "16:00", client_name: "Marc Dupuis", type: "decouverte", zoom_link: "https://zoom.us/j/444555666" },
  { id: "apt-5", date: "2026-03-02", time: "11:00", client_name: "Isabelle Fontaine", type: "coaching", zoom_link: "https://zoom.us/j/777888999" },
  { id: "apt-6", date: "2026-03-03", time: "09:30", client_name: "Pierre Leclerc", type: "review", zoom_link: "https://zoom.us/j/101112131" },
];

// ---------- Funnel data ----------
export interface MockFunnelStep {
  label: string;
  count: number;
}

export const mockFunnelData: MockFunnelStep[] = [
  { label: "Formulaire vu", count: 150 },
  { label: "Commence", count: 89 },
  { label: "Complete", count: 45 },
  { label: "RDV pris", count: 32 },
];

// ---------- Helper: get company kpis ----------
export function getCompanyAverageKpis(companyId: string): MockKpiScores {
  const employees = mockCoachees.filter((c) => c.company_id === companyId);
  if (employees.length === 0) return { investissement: 0, efficacite: 0, participation: 0 };
  const sum = employees.reduce(
    (acc, c) => ({
      investissement: acc.investissement + c.kpis.investissement,
      efficacite: acc.efficacite + c.kpis.efficacite,
      participation: acc.participation + c.kpis.participation,
    }),
    { investissement: 0, efficacite: 0, participation: 0 }
  );
  return {
    investissement: Math.round((sum.investissement / employees.length) * 10) / 10,
    efficacite: Math.round((sum.efficacite / employees.length) * 10) / 10,
    participation: Math.round((sum.participation / employees.length) * 10) / 10,
  };
}

// ---------- Helper: days ago ----------
export function daysAgo(dateStr: string): string {
  const now = new Date("2026-02-26");
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Aujourd'hui";
  if (diff === 1) return "Il y a 1 jour";
  if (diff < 7) return `Il y a ${diff} jours`;
  if (diff < 30) return `Il y a ${Math.floor(diff / 7)} semaine${Math.floor(diff / 7) > 1 ? "s" : ""}`;
  return `Il y a ${Math.floor(diff / 30)} mois`;
}
