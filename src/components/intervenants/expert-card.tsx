import Link from "next/link";
import { Star } from "lucide-react";

export interface ExpertData {
  id: string;
  initials: string;
  name: string;
  domain: string;
  bio: string;
  rating: number;
}

interface ExpertCardProps {
  expert: ExpertData;
}

export function ExpertCard({ expert }: ExpertCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
      {/* Avatar */}
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-medium text-white font-heading font-bold text-lg">
        {expert.initials}
      </div>

      {/* Name */}
      <h3 className="font-heading text-lg font-bold text-dark text-center">
        {expert.name}
      </h3>

      {/* Domain */}
      <span className="inline-block mt-1 text-sm font-medium text-accent text-center">
        {expert.domain}
      </span>

      {/* Bio */}
      <p className="mt-3 text-sm text-gray-500 line-clamp-2 text-center flex-1">
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

      {/* CTA */}
      <Link
        href={`/intervenants/${expert.id}`}
        className="mt-4 block rounded-lg border-2 border-primary-medium py-2 px-4 text-sm font-semibold text-primary-medium text-center hover:bg-primary-medium hover:text-white transition-colors"
      >
        Voir le profil
      </Link>
    </div>
  );
}
