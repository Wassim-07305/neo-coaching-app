"use client";

import { useState } from "react";
import { Building2, Plus, Upload } from "lucide-react";
import { CompanyList } from "@/components/admin/company-list";
import { CsvImport } from "@/components/admin/csv-import";
import { useCompanies } from "@/lib/supabase/hooks";
import { adaptCompany } from "@/lib/supabase/adapters";
import { mockCompanies } from "@/lib/mock-data";

export default function EntreprisesPage() {
  const { data: supaCompanies } = useCompanies();
  const companies = supaCompanies
    ? supaCompanies.map((c) => adaptCompany(c as Parameters<typeof adaptCompany>[0]))
    : mockCompanies;
  const [showImport, setShowImport] = useState(false);

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
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowImport(!showImport)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Import CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors">
            <Plus className="w-4 h-4" />
            Ajouter une entreprise
          </button>
        </div>
      </div>

      {/* CSV Import */}
      {showImport && (
        <CsvImport
          onImport={(rows) => {
            console.log("Imported:", rows);
            setShowImport(false);
          }}
        />
      )}

      {/* Company list */}
      <CompanyList companies={companies} />
    </div>
  );
}
