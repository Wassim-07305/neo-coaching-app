import { BookOpen } from "lucide-react";

export default function CoachingModulesPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <BookOpen className="w-6 h-6 text-accent" />
        <h1 className="font-heading text-xl font-bold text-dark">
          Mes Modules
        </h1>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500">
          Vos modules de coaching seront bientot disponibles.
        </p>
      </div>
    </div>
  );
}
