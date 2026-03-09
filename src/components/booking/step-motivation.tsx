"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motivationSchema, type MotivationData } from "@/lib/validations/booking";
import { cn } from "@/lib/utils";

const budgetOptions = [
  "Moins de 500\u20AC",
  "500-1000\u20AC",
  "1000-2000\u20AC",
  "Plus de 2000\u20AC",
];

interface StepMotivationProps {
  data: Partial<MotivationData>;
  onNext: (data: MotivationData) => void;
  onPrev: () => void;
}

export function StepMotivation({ data, onNext, onPrev }: StepMotivationProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<MotivationData>({
    resolver: zodResolver(motivationSchema),
    defaultValues: {
      motivation_level: data.motivation_level ?? 5,
      objectifs: data.objectifs ?? "",
      budget: data.budget ?? "",
    },
  });

  const motivationLevel = watch("motivation_level");

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5">
      <div>
        <h3 className="font-heading text-xl font-bold text-dark mb-1">
          Motivation et objectifs
        </h3>
        <p className="text-gray-500 text-sm mb-6">
          Parlez-nous de vos ambitions et de votre niveau de motivation.
        </p>
      </div>

      {/* Motivation level slider */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Niveau de motivation : <span className="text-accent font-bold">{motivationLevel}/10</span>
        </label>
        <Controller
          name="motivation_level"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <input
                type="range"
                min={1}
                max={10}
                value={field.value}
                onChange={(e) => field.onChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>1</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>
          )}
        />
      </div>

      {/* Objectifs */}
      <div>
        <label htmlFor="objectifs" className="block text-sm font-medium text-gray-700 mb-1.5">
          Quels sont vos 3 objectifs principaux ?
        </label>
        <textarea
          id="objectifs"
          {...register("objectifs")}
          rows={4}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors resize-none"
          placeholder="Ex: 1. Prendre confiance en moi&#10;2. Apprendre a deleguer&#10;3. Ameliorer ma prise de parole"
        />
      </div>

      {/* Budget */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Budget envisage *
        </label>
        <div className="grid grid-cols-2 gap-3">
          {budgetOptions.map((option) => (
            <label
              key={option}
              className={cn(
                "flex items-center justify-center rounded-lg border-2 py-3 px-4 text-sm font-medium cursor-pointer transition-all text-center",
                watch("budget") === option
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
              )}
            >
              <input
                type="radio"
                value={option}
                {...register("budget")}
                className="sr-only"
              />
              {option}
            </label>
          ))}
        </div>
        {errors.budget && (
          <p className="text-danger text-xs mt-1">{errors.budget.message}</p>
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
