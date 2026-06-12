'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ArticleReaderClient() {
  const [readingProgress, setReadingProgress] = useState(0);
  const [showClaim, setShowClaim] = useState(false);
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolledPercentage = (window.scrollY / scrollableHeight) * 100;
      setReadingProgress(Math.min(scrolledPercentage, 100));

      if (scrolledPercentage >= 95) {
        setShowClaim(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClaim = () => {
    setClaimed(true);
    setTimeout(() => {
      setShowClaim(false);
    }, 1500);
  };

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen relative flex flex-col">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 py-2 bg-surface border-b border-surface-secondary shadow-sm">
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined text-on-surface">person</span>
          </button>
          <h1 className="font-headline-md text-headline-md font-bold text-primary">CMPapp</h1>
        </div>
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:opacity-80 transition-opacity">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        {/* Reading Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-transparent z-50">
          <div
            className="h-full bg-secondary-container"
            style={{ width: `${readingProgress}%` }}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-margin-mobile md:px-gutter max-w-container-max mx-auto w-full pt-16 pb-36">
        <article className="max-w-3xl mx-auto bg-surface-container-lowest rounded-lg border border-surface-secondary shadow-[0px_4px_20px_rgba(13,27,53,0.05)] overflow-hidden">
          {/* Article Hero Image */}
          <div className="w-full h-64 md:h-96 relative bg-surface-container-low">
            <img
              alt="Fintech Data Workspace"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLpYMhKyUa3sYfjFwarbRZOAgcB7gxZ5UAftIvcxhLD7heSc8Kky1bvKl9y3QwQToZ7Hyo1U2Pm451bDN15__5P8JArXLALuKP1XypuIT8j8hzfeYaLPO2r_XojOLNOD9z9BB3S_muGDdH5-EtKZfsvDkITMChSw8ovuykCltnOXCXIbJMADsByFMcRKCO9f_napkWXv9NPxnHsoMAe3QFUhtGUCv2UU_UG1nUHeB3DF1x-FNz6krDG7na8XgFrFhBm6OZ9841xZaQ"
            />
            {/* Coin Badge Overlay */}
            <div className="absolute top-4 right-4 bg-secondary-fixed/5 border border-secondary-container rounded-full px-3 py-1 flex items-center gap-2 backdrop-blur-sm shadow-sm">
              <span className="text-[14px]">🪙</span>
              <span className="font-wallet-display text-wallet-display text-secondary-container text-sm">Read to Earn</span>
            </div>
          </div>

          <div className="p-6 md:p-10 space-y-stack-lg">
            {/* Article Header */}
            <header className="space-y-stack-md text-center">
              <div className="flex items-center justify-center gap-2 text-text-muted font-body-sm text-body-sm">
                <span>Fintech</span>
                <span>•</span>
                <span>5 Min Read</span>
                <span>•</span>
                <span>Oct 24, 2023</span>
              </div>
              <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">The Rise of Digital Wallets in Nigeria's Economy</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">How seamless mobile transactions are reshaping financial inclusion and creating new opportunities for everyday users.</p>
            </header>

            {/* Article Body */}
            <div className="space-y-stack-md font-body-md text-body-md text-text-main leading-relaxed">
              <p>In recent years, Nigeria has witnessed a profound transformation in how its citizens handle money. The traditional banking landscape, once characterized by long queues and complex paperwork, is rapidly giving way to a digital-first approach. At the forefront of this revolution are mobile digital wallets, which have not only simplified transactions but also brought millions of previously unbanked individuals into the formal financial system.</p>
              <p>This shift is driven by a combination of factors: deep mobile phone penetration, a youthful population eager to adopt new technologies, and proactive regulatory frameworks that encourage innovation while maintaining security. For many, a smartphone is no longer just a communication device; it is a pocket-sized bank branch.</p>

              <h3 className="font-headline-md text-headline-md text-primary mt-stack-lg mb-stack-sm text-left">Bridging the Gap</h3>
              <p>One of the most significant impacts of digital wallets is their ability to bridge the gap between urban centers and rural communities. In areas where physical bank branches are scarce, agents equipped with mobile wallet platforms provide essential cash-in and cash-out services. This agent network operates as the physical infrastructure for the digital economy, ensuring that even those without reliable internet access can participate.</p>

              {/* Pull Quote */}
              <div className="my-8 p-6 bg-primary-container text-on-primary rounded-lg border-l-4 border-secondary-container shadow-md">
                <p className="font-headline-md text-[20px] leading-[28px] italic mb-2">"The future of finance in emerging markets isn't just about moving money faster; it's about making every transaction inherently rewarding and secure."</p>
              </div>

              <h3 className="font-headline-md text-headline-md text-primary mt-stack-lg mb-stack-sm text-left">The Gamification of Finance</h3>
              <p>An interesting trend emerging in the latest generation of fintech apps is the integration of gamified elements. Drawing inspiration from gaming environments, these platforms are introducing reward systems, badges, and 'coins' for completing standard financial tasks or even educational modules—like reading articles on financial literacy.</p>
              <p>This approach transforms a traditionally dry sector into an engaging experience. By providing immediate, tangible rewards for positive financial behaviors, these apps foster stronger user habits and loyalty.</p>

              <p className="mt-8 pt-8 border-t border-surface-secondary text-center text-text-muted italic">End of article.</p>
            </div>
          </div>
        </article>
      </main>

      {/* Claim Reward Footer */}
      <div className={`fixed bottom-[72px] md:bottom-0 left-0 w-full z-40 bg-surface-container border-t border-surface-secondary shadow-[0px_-8px_24px_rgba(13,27,53,0.08)] px-4 py-4 flex justify-center items-center transition-transform duration-300 ${showClaim ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="max-w-container-max w-full flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface-container-lowest p-4 rounded-xl border border-secondary-container/30">
          <div className="flex items-center gap-3">
            <span className="text-[24px]">🎉</span>
            <span className="font-body-lg text-body-lg text-primary">You've finished reading!</span>
          </div>
          <button
            onClick={handleClaim}
            className={`bg-secondary-container text-on-secondary-container hover:bg-[#8B6914] hover:text-white transition-colors font-label-caps text-label-caps px-6 py-3 rounded-lg shadow-sm flex items-center gap-2 uppercase tracking-wider ${claimed ? 'bg-success text-white' : ''}`}
          >
            {claimed ? (
              <>Claimed! <span className="material-symbols-outlined text-[16px]">check_circle</span></>
            ) : (
              <>Claim 50 Coins <span className="text-[16px]">🪙</span></>
            )}
          </button>
        </div>
      </div>

      {/* BottomNavBar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 bg-primary-container shadow-[0px_-4px_20px_rgba(13,27,53,0.1)]">
        <Link href="/" className="flex flex-col items-center justify-center text-on-primary-fixed-variant px-3 py-1 hover:text-secondary-fixed transition-colors">
          <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
          <span className="font-label-caps text-label-caps">Home</span>
        </Link>
        <button className="flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-xl px-3 py-1 active:scale-90 transition-all">
          <span className="material-symbols-outlined mb-1">payments</span>
          <span className="font-label-caps text-label-caps">Earn</span>
        </button>
        <Link href="/music" className="flex flex-col items-center justify-center text-on-primary-fixed-variant px-3 py-1 hover:text-secondary-fixed transition-colors">
          <span className="material-symbols-outlined mb-1">music_note</span>
          <span className="font-label-caps text-label-caps">Music</span>
        </Link>
        <Link href="/marketplace" className="flex flex-col items-center justify-center text-on-primary-fixed-variant px-3 py-1 hover:text-secondary-fixed transition-colors">
          <span className="material-symbols-outlined mb-1">storefront</span>
          <span className="font-label-caps text-label-caps">Market</span>
        </Link>
        <Link href="/wallet" className="flex flex-col items-center justify-center text-on-primary-fixed-variant px-3 py-1 hover:text-secondary-fixed transition-colors">
          <span className="material-symbols-outlined mb-1">account_balance_wallet</span>
          <span className="font-label-caps text-label-caps">Wallet</span>
        </Link>
      </nav>
    </div>
  );
}
