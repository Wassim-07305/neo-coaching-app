"use client";

import { useState, useMemo } from "react";
import { BookOpen, Plus, Loader2 } from "lucide-react";
import { ModuleList } from "@/components/admin/module-list";
import { ModuleForm } from "@/components/admin/module-form";
import { useModules, useModuleProgress } from "@/hooks/use-supabase-data";
import { mockModules } from "@/lib/mock-data";
import type { MockModule } from "@/lib/mock-data";

export default function ModulesPage() {
  // Fetch real data from Supabase
  const { data: supabaseModules, loading } = useModules();
  const { data: allModuleProgress } = useModuleProgress();

  // Count enrollments per module from module_progress
  const enrollmentCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    if (allModuleProgress) {
      for (const mp of allModuleProgress) {
        counts[mp.module_id] = (counts[mp.module_id] || 0) + 1;
      }
    }
    return counts;
  }, [allModuleProgress]);

  // Transform Supabase data to match MockModule structure
  const modules = useMemo((): MockModule[] => {
    if (supabaseModules && supabaseModules.length > 0) {
      return supabaseModules.map((m) => ({
        id: m.id,
        title: m.title,
        description: m.description || "",
        content_summary: m.description || "",
        price: m.price_cents / 100,
        duration_weeks: m.duration_minutes ? Math.round(m.duration_minutes / 60 / 40) || 1 : 1,
        order_index: m.order_index,
        parcours_type: m.parcours_type,
        enrolled_count: enrollmentCounts[m.id] || 0,
        exercise_json: JSON.stringify(m.exercise || {}),
      }));
    }
    return mockModules;
  }, [supabaseModules, enrollmentCounts]);

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

  if (loading) {
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
