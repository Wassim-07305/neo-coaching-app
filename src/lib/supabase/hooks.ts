"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import * as queries from "./queries";

// ─── Generic fetch hook ──────────────────────────────────────

interface UseQueryResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

function useQuery<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = []
): UseQueryResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

// ─── Profile ─────────────────────────────────────────────────

export function useProfile() {
  const { user } = useAuth();
  return useQuery(
    () => (user ? queries.getProfile(user.id) : Promise.resolve(null)),
    [user?.id]
  );
}

// ─── Coachees ────────────────────────────────────────────────

export function useCoachees() {
  return useQuery(() => queries.getCoachees(), []);
}

export function useCoacheesByCompany(companyId: string | null) {
  return useQuery(
    () => (companyId ? queries.getCoacheesByCompany(companyId) : Promise.resolve([])),
    [companyId]
  );
}

// ─── Companies ───────────────────────────────────────────────

export function useCompanies() {
  return useQuery(() => queries.getCompanies(), []);
}

export function useCompany(id: string | null) {
  return useQuery(
    () => (id ? queries.getCompany(id) : Promise.resolve(null)),
    [id]
  );
}

// ─── Modules ─────────────────────────────────────────────────

export function useModules() {
  return useQuery(() => queries.getModules(), []);
}

export function useModule(id: string | null) {
  return useQuery(
    () => (id ? queries.getModule(id) : Promise.resolve(null)),
    [id]
  );
}

// ─── Module Progress ─────────────────────────────────────────

export function useMyModuleProgress() {
  const { user } = useAuth();
  return useQuery(
    () => (user ? queries.getUserModuleProgress(user.id) : Promise.resolve([])),
    [user?.id]
  );
}

// ─── KPIs ────────────────────────────────────────────────────

export function useLatestKpi(userId?: string) {
  const { user } = useAuth();
  const id = userId || user?.id;
  return useQuery(
    () => (id ? queries.getLatestKpi(id) : Promise.resolve(null)),
    [id]
  );
}

export function useKpiHistory(userId?: string, limit = 12) {
  const { user } = useAuth();
  const id = userId || user?.id;
  return useQuery(
    () => (id ? queries.getKpiHistory(id, limit) : Promise.resolve([])),
    [id, limit]
  );
}

// ─── Appointments ────────────────────────────────────────────

export function useUpcomingAppointments() {
  const { user } = useAuth();
  return useQuery(
    () => queries.getUpcomingAppointments(user?.id),
    [user?.id]
  );
}

export function useMyAppointments() {
  const { user } = useAuth();
  return useQuery(
    () => (user ? queries.getUserAppointments(user.id) : Promise.resolve([])),
    [user?.id]
  );
}

// ─── Groups & Messages ──────────────────────────────────────

export function useMyGroups() {
  const { user } = useAuth();
  return useQuery(
    () => (user ? queries.getUserGroups(user.id) : Promise.resolve([])),
    [user?.id]
  );
}

export function useGroupMessages(groupId: string | null) {
  return useQuery(
    () => (groupId ? queries.getGroupMessages(groupId) : Promise.resolve([])),
    [groupId]
  );
}

// ─── Notifications ───────────────────────────────────────────

export function useNotifications() {
  const { user } = useAuth();
  return useQuery(
    () => (user ? queries.getUserNotifications(user.id) : Promise.resolve([])),
    [user?.id]
  );
}

// ─── Tasks ───────────────────────────────────────────────────

export function useMyTasks() {
  const { user } = useAuth();
  return useQuery(
    () => (user ? queries.getUserTasks(user.id) : Promise.resolve([])),
    [user?.id]
  );
}

// ─── Dashboard Stats ─────────────────────────────────────────

export function useAdminDashboardStats() {
  return useQuery(() => queries.getAdminDashboardStats(), []);
}

// ─── Booking Funnel ──────────────────────────────────────────

export function useBookingSubmissions() {
  return useQuery(() => queries.getBookingSubmissions(), []);
}
