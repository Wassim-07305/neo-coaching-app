import { Users } from "lucide-react";

export default function CoacheesPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Users className="w-6 h-6 text-accent" />
        <h1 className="font-heading text-2xl font-bold text-dark">Coachees</h1>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500">
          La liste des coachees sera bientot disponible.
        </p>
      </div>
    </div>
  );
}
