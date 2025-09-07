'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Users, Calendar, Tag } from 'lucide-react';
import { type Project } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  onJoin?: (projectId: string) => void;
  onView?: (projectId: string) => void;
  isJoined?: boolean;
}

export function ProjectCard({ project, onJoin, onView, isJoined = false }: ProjectCardProps) {
  const handleJoin = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    onJoin?.(project.projectId);
  };
  
  const handleView = () => {
    onView?.(project.projectId);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'hackathon': return 'bg-purple-500';
      case 'coursework': return 'bg-blue-500';
      case 'research': return 'bg-green-500';
      case 'extracurricular': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };
  
  return (
    <Card onClick={handleView} className="h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-heading text-white">{project.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs text-white ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
          </div>
          <p className="text-body text-white text-opacity-80 mb-3">
            {project.description}
          </p>
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-caption">
          <Tag className="w-4 h-4" />
          <span className={`px-2 py-1 rounded-full text-xs text-white ${getCategoryColor(project.category)}`}>
            {project.category}
          </span>
        </div>
        
        <div className="flex items-center space-x-2 text-caption">
          <Users className="w-4 h-4" />
          <span>{project.collaborators.length} collaborators</span>
        </div>
        
        {project.deadline && (
          <div className="flex items-center space-x-2 text-caption">
            <Calendar className="w-4 h-4" />
            <span>Due: {formatDate(project.deadline)}</span>
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {project.requiredSkills.slice(0, 3).map((skill) => (
          <span
            key={skill}
            className="px-2 py-1 bg-white bg-opacity-20 rounded-full text-xs text-white"
          >
            {skill}
          </span>
        ))}
        {project.requiredSkills.length > 3 && (
          <span className="px-2 py-1 bg-white bg-opacity-20 rounded-full text-xs text-white">
            +{project.requiredSkills.length - 3} more
          </span>
        )}
      </div>
      
      <div className="flex space-x-2">
        {!isJoined && project.status === 'open' ? (
          <Button
            variant="primary"
            size="sm"
            onClick={handleJoin}
            className="flex-1"
          >
            Join Project
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleView}
            className="flex-1"
          >
            View Project
          </Button>
        )}
      </div>
    </Card>
  );
}
