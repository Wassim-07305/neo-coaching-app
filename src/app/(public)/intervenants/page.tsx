import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { ExpertCard, type ExpertData } from "@/components/intervenants/expert-card";

export const metadata: Metadata = {
  title: "Nos Experts | Neo-Coaching",
  description:
    "Decouvrez nos intervenants specialises pour completer votre parcours de coaching.",
};

const experts: ExpertData[] = [
  {
    id: "1",
    initials: "SB",
    name: "Sophie Bertrand",
    domain: "Communication",
    bio: "Experte en communication non-violente et gestion des conflits en entreprise. 15 ans d'experience au service des leaders.",
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
    bio: "Coach certifie en leadership transformationnel. Ancien dirigeant de PME avec 20 ans d'experience manageriale.",
    rating: 5,
  },
  {
    id: "5",
    initials: "LM",
    name: "Lucie Martin",
    domain: "Gestion du stress",
    bio: "Psychologue du travail et sophrologue. Accompagne les professionnels vers un equilibre durable.",
    rating: 5,
  },
  {
    id: "6",
    initials: "KN",
    name: "Karim Nasser",
    domain: "Prise de parole",
    bio: "Ancien comedien devenu coach en prise de parole. Expert en presentations impactantes et storytelling.",
    rating: 4,
  },
];

export default function IntervenantsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero section */}
        <section className="bg-primary pt-28 sm:pt-32 pb-16 sm:pb-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Nos <span className="text-accent">Experts</span>
            </h1>
            <div className="mx-auto h-1 w-16 rounded-full bg-accent mb-4" />
            <p className="text-gray-300 text-lg max-w-xl mx-auto">
              Des intervenants specialises pour completer votre parcours de coaching
              et de formation.
            </p>
          </div>
        </section>

        {/* Expert grid */}
        <section className="bg-gray-50 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {experts.map((expert) => (
                <ExpertCard key={expert.id} expert={expert} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
