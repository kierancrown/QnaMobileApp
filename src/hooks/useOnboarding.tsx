import {supabase} from 'app/lib/supabase';
import {useCallback} from 'react';
import {useUsername} from './useUsername';
import {useUser} from 'app/lib/supabase/context/auth';
import {User} from '@supabase/supabase-js';

export const useOnboarding = () => {
  const {updateUsername} = useUsername();
  const {user} = useUser();

  const hasOnboarded = async (u?: User) => {
    const internalUser = u ?? user;
    if (!internalUser?.id) {
      return false;
    }
    const {data} = await supabase
      .from('user_metadata')
      .select('has_onboarded, onboarding_step')
      .eq('user_id', internalUser?.id ?? '')
      .single();
    return data?.has_onboarded ? true : data?.onboarding_step;
  };

  const completeStep1 = async (username: string, bio?: string) => {
    const userId = user?.id;
    if (!userId) {
      throw new Error('User not found');
    }

    try {
      await updateUsername(username.trim());
      await supabase
        .from('user_metadata')
        .update({bio, onboarding_step: 1})
        .eq('user_id', userId);
      return true;
    } catch (error) {
      console.error(error);
    }
    return false;
  };

  const completeOnboarding = useCallback(async () => {
    const userId = user?.id;
    if (!userId) {
      throw new Error('User not found');
    }
    const {error} = await supabase
      .from('user_metadata')
      .update({
        has_onboarded: true,
        onboarding_step: 3,
      })
      .eq('user_id', user.id ?? '');

    if (error) {
      console.error(error);
      return false;
    }
    return true;
  }, [user]);

  return {hasOnboarded, completeOnboarding, completeStep1};
};
