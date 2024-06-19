import {supabase} from 'app/lib/supabase';
import {useCallback, useEffect, useState} from 'react';
import {useUsername} from './useUsername';
import {Profile} from 'app/types/Profile';

export const useOnboarding = (profile?: Profile) => {
  const {updateUsername} = useUsername();
  const [hasOnboarded, setHasOnboarded] = useState<boolean>(false);
  const [onboardingStep, setOnboardingStep] = useState<number>(0);
  const userId = profile?.user_id;

  const checkOnboardingStatus = useCallback(async () => {
    if (!userId) {
      setHasOnboarded(false);
      setOnboardingStep(0);
      return false;
    }
    const {data} = await supabase
      .from('user_metadata')
      .select('has_onboarded, onboarding_step')
      .eq('user_id', userId)
      .single();
    setOnboardingStep(data?.onboarding_step ?? 0);
    setHasOnboarded(data?.has_onboarded ?? false);
  }, [userId]);

  useEffect(() => {
    checkOnboardingStatus().then();
  }, [checkOnboardingStatus]);

  const completeStep1 = async (username: string, bio?: string) => {
    if (!userId) {
      return false;
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
    if (!userId) {
      return false;
    }
    const {error} = await supabase
      .from('user_metadata')
      .update({
        has_onboarded: true,
        onboarding_step: 3,
      })
      .eq('user_id', userId);

    if (error) {
      console.error(error);
      return false;
    }
    return true;
  }, [userId]);

  return {hasOnboarded, onboardingStep, completeOnboarding, completeStep1};
};
