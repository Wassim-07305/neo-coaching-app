import { LayoutDashboard } from "lucide-react";

export default function SalarieDashboardPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <LayoutDashboard className="w-6 h-6 text-accent" />
        <h1 className="font-heading text-xl font-bold text-dark">
          Mon Espace
        </h1>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500">
          Votre tableau de bord sera bientot disponible.
        </p>
      </div>
    </div>
  );
}
