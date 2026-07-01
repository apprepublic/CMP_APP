'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useArticles } from '@/lib/hooks';
import type { Article } from '@/lib/queries';

function MobileArticlesPage() {
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
    <div className="lg:hidden min-h-screen bg-surface pb-[160px]">
      <main className="pt-20 px-4 pb-8 flex flex-col gap-5 max-w-3xl mx-auto w-full">
        {/* Search Input */}
        <section className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[22px]">search</span>
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search articles..."
            className="w-full bg-white border border-outline-variant rounded-xl pl-12 pr-4 py-3.5 text-body-sm font-body-sm text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-[inset_2px_2px_8px_rgba(13,27,53,0.05)]" />
        </section>

        {/* Category Chips */}
        {categories.length > 0 && (
          <section>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <button onClick={() => setSelectedCategory(null)}
                className={`whitespace-nowrap px-4 py-2 rounded-full font-label-caps text-label-caps text-xs border transition-colors flex-shrink-0 ${
                  selectedCategory === null ? 'bg-[#B8860B] text-white border-[#B8860B]' : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/30'
                }`}>
                All
              </button>
              {categories.map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full font-label-caps text-label-caps text-xs border transition-colors flex-shrink-0 ${
                    selectedCategory === cat ? 'bg-[#B8860B] text-white border-[#B8860B]' : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/30'
                  }`}>
                  {cat}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Article Feed */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-body-md text-body-md text-on-surface font-semibold">
              {selectedCategory || 'All Articles'}
            </h2>
            <span className="font-data-xs text-data-xs text-on-surface-variant">{articles.length} articles</span>
          </div>

          {articlesLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/20 animate-pulse">
                <div className="h-32 bg-surface-dim" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-surface-dim rounded w-1/3" />
                  <div className="h-5 bg-surface-dim rounded w-3/4" />
                  <div className="h-3 bg-surface-dim rounded w-1/2" />
                </div>
              </div>
            ))
          ) : articles.length === 0 ? (
            <div className="text-center py-12 bg-surface-container-lowest rounded-xl border border-outline-variant/20">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-3">article</span>
              <p className="font-body-md text-body-md text-on-surface-variant">No articles found</p>
            </div>
          ) : (
            articles.map((article) => (
              <Link key={article.id} href={`/articles/${article.slug}`}
                className="block bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/20 shadow-[-4px_-4px_10px_rgba(255,255,255,0.8),4px_4px_10px_rgba(13,27,53,0.08)]">
                {article.cover_image_url && (
                  <div className="relative w-full aspect-[16/9] overflow-hidden">
                    <img src={article.cover_image_url} alt={article.title}
                      className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-[#B8860B]/10 text-[#B8860B] font-label-caps text-label-caps text-xs rounded">
                      {article.category}
                    </span>
                    <span className="font-data-xs text-data-xs text-on-surface-variant">{article.read_time_minutes} min read</span>
                  </div>
                  <h3 className="font-body-md text-body-md text-on-surface font-semibold line-clamp-2">{article.title}</h3>
                  {article.excerpt && (
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">{article.excerpt}</p>
                  )}
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-data-xs text-data-xs text-on-surface-variant">
                      {new Date(article.published_at || article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1 text-[#B8860B] font-semibold text-body-sm font-body-sm">
                      <span className="material-symbols-outlined text-[16px]">account_balance_wallet</span>
                      {article.coin_reward} CMP
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

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
    <>
      <MobileArticlesPage />
      <main className="hidden lg:block flex-1 flex flex-col relative pb-[160px] lg:pb-[100px]">
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
                className="w-full bg-surface-container-lowest/10 backdrop-blur-sm border-2 border-outline-variant/30 text-on-surface placeholder-on-surface-variant/70 rounded-xl pl-14 pr-6 py-4 font-body-lg focus:border-secondary focus:ring-0 transition-all shadow-inner outline-none"
              />
            </div>
          </div>
        </section>

        {/* Category Pills */}
        {categories.length > 0 && (
          <section>
            <div className="flex flex-wrap items-center gap-3 pb-2">
              <button 
                onClick={() => setSelectedCategory(null)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full font-label-caps text-label-caps border-2 border-transparent shadow-sm transition-colors ${
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
                  className={`whitespace-nowrap px-6 py-2.5 rounded-full font-label-caps text-label-caps transition-colors ${
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
    </>
  );
}