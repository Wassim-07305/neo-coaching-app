import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { ExpertDetail } from "@/components/intervenants/expert-detail";

// Mock data for experts (will be replaced with Supabase later)
const expertsData: Record<
  string,
  {
    id: string;
    initials: string;
    name: string;
    domain: string;
    bio: string;
    fullBio: string;
    rating: number;
    videoUrl: string | null;
    packages: { hours: number; price: string; popular?: boolean }[];
    availableSlots: string[];
  }
> = {
  "1": {
    id: "1",
    initials: "SB",
    name: "Sophie Bertrand",
    domain: "Communication",
    bio: "Experte en communication non-violente et gestion des conflits en entreprise.",
    fullBio:
      "Sophie Bertrand est une experte reconnue en communication non-violente et en gestion des conflits en entreprise. Avec plus de 15 ans d'experience, elle accompagne les dirigeants et les equipes dans l'amelioration de leurs echanges professionnels. Formee a la Communication Non-Violente (CNV) de Marshall Rosenberg, elle intervient regulierement dans des PME et ETI pour des missions de mediation et de formation.",
    rating: 5,
    videoUrl: null,
    packages: [
      { hours: 2, price: "180\u20AC" },
      { hours: 4, price: "320\u20AC", popular: true },
      { hours: 6, price: "450\u20AC" },
    ],
    availableSlots: [
      "Lun 9h", "Lun 14h", "Mar 10h", "Mar 15h",
      "Mer 9h", "Jeu 10h", "Jeu 14h", "Ven 9h",
    ],
  },
  "2": {
    id: "2",
    initials: "ML",
    name: "Marc Lefevre",
    domain: "Anglais professionnel",
    bio: "Formateur certifie en anglais des affaires.",
    fullBio:
      "Marc Lefevre est formateur certifie en anglais des affaires avec plus de 10 ans d'experience. Diplome de Cambridge CELTA et titulaire d'un Master en linguistique appliquee, il se specialise dans la preparation aux certifications internationales (TOEIC, IELTS, Cambridge). Son approche immersive et pratique permet a ses apprenants de gagner rapidement en aisance a l'oral comme a l'ecrit.",
    rating: 5,
    videoUrl: null,
    packages: [
      { hours: 2, price: "160\u20AC" },
      { hours: 4, price: "290\u20AC", popular: true },
      { hours: 6, price: "420\u20AC" },
    ],
    availableSlots: [
      "Lun 10h", "Mar 9h", "Mar 14h", "Mer 10h",
      "Jeu 9h", "Jeu 15h", "Ven 10h", "Ven 14h",
    ],
  },
  "3": {
    id: "3",
    initials: "AC",
    name: "Amina Chertier",
    domain: "Espagnol",
    bio: "Enseignante native, specialisee dans l'espagnol commercial.",
    fullBio:
      "Amina Chertier est une enseignante native d'espagnol, specialisee dans l'espagnol commercial et la negociation interculturelle. Bilingue francais-espagnol, elle possede une riche experience en formation d'adultes dans le monde de l'entreprise. Elle aide les professionnels a developper leurs competences linguistiques pour evoluer a l'international.",
    rating: 4,
    videoUrl: null,
    packages: [
      { hours: 2, price: "140\u20AC" },
      { hours: 4, price: "260\u20AC", popular: true },
      { hours: 6, price: "380\u20AC" },
    ],
    availableSlots: [
      "Mar 9h", "Mar 11h", "Mer 14h", "Jeu 10h",
      "Jeu 16h", "Ven 9h", "Ven 11h", "Ven 14h",
    ],
  },
  "4": {
    id: "4",
    initials: "PD",
    name: "Philippe Durand",
    domain: "Leadership",
    bio: "Coach certifie en leadership transformationnel.",
    fullBio:
      "Philippe Durand est un coach certifie en leadership transformationnel et ancien dirigeant de PME. Avec 20 ans d'experience manageriale et 8 ans de coaching, il accompagne les leaders dans le developpement de leur posture, leur vision strategique et leur capacite a mobiliser leurs equipes. Il utilise des outils reconnus comme le MBTI et le 360 feedback.",
    rating: 5,
    videoUrl: null,
    packages: [
      { hours: 2, price: "200\u20AC" },
      { hours: 4, price: "360\u20AC", popular: true },
      { hours: 6, price: "500\u20AC" },
    ],
    availableSlots: [
      "Lun 9h", "Lun 15h", "Mar 10h", "Mer 9h",
      "Mer 14h", "Jeu 10h", "Ven 9h", "Ven 15h",
    ],
  },
  "5": {
    id: "5",
    initials: "LM",
    name: "Lucie Martin",
    domain: "Gestion du stress",
    bio: "Psychologue du travail et sophrologue.",
    fullBio:
      "Lucie Martin est psychologue du travail et sophrologue, specialisee dans la gestion du stress et la prevention du burn-out. Elle accompagne les professionnels vers un equilibre durable entre performance et bien-etre. Son approche combine des techniques de sophrologie, de pleine conscience et de coaching cognitivo-comportemental.",
    rating: 5,
    videoUrl: null,
    packages: [
      { hours: 2, price: "170\u20AC" },
      { hours: 4, price: "300\u20AC", popular: true },
      { hours: 6, price: "430\u20AC" },
    ],
    availableSlots: [
      "Lun 10h", "Lun 14h", "Mar 9h", "Mer 10h",
      "Mer 15h", "Jeu 9h", "Ven 10h", "Ven 14h",
    ],
  },
  "6": {
    id: "6",
    initials: "KN",
    name: "Karim Nasser",
    domain: "Prise de parole",
    bio: "Ancien comedien devenu coach en prise de parole.",
    fullBio:
      "Karim Nasser est un ancien comedien devenu coach en prise de parole. Expert en presentations impactantes et storytelling, il aide les professionnels a captiver leur audience, que ce soit en reunion, en conference ou en pitch. Son approche unique melant techniques theatrales et coaching permet des progres rapides et durables.",
    rating: 4,
    videoUrl: null,
    packages: [
      { hours: 2, price: "150\u20AC" },
      { hours: 4, price: "270\u20AC", popular: true },
      { hours: 6, price: "390\u20AC" },
    ],
    availableSlots: [
      "Lun 9h", "Mar 10h", "Mar 14h", "Mer 9h",
      "Jeu 10h", "Jeu 14h", "Ven 9h", "Ven 15h",
    ],
  },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const expert = expertsData[id];

  if (!expert) {
    return { title: "Expert non trouve | Neo-Coaching" };
  }

  return {
    title: `${expert.name} - ${expert.domain} | Neo-Coaching`,
    description: expert.bio,
  };
}

export default async function ExpertPage({ params }: PageProps) {
  const { id } = await params;
  const expert = expertsData[id];

  if (!expert) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Spacer for fixed nav */}
        <div className="bg-primary h-20" />

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <ExpertDetail expert={expert} />
        </div>
      </main>
      <Footer />
    </>
  );
}
