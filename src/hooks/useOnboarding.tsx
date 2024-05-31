import {supabase} from 'app/lib/supabase';
import {useAppDispatch} from 'app/redux/store';
import {completeOnboarding as dispatchCompleted} from 'app/redux/slices/authSlice';
import {User} from '@supabase/supabase-js';
import {useCallback} from 'react';

export const useOnboarding = () => {
  const dispatch = useAppDispatch();

  const hasOnboarded = async (user?: User) => {
    if (!user?.id) {
      return false;
    }
    const {data} = await supabase
      .from('user_metadata')
      .select('has_onboarded')
      .eq('user_id', user?.id ?? '')
      .single();
    return data?.has_onboarded ?? false;
  };

  const completeOnboarding = useCallback(
    async (user?: User) => {
      const userId = user?.id;
      if (!userId) {
        throw new Error('User not found');
      }
      const {error} = await supabase
        .from('user_metadata')
        .update({
          has_onboarded: true,
        })
        .eq('user_id', user.id ?? '');

      if (error) {
        throw error;
      }

      dispatch(dispatchCompleted());
    },
    [dispatch],
  );

  return {hasOnboarded, completeOnboarding};
};
