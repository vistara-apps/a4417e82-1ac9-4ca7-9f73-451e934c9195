'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Download, FileText, Tag, User } from 'lucide-react';
import { type Resource } from '@/lib/types';
import { formatRelativeTime } from '@/lib/utils';

interface ResourceCardProps {
  resource: Resource;
  onDownload?: (resourceId: string) => void;
  onView?: (resourceId: string) => void;
}

export function ResourceCard({ resource, onDownload, onView }: ResourceCardProps) {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownload?.(resource.resourceId);
  };
  
  const handleView = () => {
    onView?.(resource.resourceId);
  };
  
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    // For now, using FileText for all files
    return <FileText className="w-5 h-5" />;
  };
  
  return (
    <Card onClick={handleView} className="h-full">
      <div className="flex items-start space-x-3 mb-4">
        <div className="p-2 bg-white bg-opacity-20 rounded-lg">
          {getFileIcon(resource.fileName)}
        </div>
        <div className="flex-1">
          <h3 className="text-heading text-white mb-1">{resource.fileName}</h3>
          <p className="text-body text-white text-opacity-80 mb-2">
            {resource.description}
          </p>
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        {resource.tags.course && (
          <div className="flex items-center space-x-2 text-caption">
            <Tag className="w-3 h-3" />
            <span>Course: {resource.tags.course}</span>
          </div>
        )}
        
        {resource.tags.professor && (
          <div className="flex items-center space-x-2 text-caption">
            <User className="w-3 h-3" />
            <span>Prof: {resource.tags.professor}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between text-caption">
          <span>{formatRelativeTime(resource.uploadTimestamp)}</span>
          <span>{resource.downloadCount} downloads</span>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <Button
          variant="primary"
          size="sm"
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </Button>
      </div>
    </Card>
  );
}
