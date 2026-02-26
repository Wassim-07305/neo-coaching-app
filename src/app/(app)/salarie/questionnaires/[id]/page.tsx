import { FileText } from "lucide-react";

export default async function SalarieQuestionnairePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <FileText className="w-6 h-6 text-accent" />
        <h1 className="font-heading text-xl font-bold text-dark">
          Questionnaire
        </h1>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500">
          Le questionnaire ({id}) sera bientot disponible.
        </p>
      </div>
    </div>
  );
}
