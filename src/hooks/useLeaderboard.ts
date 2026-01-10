import { useQuery } from '@tanstack/react-query';
import { LeaderboardEntry } from '../types';
import { supabase } from '../services/supabaseClient';

export const useLeaderboard = (limit: number = 10) => {
  return useQuery({
    queryKey: ['leaderboard', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leaderboard_scores')
        .select(`
          user_id,
          points,
          users(display_name)
        `)
        .order('points', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return (data || []).map((entry: any, index: number) => ({
        user_id: entry.user_id,
        display_name: entry.users?.display_name || 'Anonymous',
        points: entry.points,
        rank: index + 1,
      })) as LeaderboardEntry[];
    },
  });
};

export const useUserRank = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['userRank', userId],
    queryFn: async () => {
      if (!userId) return { rank: 999, points: 0 };

      // Get user's points
      const { data: userScore, error: scoreError } = await supabase
        .from('leaderboard_scores')
        .select('points')
        .eq('user_id', userId)
        .single();

      if (scoreError || !userScore) {
        return { rank: 999, points: 0 };
      }

      // Count how many users have more points
      const { count, error: rankError } = await supabase
        .from('leaderboard_scores')
        .select('*', { count: 'exact', head: true })
        .gt('points', userScore.points);

      if (rankError) {
        return { rank: 999, points: userScore.points };
      }

      return { rank: (count || 0) + 1, points: userScore.points };
    },
    enabled: Boolean(userId),
  });
};
