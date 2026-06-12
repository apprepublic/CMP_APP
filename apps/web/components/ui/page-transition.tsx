'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

export interface PageTransitionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function PageTransition({ children, className = '', delay = 0 }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{
        duration: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ children, className = '', stagger = 0.08 }: { children: ReactNode; className?: string; stagger?: number }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      className={className}
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: stagger },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}