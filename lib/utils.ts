import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Search and filter utilities
export function searchGroups(groups: any[], query: string) {
  if (!query.trim()) return groups;
  
  const searchTerm = query.toLowerCase();
  return groups.filter(group => 
    group.name.toLowerCase().includes(searchTerm) ||
    group.description.toLowerCase().includes(searchTerm) ||
    group.interests.some((interest: string) => 
      interest.toLowerCase().includes(searchTerm)
    )
  );
}

export function searchResources(resources: any[], query: string) {
  if (!query.trim()) return resources;
  
  const searchTerm = query.toLowerCase();
  return resources.filter(resource => 
    resource.fileName.toLowerCase().includes(searchTerm) ||
    resource.description.toLowerCase().includes(searchTerm) ||
    resource.tags.course.toLowerCase().includes(searchTerm) ||
    resource.tags.professor.toLowerCase().includes(searchTerm) ||
    resource.tags.topic.toLowerCase().includes(searchTerm)
  );
}

export function searchProjects(projects: any[], query: string) {
  if (!query.trim()) return projects;
  
  const searchTerm = query.toLowerCase();
  return projects.filter(project => 
    project.title.toLowerCase().includes(searchTerm) ||
    project.description.toLowerCase().includes(searchTerm) ||
    project.requiredSkills.some((skill: string) => 
      skill.toLowerCase().includes(searchTerm)
    ) ||
    project.category.toLowerCase().includes(searchTerm)
  );
}
