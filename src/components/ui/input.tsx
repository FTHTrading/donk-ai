import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  leftIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, leftIcon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7b82b4] pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full bg-[#0a0b14] border border-[#2a2d4a] rounded-xl px-4 py-2.5',
            'text-sm text-[#e8eaf6] placeholder:text-[#7b82b4]',
            'focus:outline-none focus:ring-2 focus:ring-donk-500/40 focus:border-donk-500/60',
            'transition-all duration-200',
            leftIcon && 'pl-10',
            error && 'border-red-500/60 focus:ring-red-500/30',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <textarea
          ref={ref}
          className={cn(
            'w-full bg-[#0a0b14] border border-[#2a2d4a] rounded-xl px-4 py-2.5 resize-none',
            'text-sm text-[#e8eaf6] placeholder:text-[#7b82b4]',
            'focus:outline-none focus:ring-2 focus:ring-donk-500/40 focus:border-donk-500/60',
            'transition-all duration-200',
            error && 'border-red-500/60 focus:ring-red-500/30',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
