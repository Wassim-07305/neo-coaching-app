import { BookOpen } from "lucide-react";

export default async function CoachingModuleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <BookOpen className="w-6 h-6 text-accent" />
        <h1 className="font-heading text-xl font-bold text-dark">
          Detail Module
        </h1>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500">
          Le contenu du module ({id}) sera bientot disponible.
        </p>
      </div>
    </div>
  );
}
