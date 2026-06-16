'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Milestone30Page() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Confetti logic
    const container = document.getElementById('confetti-container');
    if (!container) return;
    
    const colors = ['#B8860B', '#fdc34d', '#ffffff', '#b9c6e8'];
    const elements: HTMLDivElement[] = [];
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'absolute';
      confetti.style.width = '10px';
      confetti.style.height = '30px';
      confetti.style.background = '#ffd300';
      confetti.style.top = '0';
      confetti.style.opacity = '0';
      
      // Randomize properties
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.animation = `makeItRain ${2 + Math.random() * 2}s infinite ease-in-out ${Math.random() * 3}s`;
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      
      // Randomize shape slightly
      if (Math.random() > 0.5) {
        confetti.style.borderRadius = '50%';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
      }
      
      container.appendChild(confetti);
      elements.push(confetti);
    }
    
    const timeout1 = setTimeout(() => {
      if (container) {
        container.style.opacity = '0';
        container.style.transition = 'opacity 2s ease';
      }
    }, 5000);
    
    const timeout2 = setTimeout(() => {
      elements.forEach(el => el.remove());
    }, 7000);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      elements.forEach(el => el.remove());
    };
  }, []);

  return (
    <div className="flex-1 w-full overflow-x-hidden pb-24 md:pb-0 relative min-h-[calc(100vh-64px)]">
      {/* Confetti Overlay Container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[100] fixed" id="confetti-container">
        {mounted && (
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes makeItRain {
                0% { opacity: 0; top: -10%; transform: rotate(0deg); }
                10% { opacity: 1; }
                50% { opacity: 1; transform: rotate(180deg); }
                100% { opacity: 0; top: 110%; transform: rotate(360deg); }
            }
          `}} />
        )}
      </div>

      {/* Hero Celebration Section */}
      <section className="bg-primary-container relative py-20 px-margin-mobile md:px-margin-desktop flex flex-col items-center justify-center text-center overflow-hidden -mx-margin-mobile lg:-mx-gutter lg:-mt-16 w-[calc(100%+32px)] lg:w-[calc(100%+48px)]">
        {/* Decorative Background Element */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-container to-primary-fixed-dim/20 pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-6">
          {/* Golden Laurel / Badge */}
          <div className="w-32 h-32 rounded-full border-4 border-[#B8860B] bg-primary-fixed flex items-center justify-center shadow-[0_0_40px_rgba(184,134,11,0.3)] mb-4">
            <span className="material-symbols-outlined text-6xl text-[#B8860B]" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
          </div>
          <h1 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-on-primary mb-2">30 Days Unlocked!</h1>
          <p className="font-body-lg text-body-lg text-on-primary-container">Incredible consistency. You've actively shaped the creative economy for a full month.</p>
        </div>
      </section>

      <div className="max-w-container-max mx-auto -mt-12 relative z-20 flex flex-col gap-gutter">
        {/* Reward Card */}
        <div className="bg-surface-alt rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 border-2 border-[#B8860B] shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-[#B8860B]/10 rounded-full flex items-center justify-center border border-[#B8860B] shrink-0">
              <span className="material-symbols-outlined text-4xl text-[#B8860B]">toll</span>
            </div>
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase tracking-wider">Milestone Bonus</p>
              <h2 className="font-h2 text-h2 text-primary">10,000 CMP Coins</h2>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0">
            <button className="bg-[#B8860B] text-primary font-label-caps text-label-caps py-4 px-8 rounded-lg hover:bg-[#8B6914] transition-colors shadow-md whitespace-nowrap uppercase">
              Claim Reward
            </button>
            <button className="bg-primary text-on-primary font-label-caps text-label-caps py-4 px-8 rounded-lg hover:bg-on-primary-fixed transition-colors flex items-center justify-center gap-2 whitespace-nowrap uppercase">
              <span className="material-symbols-outlined text-[18px]">share</span>
              Share Achievement
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mt-8">
          {/* Streak Journey Chart */}
          <div className="lg:col-span-2 bg-surface-alt rounded-xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/30">
            <h3 className="font-h3 text-h3 text-on-background mb-6">Your Streak Journey</h3>
            <div className="relative pt-8 pb-4">
              {/* Progress Line */}
              <div className="absolute top-1/2 left-0 w-full h-2 bg-surface-container-high rounded-full -translate-y-1/2"></div>
              <div className="absolute top-1/2 left-0 w-full h-2 bg-[#B8860B] rounded-full -translate-y-1/2"></div>
              
              {/* Milestones */}
              <div className="flex justify-between relative z-10">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#B8860B] border-4 border-surface-alt shadow-sm"></div>
                  <span className="font-data-md text-data-md text-on-surface-variant">Day 1</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#B8860B] border-4 border-surface-alt shadow-sm"></div>
                  <span className="font-data-md text-data-md text-on-surface-variant">Day 10</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#B8860B] border-4 border-surface-alt shadow-sm"></div>
                  <span className="font-data-md text-data-md text-on-surface-variant">Day 20</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary border-4 border-[#B8860B] shadow-md flex items-center justify-center -mt-1">
                    <span className="material-symbols-outlined text-[14px] text-[#B8860B]">check</span>
                  </div>
                  <span className="font-data-md text-data-md text-primary font-bold">Day 30</span>
                </div>
              </div>
            </div>
          </div>

          {/* Next Goal Teaser */}
          <div className="bg-primary-container text-on-primary rounded-xl p-8 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-[#B8860B]">flag</span>
                <span className="font-label-caps text-label-caps text-[#B8860B] uppercase tracking-wider">Next Objective</span>
              </div>
              <h3 className="font-h3 text-h3 mb-2 text-on-primary">60-Day Titan</h3>
              <p className="font-body-sm text-body-sm text-on-primary-container">Maintain your momentum for another 30 days to unlock exclusive Creator Tier status and a massive 25k bonus.</p>
            </div>
            
            <div className="mt-8">
              <div className="flex justify-between mb-2">
                <span className="font-data-md text-data-md text-on-primary-container">Progress</span>
                <span className="font-data-md text-data-md text-[#B8860B]">30 / 60</span>
              </div>
              <div className="w-full h-3 bg-on-primary-fixed-variant rounded-full overflow-hidden">
                <div className="w-1/2 h-full bg-[#B8860B] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
