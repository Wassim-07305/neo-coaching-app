"use client";

import { useCallback, useEffect, useState } from "react";
import { createUntypedClient } from "@/lib/supabase/client";
import type {
  Profile,
  Company,
  Module,
  ModuleProgress,
  KpiScore,
  Appointment,
  Group,
  GroupMember,
  Message,
  Notification,
  Task,
  Questionnaire,
  QuestionnaireQuestion,
  QuestionnaireResponse,
  ParcoursTemplate,
  AssignedParcours,
  ParcoursModule,
  CalendlySettings,
  CalendlyBooking,
  Intervenant,
  BookingFormSubmission,
} from "@/lib/supabase/types";

// Generic hook for fetching data
function useSupabaseQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: Error | null }>,
  deps: unknown[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await queryFn();
    setData(data);
    setError(error);
    setLoading(false);
  }, deps);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}

// ============================================================================
// PROFILES
// ============================================================================

export function useProfiles(filters?: { role?: string; company_id?: string; status?: string }) {
  const supabase = createUntypedClient();

  return useSupabaseQuery<Profile[]>(async () => {
    let query = supabase.from("profiles").select("*");

    if (filters?.role) query = query.eq("role", filters.role);
    if (filters?.company_id) query = query.eq("company_id", filters.company_id);
    if (filters?.status) query = query.eq("status", filters.status);

    const { data, error } = await query.order("created_at", { ascending: false });
    return { data, error };
  }, [filters?.role, filters?.company_id, filters?.status]);
}

export function useProfile(id: string | undefined) {
  const supabase = createUntypedClient();

  return useSupabaseQuery<Profile>(async () => {
    if (!id) return { data: null, error: null };
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();
    return { data, error };
  }, [id]);
}

// ============================================================================
// COMPANIES
// ============================================================================

export function useCompanies() {
  const supabase = createUntypedClient();

  return useSupabaseQuery<Company[]>(async () => {
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .order("name");
    return { data, error };
  }, []);
}

export function useCompany(id: string | undefined) {
  const supabase = createUntypedClient();

  return useSupabaseQuery<Company>(async () => {
    if (!id) return { data: null, error: null };
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .eq("id", id)
      .single();
    return { data, error };
  }, [id]);
}

export function useCompanyWithEmployees(id: string | undefined) {
  const supabase = createUntypedClient();

  return useSupabaseQuery<Company & { employees: Profile[] }>(async () => {
    if (!id) return { data: null, error: null };

    const companyResponse = await supabase
      .from("companies")
      .select("*")
      .eq("id", id)
      .single();

    if (companyResponse.error) {
      return { data: null, error: companyResponse.error };
    }

    const companyData = companyResponse.data as Company | null;
    if (!companyData) {
      return { data: null, error: null };
    }

    const employeesResponse = await supabase
      .from("profiles")
      .select("*")
      .eq("company_id", id)
      .order("last_name");

    const result: Company & { employees: Profile[] } = {
      ...companyData,
      employees: (employeesResponse.data as Profile[] | null) || [],
    };

    return { data: result, error: null };
  }, [id]);
}

// ============================================================================
// MODULES
// ============================================================================

export function useModules(filters?: { parcours_type?: string }) {
  const supabase = createUntypedClient();

  return useSupabaseQuery<Module[]>(async () => {
    let query = supabase.from("modules").select("*");

    if (filters?.parcours_type) {
      query = query.or(`parcours_type.eq.${filters.parcours_type},parcours_type.eq.les_deux`);
    }

    const { data, error } = await query.order("order_index");
    return { data, error };
  }, [filters?.parcours_type]);
}

export function useModule(id: string | undefined) {
  const supabase = createUntypedClient();

  return useSupabaseQuery<Module>(async () => {
    if (!id) return { data: null, error: null };
    const { data, error } = await supabase
      .from("modules")
      .select("*")
      .eq("id", id)
      .single();
    return { data, error };
  }, [id]);
}

// ============================================================================
// MODULE PROGRESS
// ============================================================================

export function useModuleProgress(filters?: { user_id?: string; module_id?: string; company_id?: string }) {
  const supabase = createUntypedClient();

  return useSupabaseQuery<(ModuleProgress & { module?: Module; user?: Profile })[]>(async () => {
    // If company_id is provided, we first need to get all user IDs for that company
    let userIds: string[] | null = null;
    if (filters?.company_id) {
      const employeesResult = await supabase
        .from("profiles")
        .select("id")
        .eq("company_id", filters.company_id)
        .in("role", ["salarie", "coachee"]);
      userIds = (employeesResult.data as { id: string }[] | null)?.map((e) => e.id) || [];
      if (userIds.length === 0) {
        return { data: [], error: null };
      }
    }

    let query = supabase.from("module_progress").select(`
      *,
      module:modules(*),
      user:profiles(*)
    `);

    if (filters?.user_id) query = query.eq("user_id", filters.user_id);
    if (filters?.module_id) query = query.eq("module_id", filters.module_id);
    if (userIds) query = query.in("user_id", userIds);

    const { data, error } = await query.order("created_at", { ascending: false });
    return { data, error };
  }, [filters?.user_id, filters?.module_id, filters?.company_id]);
}

export function useUserModuleProgress(userId: string | undefined) {
  const supabase = createUntypedClient();

  return useSupabaseQuery<(ModuleProgress & { module: Module })[]>(async () => {
    if (!userId) return { data: null, error: null };
    const { data, error } = await supabase
      .from("module_progress")
      .select(`*, module:modules(*)`)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    return { data, error };
  }, [userId]);
}

// ============================================================================
// KPI SCORES
// ============================================================================

export function useKpiScores(filters?: { user_id?: string; company_id?: string }) {
  const supabase = createUntypedClient();

  return useSupabaseQuery<(KpiScore & { user?: Profile })[]>(async () => {
    let query = supabase.from("kpi_scores").select(`*, user:profiles(*)`);

    if (filters?.user_id) query = query.eq("user_id", filters.user_id);
    if (filters?.company_id) query = query.eq("company_id", filters.company_id);

    const { data, error } = await query.order("scored_at", { ascending: false });
    return { data, error };
  }, [filters?.user_id, filters?.company_id]);
}

export function useLatestKpiScore(userId: string | undefined) {
  const supabase = createUntypedClient();

  return useSupabaseQuery<KpiScore>(async () => {
    if (!userId) return { data: null, error: null };
    const { data, error } = await supabase
      .from("kpi_scores")
      .select("*")
      .eq("user_id", userId)
      .order("scored_at", { ascending: false })
      .limit(1)
      .single();
    return { data, error };
  }, [userId]);
}

// ============================================================================
// APPOINTMENTS
// ============================================================================

export function useAppointments(filters?: { client_id?: string; coach_id?: string; status?: string }) {
  const supabase = createUntypedClient();

  return useSupabaseQuery<(Appointment & { client?: Profile; coach?: Profile })[]>(async () => {
    let query = supabase.from("appointments").select(`
      *,
      client:profiles!appointments_client_id_fkey(*),
      coach:profiles!appointments_coach_id_fkey(*)
    `);

    if (filters?.client_id) query = query.eq("client_id", filters.client_id);
    if (filters?.coach_id) query = query.eq("coach_id", filters.coach_id);
    if (filters?.status) query = query.eq("status", filters.status);

    const { data, error } = await query.order("datetime_start", { ascending: true });
    return { data, error };
  }, [filters?.client_id, filters?.coach_id, filters?.status]);
}

export function useUpcomingAppointments(coachId?: string) {
  const supabase = createUntypedClient();

  return useSupabaseQuery<(Appointment & { client?: Profile })[]>(async () => {
    let query = supabase
      .from("appointments")
      .select(`*, client:profiles!appointments_client_id_fkey(*)`)
      .gte("datetime_start", new Date().toISOString())
      .eq("status", "scheduled");

    if (coachId) query = query.eq("coach_id", coachId);

    const { data, error } = await query.order("datetime_start").limit(10);
    return { data, error };
  }, [coachId]);
}

// Booking form submissions
export function useBookingSubmissions() {
  const supabase = createUntypedClient();

  return useSupabaseQuery<BookingFormSubmission[]>(async () => {
    const { data, error } = await supabase
      .from("booking_form_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    return { data, error };
  }, []);
}

// ============================================================================
// GROUPS & MESSAGES
// ============================================================================

export function useGroups(userId?: string) {
  const supabase = createUntypedClient();

  return useSupabaseQuery<Group[]>(async () => {
    if (!userId) {
      const { data, error } = await supabase.from("groups").select("*").eq("is_active", true);
      return { data: data as Group[] | null, error };
    }

    // Get groups the user is a member of
    const memberResponse = await supabase
      .from("group_members")
      .select("group_id")
      .eq("user_id", userId);

    const memberData = memberResponse.data as { group_id: string }[] | null;
    const groupIds = memberData?.map((m) => m.group_id) || [];

    if (groupIds.length === 0) return { data: [], error: null };

    const { data, error } = await supabase
      .from("groups")
      .select("*")
      .in("id", groupIds)
      .eq("is_active", true);

    return { data: data as Group[] | null, error };
  }, [userId]);
}

export function useGroupMembers(groupId: string | undefined) {
  const supabase = createUntypedClient();

  return useSupabaseQuery<(GroupMember & { user: Profile })[]>(async () => {
    if (!groupId) return { data: null, error: null };
    const { data, error } = await supabase
      .from("group_members")
      .select(`*, user:profiles(*)`)
      .eq("group_id", groupId);
    return { data, error };
  }, [groupId]);
}

export function useMessages(groupId?: string, recipientId?: string) {
  const supabase = createUntypedClient();

  return useSupabaseQuery<(Message & { sender: Profile })[]>(async () => {
    let query = supabase.from("messages").select(`*, sender:profiles!messages_sender_id_fkey(*)`);

    if (groupId) {
      query = query.eq("group_id", groupId);
    } else if (recipientId) {
      query = query.or(`recipient_id.eq.${recipientId},sender_id.eq.${recipientId}`);
    }

    const { data, error } = await query.order("created_at", { ascending: true });
    return { data, error };
  }, [groupId, recipientId]);
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export function useNotifications(userId: string | undefined, unreadOnly = false) {
  const supabase = createUntypedClient();

  return useSupabaseQuery<Notification[]>(async () => {
    if (!userId) return { data: null, error: null };

    let query = supabase.from("notifications").select("*").eq("user_id", userId);

    if (unreadOnly) query = query.eq("is_read", false);

    const { data, error } = await query.order("created_at", { ascending: false }).limit(50);
    return { data, error };
  }, [userId, unreadOnly]);
}

// ============================================================================
// TASKS
// ============================================================================

export function useTasks(filters?: { user_id?: string; company_id?: string; status?: string }) {
  const supabase = createUntypedClient();

  return useSupabaseQuery<Task[]>(async () => {
    let query = supabase.from("tasks").select("*");

    if (filters?.user_id) query = query.eq("user_id", filters.user_id);
    if (filters?.company_id) query = query.eq("company_id", filters.company_id);
    if (filters?.status) query = query.eq("status", filters.status);

    const { data, error } = await query.order("due_date", { ascending: true });
    return { data, error };
  }, [filters?.user_id, filters?.company_id, filters?.status]);
}

// ============================================================================
// QUESTIONNAIRES
// ============================================================================

export function useQuestionnaires(filters?: { phase?: string; module_id?: string }) {
  const supabase = createUntypedClient();

  return useSupabaseQuery<Questionnaire[]>(async () => {
    let query = supabase.from("questionnaires").select("*").eq("is_active", true);

    if (filters?.phase) query = query.eq("phase", filters.phase);
    if (filters?.module_id) query = query.eq("module_id", filters.module_id);

    const { data, error } = await query.order("created_at", { ascending: false });
    return { data, error };
  }, [filters?.phase, filters?.module_id]);
}

export function useQuestionnaire(id: string | undefined) {
  const supabase = createUntypedClient();

  return useSupabaseQuery<Questionnaire & { questions: QuestionnaireQuestion[] }>(async () => {
    if (!id) return { data: null, error: null };

    const questionnaireResponse = await supabase
      .from("questionnaires")
      .select("*")
      .eq("id", id)
      .single();

    if (questionnaireResponse.error) {
      return { data: null, error: questionnaireResponse.error };
    }

    const questionnaireData = questionnaireResponse.data as Questionnaire | null;
    if (!questionnaireData) {
      return { data: null, error: null };
    }

    const questionsResponse = await supabase
      .from("questionnaire_questions")
      .select("*")
      .eq("questionnaire_id", id)
      .order("order_index");

    const result: Questionnaire & { questions: QuestionnaireQuestion[] } = {
      ...questionnaireData,
      questions: (questionsResponse.data as QuestionnaireQuestion[] | null) || [],
    };

    return { data: result, error: null };
  }, [id]);
}

export function useModuleQuestionnaires(moduleId: string | undefined) {
  const supabase = createUntypedClient();

  return useSupabaseQuery<{ amont?: Questionnaire; aval?: Questionnaire }>(async () => {
    if (!moduleId) return { data: null, error: null };

    const { data, error } = await supabase
      .from("questionnaires")
      .select("*")
      .eq("module_id", moduleId)
      .eq("is_active", true);

    if (error) return { data: null, error };

    const questionnaires = data as Questionnaire[] | null;
    const result: { amont?: Questionnaire; aval?: Questionnaire } = {};
    for (const q of questionnaires || []) {
      if (q.phase === "amont") result.amont = q;
      if (q.phase === "aval") result.aval = q;
    }

    return { data: result, error: null };
  }, [moduleId]);
}

export function useQuestionnaireResponses(filters?: { user_id?: string; questionnaire_id?: string }) {
  const supabase = createUntypedClient();

  return useSupabaseQuery<QuestionnaireResponse[]>(async () => {
    let query = supabase.from("questionnaire_responses").select("*");

    if (filters?.user_id) query = query.eq("user_id", filters.user_id);
    if (filters?.questionnaire_id) query = query.eq("questionnaire_id", filters.questionnaire_id);

    const { data, error } = await query.order("submitted_at", { ascending: false });
    return { data, error };
  }, [filters?.user_id, filters?.questionnaire_id]);
}

// ============================================================================
// PARCOURS
// ============================================================================

export function useParcoursTemplates() {
  const supabase = createUntypedClient();

  return useSupabaseQuery<ParcoursTemplate[]>(async () => {
    const { data, error } = await supabase
      .from("parcours_templates")
      .select("*")
      .eq("is_active", true)
      .order("title");
    return { data, error };
  }, []);
}

export function useAssignedParcours(filters?: { user_id?: string; company_id?: string; status?: string }) {
  const supabase = createUntypedClient();

  return useSupabaseQuery<(AssignedParcours & { assigned_user?: Profile; company?: Company })[]>(async () => {
    let query = supabase.from("assigned_parcours").select(`
      *,
      assigned_user:profiles!assigned_parcours_assigned_to_fkey(*),
      company:companies(*)
    `);

    if (filters?.user_id) query = query.eq("assigned_to", filters.user_id);
    if (filters?.company_id) query = query.eq("company_id", filters.company_id);
    if (filters?.status) query = query.eq("status", filters.status);

    const { data, error } = await query.order("created_at", { ascending: false });
    return { data, error };
  }, [filters?.user_id, filters?.company_id, filters?.status]);
}

export function useAssignedParcoursWithModules(id: string | undefined) {
  const supabase = createUntypedClient();

  return useSupabaseQuery<AssignedParcours & { modules: (ParcoursModule & { module: Module })[] }>(async () => {
    if (!id) return { data: null, error: null };

    const parcoursResponse = await supabase
      .from("assigned_parcours")
      .select("*")
      .eq("id", id)
      .single();

    if (parcoursResponse.error) {
      return { data: null, error: parcoursResponse.error };
    }

    const parcoursData = parcoursResponse.data as AssignedParcours | null;
    if (!parcoursData) {
      return { data: null, error: null };
    }

    const modulesResponse = await supabase
      .from("parcours_modules")
      .select(`*, module:modules(*)`)
      .eq("parcours_id", id)
      .order("order_index");

    const result: AssignedParcours & { modules: (ParcoursModule & { module: Module })[] } = {
      ...parcoursData,
      modules: (modulesResponse.data || []) as (ParcoursModule & { module: Module })[],
    };

    return { data: result, error: null };
  }, [id]);
}

export function useParcoursStats(companyId?: string) {
  const supabase = createUntypedClient();

  return useSupabaseQuery<{
    total: number;
    in_progress: number;
    completed: number;
    overdue: number;
    avg_progress: number;
  }>(async () => {
    let query = supabase.from("assigned_parcours").select("status, progress");

    if (companyId) query = query.eq("company_id", companyId);

    const { data, error } = await query;

    if (error || !data) return { data: null, error };

    const parcoursList = data as { status: string; progress: number }[];
    const stats = {
      total: parcoursList.length,
      in_progress: parcoursList.filter((p) => p.status === "in_progress").length,
      completed: parcoursList.filter((p) => p.status === "completed").length,
      overdue: parcoursList.filter((p) => p.status === "overdue").length,
      avg_progress: parcoursList.length > 0
        ? Math.round(parcoursList.reduce((sum, p) => sum + p.progress, 0) / parcoursList.length)
        : 0,
    };

    return { data: stats, error: null };
  }, [companyId]);
}

// ============================================================================
// CALENDLY
// ============================================================================

export function useCalendlySettings(userId: string | undefined) {
  const supabase = createUntypedClient();

  return useSupabaseQuery<CalendlySettings>(async () => {
    if (!userId) return { data: null, error: null };
    const { data, error } = await supabase
      .from("calendly_settings")
      .select("*")
      .eq("user_id", userId)
      .single();
    return { data, error };
  }, [userId]);
}

export function useCalendlyBookings(filters?: { user_id?: string; status?: string }) {
  const supabase = createUntypedClient();

  return useSupabaseQuery<(CalendlyBooking & { client?: Profile })[]>(async () => {
    let query = supabase.from("calendly_bookings").select(`
      *,
      client:profiles!calendly_bookings_client_id_fkey(*)
    `);

    if (filters?.user_id) query = query.eq("user_id", filters.user_id);
    if (filters?.status) query = query.eq("status", filters.status);

    const { data, error } = await query.order("start_time", { ascending: true });
    return { data, error };
  }, [filters?.user_id, filters?.status]);
}

// ============================================================================
// INTERVENANTS
// ============================================================================

export function useIntervenants(activeOnly = true) {
  const supabase = createUntypedClient();

  return useSupabaseQuery<(Intervenant & { user: Profile })[]>(async () => {
    let query = supabase.from("intervenants").select(`*, user:profiles(*)`);

    if (activeOnly) query = query.eq("is_active", true);

    const { data, error } = await query.order("domain");
    return { data, error };
  }, [activeOnly]);
}

export function useIntervenant(id: string | undefined) {
  const supabase = createUntypedClient();

  return useSupabaseQuery<Intervenant & { user: Profile }>(async () => {
    if (!id) return { data: null, error: null };
    const { data, error } = await supabase
      .from("intervenants")
      .select(`*, user:profiles(*)`)
      .eq("id", id)
      .single();
    return { data, error };
  }, [id]);
}

// ============================================================================
// DASHBOARD STATS
// ============================================================================

export function useAdminDashboardStats() {
  const supabase = createUntypedClient();

  return useSupabaseQuery<{
    totalCoachees: number;
    activeCompanies: number;
    completedModules: number;
    upcomingAppointments: number;
    avgSatisfaction: number;
    parcoursInProgress: number;
  }>(async () => {
    const now = new Date().toISOString();

    const [
      coacheesResult,
      companiesResult,
      modulesResult,
      appointmentsResult,
      satisfactionResult,
      parcoursResult,
    ] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact" }).in("role", ["coachee", "salarie"]).eq("status", "active"),
      supabase.from("companies").select("id", { count: "exact" }).eq("mission_status", "active"),
      supabase.from("module_progress").select("id", { count: "exact" }).eq("status", "validated"),
      supabase.from("appointments").select("id", { count: "exact" }).gte("datetime_start", now).eq("status", "scheduled"),
      supabase.from("module_progress").select("satisfaction_score").not("satisfaction_score", "is", null),
      supabase.from("assigned_parcours").select("id", { count: "exact" }).eq("status", "in_progress"),
    ]);

    const satisfactionData = satisfactionResult.data as { satisfaction_score: number | null }[] | null;
    const satisfactionScores = satisfactionData?.map((r) => r.satisfaction_score).filter((s): s is number => s !== null) || [];
    const avgSatisfaction = satisfactionScores.length > 0
      ? Math.round(satisfactionScores.reduce((a, b) => a + b, 0) / satisfactionScores.length * 10) / 10
      : 0;

    return {
      data: {
        totalCoachees: coacheesResult.count || 0,
        activeCompanies: companiesResult.count || 0,
        completedModules: modulesResult.count || 0,
        upcomingAppointments: appointmentsResult.count || 0,
        avgSatisfaction,
        parcoursInProgress: parcoursResult.count || 0,
      },
      error: null,
    };
  }, []);
}

export function useDirigeantDashboardStats(companyId: string | undefined) {
  const supabase = createUntypedClient();

  return useSupabaseQuery<{
    employeeCount: number;
    avgKpiInvestissement: number;
    avgKpiEfficacite: number;
    avgKpiParticipation: number;
    modulesCompleted: number;
    parcoursProgress: number;
  }>(async () => {
    if (!companyId) return { data: null, error: null };

    // First get employees to get their IDs
    const employeesResult = await supabase
      .from("profiles")
      .select("id")
      .eq("company_id", companyId)
      .eq("role", "salarie");

    const employeeIds = (employeesResult.data as { id: string }[] | null)?.map((e) => e.id) || [];

    const [kpiResult, modulesResult, parcoursResult] = await Promise.all([
      supabase.from("kpi_scores").select("*").eq("company_id", companyId).order("scored_at", { ascending: false }).limit(100),
      employeeIds.length > 0
        ? supabase.from("module_progress").select("id", { count: "exact" }).eq("status", "validated").in("user_id", employeeIds)
        : Promise.resolve({ data: null, count: 0, error: null }),
      supabase.from("assigned_parcours").select("progress").eq("company_id", companyId),
    ]);

    const kpiData = (kpiResult.data as KpiScore[] | null) || [];
    const avgKpi = (field: "investissement" | "efficacite" | "participation") => {
      if (kpiData.length === 0) return 0;
      return Math.round(kpiData.reduce((sum, k) => sum + k[field], 0) / kpiData.length * 10) / 10;
    };

    const parcoursData = (parcoursResult.data as { progress: number }[] | null) || [];
    const avgParcoursProgress = parcoursData.length > 0
      ? Math.round(parcoursData.reduce((sum, p) => sum + p.progress, 0) / parcoursData.length)
      : 0;

    return {
      data: {
        employeeCount: employeeIds.length,
        avgKpiInvestissement: avgKpi("investissement"),
        avgKpiEfficacite: avgKpi("efficacite"),
        avgKpiParticipation: avgKpi("participation"),
        modulesCompleted: modulesResult.count || 0,
        parcoursProgress: avgParcoursProgress,
      },
      error: null,
    };
  }, [companyId]);
}

// ============================================================
// MUTATIONS — Insert/Update operations for admin CRUD
// ============================================================

export async function insertProfile(data: {
  email: string;
  first_name: string;
  last_name: string;
  role: "coachee" | "salarie" | "dirigeant" | "intervenant";
  company_id?: string;
  coaching_type?: "individuel" | "entreprise";
}) {
  const supabase = createUntypedClient();
  const id = crypto.randomUUID();
  const { data: result, error } = await supabase
    .from("profiles")
    .insert({
      id,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      role: data.role,
      company_id: data.company_id || null,
      coaching_type: data.coaching_type || null,
      status: "active",
      onboarding_completed: false,
    })
    .select()
    .single();
  return { data: result as Profile | null, error };
}

export async function insertKpiScore(data: {
  user_id: string;
  company_id?: string;
  investissement: number;
  efficacite: number;
  participation: number;
  notes?: string;
}) {
  const supabase = createUntypedClient();
  const { data: result, error } = await supabase
    .from("kpi_scores")
    .insert({
      user_id: data.user_id,
      company_id: data.company_id || null,
      investissement: data.investissement,
      efficacite: data.efficacite,
      participation: data.participation,
      notes: data.notes || null,
      scored_at: new Date().toISOString(),
    })
    .select()
    .single();
  return { data: result as KpiScore | null, error };
}

export async function insertModuleProgress(data: {
  user_id: string;
  module_id: string;
}) {
  const supabase = createUntypedClient();
  const { data: result, error } = await supabase
    .from("module_progress")
    .insert({
      user_id: data.user_id,
      module_id: data.module_id,
      status: "not_started",
    })
    .select()
    .single();
  return { data: result as ModuleProgress | null, error };
}

export async function insertGroup(data: {
  name: string;
  type: "entreprise" | "coaching_individuel" | "general";
  created_by: string;
  company_id?: string;
}) {
  const supabase = createUntypedClient();
  const { data: result, error } = await supabase
    .from("groups")
    .insert({
      name: data.name,
      type: data.type,
      created_by: data.created_by,
      company_id: data.company_id || null,
      is_active: true,
    })
    .select()
    .single();
  return { data: result as Group | null, error };
}

export async function insertMessage(data: {
  sender_id: string;
  content: string;
  group_id?: string;
  recipient_id?: string;
}) {
  const supabase = createUntypedClient();
  const { data: result, error } = await supabase
    .from("messages")
    .insert({
      sender_id: data.sender_id,
      content: data.content,
      group_id: data.group_id || null,
      recipient_id: data.recipient_id || null,
      is_pinned: false,
    })
    .select()
    .single();
  return { data: result as Message | null, error };
}

export async function upsertModule(data: {
  id?: string;
  title: string;
  description?: string;
  content: Record<string, unknown>;
  exercise?: Record<string, unknown>;
  order_index: number;
  parcours_type: "individuel" | "entreprise" | "les_deux";
  price_cents: number;
  is_free?: boolean;
  duration_minutes?: number;
}) {
  const supabase = createUntypedClient();
  const payload = {
    title: data.title,
    description: data.description || null,
    content: data.content,
    exercise: data.exercise || null,
    order_index: data.order_index,
    parcours_type: data.parcours_type,
    price_cents: data.price_cents,
    is_free: data.is_free ?? data.price_cents === 0,
    duration_minutes: data.duration_minutes || null,
  };

  if (data.id) {
    const { data: result, error } = await supabase
      .from("modules")
      .update(payload)
      .eq("id", data.id)
      .select()
      .single();
    return { data: result as Module | null, error };
  } else {
    const { data: result, error } = await supabase
      .from("modules")
      .insert(payload)
      .select()
      .single();
    return { data: result as Module | null, error };
  }
}

export async function updateAppointmentStatus(
  id: string,
  status: "scheduled" | "completed" | "cancelled" | "no_show"
) {
  const supabase = createUntypedClient();
  const { data: result, error } = await supabase
    .from("appointments")
    .update({ status })
    .eq("id", id)
    .select()
    .single();
  return { data: result as Appointment | null, error };
}
