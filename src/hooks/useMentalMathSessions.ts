import { useQuery } from '@tanstack/react-query';
import { getMentalMathSessions } from '../services/mentalMathSessionsService';
import { MentalMathSession } from '../types';

export const useMentalMathSessions = (userId: string | undefined) => {
  return useQuery<MentalMathSession[]>({
    queryKey: ['mentalMathSessions', userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error('User ID is required');
      }
      const { data, error } = await getMentalMathSessions(userId);
      if (error) {
        throw error;
      }
      return (data || []) as MentalMathSession[];
    },
    enabled: !!userId,
    staleTime: 30000, // 30 seconds
  });
};

