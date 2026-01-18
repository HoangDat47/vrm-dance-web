'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth as useClerkAuth, useUser } from '@clerk/nextjs';

interface User {
  id: string;
  email: string;
  username: string | null;
  role: 'admin' | 'moderator' | 'user';
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut } = useClerkAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    if (!clerkUser) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/user');
      if (!response.ok) {
        const errorData = await response.json();
        console.error('[AuthProvider] API error:', {
          status: response.status,
          error: errorData.error,
          details: errorData.details,
        });
        throw new Error(errorData.details || errorData.error || 'Failed to fetch user profile');
      }

      const data = await response.json();
      console.log('[AuthProvider] User profile loaded:', data.user?.id);
      setUser(data.user ?? null);
    } catch (error) {
      console.error('[AuthProvider] Failed to load user profile from Supabase:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [clerkUser]);

  useEffect(() => {
    if (!isLoaded) return;
    if (!clerkUser) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    fetchUserProfile();
  }, [isLoaded, clerkUser, fetchUserProfile]);

  const logout = async () => {
    await signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: isLoading || !isLoaded,
        refresh: fetchUserProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
