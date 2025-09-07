// Core data model types based on specifications

export interface User {
  userId: string; // Farcaster FID or Privy Wallet Address
  displayName: string;
  major: string;
  interests: string[];
  bio: string;
  connections: string[];
  avatar?: string;
}

export interface Group {
  groupId: string;
  name: string;
  description: string;
  members: string[];
  interests: string[];
  privacyLevel: 'public' | 'private';
  createdBy: string;
  createdAt: Date;
  memberCount: number;
}

export interface Resource {
  resourceId: string;
  groupId: string;
  uploadedBy: string; // userId
  fileName: string;
  storageHash: string; // IPFS CID
  tags: {
    course?: string;
    professor?: string;
    topic?: string;
  };
  description: string;
  uploadTimestamp: Date;
  downloadCount: number;
}

export interface StudySession {
  sessionId: string;
  groupId: string;
  title: string;
  description: string;
  dateTime: Date;
  location: string; // physical location or virtual link
  attendees: string[];
  maxAttendees?: number;
  createdBy: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface Project {
  projectId: string;
  title: string;
  description: string;
  requiredSkills: string[];
  createdBy: string;
  collaborators: string[];
  status: 'open' | 'in-progress' | 'completed';
  deadline?: Date;
  category: 'hackathon' | 'coursework' | 'research' | 'extracurricular';
}

// UI Component Props
export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated';
  onClick?: () => void;
}

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'search';
  className?: string;
  disabled?: boolean;
}

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  fallback?: string;
  className?: string;
}
