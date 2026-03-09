import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { blogArticles } from "@/lib/blog-data";

const categoryColors: Record<string, string> = {
  Management: "bg-primary-medium/10 text-primary-medium",
  Confiance: "bg-accent/10 text-accent",
  "Prise de parole": "bg-success/10 text-success",
  Transition: "bg-blue-50 text-blue-700",
};

export function BlogSection() {
  const featured = blogArticles.slice(0, 3);

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="text-center mb-14">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-dark mb-3">
            Ressources & Conseils
          </h2>
          <div className="mx-auto h-1 w-16 rounded-full bg-accent mb-4" />
          <p className="text-gray-600 max-w-lg mx-auto">
            Articles, astuces et bonnes pratiques pour developper votre
            leadership et votre confiance.
          </p>
        </div>

        {/* Article cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featured.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-all"
            >
              {/* Color bar top */}
              <div className="h-1.5 bg-gradient-to-r from-accent to-primary" />

              <div className="p-6">
                {/* Category + read time */}
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      categoryColors[article.category] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-gray-400">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-heading text-lg font-bold text-dark mb-2 group-hover:text-accent transition-colors line-clamp-2">
                  {article.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-4">
                  {article.excerpt}
                </p>

                {/* Date */}
                <p className="text-xs text-gray-400">
                  {new Date(article.date).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* See all link */}
        <div className="text-center mt-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
          >
            Voir tous les articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
