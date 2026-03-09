"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "Comment se deroule un coaching avec Neo-Formations ?",
    answer:
      "Tout commence par un appel strategique gratuit de 30 minutes pour comprendre vos besoins. Ensuite, nous definissons ensemble un plan d'accompagnement personnalise avec des modules de formation, des seances individuelles et un suivi par KPIs.",
  },
  {
    question: "Quelle est la duree d'un accompagnement ?",
    answer:
      "Le coaching individuel est disponible en formules de 3, 6 ou 12 mois. Pour les entreprises, les missions de coaching collectif durent generalement 12 mois pour obtenir des resultats durables et mesurables.",
  },
  {
    question: "Quelles sont les certifications de Jean-Claude YEKPE ?",
    answer:
      "Jean-Claude est coach certifie par The John Maxwell Team, et maitre praticien en REP-7, CDPM-I, Process'Communication et PNL. Il dirige NEO-FORMATIONS depuis 2009.",
  },
  {
    question: "Comment mesurez-vous les resultats du coaching ?",
    answer:
      "Nous utilisons un systeme de KPIs en temps reel qui mesure trois axes : l'Investissement (engagement), l'Efficacite (resultats) et la Participation (activite). Des rapports mensuels detailles sont generes automatiquement.",
  },
  {
    question: "Le coaching est-il adapte aux femmes salariees ?",
    answer:
      "Absolument. Notre programme individuel est specialement concu pour les femmes salariees souhaitant renforcer leur estime de soi, leur confiance et leur prise de parole en public, avec une communaute de soutien entre coachees.",
  },
  {
    question: "Quels resultats attendre pour mon entreprise ?",
    answer:
      "Nos clients entreprises constatent en moyenne une amelioration de +10% a +30% de leur chiffre d'affaires sur 12 mois, une meilleure cohesion d'equipe et une reduction significative du turnover.",
  },
  {
    question: "Les seances se font-elles en presentiel ou a distance ?",
    answer:
      "Les seances peuvent se derouler en visioconference (Zoom) ou en presentiel selon vos preferences et votre localisation. Tous les modules de formation sont accessibles en ligne via notre plateforme.",
  },
  {
    question: "Comment fonctionne la communaute ?",
    answer:
      "Chaque coachee accede a un espace communautaire prive ou echanger avec les autres participants de son programme : partage d'experiences, entraide, defis mensuels et ressources exclusives.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-gray-50 py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="text-center mb-14">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-dark mb-3">
            Questions frequentes
          </h2>
          <div className="mx-auto h-1 w-16 rounded-full bg-accent" />
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex items-center justify-between w-full px-6 py-4 text-left"
                >
                  <span className="font-heading font-semibold text-dark text-sm sm:text-base pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 text-accent shrink-0 transition-transform duration-200",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-200",
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <p className="px-6 pb-5 text-sm text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
