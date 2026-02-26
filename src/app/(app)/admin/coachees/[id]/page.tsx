import { Users } from "lucide-react";

export default async function CoacheeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Users className="w-6 h-6 text-accent" />
        <h1 className="font-heading text-2xl font-bold text-dark">
          Detail Coachee
        </h1>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500">
          Les details du coachee ({id}) seront bientot disponibles.
        </p>
      </div>
    </div>
  );
}
