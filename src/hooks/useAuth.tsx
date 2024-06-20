import {AuthChangeEvent, PostgrestError, Session} from '@supabase/supabase-js';
import {supabase} from 'app/lib/supabase';
import {Profile, profileQuery} from 'app/types/Profile';
import {useCallback, useEffect, useState} from 'react';

interface useAuthProps {
  onAuthStateChange?: (event: AuthChangeEvent, session: Session | null) => void;
}

export const useAuth = ({onAuthStateChange}: useAuthProps) => {
  const [profile, setProfile] = useState<Profile>();
  const [_session, setSession] = useState<Session | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthChangeEvent | null>(null);
  const [hasOnboarded, setHasOnboarded] = useState<boolean>(false);
  const [onboardingStep, setOnboardingStep] = useState<number>(0);

  useEffect(() => {
    const {data: authListener} = supabase.auth.onAuthStateChange(
      (event, session) => {
        onAuthStateChange?.(event, session);
        setSession(session);
        if (event === 'SIGNED_IN' && session?.user.id) {
          getProfile(session.user.id).then(res => {
            if (res.profile) {
              setProfile(res.profile);
              setHasOnboarded(res.profile.has_onboarded);
              setOnboardingStep(res.profile.onboarding_step);
              setAuthStatus(event);
            }
          });
        }
      },
    );
    return () => {
      return authListener.subscription.unsubscribe();
    };
  });

  const getProfile = useCallback(
    async (
      id: string,
    ): Promise<{profile: Profile | null; error: PostgrestError | null}> => {
      const {data, error} = await profileQuery(id);

      if (data) {
        return {profile: data, error};
      } else {
        return {profile: null, error};
      }
    },
    [],
  );

  return {profile, hasOnboarded, onboardingStep, session: _session, authStatus};
};
