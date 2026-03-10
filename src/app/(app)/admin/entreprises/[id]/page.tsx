"use client";

import { use, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { CompanyDetail } from "@/components/admin/company-detail";
import { useCompany, useProfiles } from "@/hooks/use-supabase-data";
import { mockCompanies } from "@/lib/mock-data";

export default function EntrepriseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  // Fetch real data from Supabase
  const { data: supabaseCompany, loading: companyLoading } = useCompany(id);
  const { data: profiles } = useProfiles({ company_id: id });

  // Fallback mock company
  const mockCompany = mockCompanies.find((c) => c.id === id);

  // Transform Supabase data to match component props
  const company = useMemo(() => {
    if (supabaseCompany) {
      const employeeCount = profiles?.filter((p) => p.company_id === supabaseCompany.id).length || 0;

      return {
        id: supabaseCompany.id,
        name: supabaseCompany.name,
        dirigeant_name: "",
        dirigeant_email: "",
        employee_count: employeeCount,
        mission_start: supabaseCompany.mission_start_date || "",
        mission_end: supabaseCompany.mission_end_date || "",
        mission_status: supabaseCompany.mission_status,
        objectives: [] as string[],
        logo_placeholder: supabaseCompany.name.substring(0, 2).toUpperCase(),
      };
    }
    return mockCompany;
  }, [supabaseCompany, profiles, mockCompany]);

  if (companyLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-gray-500">Entreprise introuvable.</p>
      </div>
    );
  }

  return <CompanyDetail company={company} />;
}
