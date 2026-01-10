import { useQuery } from '@tanstack/react-query';
import { getMentalMathStats } from '../services/mentalMathService';
import { MentalMathStatRow } from '../types';

export const useMentalMathStats = (userId: string | undefined) => {
  return useQuery<MentalMathStatRow[]>({
    queryKey: ['mentalMathStats', userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error('User ID is required');
      }
      const { data, error } = await getMentalMathStats(userId);
      if (error) {
        throw error;
      }
      return (data || []) as MentalMathStatRow[];
    },
    enabled: !!userId,
    staleTime: 30000, // 30 seconds
  });
};

