export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          userId: string;
          displayName: string;
          major: string;
          interests: string[];
          bio: string;
          connections: string[];
          avatar: string | null;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          userId: string;
          displayName: string;
          major: string;
          interests: string[];
          bio?: string;
          connections?: string[];
          avatar?: string | null;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          userId?: string;
          displayName?: string;
          major?: string;
          interests?: string[];
          bio?: string;
          connections?: string[];
          avatar?: string | null;
          updatedAt?: string;
        };
      };
      groups: {
        Row: {
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
        };
        Insert: {
          groupId?: string;
          name: string;
          description: string;
          members: string[];
          interests: string[];
          privacyLevel: 'public' | 'private';
          createdBy: string;
          createdAt?: string;
          updatedAt?: string;
          memberCount?: number;
          featured?: boolean;
          featuredUntil?: string | null;
        };
        Update: {
          groupId?: string;
          name?: string;
          description?: string;
          members?: string[];
          interests?: string[];
          privacyLevel?: 'public' | 'private';
          createdBy?: string;
          updatedAt?: string;
          memberCount?: number;
          featured?: boolean;
          featuredUntil?: string | null;
        };
      };
      study_sessions: {
        Row: {
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
        };
        Insert: {
          sessionId?: string;
          groupId: string;
          title: string;
          description: string;
          dateTime: string;
          location: string;
          attendees: string[];
          maxAttendees?: number | null;
          createdBy: string;
          status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          sessionId?: string;
          groupId?: string;
          title?: string;
          description?: string;
          dateTime?: string;
          location?: string;
          attendees?: string[];
          maxAttendees?: number | null;
          createdBy?: string;
          status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
          updatedAt?: string;
        };
      };
      resources: {
        Row: {
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
        };
        Insert: {
          resourceId?: string;
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
          uploadTimestamp?: string;
          downloadCount?: number;
          featured?: boolean;
          featuredUntil?: string | null;
        };
        Update: {
          resourceId?: string;
          groupId?: string;
          uploadedBy?: string;
          fileName?: string;
          storageHash?: string;
          tags?: {
            course?: string;
            professor?: string;
            topic?: string;
          };
          description?: string;
          uploadTimestamp?: string;
          downloadCount?: number;
          featured?: boolean;
          featuredUntil?: string | null;
        };
      };
      projects: {
        Row: {
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
        };
        Insert: {
          projectId?: string;
          title: string;
          description: string;
          requiredSkills: string[];
          createdBy: string;
          collaborators?: string[];
          status?: 'open' | 'in-progress' | 'completed';
          deadline?: string | null;
          category: 'hackathon' | 'coursework' | 'research' | 'extracurricular';
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          projectId?: string;
          title?: string;
          description?: string;
          requiredSkills?: string[];
          createdBy?: string;
          collaborators?: string[];
          status?: 'open' | 'in-progress' | 'completed';
          deadline?: string | null;
          category?: 'hackathon' | 'coursework' | 'research' | 'extracurricular';
          updatedAt?: string;
        };
      };
      payments: {
        Row: {
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
        };
        Insert: {
          paymentId?: string;
          userId: string;
          amount: number;
          currency: string;
          type: string;
          status?: 'pending' | 'completed' | 'failed';
          transactionHash?: string | null;
          metadata?: Record<string, any>;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          paymentId?: string;
          userId?: string;
          amount?: number;
          currency?: string;
          type?: string;
          status?: 'pending' | 'completed' | 'failed';
          transactionHash?: string | null;
          metadata?: Record<string, any>;
          updatedAt?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_download_count: {
        Args: {
          resource_id: string;
        };
        Returns: void;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
