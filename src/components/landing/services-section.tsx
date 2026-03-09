import { Users, Heart, Award } from "lucide-react";

const services = [
  {
    icon: Users,
    title: "Management des Equipes",
    description:
      "Missions de 12 mois en entreprise pour transformer vos equipes. Ameliorez votre chiffre d'affaires de +10% a +30% grace a un management repense et des collaborateurs engages.",
    color: "bg-primary-medium",
  },
  {
    icon: Heart,
    title: "Coaching Individuel",
    description:
      "Accompagnement personnalise pour les femmes salariees : estime de soi, confiance, prise de parole en public. Reveillez la leader qui sommeille en vous.",
    color: "bg-accent",
  },
  {
    icon: Award,
    title: "Formation Certifiee",
    description:
      "Outils certifies et reconnus : REP-7, CDPM-I, Process'Communication, PNL. Des formations qui vous donnent les cles pour reussir durablement.",
    color: "bg-success",
  },
];

export function ServicesSection() {
  return (
    <section className="bg-gray-50 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="text-center mb-14">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-dark mb-3">
            Nos Services
          </h2>
          <div className="mx-auto h-1 w-16 rounded-full bg-accent" />
        </div>

        {/* Service cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div
                  className={`inline-flex h-14 w-14 items-center justify-center rounded-xl ${service.color} text-white mb-6`}
                >
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="font-heading text-xl font-bold text-dark mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
