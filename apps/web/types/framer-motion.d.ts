declare module 'framer-motion' {
  import * as React from 'react';
  
  export type MotionProps<Element extends React.ElementType = 'div'> = React.ComponentPropsWithoutRef<Element> & {
    animate?: any;
    initial?: any;
    exit?: any;
    transition?: any;
    whileHover?: any;
    whileTap?: any;
    whileFocus?: any;
    whileDrag?: any;
    whileInView?: any;
    onTap?: () => void;
    onHoverStart?: () => void;
    onHoverEnd?: () => void;
  };
  
  export type HTMLMotionProps<Tag extends keyof React.JSX.IntrinsicElements> = 
    MotionProps<Tag> & React.ComponentPropsWithoutRef<Tag>;
  
  export const motion: {
    [Tag in keyof React.JSX.IntrinsicElements]: React.ForwardRefExoticComponent<
      React.RefAttributes<HTMLElementTagNameMap[Tag]> & HTMLMotionProps<Tag>
    >;
  };
  
  export interface AnimatePresenceProps {
    children: React.ReactNode;
    mode?: 'wait' | 'sync' | 'popLayout';
    initial?: boolean;
    custom?: any;
    onExitComplete?: () => void;
  }
  
  export const AnimatePresence: React.FC<AnimatePresenceProps>;
  
  export interface Transition {
    duration?: number;
    ease?: string | number[];
    type?: 'spring' | 'tween' | 'inertia';
    stiffness?: number;
    damping?: number;
    mass?: number;
    delay?: number;
    repeat?: number;
    repeatType?: 'loop' | 'mirror' | 'reverse';
    repeatDelay?: number;
  }
  
  export interface AnimationTarget {
    [key: string]: any;
  }
}

declare module 'framer-motion/client' {
  export * from 'framer-motion';
}