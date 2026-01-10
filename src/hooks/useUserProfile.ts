import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserProfile } from '../types';
import { supabase } from '../services/supabaseClient';

export const useUserProfile = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }

      return data as UserProfile;
    },
    enabled: Boolean(userId),
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, displayName }: { userId: string; displayName: string }) => {
      const { data, error } = await supabase
        .from('users')
        .update({ display_name: displayName })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      queryClient.setQueryData(['userProfile', userId], data);
      return data as UserProfile;
    },
  });
};
