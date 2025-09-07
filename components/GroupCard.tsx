'use client';

import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Users, Lock, Globe } from 'lucide-react';
import { type Group } from '@/lib/types';
import { truncateText } from '@/lib/utils';

interface GroupCardProps {
  group: Group;
  onJoin?: (groupId: string) => void;
  onView?: (groupId: string) => void;
  isJoined?: boolean;
}

export function GroupCard({ group, onJoin, onView, isJoined = false }: GroupCardProps) {
  const handleJoin = (e: React.MouseEvent) => {
    e.stopPropagation();
    onJoin?.(group.groupId);
  };
  
  const handleView = () => {
    onView?.(group.groupId);
  };
  
  return (
    <Card onClick={handleView} className="h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Avatar 
            fallback={group.name}
            size="md"
          />
          <div>
            <h3 className="text-heading text-white">{group.name}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <div className="flex items-center space-x-1 text-caption">
                <Users className="w-3 h-3" />
                <span>{group.memberCount} members</span>
              </div>
              <div className="flex items-center space-x-1 text-caption">
                {group.privacyLevel === 'private' ? (
                  <Lock className="w-3 h-3" />
                ) : (
                  <Globe className="w-3 h-3" />
                )}
                <span>{group.privacyLevel}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-body text-white text-opacity-80 mb-4">
        {truncateText(group.description, 120)}
      </p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {group.interests.slice(0, 3).map((interest) => (
          <span
            key={interest}
            className="px-2 py-1 bg-white bg-opacity-20 rounded-full text-xs text-white"
          >
            {interest}
          </span>
        ))}
        {group.interests.length > 3 && (
          <span className="px-2 py-1 bg-white bg-opacity-20 rounded-full text-xs text-white">
            +{group.interests.length - 3} more
          </span>
        )}
      </div>
      
      <div className="flex space-x-2">
        {!isJoined ? (
          <Button
            variant="primary"
            size="sm"
            onClick={handleJoin}
            className="flex-1"
          >
            Join Group
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleView}
            className="flex-1"
          >
            View Group
          </Button>
        )}
      </div>
    </Card>
  );
}
