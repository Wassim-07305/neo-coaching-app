// @ts-nocheck — Database generic doesn't fully resolve with @supabase/ssr v0.6+
// Runtime types are validated via the Database type in client.ts
import { createClient } from "./client";
import type {
  Profile,
  Company,
  Module,
  ModuleProgress,
  KpiScore,
  Appointment,
  Group,
  Message,
  Notification,
  Task,
} from "./types";

// ─── Helpers ─────────────────────────────────────────────────

function supabase() {
  return createClient();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleError<T>(result: { data: T | null; error: any }): T {
  if (result.error) throw result.error;
  return result.data as T;
}

// Type cast helper for insert/update operations where
// the Database generic doesn't perfectly resolve
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function asData<T>(data: T): any {
  return data;
}

// ─── Profiles ────────────────────────────────────────────────

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data } = await supabase()
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return data;
}

export async function updateProfile(
  userId: string,
  updates: Partial<Profile>
) {
  return handleError(
    await supabase()
      .from("profiles")
      .update(asData(updates))
      .eq("id", userId)
      .select()
      .single()
  );
}

export async function getCoachees() {
  return handleError(
    await supabase()
      .from("profiles")
      .select("*, companies(name)")
      .in("role", ["coachee", "salarie"])
      .order("created_at", { ascending: false })
  );
}

export async function getCoacheesByCompany(companyId: string) {
  return handleError(
    await supabase()
      .from("profiles")
      .select("*")
      .eq("company_id", companyId)
      .in("role", ["coachee", "salarie"])
      .order("last_name")
  );
}

export async function archiveProfile(userId: string) {
  return updateProfile(userId, { status: "archived" });
}

// ─── Companies ───────────────────────────────────────────────

export async function getCompanies() {
  return handleError(
    await supabase()
      .from("companies")
      .select("*, profiles!companies_dirigeant_id_fkey(first_name, last_name)")
      .order("name")
  );
}

export async function getCompany(id: string) {
  return handleError(
    await supabase().from("companies").select("*").eq("id", id).single()
  );
}

export async function createCompany(data: { name: string; dirigeant_id?: string; notes?: string }) {
  return handleError(
    await supabase().from("companies").insert(asData(data)).select().single()
  );
}

export async function updateCompany(id: string, updates: Partial<Company>) {
  return handleError(
    await supabase()
      .from("companies")
      .update(asData(updates))
      .eq("id", id)
      .select()
      .single()
  );
}

// ─── Modules ─────────────────────────────────────────────────

export async function getModules() {
  return handleError(
    await supabase()
      .from("modules")
      .select("*")
      .order("order_index")
  );
}

export async function getModule(id: string) {
  return handleError(
    await supabase().from("modules").select("*").eq("id", id).single()
  );
}

export async function createModule(data: {
  title: string;
  description?: string;
  content: Record<string, unknown>;
  exercise?: Record<string, unknown>;
  order_index: number;
  parcours_type: Module["parcours_type"];
  price_cents?: number;
  duration_minutes?: number;
}) {
  return handleError(
    await supabase().from("modules").insert(asData(data)).select().single()
  );
}

export async function updateModule(id: string, updates: Partial<Module>) {
  return handleError(
    await supabase()
      .from("modules")
      .update(asData(updates))
      .eq("id", id)
      .select()
      .single()
  );
}

export async function deleteModule(id: string) {
  return handleError(
    await supabase().from("modules").delete().eq("id", id)
  );
}

// ─── Module Progress ─────────────────────────────────────────

export async function getUserModuleProgress(userId: string) {
  return handleError(
    await supabase()
      .from("module_progress")
      .select("*, modules(title, description, order_index)")
      .eq("user_id", userId)
      .order("created_at")
  );
}

export async function getModuleProgressForModule(moduleId: string) {
  return handleError(
    await supabase()
      .from("module_progress")
      .select("*, profiles(first_name, last_name, email)")
      .eq("module_id", moduleId)
  );
}

export async function upsertModuleProgress(data: {
  user_id: string;
  module_id: string;
  status?: ModuleProgress["status"];
  satisfaction_score?: number;
  coach_notes?: string;
}) {
  return handleError(
    await supabase()
      .from("module_progress")
      .upsert(asData(data), { onConflict: "user_id,module_id" })
      .select()
      .single()
  );
}

export async function validateModule(
  userId: string,
  moduleId: string,
  notes?: string
) {
  return upsertModuleProgress({
    user_id: userId,
    module_id: moduleId,
    status: "validated",
    coach_notes: notes,
  });
}

// ─── KPI Scores ──────────────────────────────────────────────

export async function getLatestKpi(userId: string): Promise<KpiScore | null> {
  const { data } = await supabase()
    .from("kpi_scores")
    .select("*")
    .eq("user_id", userId)
    .order("scored_at", { ascending: false })
    .limit(1)
    .single();
  return data;
}

export async function getKpiHistory(userId: string, limit = 12) {
  return handleError(
    await supabase()
      .from("kpi_scores")
      .select("*")
      .eq("user_id", userId)
      .order("scored_at", { ascending: false })
      .limit(limit)
  );
}

export async function getCompanyKpis(companyId: string) {
  return handleError(
    await supabase()
      .from("kpi_scores")
      .select("*, profiles(first_name, last_name)")
      .eq("company_id", companyId)
      .order("scored_at", { ascending: false })
  );
}

export async function insertKpiScore(data: {
  user_id: string;
  company_id?: string;
  investissement: number;
  efficacite: number;
  participation: number;
  scored_at: string;
  notes?: string;
}) {
  return handleError(
    await supabase().from("kpi_scores").insert(asData(data)).select().single()
  );
}

// ─── Appointments ────────────────────────────────────────────

export async function getUpcomingAppointments(coachId?: string) {
  let query = supabase()
    .from("appointments")
    .select("*, profiles!appointments_client_id_fkey(first_name, last_name, email)")
    .gte("datetime_start", new Date().toISOString())
    .eq("status", "scheduled")
    .order("datetime_start");

  if (coachId) {
    query = query.eq("coach_id", coachId);
  }

  return handleError(await query);
}

export async function getUserAppointments(userId: string) {
  return handleError(
    await supabase()
      .from("appointments")
      .select("*, profiles!appointments_coach_id_fkey(first_name, last_name)")
      .eq("client_id", userId)
      .order("datetime_start", { ascending: false })
  );
}

export async function createAppointment(data: {
  client_id?: string;
  coach_id: string;
  datetime_start: string;
  datetime_end: string;
  type: Appointment["type"];
  zoom_link?: string;
  notes?: string;
}) {
  return handleError(
    await supabase().from("appointments").insert(asData(data)).select().single()
  );
}

export async function updateAppointment(
  id: string,
  updates: Partial<Appointment>
) {
  return handleError(
    await supabase()
      .from("appointments")
      .update(asData(updates))
      .eq("id", id)
      .select()
      .single()
  );
}

export async function cancelAppointment(id: string) {
  return updateAppointment(id, { status: "cancelled" });
}

// ─── Groups & Messages ──────────────────────────────────────

export async function getUserGroups(userId: string) {
  return handleError(
    await supabase()
      .from("group_members")
      .select("group_id, groups(id, name, type, is_active)")
      .eq("user_id", userId)
  );
}

export async function getGroupMessages(groupId: string, limit = 50) {
  return handleError(
    await supabase()
      .from("messages")
      .select("*, profiles!messages_sender_id_fkey(first_name, last_name, avatar_url)")
      .eq("group_id", groupId)
      .order("created_at", { ascending: false })
      .limit(limit)
  );
}

export async function sendMessage(data: {
  group_id?: string;
  sender_id: string;
  recipient_id?: string;
  content: string;
  attachment_url?: string;
}) {
  return handleError(
    await supabase().from("messages").insert(asData(data)).select().single()
  );
}

export async function togglePinMessage(messageId: string, isPinned: boolean) {
  return handleError(
    await supabase()
      .from("messages")
      .update(asData({ is_pinned: isPinned }))
      .eq("id", messageId)
      .select()
      .single()
  );
}

// ─── Notifications ───────────────────────────────────────────

export async function getUserNotifications(userId: string, limit = 20) {
  return handleError(
    await supabase()
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)
  );
}

export async function markNotificationRead(id: string) {
  return handleError(
    await supabase()
      .from("notifications")
      .update(asData({ is_read: true }))
      .eq("id", id)
  );
}

export async function markAllNotificationsRead(userId: string) {
  return handleError(
    await supabase()
      .from("notifications")
      .update(asData({ is_read: true }))
      .eq("user_id", userId)
      .eq("is_read", false)
  );
}

// ─── Tasks ───────────────────────────────────────────────────

export async function getUserTasks(userId: string) {
  return handleError(
    await supabase()
      .from("tasks")
      .select("*")
      .eq("user_id", userId)
      .order("due_date")
  );
}

export async function createTask(data: {
  user_id: string;
  title: string;
  due_date?: string;
  company_id?: string;
}) {
  return handleError(
    await supabase().from("tasks").insert(asData(data)).select().single()
  );
}

export async function completeTask(id: string) {
  return handleError(
    await supabase()
      .from("tasks")
      .update(asData({ status: "completed", completed_at: new Date().toISOString() }))
      .eq("id", id)
      .select()
      .single()
  );
}

// ─── Dashboard Stats ─────────────────────────────────────────

export async function getAdminDashboardStats() {
  const sb = supabase();

  const [coachees, companies, appointments, modules] = await Promise.all([
    sb.from("profiles").select("id, status, role", { count: "exact" }).in("role", ["coachee", "salarie"]),
    sb.from("companies").select("id", { count: "exact" }),
    sb.from("appointments").select("id", { count: "exact" }).eq("status", "scheduled").gte("datetime_start", new Date().toISOString()),
    sb.from("modules").select("id", { count: "exact" }),
  ]);

  return {
    totalCoachees: coachees.count || 0,
    activeCoachees: coachees.data?.filter((p) => p.status === "active").length || 0,
    totalCompanies: companies.count || 0,
    upcomingRdv: appointments.count || 0,
    totalModules: modules.count || 0,
  };
}

// ─── Booking Funnel ──────────────────────────────────────────

export async function getBookingSubmissions(limit = 50) {
  return handleError(
    await supabase()
      .from("booking_form_submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)
  );
}

// ─── Realtime Subscriptions ──────────────────────────────────

export function subscribeToMessages(
  groupId: string,
  callback: (message: Message) => void
) {
  return supabase()
    .channel(`messages:${groupId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `group_id=eq.${groupId}`,
      },
      (payload) => callback(payload.new as Message)
    )
    .subscribe();
}

export function subscribeToNotifications(
  userId: string,
  callback: (notification: Notification) => void
) {
  return supabase()
    .channel(`notifications:${userId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => callback(payload.new as Notification)
    )
    .subscribe();
}
