import { Calendar } from "lucide-react";

export default function RdvPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Calendar className="w-6 h-6 text-accent" />
        <h1 className="font-heading text-2xl font-bold text-dark">
          RDV / Booking
        </h1>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500">
          La gestion des rendez-vous sera bientot disponible.
        </p>
      </div>
    </div>
  );
}
