"use client";

import { useState, useCallback } from "react";
import { StepPersonal } from "./step-personal";
import { StepSituation } from "./step-situation";
import { StepMotivation } from "./step-motivation";
import { StepQualification } from "./step-qualification";
import { StepCreneau } from "./step-creneau";
import { Confirmation } from "./confirmation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/toast";
import type { BookingFormData } from "@/lib/validations/booking";
import { cn } from "@/lib/utils";

const TOTAL_STEPS = 5;

const stepLabels = [
  "Informations",
  "Situation",
  "Motivation",
  "Qualification",
  "Creneau",
];

export function BookingWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<BookingFormData>>({});
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  // Save partial data to Supabase
  const savePartialData = useCallback(
    async (data: Partial<BookingFormData>, currentStep: number) => {
      try {
        const payload = {
          first_name: data.first_name || null,
          last_name: data.last_name || null,
          email: data.email || null,
          phone: data.phone || null,
          responses: data as Record<string, unknown>,
          step_reached: currentStep,
          completed: false,
          source: data.source || null,
        };

        if (submissionId) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase as any)
            .from("booking_form_submissions")
            .update(payload)
            .eq("id", submissionId);
        } else {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data: inserted } = await (supabase as any)
            .from("booking_form_submissions")
            .insert(payload)
            .select("id")
            .single();

          if (inserted) {
            setSubmissionId(inserted.id);
          }
        }
      } catch {
        // Silently fail on partial saves - don't block the user
      }
    },
    [submissionId, supabase]
  );

  // Handle step completion
  const handleStepComplete = async (stepData: Record<string, unknown>, nextStep: number) => {
    const merged = { ...formData, ...stepData };
    setFormData(merged);

    // Save partial data
    await savePartialData(merged, nextStep);

    if (nextStep > TOTAL_STEPS) {
      // Final step - mark as complete
      try {
        if (submissionId) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase as any)
            .from("booking_form_submissions")
            .update({ completed: true, step_reached: TOTAL_STEPS })
            .eq("id", submissionId);
        }
      } catch {
        // ignore
      }
      setIsComplete(true);
      toast("Votre rendez-vous a ete confirme !", "success");
    } else {
      setStep(nextStep);
    }
  };

  const handlePrev = () => {
    setStep((s) => Math.max(1, s - 1));
  };

  if (isComplete) {
    return <Confirmation data={formData as BookingFormData} />;
  }

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-500">
            Etape {step}/{TOTAL_STEPS}
          </span>
          <span className="text-sm font-medium text-accent">
            {stepLabels[step - 1]}
          </span>
        </div>

        {/* Progress track */}
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>

        {/* Step indicators */}
        <div className="flex justify-between mt-3">
          {stepLabels.map((label, index) => (
            <div
              key={label}
              className={cn(
                "flex flex-col items-center gap-1",
                index + 1 <= step ? "text-accent" : "text-gray-300"
              )}
            >
              <div
                className={cn(
                  "h-3 w-3 rounded-full border-2 transition-colors",
                  index + 1 < step
                    ? "bg-accent border-accent"
                    : index + 1 === step
                    ? "bg-white border-accent"
                    : "bg-white border-gray-200"
                )}
              />
              <span className="text-[10px] font-medium hidden sm:block">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      {step === 1 && (
        <StepPersonal
          data={formData}
          onNext={(data) => handleStepComplete(data, 2)}
        />
      )}
      {step === 2 && (
        <StepSituation
          data={formData}
          onNext={(data) => handleStepComplete(data, 3)}
          onPrev={handlePrev}
        />
      )}
      {step === 3 && (
        <StepMotivation
          data={formData}
          onNext={(data) => handleStepComplete(data, 4)}
          onPrev={handlePrev}
        />
      )}
      {step === 4 && (
        <StepQualification
          data={formData}
          onNext={(data) => handleStepComplete(data, 5)}
          onPrev={handlePrev}
        />
      )}
      {step === 5 && (
        <StepCreneau
          data={formData}
          onNext={(data) => handleStepComplete(data, 6)}
          onPrev={handlePrev}
        />
      )}
    </div>
  );
}
