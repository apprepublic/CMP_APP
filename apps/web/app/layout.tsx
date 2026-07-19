import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { ConditionalChrome } from '@/components/layout/ConditionalChrome';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CMPapp - Complete Tasks, Stream Music, Shop & More',
  description: 'Nigeria\'s premier earning platform. Complete tasks, stream music, sell products, and earn CMP Coins!',
  keywords: ['earn money', 'online earning', 'Nigeria', 'music streaming', 'marketplace', 'CMP Coin'],
  authors: [{ name: 'CMPapp Team' }],
  icons: {
    icon: '/coin.png',
  },
  openGraph: {
title: 'CMPapp - Complete Tasks, Stream Music, Shop & More',
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
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Symbols+Outlined"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Inter:wght@400;500;700&family=JetBrains+Mono:wght@500;600&display=swap"
          rel="stylesheet"
        />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4023744925153520" crossOrigin="anonymous"></script>
      </head>
      <body className={inter.className}>
        <Providers>
          <ConditionalChrome>{children}</ConditionalChrome>
        </Providers>
      </body>
    </html>
  );
}