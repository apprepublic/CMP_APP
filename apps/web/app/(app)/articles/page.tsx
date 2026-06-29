'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useArticles } from '@/lib/hooks';
import type { Article } from '@/lib/queries';

export default function ArticlesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: articles = [], isLoading: articlesLoading } = useArticles(
    selectedCategory ? { category: selectedCategory, search: searchQuery } : { search: searchQuery }
  );

  const categories = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a: any) => a.category && set.add(a.category));
    return Array.from(set);
  }, [articles]);

  return (
    <main className="flex-1 flex flex-col relative pb-[160px] lg:pb-[100px]">
      <div className="p-margin-mobile lg:p-margin-desktop space-y-12 max-w-[1400px] mx-auto w-full">
        {/* Hero Section */}
        <section className="relative bg-primary-container rounded-2xl p-8 lg:p-12 overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-tertiary-fixed/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto space-y-6">
            <h2 className="font-h1-mobile lg:font-h1 text-h1-mobile lg:text-h1 text-on-primary">
              Discover Knowledge & Insights
            </h2>
            <div className="w-full relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-primary-container text-[28px] group-focus-within:text-secondary transition-colors">
                search
              </span>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..." 
                className="w-full bg-surface-container-lowest/10 backdrop-blur-sm border-2 border-outline-variant/30 text-on-primary placeholder-on-primary-container/70 rounded-xl pl-14 pr-6 py-4 font-body-lg focus:border-secondary focus:ring-0 transition-all shadow-inner outline-none"
              />
            </div>
          </div>
        </section>

        {/* Category Pills */}
        {categories.length > 0 && (
          <section>
            <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-2 snap-x">
              <button 
                onClick={() => setSelectedCategory(null)}
                className={`snap-start whitespace-nowrap px-6 py-2.5 rounded-full font-label-caps text-label-caps border-2 border-transparent shadow-sm transition-colors ${
                  selectedCategory === null
                    ? 'bg-secondary-container text-on-secondary-container'
                    : 'bg-surface-alt text-on-surface-variant border-outline-variant/50 hover:bg-surface-container-high'
                }`}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button 
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`snap-start whitespace-nowrap px-6 py-2.5 rounded-full font-label-caps text-label-caps transition-colors ${
                    selectedCategory === category
                      ? 'bg-secondary-container text-on-secondary-container'
                      : 'bg-surface-alt text-on-surface-variant border-outline-variant/50 hover:bg-surface-container-high'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Articles Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-h3 text-h3 text-on-background">
              {selectedCategory ? `${selectedCategory} Articles` : 'All Articles'}
            </h3>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              {articles.length} {articles.length === 1 ? 'article' : 'articles'}
            </span>
          </div>
          
          {articlesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-surface-variant animate-pulse aspect-[3/4]" />
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-16 bg-surface-alt rounded-2xl border border-outline-variant/30">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">article</span>
              <h4 className="font-h3 text-h3 text-on-surface mb-2">No Articles Found</h4>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {searchQuery || selectedCategory 
                  ? 'Try adjusting your search or filter' 
                  : 'Check back soon for new content'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Link 
                  key={article.id} 
                  href={`/articles/${article.slug}`}
                  className="group block bg-surface-alt rounded-2xl overflow-hidden border border-outline-variant/30 hover:border-secondary transition-all shadow-sm hover:shadow-md"
                >
                  {article.cover_image_url && (
                    <div className="relative w-full aspect-video overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={article.cover_image_url} 
                        alt={article.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-secondary-container/20 text-secondary font-label-caps text-label-caps rounded-full">
                        {article.category}
                      </span>
                      <span className="font-data-xs text-data-xs text-on-surface-variant">
                        {article.read_time_minutes} min read
                      </span>
                    </div>
                    <h4 className="font-h3 text-h3 text-on-background group-hover:text-secondary transition-colors line-clamp-2">
                      {article.title}
                    </h4>
                    {article.excerpt && (
                      <p className="font-body-md text-body-md text-on-surface-variant line-clamp-3">
                        {article.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-3 border-t border-outline-variant/20">
                      <div className="flex items-center gap-2 text-on-surface-variant">
                        <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                        <span className="font-body-sm text-body-sm">
                          {new Date(article.published_at || article.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[#B8860B] font-semibold">
                        <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                        <span className="font-body-md text-body-md">{article.coin_reward} Coins</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}