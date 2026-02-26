import { FileText } from "lucide-react";

export default function DirigeantRapportsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <FileText className="w-6 h-6 text-accent" />
        <h1 className="font-heading text-2xl font-bold text-dark">Rapports</h1>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500">
          Les rapports seront bientot disponibles.
        </p>
      </div>
    </div>
  );
}
