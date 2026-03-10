"use client";

import { useState, useCallback } from "react";
import { createUntypedClient } from "@/lib/supabase/client";
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
  Questionnaire,
  QuestionnaireQuestion,
  QuestionnaireResponse,
  ParcoursTemplate,
  AssignedParcours,
  ParcoursModule,
  CalendlySettings,
} from "@/lib/supabase/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

// Generic mutation hook
function useMutation<TInput, TOutput>(
  mutationFn: (input: TInput) => Promise<{ data: TOutput | null; error: Error | null }>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async (input: TInput): Promise<TOutput | null> => {
      setLoading(true);
      setError(null);
      const { data, error } = await mutationFn(input);
      setError(error);
      setLoading(false);
      return data;
    },
    [mutationFn]
  );

  return { mutate, loading, error };
}

// ============================================================================
// PROFILES
// ============================================================================

export function useUpdateProfile() {
  const supabase = createUntypedClient();

  return useMutation<{ id: string; data: Partial<Profile> }, Profile>(async ({ id, data }) => {
    const { data: result, error } = await supabase
      .from("profiles")
      .update(data as AnyRecord)
      .eq("id", id)
      .select()
      .single();
    return { data: result as Profile | null, error };
  });
}

// ============================================================================
// COMPANIES
// ============================================================================

export function useCreateCompany() {
  const supabase = createUntypedClient();

  return useMutation<Partial<Company> & { name: string }, Company>(async (input) => {
    const { data, error } = await supabase
      .from("companies")
      .insert(input as AnyRecord)
      .select()
      .single();
    return { data: data as Company | null, error };
  });
}

export function useUpdateCompany() {
  const supabase = createUntypedClient();

  return useMutation<{ id: string; data: Partial<Company> }, Company>(async ({ id, data }) => {
    const { data: result, error } = await supabase
      .from("companies")
      .update(data as AnyRecord)
      .eq("id", id)
      .select()
      .single();
    return { data: result as Company | null, error };
  });
}

// ============================================================================
// MODULES
// ============================================================================

export function useCreateModule() {
  const supabase = createUntypedClient();

  return useMutation<Partial<Module> & { title: string }, Module>(async (input) => {
    const { data, error } = await supabase
      .from("modules")
      .insert(input as AnyRecord)
      .select()
      .single();
    return { data: data as Module | null, error };
  });
}

export function useUpdateModule() {
  const supabase = createUntypedClient();

  return useMutation<{ id: string; data: Partial<Module> }, Module>(async ({ id, data }) => {
    const { data: result, error } = await supabase
      .from("modules")
      .update(data as AnyRecord)
      .eq("id", id)
      .select()
      .single();
    return { data: result as Module | null, error };
  });
}

export function useDeleteModule() {
  const supabase = createUntypedClient();

  return useMutation<string, null>(async (id) => {
    const { error } = await supabase.from("modules").delete().eq("id", id);
    return { data: null, error };
  });
}

// ============================================================================
// MODULE PROGRESS
// ============================================================================

export function useCreateModuleProgress() {
  const supabase = createUntypedClient();

  return useMutation<Partial<ModuleProgress> & { user_id: string; module_id: string }, ModuleProgress>(async (input) => {
    const { data, error } = await supabase
      .from("module_progress")
      .insert(input as AnyRecord)
      .select()
      .single();
    return { data: data as ModuleProgress | null, error };
  });
}

export function useUpdateModuleProgress() {
  const supabase = createUntypedClient();

  return useMutation<{ id: string; data: Partial<ModuleProgress> }, ModuleProgress>(async ({ id, data }) => {
    const { data: result, error } = await supabase
      .from("module_progress")
      .update(data as AnyRecord)
      .eq("id", id)
      .select()
      .single();
    return { data: result as ModuleProgress | null, error };
  });
}

// ============================================================================
// KPI SCORES
// ============================================================================

export function useCreateKpiScore() {
  const supabase = createUntypedClient();

  return useMutation<Partial<KpiScore> & { user_id: string; scored_at: string }, KpiScore>(async (input) => {
    const { data, error } = await supabase
      .from("kpi_scores")
      .insert(input as AnyRecord)
      .select()
      .single();
    return { data: data as KpiScore | null, error };
  });
}

// ============================================================================
// APPOINTMENTS
// ============================================================================

export function useCreateAppointment() {
  const supabase = createUntypedClient();

  return useMutation<Partial<Appointment> & { coach_id: string; datetime_start: string; datetime_end: string; type: string }, Appointment>(async (input) => {
    const { data, error } = await supabase
      .from("appointments")
      .insert(input as AnyRecord)
      .select()
      .single();
    return { data: data as Appointment | null, error };
  });
}

export function useUpdateAppointment() {
  const supabase = createUntypedClient();

  return useMutation<{ id: string; data: Partial<Appointment> }, Appointment>(async ({ id, data }) => {
    const { data: result, error } = await supabase
      .from("appointments")
      .update(data as AnyRecord)
      .eq("id", id)
      .select()
      .single();
    return { data: result as Appointment | null, error };
  });
}

// ============================================================================
// GROUPS & MESSAGES
// ============================================================================

export function useCreateGroup() {
  const supabase = createUntypedClient();

  return useMutation<Partial<Group> & { name: string; type: string; created_by: string }, Group>(async (input) => {
    const { data, error } = await supabase
      .from("groups")
      .insert(input as AnyRecord)
      .select()
      .single();
    return { data: data as Group | null, error };
  });
}

export function useAddGroupMember() {
  const supabase = createUntypedClient();

  return useMutation<{ group_id: string; user_id: string }, null>(async ({ group_id, user_id }) => {
    const { error } = await supabase
      .from("group_members")
      .insert({ group_id, user_id } as AnyRecord);
    return { data: null, error };
  });
}

export function useSendMessage() {
  const supabase = createUntypedClient();

  return useMutation<Partial<Message> & { sender_id: string; content: string }, Message>(async (input) => {
    const { data, error } = await supabase
      .from("messages")
      .insert(input as AnyRecord)
      .select()
      .single();
    return { data: data as Message | null, error };
  });
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export function useMarkNotificationRead() {
  const supabase = createUntypedClient();

  return useMutation<string, Notification>(async (id) => {
    const { data, error } = await supabase
      .from("notifications")
      .update({ is_read: true } as AnyRecord)
      .eq("id", id)
      .select()
      .single();
    return { data: data as Notification | null, error };
  });
}

export function useMarkAllNotificationsRead() {
  const supabase = createUntypedClient();

  return useMutation<string, null>(async (userId) => {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true } as AnyRecord)
      .eq("user_id", userId)
      .eq("is_read", false);
    return { data: null, error };
  });
}

// ============================================================================
// TASKS
// ============================================================================

export function useCreateTask() {
  const supabase = createUntypedClient();

  return useMutation<Partial<Task> & { user_id: string; title: string }, Task>(async (input) => {
    const { data, error } = await supabase
      .from("tasks")
      .insert(input as AnyRecord)
      .select()
      .single();
    return { data: data as Task | null, error };
  });
}

export function useUpdateTask() {
  const supabase = createUntypedClient();

  return useMutation<{ id: string; data: Partial<Task> }, Task>(async ({ id, data }) => {
    const { data: result, error } = await supabase
      .from("tasks")
      .update(data as AnyRecord)
      .eq("id", id)
      .select()
      .single();
    return { data: result as Task | null, error };
  });
}

export function useCompleteTask() {
  const supabase = createUntypedClient();

  return useMutation<string, Task>(async (id) => {
    const { data, error } = await supabase
      .from("tasks")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
      } as AnyRecord)
      .eq("id", id)
      .select()
      .single();
    return { data: data as Task | null, error };
  });
}

// ============================================================================
// QUESTIONNAIRES
// ============================================================================

export function useCreateQuestionnaire() {
  const supabase = createUntypedClient();

  return useMutation<Partial<Questionnaire> & { title: string; phase: string }, Questionnaire>(async (input) => {
    const { data, error } = await supabase
      .from("questionnaires")
      .insert(input as AnyRecord)
      .select()
      .single();
    return { data: data as Questionnaire | null, error };
  });
}

export function useUpdateQuestionnaire() {
  const supabase = createUntypedClient();

  return useMutation<{ id: string; data: Partial<Questionnaire> }, Questionnaire>(async ({ id, data }) => {
    const { data: result, error } = await supabase
      .from("questionnaires")
      .update(data as AnyRecord)
      .eq("id", id)
      .select()
      .single();
    return { data: result as Questionnaire | null, error };
  });
}

export function useCreateQuestionnaireQuestion() {
  const supabase = createUntypedClient();

  return useMutation<Partial<QuestionnaireQuestion> & { questionnaire_id: string; label: string; type: string }, QuestionnaireQuestion>(
    async (input) => {
      const { data, error } = await supabase
        .from("questionnaire_questions")
        .insert(input as AnyRecord)
        .select()
        .single();
      return { data: data as QuestionnaireQuestion | null, error };
    }
  );
}

export function useSubmitQuestionnaireResponse() {
  const supabase = createUntypedClient();

  return useMutation<
    { questionnaire_id: string; user_id: string; answers: Record<string, string | number>; module_progress_id?: string },
    QuestionnaireResponse
  >(async (input) => {
    const { data, error } = await supabase
      .from("questionnaire_responses")
      .insert({
        questionnaire_id: input.questionnaire_id,
        user_id: input.user_id,
        answers: input.answers,
        module_progress_id: input.module_progress_id,
        submitted_at: new Date().toISOString(),
      } as AnyRecord)
      .select()
      .single();
    return { data: data as QuestionnaireResponse | null, error };
  });
}

// ============================================================================
// PARCOURS
// ============================================================================

export function useCreateParcoursTemplate() {
  const supabase = createUntypedClient();

  return useMutation<Partial<ParcoursTemplate> & { title: string; category: string; created_by: string }, ParcoursTemplate>(async (input) => {
    const { data, error } = await supabase
      .from("parcours_templates")
      .insert(input as AnyRecord)
      .select()
      .single();
    return { data: data as ParcoursTemplate | null, error };
  });
}

export function useAssignParcours() {
  const supabase = createUntypedClient();

  return useMutation<
    {
      template_id?: string;
      title: string;
      description?: string;
      assigned_to: string;
      assigned_by: string;
      company_id?: string;
      start_date: string;
      end_date: string;
      modules: { module_id: string; deadline?: string }[];
    },
    AssignedParcours
  >(async (input) => {
    // Create the assigned parcours
    const { data: parcours, error: parcoursError } = await supabase
      .from("assigned_parcours")
      .insert({
        template_id: input.template_id,
        title: input.title,
        description: input.description,
        assigned_to: input.assigned_to,
        assigned_by: input.assigned_by,
        company_id: input.company_id,
        start_date: input.start_date,
        end_date: input.end_date,
        status: "not_started",
        progress: 0,
      } as AnyRecord)
      .select()
      .single();

    if (parcoursError || !parcours) return { data: null, error: parcoursError };

    const parcoursData = parcours as AssignedParcours;

    // Create the parcours modules
    const modulesInsert = input.modules.map((m, index) => ({
      parcours_id: parcoursData.id,
      module_id: m.module_id,
      order_index: index,
      deadline: m.deadline,
      status: index === 0 ? "available" : "locked",
    }));

    const { error: modulesError } = await supabase
      .from("parcours_modules")
      .insert(modulesInsert as AnyRecord[]);

    if (modulesError) return { data: null, error: modulesError };

    return { data: parcoursData, error: null };
  });
}

export function useUpdateAssignedParcours() {
  const supabase = createUntypedClient();

  return useMutation<{ id: string; data: Partial<AssignedParcours> }, AssignedParcours>(async ({ id, data }) => {
    const { data: result, error } = await supabase
      .from("assigned_parcours")
      .update(data as AnyRecord)
      .eq("id", id)
      .select()
      .single();
    return { data: result as AssignedParcours | null, error };
  });
}

export function useUpdateParcoursModule() {
  const supabase = createUntypedClient();

  return useMutation<{ id: string; data: Partial<ParcoursModule> }, ParcoursModule>(async ({ id, data }) => {
    const { data: result, error } = await supabase
      .from("parcours_modules")
      .update(data as AnyRecord)
      .eq("id", id)
      .select()
      .single();
    return { data: result as ParcoursModule | null, error };
  });
}

// ============================================================================
// CALENDLY
// ============================================================================

export function useSaveCalendlySettings() {
  const supabase = createUntypedClient();

  return useMutation<Partial<CalendlySettings> & { user_id: string; calendly_url: string }, CalendlySettings>(async (input) => {
    const { data, error } = await supabase
      .from("calendly_settings")
      .upsert(input as AnyRecord, { onConflict: "user_id" })
      .select()
      .single();
    return { data: data as CalendlySettings | null, error };
  });
}

// ============================================================================
// INVITATIONS (for company employees)
// ============================================================================

export function useInviteEmployee() {
  const supabase = createUntypedClient();

  return useMutation<
    { email: string; first_name: string; last_name: string; company_id: string },
    { success: boolean }
  >(async (input) => {
    // Create the user via Supabase Auth admin API (this should be done via Edge Function in production)
    // For now, we'll create a profile entry and send an invite email
    const { error } = await supabase.auth.signInWithOtp({
      email: input.email,
      options: {
        data: {
          first_name: input.first_name,
          last_name: input.last_name,
          role: "salarie",
          company_id: input.company_id,
        },
      },
    });

    if (error) return { data: null, error };

    return { data: { success: true }, error: null };
  });
}
