"use client";

import { useState } from "react";
import {
  Sparkles,
  User,
  BookOpen,
  Rocket,
  ChevronRight,
  ChevronLeft,
  Check,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingModule {
  id: string;
  title: string;
  description: string;
}

interface OnboardingWizardProps {
  firstName: string;
  modules: OnboardingModule[];
  onComplete: () => void;
}

const steps = [
  { label: "Bienvenue", icon: Sparkles },
  { label: "Profil", icon: User },
  { label: "Modules", icon: BookOpen },
  { label: "C'est parti", icon: Rocket },
];

export function OnboardingWizard({
  firstName,
  modules,
  onComplete,
}: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const next = () => {
    if (currentStep < steps.length - 1) setCurrentStep((s) => s + 1);
  };
  const prev = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  return (
    <div className="mx-auto w-full max-w-lg">
      {/* Progress indicator */}
      <div className="mb-8 flex items-center justify-center gap-2">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300",
                i < currentStep
                  ? "bg-[#2D8C4E] text-white"
                  : i === currentStep
                    ? "bg-[#D4A843] text-white scale-110"
                    : "bg-white/10 text-gray-500"
              )}
            >
              {i < currentStep ? (
                <Check className="h-4 w-4" />
              ) : (
                <step.icon className="h-4 w-4" />
              )}
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-8 transition-colors duration-300",
                  i < currentStep ? "bg-[#2D8C4E]" : "bg-white/10"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="min-h-[320px]">
        {currentStep === 0 && (
          <div className="space-y-6 text-center animate-in fade-in duration-300">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#2D8C4E] text-2xl font-bold text-white">
              NC
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold text-white">
                Bienvenue, {firstName} !
              </h2>
              <p className="mt-2 text-gray-400 leading-relaxed">
                Neo-Coaching est votre espace de developpement personnel et
                professionnel. Decouvrez vos modules, suivez vos KPIs et
                echangez avec la communaute.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { icon: BookOpen, label: "Modules\ninteractifs" },
                { icon: Calendar, label: "Rendez-vous\npersonnalises" },
                { icon: Sparkles, label: "Suivi\nKPIs" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl bg-white/5 p-3 border border-white/10"
                >
                  <item.icon className="mx-auto h-6 w-6 text-[#D4A843] mb-1" />
                  <p className="text-xs text-gray-400 whitespace-pre-line">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <h2 className="font-heading text-xl font-bold text-white text-center">
              Completez votre profil
            </h2>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/10 border-2 border-dashed border-white/20">
              <User className="h-8 w-8 text-gray-500" />
            </div>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Telephone
                </label>
                <input
                  type="tel"
                  placeholder="06 12 34 56 78"
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-500 focus:border-[#D4A843] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Vos objectifs de coaching
                </label>
                <textarea
                  rows={3}
                  placeholder="Decrivez ce que vous souhaitez accomplir..."
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-500 focus:border-[#D4A843] focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <h2 className="font-heading text-xl font-bold text-white text-center">
              Vos modules assignes
            </h2>
            <p className="text-center text-sm text-gray-400">
              Voici les modules qui vous ont ete attribues
            </p>
            <div className="space-y-3">
              {modules.map((mod, i) => (
                <div
                  key={mod.id}
                  className="flex items-start gap-3 rounded-xl bg-white/5 border border-white/10 p-4"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#D4A843]/20 text-sm font-bold text-[#D4A843]">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{mod.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {mod.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6 text-center animate-in fade-in duration-300">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#2D8C4E]/20">
              <Rocket className="h-8 w-8 text-[#2D8C4E]" />
            </div>
            <h2 className="font-heading text-xl font-bold text-white">
              Vous etes pret !
            </h2>
            <div className="mx-auto max-w-sm space-y-3 text-left">
              {[
                { label: "Completer votre profil", done: true },
                { label: "Decouvrir votre premier module", done: false },
                { label: "Reserver un rendez-vous", done: false },
              ].map((task) => (
                <div
                  key={task.label}
                  className="flex items-center gap-3 rounded-lg bg-white/5 px-4 py-3 border border-white/10"
                >
                  <div
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                      task.done
                        ? "bg-[#2D8C4E]"
                        : "border border-white/20"
                    )}
                  >
                    {task.done && <Check className="h-3.5 w-3.5 text-white" />}
                  </div>
                  <span
                    className={cn(
                      "text-sm",
                      task.done ? "text-gray-400 line-through" : "text-white"
                    )}
                  >
                    {task.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        {currentStep > 0 ? (
          <button
            onClick={prev}
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Precedent
          </button>
        ) : (
          <div />
        )}

        {currentStep < steps.length - 1 ? (
          <div className="flex items-center gap-3">
            <button
              onClick={next}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Passer
            </button>
            <button
              onClick={next}
              className="flex items-center gap-2 rounded-lg bg-[#D4A843] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#c49a3a] transition-colors"
            >
              Suivant
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onComplete}
            className="flex items-center gap-2 rounded-lg bg-[#2D8C4E] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#247a42] transition-colors"
          >
            <Rocket className="h-4 w-4" />
            Commencer
          </button>
        )}
      </div>
    </div>
  );
}
