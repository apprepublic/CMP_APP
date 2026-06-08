import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CMPapp - Earn Coins, Stream Music, Shop & More',
  description: 'Nigeria\'s premier earning platform. Complete tasks, stream music, sell products, and earn CMP Coins!',
  keywords: ['earn money', 'online earning', 'Nigeria', 'music streaming', 'marketplace', 'CMP Coin'],
  authors: [{ name: 'CMPapp Team' }],
  openGraph: {
    title: 'CMPapp - Earn Coins, Stream Music, Shop & More',
    description: 'Nigeria\'s premier earning platform',
    url: 'https://cmpapp.ng',
    siteName: 'CMPapp',
    locale: 'en_NG',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}