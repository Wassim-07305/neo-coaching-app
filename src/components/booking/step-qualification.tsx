"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { qualificationSchema, type QualificationData } from "@/lib/validations/booking";
import { cn } from "@/lib/utils";

const emotionOptions = ["Oui", "Non", "Partiellement"];
const coachingOptions = ["Oui", "Non"];
const typeOptions = [
  "Coaching individuel",
  "Management d'equipe",
  "Les deux",
];
const sourceOptions = ["LinkedIn", "Bouche a oreille", "Google", "Autre"];

interface StepQualificationProps {
  data: Partial<QualificationData>;
  onNext: (data: QualificationData) => void;
  onPrev: () => void;
}

export function StepQualification({ data, onNext, onPrev }: StepQualificationProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<QualificationData>({
    resolver: zodResolver(qualificationSchema),
    defaultValues: {
      connait_emotions: data.connait_emotions ?? "",
      deja_coaching: data.deja_coaching ?? "",
      type_accompagnement: data.type_accompagnement ?? "",
      source: data.source ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div>
        <h3 className="font-heading text-xl font-bold text-dark mb-1">
          Qualification
        </h3>
        <p className="text-gray-500 text-sm mb-6">
          Quelques questions pour mieux adapter notre accompagnement.
        </p>
      </div>

      {/* Emotions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Connaissez-vous les 6 emotions fondamentales ? *
        </label>
        <div className="flex flex-wrap gap-2">
          {emotionOptions.map((option) => (
            <label
              key={option}
              className={cn(
                "rounded-lg border-2 py-2 px-4 text-sm font-medium cursor-pointer transition-all",
                watch("connait_emotions") === option
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
              )}
            >
              <input
                type="radio"
                value={option}
                {...register("connait_emotions")}
                className="sr-only"
              />
              {option}
            </label>
          ))}
        </div>
        {errors.connait_emotions && (
          <p className="text-danger text-xs mt-1">{errors.connait_emotions.message}</p>
        )}
      </div>

      {/* Deja coaching */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Avez-vous deja suivi un coaching ? *
        </label>
        <div className="flex flex-wrap gap-2">
          {coachingOptions.map((option) => (
            <label
              key={option}
              className={cn(
                "rounded-lg border-2 py-2 px-4 text-sm font-medium cursor-pointer transition-all",
                watch("deja_coaching") === option
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
              )}
            >
              <input
                type="radio"
                value={option}
                {...register("deja_coaching")}
                className="sr-only"
              />
              {option}
            </label>
          ))}
        </div>
        {errors.deja_coaching && (
          <p className="text-danger text-xs mt-1">{errors.deja_coaching.message}</p>
        )}
      </div>

      {/* Type accompagnement */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Quel type d&apos;accompagnement recherchez-vous ? *
        </label>
        <div className="flex flex-col gap-2">
          {typeOptions.map((option) => (
            <label
              key={option}
              className={cn(
                "rounded-lg border-2 py-3 px-4 text-sm font-medium cursor-pointer transition-all",
                watch("type_accompagnement") === option
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
              )}
            >
              <input
                type="radio"
                value={option}
                {...register("type_accompagnement")}
                className="sr-only"
              />
              {option}
            </label>
          ))}
        </div>
        {errors.type_accompagnement && (
          <p className="text-danger text-xs mt-1">{errors.type_accompagnement.message}</p>
        )}
      </div>

      {/* Source */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Comment nous avez-vous connu ? *
        </label>
        <div className="grid grid-cols-2 gap-2">
          {sourceOptions.map((option) => (
            <label
              key={option}
              className={cn(
                "rounded-lg border-2 py-2 px-4 text-sm font-medium cursor-pointer transition-all text-center",
                watch("source") === option
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
              )}
            >
              <input
                type="radio"
                value={option}
                {...register("source")}
                className="sr-only"
              />
              {option}
            </label>
          ))}
        </div>
        {errors.source && (
          <p className="text-danger text-xs mt-1">{errors.source.message}</p>
        )}
      </div>

      {/* Navigation */}
      <div className="pt-4 flex gap-3">
        <button
          type="button"
          onClick={onPrev}
          className="flex-1 py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
        >
          Precedent
        </button>
        <button
          type="submit"
          className="flex-1 py-3 px-6 bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg transition-colors"
        >
          Suivant
        </button>
      </div>
    </form>
  );
}
