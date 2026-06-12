'use client';

import { useEffect, useState } from 'react';

interface ReadingProgressProps {
  targetId?: string;
}

export default function ReadingProgress({ targetId }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const element = targetId
        ? document.getElementById(targetId)
        : document.documentElement;

      if (!element) return;

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = element.scrollHeight - element.clientHeight;
      const scrollPercentage = (scrollTop / scrollHeight) * 100;

      setProgress(Math.min(100, Math.max(0, scrollPercentage)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [targetId]);

  return (
    <div className="fixed top-0 left-0 right-0 h-2 bg-neu-bg shadow-neu-inset z-[100]">
      <div
        className="h-full bg-gradient-to-r from-neo-primary to-neo-secondary shadow-neu-raised-sm transition-all duration-150 rounded-r-full"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}