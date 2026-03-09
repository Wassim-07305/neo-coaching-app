"use client";

import { useRouter } from "next/navigation";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { useToast } from "@/components/ui/toast";
import { mockModules } from "@/lib/mock-data";

const onboardingModules = mockModules.slice(0, 3).map((m) => ({
  id: m.id,
  title: m.title,
  description: m.description,
}));

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleComplete = () => {
    toast("Bienvenue sur Neo-Coaching ! Votre espace est pret.", "success");
    router.push("/salarie/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A1628] px-4 py-8">
      <OnboardingWizard
        firstName="Marie"
        modules={onboardingModules}
        onComplete={handleComplete}
      />
    </div>
  );
}
