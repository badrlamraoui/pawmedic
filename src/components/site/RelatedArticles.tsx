import ArticleCard, { ArticleCardProps } from "@/components/landing/ArticleCard";

interface RelatedArticlesProps {
  articles: ArticleCardProps[];
  locale?: string;
}

export default function RelatedArticles({ articles, locale = "fr" }: RelatedArticlesProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-border">
      <h2 className="text-base font-semibold text-ink mb-5">Articles liés</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.slice(0, 3).map((article) => (
          <ArticleCard key={article.slug} {...article} locale={locale} />
        ))}
      </div>
    </section>
  );
}
