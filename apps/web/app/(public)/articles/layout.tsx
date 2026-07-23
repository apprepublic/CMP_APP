import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Articles — CMPapp',
  description: 'Discover knowledge and insights. Read articles, earn CMP coins, and level up your creative journey on CMPapp.',
  keywords: ['articles', 'blog', 'earning tips', 'Nigeria', 'CMPapp', 'knowledge', 'insights'],
  openGraph: {
    title: 'Articles — CMPapp',
    description: 'Discover knowledge and insights. Read articles, earn CMP coins.',
    url: 'https://cmpapp.ng/articles',
    type: 'website',
    images: [{ url: '/og-articles.png' }],
  },
  alternates: {
    canonical: '/articles',
  },
};

export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
