'use client';

import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';
import { type AvatarProps } from '@/lib/types';

export function Avatar({
  src,
  alt = '',
  size = 'md',
  fallback,
  className = '',
}: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
  };
  
  const baseClasses = 'rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold';
  
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={cn(baseClasses, sizeClasses[size], className)}
      />
    );
  }
  
  const initials = fallback ? getInitials(fallback) : '?';
  
  return (
    <div className={cn(baseClasses, sizeClasses[size], className)}>
      {initials}
    </div>
  );
}
