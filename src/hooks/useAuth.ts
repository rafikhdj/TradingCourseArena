import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../services/supabaseClient';

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      // Log for debugging
      if (error) {
        console.log('Sign in error:', error.message);
        console.log('Error details:', error);
        // If it's a JSON parse error, it might be a network/config issue
        if (error.message.includes('JSON Parse error') || error.message.includes('Unexpected character')) {
          console.error('⚠️ Network/Config Error: Supabase returned HTML instead of JSON. Check your Supabase URL and API key.');
        }
      } else if (data?.user) {
        console.log('Sign in success:', data.user.email);
        console.log('Email confirmed:', data.user.email_confirmed_at ? 'Yes' : 'No');
      }
      
      return { data, error };
    } catch (err: any) {
      // Catch any unexpected errors
      console.error('Unexpected sign in error:', err);
      return {
        data: null,
        error: {
          message: err?.message || 'An unexpected error occurred',
          name: err?.name || 'AuthUnknownError',
        } as any,
      };
    }
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName || email.split('@')[0],
        },
      },
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    session,
    user,
    loading: Boolean(loading),
    signIn,
    signUp,
    signOut,
  };
};
