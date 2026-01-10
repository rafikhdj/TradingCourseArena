import { supabase } from './supabaseClient';
import { MentalMathAttempt } from '../types';

/**
 * Insert a Mental Math attempt into the database
 */
export const insertMentalMathAttempt = async (
  attempt: MentalMathAttempt
): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('mental_math_attempts')
      .insert({
        user_id: attempt.user_id,
        type: attempt.type,
        operator: attempt.operator,
        has_gap: attempt.has_gap,
        time_ms: attempt.time_ms,
        is_correct: attempt.is_correct,
      });

    if (error) {
      console.error('Error inserting mental math attempt:', error);
      return { error };
    }

    return { error: null };
  } catch (err) {
    console.error('Exception inserting mental math attempt:', err);
    return { error: err as Error };
  }
};

/**
 * Get Mental Math stats for a user via RPC function
 */
export const getMentalMathStats = async (
  userId: string
): Promise<{ data: any[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase.rpc('get_mental_math_stats', {
      user_id_param: userId,
    });

    if (error) {
      console.error('Error fetching mental math stats:', error);
      return { data: null, error };
    }

    return { data: data || [], error: null };
  } catch (err) {
    console.error('Exception fetching mental math stats:', err);
    return { data: null, error: err as Error };
  }
};

