'use client';

import { cn } from '@/lib/utils';
import { type InputProps } from '@/lib/types';

export function Input({
  placeholder,
  value,
  onChange,
  type = 'text',
  className = '',
  disabled = false,
}: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={disabled}
      className={cn('input-field w-full', className)}
    />
  );
}
