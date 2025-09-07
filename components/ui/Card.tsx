'use client';

import { cn } from '@/lib/utils';
import { type CardProps } from '@/lib/types';

export function Card({ 
  children, 
  className = '', 
  variant = 'default',
  onClick 
}: CardProps) {
  const baseClasses = 'glass-card p-6 animate-fade-in';
  
  const variantClasses = {
    default: '',
    elevated: 'shadow-xl hover:shadow-2xl',
  };
  
  const interactiveClasses = onClick ? 'card-hover' : '';
  
  return (
    <div 
      className={cn(
        baseClasses,
        variantClasses[variant],
        interactiveClasses,
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {children}
    </div>
  );
}
