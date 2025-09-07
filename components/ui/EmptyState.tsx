'use client';

import { Card } from './Card';
import { Button } from './Button';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className
}: EmptyStateProps) {
  return (
    <Card className={cn('text-center py-12', className)}>
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
          <Icon className="w-8 h-8 text-white text-opacity-60" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-heading text-white">{title}</h3>
          <p className="text-body text-white text-opacity-70 max-w-md mx-auto">
            {description}
          </p>
        </div>
        
        {actionLabel && onAction && (
          <Button
            variant="primary"
            onClick={onAction}
            className="mt-4"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  );
}
