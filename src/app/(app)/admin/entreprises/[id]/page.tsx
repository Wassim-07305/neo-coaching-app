"use client";

import { use } from "react";
import { CompanyDetail } from "@/components/admin/company-detail";
import { mockCompanies } from "@/lib/mock-data";

// Replace with Supabase query when ready
function getCompanyData(id: string) {
  return mockCompanies.find((c) => c.id === id) || null;
}

export default function EntrepriseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const company = getCompanyData(id);

  if (!company) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-gray-500">Entreprise introuvable.</p>
      </div>
    );
  }

  return <CompanyDetail company={company} />;
}
