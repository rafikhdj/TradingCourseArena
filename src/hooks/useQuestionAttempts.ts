import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Topic } from '../types';
import { difficultyLevels } from '../utils/difficulty';
import { getDifficultyFromNumber } from '../utils/difficulty';
import { supabase } from '../services/supabaseClient';

export const useSubmitAttempts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      attempts,
      userId,
      questions,
    }: {
      attempts: Array<{ questionId: string; answer: string | number; timeSpentMs: number; isCorrect: boolean }>;
      userId: string;
      questions: Array<{ id: string; difficulty: number }>;
    }) => {
      // Insert attempts
      const attemptsData = attempts.map((attempt) => ({
        user_id: userId,
        question_id: attempt.questionId,
        answer_given: typeof attempt.answer === 'number' ? attempt.answer.toString() : attempt.answer,
        time_spent_ms: attempt.timeSpentMs,
        is_correct: attempt.isCorrect,
      }));

      const { error: attemptsError } = await supabase
        .from('question_attempts')
        .insert(attemptsData);

      if (attemptsError) {
        throw attemptsError;
      }

      // Calculate points
      let totalPoints = 0;
      attempts.forEach((attempt) => {
        if (attempt.isCorrect) {
          const question = questions.find((q) => q.id === attempt.questionId);
          if (question) {
            const difficulty = getDifficultyFromNumber(question.difficulty);
            totalPoints += difficultyLevels[difficulty].multiplier;
          }
        }
      });

      // Update leaderboard score
      const { error: leaderboardError } = await supabase.rpc('increment_leaderboard_points', {
        user_id_param: userId,
        points_to_add: totalPoints,
      });

      if (leaderboardError) {
        console.error('Error updating leaderboard:', leaderboardError);
      }

      // Invalidate queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['userRank'] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });

      return { success: true, points: totalPoints };
    },
  });
};

export const useUserStats = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['userStats', userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from('question_attempts')
        .select('is_correct, questions!inner(topic)')
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      const stats: Record<Topic, { correct: number; total: number }> = {
        mental_math: { correct: 0, total: 0 },
        probability: { correct: 0, total: 0 },
        brainteaser: { correct: 0, total: 0 },
        derivatives: { correct: 0, total: 0 },
      };

      (data || []).forEach((attempt: any) => {
        const topic = attempt.questions?.topic as Topic;
        if (topic && stats[topic]) {
          stats[topic].total++;
          if (attempt.is_correct) {
            stats[topic].correct++;
          }
        }
      });

      return stats;
    },
    enabled: Boolean(userId),
  });
};
