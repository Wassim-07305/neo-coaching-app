import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";

const experts = [
  {
    id: "1",
    initials: "SB",
    name: "Sophie Bertrand",
    domain: "Communication",
    bio: "Experte en communication non-violente et gestion des conflits en entreprise. 15 ans d'experience.",
    rating: 5,
  },
  {
    id: "2",
    initials: "ML",
    name: "Marc Lefevre",
    domain: "Anglais professionnel",
    bio: "Formateur certifie en anglais des affaires. Specialise dans la preparation aux certifications internationales.",
    rating: 5,
  },
  {
    id: "3",
    initials: "AC",
    name: "Amina Chertier",
    domain: "Espagnol",
    bio: "Enseignante native, specialisee dans l'espagnol commercial et la negociation interculturelle.",
    rating: 4,
  },
  {
    id: "4",
    initials: "PD",
    name: "Philippe Durand",
    domain: "Leadership",
    bio: "Coach certifie en leadership transformationnel. Ancien dirigeant de PME avec 20 ans d'experience.",
    rating: 5,
  },
];

export function ExpertsPreview() {
  return (
    <section className="bg-gray-50 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="text-center mb-14">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-dark mb-3">
            Nos Experts
          </h2>
          <div className="mx-auto h-1 w-16 rounded-full bg-accent mb-4" />
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            Des intervenants specialises pour completer votre accompagnement
          </p>
        </div>

        {/* Expert cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {experts.map((expert) => (
            <div
              key={expert.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center"
            >
              {/* Avatar */}
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-medium text-white font-heading font-bold text-lg">
                {expert.initials}
              </div>

              {/* Name */}
              <h3 className="font-heading text-lg font-bold text-dark">
                {expert.name}
              </h3>

              {/* Domain */}
              <span className="inline-block mt-1 text-sm font-medium text-accent">
                {expert.domain}
              </span>

              {/* Bio */}
              <p className="mt-3 text-sm text-gray-500 line-clamp-2">
                {expert.bio}
              </p>

              {/* Rating */}
              <div className="mt-3 flex items-center justify-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < expert.rating
                        ? "text-accent fill-accent"
                        : "text-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link
            href="/intervenants"
            className="inline-flex items-center gap-2 text-primary-medium font-semibold hover:text-accent transition-colors"
          >
            Voir tous les experts
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
