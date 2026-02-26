import { Building2, Plus } from "lucide-react";
import { CompanyList } from "@/components/admin/company-list";
import { mockCompanies } from "@/lib/mock-data";

// Replace with Supabase query when ready
function getCompaniesData() {
  return mockCompanies;
}

export default function EntreprisesPage() {
  const companies = getCompaniesData();

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Building2 className="w-6 h-6 text-accent" />
          <h1 className="font-heading text-2xl font-bold text-dark">
            Entreprises
          </h1>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          Ajouter une entreprise
        </button>
      </div>

      {/* Company list */}
      <CompanyList companies={companies} />
    </div>
  );
}
