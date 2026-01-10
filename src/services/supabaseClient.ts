import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Get Supabase config from app.json or environment
const getSupabaseConfig = () => {
  const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase configuration. Please check app.json or environment variables.');
  }

  // Validate URL format
  if (!supabaseUrl.startsWith('https://')) {
    console.warn('⚠️ Supabase URL should start with https://');
  }

  // Validate key format (anon keys are typically JWT tokens starting with 'eyJ')
  // But some keys might be different, so we just warn
  if (supabaseAnonKey.startsWith('sb_secret_')) {
    console.warn('⚠️ Using a key starting with "sb_secret_" - ensure this is the correct anon/public key, not a service role key.');
  }

  return { supabaseUrl, supabaseAnonKey };
};

// Lazy initialization of Supabase client
let supabaseClient: ReturnType<typeof createClient> | null = null;

export const getSupabase = () => {
  if (!supabaseClient) {
    const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
    
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
  }
  
  return supabaseClient;
};

// Export singleton instance
export const supabase = getSupabase();
