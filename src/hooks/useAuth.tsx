import {AuthChangeEvent, PostgrestError, Session} from '@supabase/supabase-js';
import {supabase} from 'app/lib/supabase';
import {Profile, profileQuery} from 'app/types/Profile';
import {useCallback, useEffect, useState} from 'react';

interface useAuthProps {
  onAuthStateChange?: (event: AuthChangeEvent, session: Session | null) => void;
}

const extractSessionId = (session: Session) => {
  if (session?.access_token) {
    try {
      const sessionTokenParts = session.access_token.split('.');
      if (sessionTokenParts.length >= 2) {
        const token = JSON.parse(
          Buffer.from(sessionTokenParts[1], 'base64').toString('ascii'),
        );
        return typeof token.session_id === 'string'
          ? token.session_id
          : undefined;
      }
    } catch (err) {
      console.log('Error parsing session token', err);
      return undefined;
    }
  }
};

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

  const logout = async ({allDevices = false, otherDevices = false}) => {
    const {error} = await supabase.auth.signOut({
      scope: otherDevices ? 'others' : allDevices ? 'global' : 'local',
    });
    if (error) {
      console.log('Error signing out', error);
    }
    // setProfile(undefined);
    // setSessionId(undefined);
    return !error;
  };

  // useEffect(() => {
  //   supabase.auth.getSession().then(({data, error}) => {
  //     const {session} = data;
  //     if (session && !error) {
  //       getProfileFromSession(session);
  //       setSessionId(extractSessionId(session));
  //     } else {
  //       console.log('Error getting session', error);
  //     }
  //   });

  //   supabase.auth.onAuthStateChange((event, session) => {
  //     session && getProfileFromSession(session);
  //     session && setSessionId(extractSessionId(session));
  //   });
  // }, [getProfileFromSession]);

  // const refreshProfile = () => {
  //   supabase.auth.getSession().then(({data, error}) => {
  //     const {session} = data;
  //     if (session && !error) {
  //       getProfileFromSession(session);
  //       setSessionId(extractSessionId(session));
  //     } else {
  //       console.log('Error getting session', error);
  //     }
  //   });
  // };

  return {
    profile,
    hasOnboarded,
    onboardingStep,
    session: _session,
    authStatus,
    logout,
  };
};
