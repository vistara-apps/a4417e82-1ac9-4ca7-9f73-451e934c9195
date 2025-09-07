import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SupabaseService } from '../services/supabase';
import { PaymentService } from '../services/payments';
import { Group } from '../types';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export function useGroups(filters?: {
  search?: string;
  interests?: string[];
  privacyLevel?: 'public' | 'private';
}) {
  const queryClient = useQueryClient();

  const {
    data: groups = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['groups', filters],
    queryFn: () => SupabaseService.getGroups(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    groups,
    isLoading,
    error,
    refetch,
  };
}

export function useCreateGroup() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (groupData: {
      name: string;
      description: string;
      interests: string[];
      privacyLevel: 'public' | 'private';
    }) => {
      if (!user?.userId) {
        throw new Error('User not authenticated');
      }

      return SupabaseService.createGroup({
        ...groupData,
        createdBy: user.userId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast.success('Group created successfully!');
    },
    onError: (error) => {
      console.error('Error creating group:', error);
      toast.error('Failed to create group');
    },
  });
}

export function useJoinGroup() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (groupId: string) => {
      if (!user?.userId) {
        throw new Error('User not authenticated');
      }

      return SupabaseService.joinGroup(groupId, user.userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast.success('Joined group successfully!');
    },
    onError: (error) => {
      console.error('Error joining group:', error);
      toast.error('Failed to join group');
    },
  });
}

export function useFeatureGroup() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (groupId: string) => {
      if (!user?.userId) {
        throw new Error('User not authenticated');
      }

      return PaymentService.featurePost(user.userId, groupId, 'group');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast.success('Group featured successfully!');
    },
    onError: (error) => {
      console.error('Error featuring group:', error);
      toast.error('Failed to feature group');
    },
  });
}

export function useUserGroups() {
  const { user } = useAuth();

  const {
    data: userGroups = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['user-groups', user?.userId],
    queryFn: async () => {
      if (!user?.userId) return [];
      
      const allGroups = await SupabaseService.getGroups();
      return allGroups.filter(group => group.members.includes(user.userId));
    },
    enabled: !!user?.userId,
    staleTime: 5 * 60 * 1000,
  });

  return {
    userGroups,
    isLoading,
    error,
  };
}
