"use client";

import { useState } from "react";
import { BookOpen, Plus } from "lucide-react";
import { ModuleList } from "@/components/admin/module-list";
import { ModuleForm } from "@/components/admin/module-form";
import { mockModules } from "@/lib/mock-data";
import type { MockModule } from "@/lib/mock-data";

// Replace with Supabase query when ready
function getModulesData() {
  return mockModules;
}

export default function ModulesPage() {
  const modules = getModulesData();
  const [formOpen, setFormOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<MockModule | null>(null);

  function handleEdit(mod: MockModule) {
    setEditingModule(mod);
    setFormOpen(true);
  }

  function handleCreate() {
    setEditingModule(null);
    setFormOpen(true);
  }

  function handleClose() {
    setFormOpen(false);
    setEditingModule(null);
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-accent" />
          <h1 className="font-heading text-2xl font-bold text-dark">
            Modules
          </h1>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Creer un module
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Total modules</p>
          <p className="text-xl font-bold font-heading text-dark">{modules.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Inscrits total</p>
          <p className="text-xl font-bold font-heading text-dark">
            {modules.reduce((sum, m) => sum + m.enrolled_count, 0)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Prix moyen</p>
          <p className="text-xl font-bold font-heading text-dark">
            {Math.round(modules.reduce((sum, m) => sum + m.price, 0) / modules.length)} EUR
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Duree moyenne</p>
          <p className="text-xl font-bold font-heading text-dark">
            {(modules.reduce((sum, m) => sum + m.duration_weeks, 0) / modules.length).toFixed(1)} sem.
          </p>
        </div>
      </div>

      {/* Module list */}
      <ModuleList modules={modules} onEdit={handleEdit} />

      {/* Module form drawer */}
      <ModuleForm
        module={editingModule}
        isOpen={formOpen}
        onClose={handleClose}
      />
    </div>
  );
}
