// User types
export interface User {
  userId: string;
  displayName: string;
  major: string;
  interests: string[];
  bio: string;
  connections: string[];
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

// Group types
export interface Group {
  groupId: string;
  name: string;
  description: string;
  members: string[];
  interests: string[];
  privacyLevel: 'public' | 'private';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  memberCount: number;
  featured: boolean;
  featuredUntil: string | null;
}

// Study Session types
export interface StudySession {
  sessionId: string;
  groupId: string;
  title: string;
  description: string;
  dateTime: string;
  location: string;
  attendees: string[];
  maxAttendees: number | null;
  createdBy: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// Resource types
export interface Resource {
  resourceId: string;
  groupId: string;
  uploadedBy: string;
  fileName: string;
  storageHash: string;
  tags: {
    course?: string;
    professor?: string;
    topic?: string;
  };
  description: string;
  uploadTimestamp: string;
  downloadCount: number;
  featured: boolean;
  featuredUntil: string | null;
}

// Project types
export interface Project {
  projectId: string;
  title: string;
  description: string;
  requiredSkills: string[];
  createdBy: string;
  collaborators: string[];
  status: 'open' | 'in-progress' | 'completed';
  deadline: string | null;
  category: 'hackathon' | 'coursework' | 'research' | 'extracurricular';
  createdAt: string;
  updatedAt: string;
}

// Payment types
export interface Payment {
  paymentId: string;
  userId: string;
  amount: number;
  currency: string;
  type: string;
  status: 'pending' | 'completed' | 'failed';
  transactionHash: string | null;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  error?: string;
  success: boolean;
}

// Form types
export interface CreateGroupForm {
  name: string;
  description: string;
  interests: string[];
  privacyLevel: 'public' | 'private';
}

export interface CreateSessionForm {
  title: string;
  description: string;
  dateTime: string;
  location: string;
  maxAttendees?: number;
  groupId: string;
}

export interface CreateProjectForm {
  title: string;
  description: string;
  requiredSkills: string[];
  deadline?: string;
  category: 'hackathon' | 'coursework' | 'research' | 'extracurricular';
}

export interface CreateResourceForm {
  fileName: string;
  description: string;
  tags: {
    course?: string;
    professor?: string;
    topic?: string;
  };
  groupId: string;
}

export interface OnboardingForm {
  displayName: string;
  major: string;
  interests: string[];
  bio?: string;
}

// Filter types
export interface GroupFilters {
  search?: string;
  interests?: string[];
  privacyLevel?: 'public' | 'private';
}

export interface ResourceFilters {
  groupId?: string;
  search?: string;
  course?: string;
  professor?: string;
  topic?: string;
}

export interface ProjectFilters {
  search?: string;
  skills?: string[];
  category?: string;
  status?: string;
}

// Component prop types
export interface GroupCardProps {
  group: Group;
  onJoin: (groupId: string) => void;
  onView: (groupId: string) => void;
  onFeature?: (groupId: string) => void;
}

export interface StudySessionCardProps {
  session: StudySession;
  onJoin: (sessionId: string) => void;
  onView: (sessionId: string) => void;
}

export interface ResourceCardProps {
  resource: Resource;
  onDownload: (resourceId: string) => void;
  onView: (resourceId: string) => void;
  onFeature?: (resourceId: string) => void;
}

export interface ProjectCardProps {
  project: Project;
  onJoin: (projectId: string) => void;
  onView: (projectId: string) => void;
}

// Utility types
export type TabType = 'home' | 'groups' | 'resources' | 'projects' | 'profile';
export type CreateType = 'group' | 'session' | 'project' | 'resource';
export type PaymentType = 'FEATURED_POST' | 'ADVANCED_FILTERS' | 'RESOURCE_BUMP' | 'PREMIUM_GROUP';

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: 'group_invite' | 'session_reminder' | 'project_update' | 'resource_shared';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  metadata?: Record<string, any>;
}
