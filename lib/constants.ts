// App constants and configuration

export const APP_CONFIG = {
  name: 'CampusConnect',
  tagline: 'Discover Your Tribe. Ace Your Studies.',
  version: '1.0.0',
  supportEmail: 'support@campusconnect.app',
  baseChainId: 8453,
  usdcAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
};

export const MAJORS = [
  'Computer Science',
  'Business Administration',
  'Engineering',
  'Psychology',
  'Biology',
  'Mathematics',
  'English Literature',
  'History',
  'Chemistry',
  'Physics',
  'Economics',
  'Political Science',
  'Art & Design',
  'Music',
  'Education',
  'Medicine',
  'Law',
  'Architecture',
  'Environmental Science',
  'Communications',
];

export const INTERESTS = [
  'Machine Learning',
  'Web Development',
  'Data Science',
  'Entrepreneurship',
  'Research',
  'Hackathons',
  'Study Groups',
  'Tutoring',
  'Project Collaboration',
  'Career Development',
  'Networking',
  'Academic Writing',
  'Public Speaking',
  'Leadership',
  'Volunteer Work',
  'Sports',
  'Music',
  'Art',
  'Photography',
  'Travel',
];

export const PRIVACY_LEVELS = {
  PUBLIC: 'public',
  PRIVATE: 'private',
} as const;

export const SESSION_STATUS = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const PROJECT_CATEGORIES = {
  HACKATHON: 'hackathon',
  COURSEWORK: 'coursework',
  RESEARCH: 'research',
  EXTRACURRICULAR: 'extracurricular',
} as const;

export const MICRO_TRANSACTION_PRICES = {
  FEATURED_POST: 0.5, // $0.50 USDC
  ADVANCED_FILTERS: 1.0, // $1.00 USDC
  RESOURCE_BUMP: 0.25, // $0.25 USDC
  PREMIUM_SEARCH: 0.75, // $0.75 USDC
} as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'image/jpeg',
  'image/png',
];

export const ANIMATION_DURATION = {
  FAST: 100,
  BASE: 200,
  SLOW: 400,
} as const;
