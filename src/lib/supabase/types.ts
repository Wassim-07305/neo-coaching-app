export type UserRole = "admin" | "dirigeant" | "salarie" | "coachee" | "intervenant";
export type CoachingType = "individuel" | "entreprise";
export type ProfileStatus = "active" | "inactive" | "archived";
export type MissionStatus = "active" | "completed" | "paused";
export type ModuleParcoursType = "individuel" | "entreprise" | "les_deux";
export type ModuleProgressStatus = "not_started" | "in_progress" | "submitted" | "validated" | "failed";
export type AppointmentType = "discovery" | "coaching" | "module_review" | "intervenant";
export type AppointmentStatus = "scheduled" | "completed" | "cancelled" | "no_show";
export type PaymentType = "module" | "intervenant_session";
export type PaymentStatus = "pending" | "succeeded" | "failed" | "refunded";
export type TaskStatus = "pending" | "completed";
export type CompletionSpeed = "same_day" | "next_day" | "on_time" | "late" | "not_done";
export type GroupType = "entreprise" | "coaching_individuel" | "general";
export type NotificationType = "module_complete" | "module_reminder" | "kpi_alert" | "message" | "rdv_reminder" | "task_reminder";

// Table Row types
export interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  company_id: string | null;
  coaching_type: CoachingType | null;
  status: ProfileStatus;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  logo_url: string | null;
  mission_start_date: string | null;
  mission_end_date: string | null;
  mission_status: MissionStatus;
  kpi_objectives: Record<string, unknown> | null;
  dirigeant_id: string | null;
  notes: string | null;
  created_at: string;
}

export interface Module {
  id: string;
  title: string;
  description: string | null;
  content: Record<string, unknown>;
  exercise: Record<string, unknown> | null;
  order_index: number;
  parcours_type: ModuleParcoursType;
  price_cents: number;
  is_free: boolean;
  duration_minutes: number | null;
  created_at: string;
}

export interface ModuleProgress {
  id: string;
  user_id: string;
  module_id: string;
  status: ModuleProgressStatus;
  started_at: string | null;
  submitted_at: string | null;
  validated_at: string | null;
  written_summary_url: string | null;
  audio_url: string | null;
  video_url: string | null;
  satisfaction_score: number | null;
  certificate_url: string | null;
  coach_notes: string | null;
  created_at: string;
}

export interface KpiScore {
  id: string;
  user_id: string;
  company_id: string | null;
  investissement: number;
  efficacite: number;
  participation: number;
  notes: string | null;
  scored_at: string;
  created_at: string;
}

export interface Appointment {
  id: string;
  client_id: string | null;
  prospect_data: Record<string, unknown> | null;
  coach_id: string;
  datetime_start: string;
  datetime_end: string;
  type: AppointmentType;
  status: AppointmentStatus;
  zoom_link: string | null;
  notes: string | null;
  created_at: string;
}

export interface BookingFormSubmission {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  responses: Record<string, unknown> | null;
  step_reached: number;
  completed: boolean;
  appointment_id: string | null;
  source: string | null;
  created_at: string;
}

export interface Group {
  id: string;
  name: string;
  type: GroupType;
  company_id: string | null;
  is_active: boolean;
  created_by: string;
  created_at: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  joined_at: string;
}

export interface Message {
  id: string;
  group_id: string | null;
  sender_id: string;
  recipient_id: string | null;
  content: string;
  attachment_url: string | null;
  is_pinned: boolean;
  created_at: string;
}

export interface Intervenant {
  id: string;
  user_id: string;
  domain: string;
  bio: string | null;
  video_url: string | null;
  hourly_rate_cents: number;
  packages: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  amount_cents: number;
  type: PaymentType;
  stripe_payment_id: string;
  status: PaymentStatus;
  module_id: string | null;
  intervenant_id: string | null;
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  company_id: string | null;
  title: string;
  due_date: string | null;
  status: TaskStatus;
  completed_at: string | null;
  completion_speed: CompletionSpeed | null;
  coach_rating: number | null;
  created_at: string;
}

// Supabase Database type for typed queries
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & Pick<Profile, "id" | "email" | "first_name" | "last_name" | "role">;
        Update: Partial<Profile>;
      };
      companies: {
        Row: Company;
        Insert: Partial<Company> & Pick<Company, "name">;
        Update: Partial<Company>;
      };
      modules: {
        Row: Module;
        Insert: Partial<Module> & Pick<Module, "title" | "content" | "order_index" | "parcours_type">;
        Update: Partial<Module>;
      };
      module_progress: {
        Row: ModuleProgress;
        Insert: Partial<ModuleProgress> & Pick<ModuleProgress, "user_id" | "module_id">;
        Update: Partial<ModuleProgress>;
      };
      kpi_scores: {
        Row: KpiScore;
        Insert: Partial<KpiScore> & Pick<KpiScore, "user_id" | "scored_at">;
        Update: Partial<KpiScore>;
      };
      appointments: {
        Row: Appointment;
        Insert: Partial<Appointment> & Pick<Appointment, "coach_id" | "datetime_start" | "datetime_end" | "type">;
        Update: Partial<Appointment>;
      };
      booking_form_submissions: {
        Row: BookingFormSubmission;
        Insert: Partial<BookingFormSubmission>;
        Update: Partial<BookingFormSubmission>;
      };
      groups: {
        Row: Group;
        Insert: Partial<Group> & Pick<Group, "name" | "type" | "created_by">;
        Update: Partial<Group>;
      };
      group_members: {
        Row: GroupMember;
        Insert: Partial<GroupMember> & Pick<GroupMember, "group_id" | "user_id">;
        Update: Partial<GroupMember>;
      };
      messages: {
        Row: Message;
        Insert: Partial<Message> & Pick<Message, "sender_id" | "content">;
        Update: Partial<Message>;
      };
      intervenants: {
        Row: Intervenant;
        Insert: Partial<Intervenant> & Pick<Intervenant, "user_id" | "domain" | "hourly_rate_cents" | "packages">;
        Update: Partial<Intervenant>;
      };
      notifications: {
        Row: Notification;
        Insert: Partial<Notification> & Pick<Notification, "user_id" | "type" | "title" | "body">;
        Update: Partial<Notification>;
      };
      payments: {
        Row: Payment;
        Insert: Partial<Payment> & Pick<Payment, "user_id" | "amount_cents" | "type" | "stripe_payment_id" | "status">;
        Update: Partial<Payment>;
      };
      tasks: {
        Row: Task;
        Insert: Partial<Task> & Pick<Task, "user_id" | "title">;
        Update: Partial<Task>;
      };
    };
  };
};
