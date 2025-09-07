'use client';

import { Card } from './Card';
import { cn } from '@/lib/utils';

interface SkeletonCardProps {
  className?: string;
  variant?: 'group' | 'resource' | 'project' | 'session';
}

export function SkeletonCard({ className, variant = 'group' }: SkeletonCardProps) {
  return (
    <Card className={cn('animate-pulse', className)}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full" />
          <div>
            <div className="h-4 bg-white bg-opacity-20 rounded w-32 mb-2" />
            <div className="h-3 bg-white bg-opacity-20 rounded w-24" />
          </div>
        </div>
      </div>
      
      {/* Description */}
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-white bg-opacity-20 rounded w-full" />
        <div className="h-3 bg-white bg-opacity-20 rounded w-3/4" />
        <div className="h-3 bg-white bg-opacity-20 rounded w-1/2" />
      </div>
      
      {/* Tags/Skills */}
      <div className="flex space-x-2 mb-4">
        <div className="h-6 bg-white bg-opacity-20 rounded-full w-16" />
        <div className="h-6 bg-white bg-opacity-20 rounded-full w-20" />
        <div className="h-6 bg-white bg-opacity-20 rounded-full w-12" />
      </div>
      
      {/* Action Button */}
      <div className="h-9 bg-white bg-opacity-20 rounded w-full" />
    </Card>
  );
}

export function SkeletonGrid({ count = 6, variant = 'group' }: { count?: number; variant?: 'group' | 'resource' | 'project' | 'session' }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} variant={variant} />
      ))}
    </div>
  );
}
