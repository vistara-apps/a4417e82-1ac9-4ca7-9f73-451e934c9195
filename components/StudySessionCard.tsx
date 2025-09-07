'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { type StudySession } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface StudySessionCardProps {
  session: StudySession;
  onJoin?: (sessionId: string) => void;
  onView?: (sessionId: string) => void;
  isJoined?: boolean;
}

export function StudySessionCard({ 
  session, 
  onJoin, 
  onView, 
  isJoined = false 
}: StudySessionCardProps) {
  const handleJoin = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    onJoin?.(session.sessionId);
  };
  
  const handleView = () => {
    onView?.(session.sessionId);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500';
      case 'ongoing': return 'bg-green-500';
      case 'completed': return 'bg-gray-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  return (
    <Card onClick={handleView} className="h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-heading text-white">{session.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs text-white ${getStatusColor(session.status)}`}>
              {session.status}
            </span>
          </div>
          <p className="text-body text-white text-opacity-80 mb-3">
            {session.description}
          </p>
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-caption">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(session.dateTime)}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-caption">
          <MapPin className="w-4 h-4" />
          <span>{session.location}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-caption">
          <Users className="w-4 h-4" />
          <span>{session.attendees.length} attending</span>
          {session.maxAttendees && (
            <span>/ {session.maxAttendees} max</span>
          )}
        </div>
      </div>
      
      <div className="flex space-x-2">
        {!isJoined && session.status === 'upcoming' ? (
          <Button
            variant="primary"
            size="sm"
            onClick={handleJoin}
            className="flex-1"
          >
            Join Session
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleView}
            className="flex-1"
          >
            View Details
          </Button>
        )}
      </div>
    </Card>
  );
}
