import Link from "next/link";
import { ArrowLeft, Clock, ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import { blogArticles } from "@/lib/blog-data";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

const categoryColors: Record<string, string> = {
  Management: "bg-primary-medium/10 text-primary-medium",
  Confiance: "bg-accent/10 text-accent",
  "Prise de parole": "bg-success/10 text-success",
  Transition: "bg-blue-50 text-blue-700",
};

interface BlogArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogArticles.map((article) => ({ slug: article.slug }));
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const article = blogArticles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  // Get related articles (same category, excluding current)
  const related = blogArticles
    .filter((a) => a.category === article.category && a.slug !== article.slug)
    .slice(0, 2);

  // Simple markdown-like rendering: split by \n\n for paragraphs,
  // handle ## headings and **bold**
  const renderContent = (content: string) => {
    const blocks = content.split("\n\n");
    return blocks.map((block, i) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      if (trimmed.startsWith("## ")) {
        return (
          <h2
            key={i}
            className="font-heading text-xl font-bold text-dark mt-8 mb-3"
          >
            {trimmed.replace("## ", "")}
          </h2>
        );
      }

      if (trimmed.startsWith("### ")) {
        return (
          <h3
            key={i}
            className="font-heading text-lg font-bold text-dark mt-6 mb-2"
          >
            {trimmed.replace("### ", "")}
          </h3>
        );
      }

      // Handle bullet lists
      if (trimmed.includes("\n- ") || trimmed.startsWith("- ")) {
        const items = trimmed.split("\n").filter((l) => l.startsWith("- "));
        return (
          <ul key={i} className="list-disc list-inside space-y-1 text-gray-600 leading-relaxed my-4">
            {items.map((item, j) => (
              <li key={j}>{item.replace("- ", "")}</li>
            ))}
          </ul>
        );
      }

      // Regular paragraph — handle **bold**
      const parts = trimmed.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={i} className="text-gray-600 leading-relaxed my-4">
          {parts.map((part, j) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <strong key={j} className="font-semibold text-dark">
                {part.slice(2, -2)}
              </strong>
            ) : (
              part
            )
          )}
        </p>
      );
    });
  };

  return (
    <>
      <Navbar />
      <main className="bg-white min-h-screen pt-24 pb-16">
        <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <Link href="/" className="hover:text-accent transition-colors">
              Accueil
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/blog" className="hover:text-accent transition-colors">
              Blog
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-600 truncate">{article.title}</span>
          </nav>

          {/* Meta */}
          <div className="flex items-center gap-3 mb-4">
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                categoryColors[article.category] || "bg-gray-100 text-gray-600"
              }`}
            >
              {article.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime}
            </span>
            <span className="text-xs text-gray-400">
              {new Date(article.date).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-dark mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Excerpt */}
          <p className="text-lg text-gray-500 leading-relaxed mb-8 border-l-4 border-accent pl-4">
            {article.excerpt}
          </p>

          {/* Divider */}
          <div className="h-px bg-gray-200 mb-8" />

          {/* Content */}
          <div className="prose-like">{renderContent(article.content)}</div>

          {/* Back link */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour aux articles
            </Link>
          </div>
        </article>

        {/* Related articles */}
        {related.length > 0 && (
          <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 mt-16">
            <h2 className="font-heading text-xl font-bold text-dark mb-6">
              Articles similaires
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/blog/${rel.slug}`}
                  className="group bg-gray-50 rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-all"
                >
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      categoryColors[rel.category] ||
                      "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {rel.category}
                  </span>
                  <h3 className="font-heading font-bold text-dark mt-2 mb-1 group-hover:text-accent transition-colors line-clamp-2">
                    {rel.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {rel.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
