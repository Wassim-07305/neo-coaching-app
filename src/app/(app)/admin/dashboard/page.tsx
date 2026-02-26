import { LayoutDashboard } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <LayoutDashboard className="w-6 h-6 text-accent" />
        <h1 className="font-heading text-2xl font-bold text-dark">
          Dashboard Admin
        </h1>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500">
          Le tableau de bord admin sera bientot disponible.
        </p>
      </div>
    </div>
  );
}
