"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Search } from "lucide-react";
import { blogArticles, blogCategories } from "@/lib/blog-data";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { cn } from "@/lib/utils";

const categoryColors: Record<string, string> = {
  Management: "bg-primary-medium/10 text-primary-medium",
  Confiance: "bg-accent/10 text-accent",
  "Prise de parole": "bg-success/10 text-success",
  Transition: "bg-blue-50 text-blue-700",
};

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [search, setSearch] = useState("");

  const filtered = blogArticles.filter((a) => {
    const matchCategory =
      activeCategory === "Tous" || a.category === activeCategory;
    const matchSearch =
      !search.trim() ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <>
      <Navbar />
      <main className="bg-gray-50 min-h-screen pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-accent mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour a l&apos;accueil
            </Link>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-dark mb-3">
              Blog & Ressources
            </h1>
            <p className="text-gray-600 max-w-lg">
              Articles, astuces et bonnes pratiques pour developper votre
              leadership et votre confiance.
            </p>
          </div>

          {/* Search + Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-dark placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["Tous", ...blogCategories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-xs font-medium border transition-colors",
                    activeCategory === cat
                      ? "bg-accent text-white border-accent"
                      : "bg-white text-gray-600 border-gray-200 hover:border-accent/50"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Articles grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-all"
              >
                <div className="h-1.5 bg-gradient-to-r from-accent to-primary" />
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        categoryColors[article.category] ||
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-gray-400">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </span>
                  </div>
                  <h2 className="font-heading text-lg font-bold text-dark mb-2 group-hover:text-accent transition-colors line-clamp-2">
                    {article.title}
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-4">
                    {article.excerpt}
                  </p>
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

          {filtered.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <p className="text-gray-500 mb-2">
                Aucun article ne correspond a votre recherche.
              </p>
              <button
                onClick={() => {
                  setActiveCategory("Tous");
                  setSearch("");
                }}
                className="text-sm text-accent font-medium hover:underline"
              >
                Voir tous les articles
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
