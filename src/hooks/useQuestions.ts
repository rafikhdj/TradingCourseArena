import { useQuery } from '@tanstack/react-query';
import { Question, Topic, Difficulty } from '../types';
import { difficultyLevels } from '../utils/difficulty';
import { supabase } from '../services/supabaseClient';

interface UseQuestionsParams {
  topic?: Topic;
  difficulty?: Difficulty;
  limit?: number;
  enabled?: boolean;
}

export const useQuestions = ({ topic, difficulty, limit = 10, enabled = true }: UseQuestionsParams = {}) => {
  return useQuery({
    queryKey: ['questions', topic, difficulty, limit],
    queryFn: async () => {
      let query = supabase
        .from('questions')
        .select('*');

      if (topic) {
        query = query.eq('topic', topic);
      }

      if (difficulty) {
        const { min, max } = difficultyLevels[difficulty];
        query = query.gte('difficulty', min).lte('difficulty', max);
      }

      // Add random ordering to get questions in random order
      // Note: Supabase doesn't support ORDER BY RANDOM() directly, so we'll shuffle in JavaScript
      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // Shuffle the array randomly using Fisher-Yates algorithm for better randomness
      const questions = [...(data || [])];
      for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
      }
      
      // Return only the requested limit after shuffling
      return questions.slice(0, limit) as Question[];
    },
    enabled: Boolean(enabled),
  });
};
