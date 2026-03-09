import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Coaching Individuel",
    audience: "Femmes salariees",
    price: "490",
    unit: "/mois",
    duration: "3, 6 ou 12 mois",
    highlight: false,
    features: [
      "Modules personnalises (estime, confiance, prise de parole)",
      "Seances 1-on-1 avec Jean-Claude",
      "Suivi KPIs en temps reel",
      "Acces a la communaute des coachees",
      "Certificats de completion",
      "Rapport de progression mensuel",
    ],
  },
  {
    name: "Coaching Equipe",
    audience: "Dirigeants de PME",
    price: "Sur devis",
    unit: "",
    duration: "Mission de 12 mois",
    highlight: true,
    features: [
      "Diagnostic complet de l'equipe",
      "Modules collectifs adaptes a vos enjeux",
      "Dashboard dirigeant avec KPIs equipe",
      "Seances de coaching individuelles et collectives",
      "Rapports mensuels automatiques",
      "+10% a +30% de CA sur 12 mois",
      "Formation certifiee REP-7, CDPM-I, PNL",
    ],
  },
  {
    name: "Session Decouverte",
    audience: "Tout public",
    price: "Gratuit",
    unit: "",
    duration: "30 minutes",
    highlight: false,
    features: [
      "Appel strategique de 30 min",
      "Analyse de votre situation actuelle",
      "Recommandations personnalisees",
      "Plan d'action initial",
      "Sans engagement",
    ],
  },
];

export function PricingSection() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="text-center mb-14">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-dark mb-3">
            Investissement
          </h2>
          <div className="mx-auto h-1 w-16 rounded-full bg-accent mb-4" />
          <p className="text-gray-600 max-w-lg mx-auto">
            Des formules adaptees a vos besoins, avec un accompagnement sur mesure
            et des resultats mesurables.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 border flex flex-col ${
                plan.highlight
                  ? "bg-primary text-white border-accent shadow-xl shadow-accent/10 scale-[1.02]"
                  : "bg-white text-dark border-gray-200 hover:border-accent/30 hover:shadow-md transition-all"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-semibold px-4 py-1 rounded-full">
                  Populaire
                </div>
              )}

              <div className="mb-6">
                <p
                  className={`text-sm font-medium mb-1 ${
                    plan.highlight ? "text-accent" : "text-accent"
                  }`}
                >
                  {plan.audience}
                </p>
                <h3
                  className={`font-heading text-xl font-bold mb-2 ${
                    plan.highlight ? "text-white" : "text-dark"
                  }`}
                >
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span
                    className={`font-heading text-4xl font-bold ${
                      plan.highlight ? "text-white" : "text-dark"
                    }`}
                  >
                    {plan.price}
                  </span>
                  {plan.unit && (
                    <span
                      className={`text-sm ${
                        plan.highlight ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      {plan.unit}
                    </span>
                  )}
                </div>
                <p
                  className={`text-sm mt-1 ${
                    plan.highlight ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {plan.duration}
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check
                      className={`h-4 w-4 shrink-0 mt-0.5 ${
                        plan.highlight ? "text-accent" : "text-success"
                      }`}
                    />
                    <span
                      className={`text-sm leading-relaxed ${
                        plan.highlight ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/reserver"
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
                  plan.highlight
                    ? "bg-accent text-white hover:bg-accent/90"
                    : "bg-primary text-white hover:bg-primary-medium"
                }`}
              >
                {plan.price === "Sur devis" ? "Demander un devis" : "Commencer"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
