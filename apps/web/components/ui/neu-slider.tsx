'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface NeuSliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
}

const NeuSlider = React.forwardRef<HTMLInputElement, NeuSliderProps>(
  ({ className, label, min = 0, max = 100, step = 1, showValue = false, disabled, ...props }, ref) => {
    const [value, setValue] = React.useState(typeof props.defaultValue === 'number' ? props.defaultValue : min);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Math.max(min, Math.min(max, parseFloat(e.target.value) || min));
      setValue(newValue);
      props.onChange?.(e);
    };
    
    const percentage = ((value - min) / (max - min)) * 100;

    return (
      <div className={cn('w-full', className)}>
        {label && (
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-neo-text-primary">{label}</label>
            {showValue && (
              <span className="text-sm font-mono text-neo-text-secondary bg-neu-bg px-2 py-1 rounded-lg shadow-neu-inset">
                {value}
              </span>
            )}
          </div>
        )}
        <div className="relative">
          <div className="h-3 w-full rounded-full overflow-hidden shadow-neu-inset bg-neu-bg">
            <motion.div
              className="h-full rounded-full shadow-neu-raised"
              style={{ 
                background: 'linear-gradient(90deg, var(--neo-primary), var(--neo-primary-hover))',
                width: `${percentage}%`
              }}
              animate={{ width: `${percentage}%` }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            />
          </div>
          <input
            ref={ref}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleChange}
            disabled={disabled}
            className="absolute inset-0 w-full h-3 opacity-0 cursor-pointer"
            style={{ WebkitAppearance: 'none' }}
            {...props}
          />
        </div>
      </div>
    );
  }
);
NeuSlider.displayName = 'NeuSlider';

export { NeuSlider };