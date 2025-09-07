import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Service role client for admin operations
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const supabaseAdmin = supabaseServiceRoleKey 
  ? createClient<Database>(supabaseUrl, supabaseServiceRoleKey)
  : null;

// Database operations
export class SupabaseService {
  // User operations
  static async createUser(userData: {
    userId: string;
    displayName: string;
    major: string;
    interests: string[];
    bio?: string;
    avatar?: string;
  }) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getUser(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('userId', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async updateUser(userId: string, updates: Partial<{
    displayName: string;
    major: string;
    interests: string[];
    bio: string;
    avatar: string;
  }>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('userId', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Group operations
  static async createGroup(groupData: {
    name: string;
    description: string;
    interests: string[];
    privacyLevel: 'public' | 'private';
    createdBy: string;
  }) {
    const { data, error } = await supabase
      .from('groups')
      .insert([{
        ...groupData,
        members: [groupData.createdBy],
        memberCount: 1,
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getGroups(filters?: {
    search?: string;
    interests?: string[];
    privacyLevel?: 'public' | 'private';
  }) {
    let query = supabase
      .from('groups')
      .select('*')
      .order('createdAt', { ascending: false });

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    if (filters?.privacyLevel) {
      query = query.eq('privacyLevel', filters.privacyLevel);
    }

    if (filters?.interests && filters.interests.length > 0) {
      query = query.overlaps('interests', filters.interests);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async joinGroup(groupId: string, userId: string) {
    // First get the current group
    const { data: group, error: fetchError } = await supabase
      .from('groups')
      .select('members, memberCount')
      .eq('groupId', groupId)
      .single();

    if (fetchError) throw fetchError;

    // Add user to members array if not already present
    const updatedMembers = group.members.includes(userId) 
      ? group.members 
      : [...group.members, userId];

    const { data, error } = await supabase
      .from('groups')
      .update({
        members: updatedMembers,
        memberCount: updatedMembers.length,
      })
      .eq('groupId', groupId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Study Session operations
  static async createStudySession(sessionData: {
    groupId: string;
    title: string;
    description: string;
    dateTime: string;
    location: string;
    maxAttendees?: number;
    createdBy: string;
  }) {
    const { data, error } = await supabase
      .from('study_sessions')
      .insert([{
        ...sessionData,
        attendees: [sessionData.createdBy],
        status: 'upcoming',
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getStudySessions(groupId?: string) {
    let query = supabase
      .from('study_sessions')
      .select('*')
      .order('dateTime', { ascending: true });

    if (groupId) {
      query = query.eq('groupId', groupId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async joinStudySession(sessionId: string, userId: string) {
    // First get the current session
    const { data: session, error: fetchError } = await supabase
      .from('study_sessions')
      .select('attendees, maxAttendees')
      .eq('sessionId', sessionId)
      .single();

    if (fetchError) throw fetchError;

    // Check if user is already attending
    if (session.attendees.includes(userId)) {
      return session;
    }

    // Check if session is full
    if (session.maxAttendees && session.attendees.length >= session.maxAttendees) {
      throw new Error('Study session is full');
    }

    const updatedAttendees = [...session.attendees, userId];

    const { data, error } = await supabase
      .from('study_sessions')
      .update({
        attendees: updatedAttendees,
      })
      .eq('sessionId', sessionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Resource operations
  static async createResource(resourceData: {
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
  }) {
    const { data, error } = await supabase
      .from('resources')
      .insert([{
        ...resourceData,
        downloadCount: 0,
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getResources(filters?: {
    groupId?: string;
    search?: string;
    course?: string;
    professor?: string;
    topic?: string;
  }) {
    let query = supabase
      .from('resources')
      .select('*')
      .order('uploadTimestamp', { ascending: false });

    if (filters?.groupId) {
      query = query.eq('groupId', filters.groupId);
    }

    if (filters?.search) {
      query = query.or(`fileName.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    if (filters?.course) {
      query = query.eq('tags->>course', filters.course);
    }

    if (filters?.professor) {
      query = query.eq('tags->>professor', filters.professor);
    }

    if (filters?.topic) {
      query = query.eq('tags->>topic', filters.topic);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async incrementDownloadCount(resourceId: string) {
    const { data, error } = await supabase
      .rpc('increment_download_count', { resource_id: resourceId });
    
    if (error) throw error;
    return data;
  }

  // Project operations
  static async createProject(projectData: {
    title: string;
    description: string;
    requiredSkills: string[];
    createdBy: string;
    deadline?: string;
    category: 'hackathon' | 'coursework' | 'research' | 'extracurricular';
  }) {
    const { data, error } = await supabase
      .from('projects')
      .insert([{
        ...projectData,
        collaborators: [],
        status: 'open',
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getProjects(filters?: {
    search?: string;
    skills?: string[];
    category?: string;
    status?: string;
  }) {
    let query = supabase
      .from('projects')
      .select('*')
      .order('createdAt', { ascending: false });

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    if (filters?.skills && filters.skills.length > 0) {
      query = query.overlaps('requiredSkills', filters.skills);
    }

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async joinProject(projectId: string, userId: string) {
    // First get the current project
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('collaborators')
      .eq('projectId', projectId)
      .single();

    if (fetchError) throw fetchError;

    // Add user to collaborators array if not already present
    const updatedCollaborators = project.collaborators.includes(userId) 
      ? project.collaborators 
      : [...project.collaborators, userId];

    const { data, error } = await supabase
      .from('projects')
      .update({
        collaborators: updatedCollaborators,
      })
      .eq('projectId', projectId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Payment operations
  static async createPayment(paymentData: {
    userId: string;
    amount: number;
    currency: string;
    type: string;
    status?: 'pending' | 'completed' | 'failed';
    transactionHash?: string | null;
    metadata?: Record<string, any>;
  }) {
    const { data, error } = await supabase
      .from('payments')
      .insert([paymentData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updatePayment(paymentId: string, updates: {
    status?: 'pending' | 'completed' | 'failed';
    transactionHash?: string;
  }) {
    const { data, error } = await supabase
      .from('payments')
      .update(updates)
      .eq('paymentId', paymentId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getPayment(paymentId: string) {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('paymentId', paymentId)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getPaymentHistory(userId: string) {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async featureGroup(groupId: string, days: number) {
    const featuredUntil = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
    
    const { data, error } = await supabase
      .from('groups')
      .update({
        featured: true,
        featuredUntil,
      })
      .eq('groupId', groupId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async featureResource(resourceId: string, days: number) {
    const featuredUntil = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
    
    const { data, error } = await supabase
      .from('resources')
      .update({
        featured: true,
        featuredUntil,
      })
      .eq('resourceId', resourceId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async bumpResource(resourceId: string) {
    const { data, error } = await supabase
      .from('resources')
      .update({
        uploadTimestamp: new Date().toISOString(),
      })
      .eq('resourceId', resourceId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}
