import { useState, useEffect, useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { SupabaseService } from '../services/supabase';
import { User } from '../types';

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export function useAuth() {
  const { user: privyUser, login, logout, authenticated } = usePrivy();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  const fetchUser = useCallback(async (userId: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const userData = await SupabaseService.getUser(userId);
      
      setAuthState({
        user: userData,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: 'Failed to fetch user data',
      });
    }
  }, []);

  const createUser = useCallback(async (userData: {
    displayName: string;
    major: string;
    interests: string[];
    bio?: string;
  }) => {
    if (!privyUser?.id) {
      throw new Error('No authenticated user');
    }

    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const newUser = await SupabaseService.createUser({
        userId: privyUser.id,
        ...userData,
      });
      
      setAuthState({
        user: newUser,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });

      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to create user profile',
      }));
      throw error;
    }
  }, [privyUser?.id]);

  const updateUser = useCallback(async (updates: Partial<{
    displayName: string;
    major: string;
    interests: string[];
    bio: string;
    avatar: string;
  }>) => {
    if (!authState.user?.userId) {
      throw new Error('No authenticated user');
    }

    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const updatedUser = await SupabaseService.updateUser(
        authState.user.userId,
        updates
      );
      
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
        isLoading: false,
        error: null,
      }));

      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to update user profile',
      }));
      throw error;
    }
  }, [authState.user?.userId]);

  const signOut = useCallback(async () => {
    try {
      await logout();
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
    } catch (error) {
      console.error('Error signing out:', error);
      setAuthState(prev => ({
        ...prev,
        error: 'Failed to sign out',
      }));
    }
  }, [logout]);

  // Effect to handle authentication state changes
  useEffect(() => {
    if (authenticated && privyUser?.id) {
      fetchUser(privyUser.id);
    } else if (!authenticated) {
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
    }
  }, [authenticated, privyUser?.id, fetchUser]);

  return {
    ...authState,
    login,
    logout: signOut,
    createUser,
    updateUser,
    privyUser,
  };
}
