import { supabase } from './supabaseClient';
import { MentalMathSession } from '../types';

/**
 * Get Mental Math sessions for a user
 * First try RPC function, fallback to direct query if RPC doesn't exist
 */
export const getMentalMathSessions = async (
  userId: string
): Promise<{ data: MentalMathSession[] | null; error: Error | null }> => {
  try {
    // Try RPC function first
    const { data: rpcData, error: rpcError } = await supabase.rpc('get_mental_math_sessions', {
      user_id_param: userId,
    });

    if (!rpcError && rpcData) {
      return { data: (rpcData || []) as MentalMathSession[], error: null };
    }

    // Fallback to direct query if RPC doesn't exist or fails
    console.log('RPC failed, trying direct query:', rpcError);
    const { data: queryData, error: queryError } = await supabase
      .from('mental_math_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (queryError) {
      console.error('Error fetching mental math sessions:', queryError);
      return { data: null, error: queryError };
    }

    return { data: (queryData || []) as MentalMathSession[], error: null };
  } catch (err) {
    console.error('Exception fetching mental math sessions:', err);
    return { data: null, error: err as Error };
  }
};

