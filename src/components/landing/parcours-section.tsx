import { Phone, Search, BookOpen, MessageCircle, TrendingUp } from "lucide-react";

const steps = [
  {
    number: 1,
    title: "Appel decouverte",
    description: "30 min gratuit",
    icon: Phone,
  },
  {
    number: 2,
    title: "Diagnostic personnalise",
    description: "Analyse de votre situation",
    icon: Search,
  },
  {
    number: 3,
    title: "Modules de formation",
    description: "Contenus adaptes a vos besoins",
    icon: BookOpen,
  },
  {
    number: 4,
    title: "Coaching & suivi",
    description: "Accompagnement continu",
    icon: MessageCircle,
  },
  {
    number: 5,
    title: "Resultats mesurables",
    description: "Transformation durable",
    icon: TrendingUp,
  },
];

export function ParcoursSection() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="text-center mb-14">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-dark mb-3">
            Votre Parcours de Coaching
          </h2>
          <div className="mx-auto h-1 w-16 rounded-full bg-accent" />
        </div>

        {/* Steps - Horizontal on desktop, vertical on mobile */}
        <div className="relative">
          {/* Connection line - desktop */}
          <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-accent/20 via-accent to-accent/20" />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="flex md:flex-col items-center md:items-center gap-4 md:gap-0 text-left md:text-center">
                  {/* Numbered circle */}
                  <div className="relative z-10 flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-lg">
                    <div className="text-center">
                      <Icon className="h-6 w-6 mx-auto mb-0.5 text-accent" />
                      <span className="text-xs font-bold">{step.number}</span>
                    </div>
                  </div>

                  {/* Text */}
                  <div className="md:mt-4">
                    <h3 className="font-heading text-base font-bold text-dark">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {step.description}
                    </p>
                  </div>

                  {/* Connection line - mobile */}
                  {step.number < 5 && (
                    <div className="hidden" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
