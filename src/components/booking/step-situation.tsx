"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { situationSchema, type SituationData } from "@/lib/validations/booking";
import { Briefcase, Building, MessageSquare } from "lucide-react";

interface StepSituationProps {
  data: Partial<SituationData>;
  onNext: (data: SituationData) => void;
  onPrev: () => void;
}

export function StepSituation({ data, onNext, onPrev }: StepSituationProps) {
  const {
    register,
    handleSubmit,
  } = useForm<SituationData>({
    resolver: zodResolver(situationSchema),
    defaultValues: {
      poste_actuel: data.poste_actuel ?? "",
      entreprise: data.entreprise ?? "",
      problematique: data.problematique ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5">
      <div>
        <h3 className="font-heading text-xl font-bold text-dark mb-1">
          Situation actuelle
        </h3>
        <p className="text-gray-500 text-sm mb-6">
          Aidez-nous a mieux comprendre votre contexte professionnel.
        </p>
      </div>

      {/* Poste actuel */}
      <div>
        <label htmlFor="poste_actuel" className="block text-sm font-medium text-gray-700 mb-1.5">
          Poste actuel
        </label>
        <div className="relative">
          <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            id="poste_actuel"
            type="text"
            {...register("poste_actuel")}
            className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
            placeholder="Ex: Directrice commerciale"
          />
        </div>
      </div>

      {/* Entreprise */}
      <div>
        <label htmlFor="entreprise" className="block text-sm font-medium text-gray-700 mb-1.5">
          Entreprise
        </label>
        <div className="relative">
          <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            id="entreprise"
            type="text"
            {...register("entreprise")}
            className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
            placeholder="Nom de votre entreprise"
          />
        </div>
      </div>

      {/* Problematique */}
      <div>
        <label htmlFor="problematique" className="block text-sm font-medium text-gray-700 mb-1.5">
          Problematique principale
        </label>
        <div className="relative">
          <MessageSquare className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
          <textarea
            id="problematique"
            {...register("problematique")}
            rows={4}
            className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors resize-none"
            placeholder="Decrivez en quelques mots votre situation actuelle et ce que vous aimeriez changer"
          />
        </div>
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
