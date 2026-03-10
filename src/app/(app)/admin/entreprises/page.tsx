"use client";

import { useState, useMemo } from "react";
import { Building2, Plus, Users, TrendingUp, CheckCircle, Loader2 } from "lucide-react";
import { CompanyList } from "@/components/admin/company-list";
import { CreateCompanyModal } from "@/components/admin/create-company-modal";
import { useCompanies, useProfiles } from "@/hooks/use-supabase-data";
import { mockCompanies } from "@/lib/mock-data";

export default function EntreprisesPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch real data from Supabase
  const { data: supabaseCompanies, loading: companiesLoading, refetch: refetchCompanies } = useCompanies();
  const { data: profiles } = useProfiles();

  // Transform Supabase data to match component props
  const companies = useMemo(() => {
    if (supabaseCompanies && supabaseCompanies.length > 0) {
      return supabaseCompanies.map((company) => {
        const employeeCount = profiles?.filter((p) => p.company_id === company.id).length || 0;

        return {
          id: company.id,
          name: company.name,
          dirigeant_name: "",
          dirigeant_email: "",
          employee_count: employeeCount,
          mission_start: company.mission_start_date || "",
          mission_end: company.mission_end_date || "",
          mission_status: company.mission_status,
          objectives: [] as string[],
          logo_placeholder: company.name.substring(0, 2).toUpperCase(),
        };
      });
    }
    // Fallback to mock data
    return mockCompanies;
  }, [supabaseCompanies, profiles]);

  // Stats
  const stats = {
    total: companies.length,
    active: companies.filter((c) => c.mission_status === "active").length,
    completed: companies.filter((c) => c.mission_status === "completed").length,
    totalEmployees: companies.reduce((sum, c) => sum + c.employee_count, 0),
  };

  if (companiesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Building2 className="w-6 h-6 text-accent" />
          <div>
            <h1 className="font-heading text-2xl font-bold text-dark">
              Entreprises
            </h1>
            <p className="text-sm text-gray-500">
              Gerez vos missions en entreprise
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Ajouter une entreprise
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark">{stats.total}</p>
              <p className="text-xs text-gray-500">Entreprises</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark">{stats.active}</p>
              <p className="text-xs text-gray-500">Missions actives</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark">{stats.completed}</p>
              <p className="text-xs text-gray-500">Terminees</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark">{stats.totalEmployees}</p>
              <p className="text-xs text-gray-500">Salaries</p>
            </div>
          </div>
        </div>
      </div>

      {/* Company list */}
      <CompanyList companies={companies} />

      {/* Create modal */}
      {showCreateModal && (
        <CreateCompanyModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            refetchCompanies();
          }}
        />
      )}
    </div>
  );
}
