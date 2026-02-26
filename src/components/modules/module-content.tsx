"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { mockModules } from "@/lib/mock-data";
import { ExerciseSection } from "./exercise-section";
import { LivrableUpload } from "./livrable-upload";
import { SatisfactionForm } from "./satisfaction-form";
import {
  ArrowLeft,
  Play,
  Clock,
  BookOpen,
  Award,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface ModuleContentProps {
  moduleId: string;
  basePath: string; // "/salarie" or "/coaching"
}

// Rich content per module for demo
const moduleRichContent: Record<string, string> = {
  "mod-1": `L'intelligence emotionnelle (IE) est la capacite a reconnaitre, comprendre et gerer nos propres emotions, ainsi qu'a reconnaitre, comprendre et influencer les emotions des autres.

Daniel Goleman identifie cinq composantes cles de l'intelligence emotionnelle :

1. La conscience de soi : Reconnaitre ses propres emotions et leur impact sur ses pensees et comportements.
2. La maitrise de soi : Gerer ses emotions de maniere saine et constructive.
3. La motivation : Utiliser ses emotions pour atteindre ses objectifs avec energie et perseverance.
4. L'empathie : Comprendre les emotions, besoins et preoccupations des autres.
5. Les competences sociales : Gerer les relations de maniere efficace et inspirer les autres.

Les six emotions fondamentales identifiees par Paul Ekman sont : la joie, la tristesse, la colere, la peur, le degout et la surprise. Apprendre a les identifier en soi et chez les autres est le premier pas vers une meilleure intelligence emotionnelle.`,

  "mod-2": `L'estime de soi est l'evaluation que l'on fait de sa propre valeur. Elle se construit tout au long de la vie et influence profondement notre bien-etre et nos decisions.

Les piliers de l'estime de soi :

1. L'acceptation de soi : Se connaitre et s'accepter avec ses forces et ses limites.
2. La bienveillance envers soi-meme : Se traiter avec la meme gentillesse qu'on traiterait un ami proche.
3. La confiance en ses capacites : Croire en sa capacite a surmonter les obstacles.
4. L'affirmation de soi : Exprimer ses besoins et ses opinions de maniere respectueuse.

Les croyances limitantes sont des pensees automatiques negatives qui sabotent notre estime de soi. Exemples courants : "Je ne suis pas assez bon(ne)", "Les autres sont meilleurs que moi", "Je ne merite pas le succes".

La technique de la lettre a soi-meme est un exercice puissant pour developper une relation plus saine avec soi-meme.`,

  "mod-3": `La confiance en soi est la croyance en ses propres capacites a faire face aux defis de la vie. Contrairement a l'estime de soi qui est une evaluation globale, la confiance en soi porte sur des competences specifiques.

Construire sa confiance en soi :

1. Identifier ses forces : Faire l'inventaire de ses competences, talents et reussites.
2. Fixer des objectifs progressifs : Commencer par des defis accessibles et augmenter progressivement la difficulte.
3. Gerer le syndrome de l'imposteur : Reconnaitre que ce sentiment est normal et qu'il ne reflete pas la realite.
4. Apprendre de ses echecs : Chaque echec est une opportunite d'apprentissage, pas une preuve d'incompetence.
5. S'entourer de personnes positives : L'environnement social influence fortement notre niveau de confiance.

La prise de risques calculee est essentielle pour developper sa confiance. Sortir de sa zone de confort de maniere progressive permet de decouvrir de nouvelles capacites.`,

  "mod-4": `La prise de parole en public est une competence essentielle dans le monde professionnel. Maitriser cet art permet de convaincre, inspirer et creer un impact durable.

Les techniques fondamentales :

1. Le storytelling : Structurer son discours autour d'une histoire captivante. Les histoires activent l'empathie et la memorisation.
2. La gestion du trac : Techniques de respiration, ancrage et visualisation positive avant une presentation.
3. Le langage corporel : 55% de la communication passe par le non-verbal. Posture ouverte, contact visuel et gestes naturels.
4. La voix : Varier le rythme, le volume et les pauses pour maintenir l'attention du public.
5. La structure : Introduction accrocheuse, developpement en 3 points, conclusion memorable.

Exercice pratique : Le pitch de 2 minutes. Presentez-vous, votre projet ou une idee en exactement 2 minutes. Enregistrez-vous et analysez votre prestation.`,
};

export function ModuleContent({ moduleId, basePath }: ModuleContentProps) {
  const [moduleCompleted, setModuleCompleted] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

  const mod = mockModules.find((m) => m.id === moduleId);

  if (!mod) {
    return (
      <div className="space-y-4">
        <Link
          href={`${basePath}/modules`}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux modules
        </Link>
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-500">Module introuvable.</p>
        </div>
      </div>
    );
  }

  const exercises = (() => {
    try {
      const parsed = JSON.parse(mod.exercise_json);
      return parsed.exercises || [];
    } catch {
      return [];
    }
  })();

  const richContent = moduleRichContent[mod.id] || mod.content_summary;

  function handleModuleComplete() {
    setModuleCompleted(true);
    setShowCongrats(true);
    // Auto-hide congrats after a few seconds
    setTimeout(() => setShowCongrats(false), 5000);
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <Link
          href={`${basePath}/modules`}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-accent transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux modules
        </Link>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
              <Clock className="w-3 h-3" />
              {mod.duration_weeks * 7 > 28
                ? `${mod.duration_weeks} semaines`
                : `${mod.duration_weeks * 7} jours`}
            </span>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                mod.parcours_type === "individuel"
                  ? "bg-blue-50 text-blue-600"
                  : mod.parcours_type === "entreprise"
                  ? "bg-purple-50 text-purple-600"
                  : "bg-green-50 text-green-600"
              )}
            >
              <BookOpen className="w-3 h-3" />
              {mod.parcours_type === "individuel"
                ? "Individuel"
                : mod.parcours_type === "entreprise"
                ? "Entreprise"
                : "Individuel & Entreprise"}
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-dark mb-2">
            {mod.title}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            {mod.description}
          </p>
        </div>
      </div>

      {/* Video/Content Section */}
      <div className="space-y-6">
        {/* Video placeholder */}
        <div className="relative aspect-video bg-primary rounded-xl overflow-hidden group cursor-pointer">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-accent/90 group-hover:bg-accent transition-colors shadow-lg">
              <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white ml-1" />
            </div>
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <span className="text-xs text-white/70">
              Video du module - {mod.title}
            </span>
            <span className="text-xs text-white/70">
              {mod.duration_weeks * 12}:00
            </span>
          </div>
        </div>

        {/* Rich text content */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-heading text-lg font-bold text-dark mb-4">
            Contenu du module
          </h2>
          <div className="prose prose-sm max-w-none">
            {richContent.split("\n\n").map((paragraph, idx) => (
              <p key={idx} className="text-gray-600 text-sm leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Exercise Section */}
      <ExerciseSection exercises={exercises} moduleTitle={mod.title} />

      {/* Livrables Submission */}
      <LivrableUpload />

      {/* Congratulations message */}
      {showCongrats && (
        <div className="bg-success/5 border border-success/20 rounded-xl p-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Sparkles className="w-10 h-10 text-accent mx-auto mb-3" />
          <h3 className="font-heading text-xl font-bold text-dark mb-2">
            Felicitations !
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            Vous avez termine le module &laquo; {mod.title} &raquo; avec succes.
          </p>
          <p className="text-sm text-gray-500">
            Votre certificat de completion est en cours de generation.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-lg">
            <Award className="w-5 h-5 text-accent" />
            <span className="text-sm font-medium text-accent">
              Certificat &laquo; {mod.title} &raquo;
            </span>
          </div>
        </div>
      )}

      {/* Module Complete Button or Satisfaction */}
      {!moduleCompleted ? (
        <button
          onClick={handleModuleComplete}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-success text-white rounded-xl font-heading font-semibold text-base hover:bg-success/90 transition-colors shadow-lg shadow-success/20"
        >
          <CheckCircle2 className="w-6 h-6" />
          Module termine
        </button>
      ) : (
        <SatisfactionForm moduleTitle={mod.title} />
      )}
    </div>
  );
}
