import { Building2 } from "lucide-react";

export default async function EntrepriseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Building2 className="w-6 h-6 text-accent" />
        <h1 className="font-heading text-2xl font-bold text-dark">
          Detail Entreprise
        </h1>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500">
          Les details de l&apos;entreprise ({id}) seront bientot disponibles.
        </p>
      </div>
    </div>
  );
}
