import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "Grace au coaching de Jean-Claude, j'ai retrouve confiance en moi et j'ai ose prendre la parole en reunion. Aujourd'hui, je suis responsable d'equipe.",
    author: "Marie L.",
    role: "Responsable d'equipe, PME industrielle",
    rating: 5,
  },
  {
    quote:
      "En 12 mois, notre chiffre d'affaires a augmente de 22%. L'accompagnement en management a transforme la dynamique de nos equipes.",
    author: "Thomas R.",
    role: "Dirigeant, Entreprise BTP",
    rating: 5,
  },
  {
    quote:
      "Les outils certifies comme la Process'Communication m'ont permis de mieux comprendre mes collaborateurs et d'adapter mon leadership.",
    author: "Fatima K.",
    role: "Directrice commerciale",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="text-center mb-14">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-dark mb-3">
            Temoignages
          </h2>
          <div className="mx-auto h-1 w-16 rounded-full bg-accent" />
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.author}
              className="bg-gray-50 rounded-2xl p-8 border border-gray-100 relative"
            >
              {/* Quote icon */}
              <Quote className="h-8 w-8 text-accent/30 mb-4" />

              {/* Quote text */}
              <p className="text-gray-700 leading-relaxed mb-6 italic">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Rating */}
              <div className="flex items-center gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < testimonial.rating
                        ? "text-accent fill-accent"
                        : "text-gray-200"
                    }`}
                  />
                ))}
              </div>

              {/* Author */}
              <div>
                <div className="font-heading font-bold text-dark">
                  {testimonial.author}
                </div>
                <div className="text-sm text-gray-500">
                  {testimonial.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
