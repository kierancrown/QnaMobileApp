import React, {useCallback, useEffect, useState} from 'react';
import {Session} from '@supabase/supabase-js';
import {PostgrestError} from '@supabase/postgrest-js';
import {Linking} from 'react-native';
import {supabase} from '../lib/supabase';
import {Profile, profileQuery} from '../types/Profile';
import {ActivityLoader, Center} from 'app/components/common';
import {useAppDispatch} from 'app/redux/store';
import {openAuthSheet} from 'app/redux/slices/authSheetSlice';
import {Buffer} from 'buffer';

type AuthStatus = 'SIGNED_IN' | 'SIGNED_OUT' | 'LOADING';

interface AuthContextValue {
  authStatus: AuthStatus;
  profile?: Profile;
  sessionId?: string;
  loginError: boolean;
  setProfile: (profile: Profile) => void;
  refreshProfile: () => void;
  logout: ({
    allDevices,
    otherDevices,
  }: {
    allDevices?: boolean;
    otherDevices?: boolean;
  }) => Promise<boolean>;
}

const AuthContext = React.createContext<AuthContextValue>({
  loginError: false,
  authStatus: 'SIGNED_OUT',
  sessionId: undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setProfile: (profile: Profile) => {},
  refreshProfile: () => {},
  logout: () => Promise.resolve(false),
});

interface AuthProviderProps {
  children: React.ReactElement | React.ReactElement[];
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

export default function AuthProvider({children}: AuthProviderProps) {
  const [authStatus, setAuthStatus] = useState<AuthStatus>('SIGNED_OUT');
  const [loginError, setLoginError] = useState(false);
  const [profile, setProfile] = useState<Profile>();
  const [sessionId, setSessionId] = useState<string>();
  // const {hasOnboarded, onboardingStep} = useOnboarding(profile);
  const dispatch = useAppDispatch();

  // useEffect(() => {
  //   if (authStatus === 'SIGNED_IN') {
  //     if (hasOnboarded === false) {
  //       dispatch(
  //         openAuthSheet({
  //           reason: 'none',
  //           initialScreen:
  //             onboardingStep === 0
  //               ? 'OnboardingWelcomeScreen'
  //               : 'OnboardingTopicsScreen',
  //         }),
  //       );
  //     } else {
  //       dispatch(
  //         openAuthSheet({
  //           reason: 'none',
  //           initialScreen: 'SuccessScreen',
  //         }),
  //       );
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [hasOnboarded]);

  const extractSessionFromLink = async (link: string) => {
    const parsedURL = new URL(link.replace('login#', 'login?'));

    if (
      parsedURL.searchParams.get('refresh_token') &&
      parsedURL.searchParams.get('access_token')
    ) {
      const {data, error} = await supabase.auth.setSession({
        access_token: parsedURL.searchParams.get('access_token')!,
        refresh_token: parsedURL.searchParams.get('refresh_token')!,
      });
      if (__DEV__) {
        console.log(
          'AUTH EVENT',
          JSON.stringify(
            {
              data,
              error,
            },
            null,
            2,
          ),
        );
      }
      if (error) {
        console.log('Error setting session', error);
      }
      const session = data?.session;
      if (session) {
        console.log(session);
        getProfileFromSession(session);
        console.log('Profile', JSON.stringify(profile, null, 2));
        setSessionId(extractSessionId(session));
      }
      setLoginError(false);
    } else if (parsedURL.searchParams.get('error')) {
      if (__DEV__) {
        const errorCode = parsedURL.searchParams.get('error_code');
        const errorDescription = parsedURL.searchParams
          .get('error_description')
          ?.replace(/\+/g, ' ');
        console.log('Login error', {
          errorCode,
          errorDescription,
        });
      }
      setLoginError(true);
    }
  };

  useEffect(() => {
    Linking.getInitialURL().then(url => {
      if (url) {
        extractSessionFromLink(url!);
      }
    });

    function handler(res: {url: string}) {
      if (res.url) {
        extractSessionFromLink(res.url);
      }
    }

    Linking.addEventListener('url', handler);

    return () => {
      Linking.removeAllListeners('url');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getProfile = useCallback(
    async (
      id: string,
    ): Promise<{profile: Profile | null; error: PostgrestError | null}> => {
      const {data, error} = await profileQuery(id);

      console.log({error, data});

      if (data) {
        setAuthStatus('SIGNED_IN');
        return {profile: data, error};
      } else {
        return {profile: null, error};
      }
    },
    [],
  );

  const getProfileFromSession = useCallback(
    (session: Session, initalLogin = false) => {
      if (session?.user) {
        getProfile(session.user.id).then(({profile: _profile}) => {
          if (_profile) {
            setProfile(_profile);
            if (initalLogin) {
              const hasOnboarded = _profile.has_onboarded;
              const onboardingStep = _profile.onboarding_step;
              if (hasOnboarded) {
                dispatch(
                  openAuthSheet({
                    reason: 'none',
                    initialScreen: 'SuccessScreen',
                  }),
                );
              } else {
                dispatch(
                  openAuthSheet({
                    reason: 'none',
                    initialScreen:
                      onboardingStep === 0
                        ? 'OnboardingWelcomeScreen'
                        : 'OnboardingTopicsScreen',
                  }),
                );
              }
            }
          } else {
            setAuthStatus('SIGNED_OUT');
          }
        });
      } else {
        console.log('No session user');
        setAuthStatus('SIGNED_OUT');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getProfile],
  );

  const logout = async ({allDevices = false, otherDevices = false}) => {
    const {error} = await supabase.auth.signOut({
      scope: otherDevices ? 'others' : allDevices ? 'global' : 'local',
    });
    if (error) {
      console.log('Error signing out', error);
    }
    setProfile(undefined);
    return !error;
  };

  useEffect(() => {
    supabase.auth.getSession().then(({data, error}) => {
      const {session} = data;
      if (session && !error) {
        getProfileFromSession(session);
        setSessionId(extractSessionId(session));
      } else {
        console.log('Error getting session', error);
      }
    });

    supabase.auth.onAuthStateChange((event, session) => {
      session && getProfileFromSession(session);
      session && setSessionId(extractSessionId(session));
    });
  }, [getProfileFromSession]);

  const refreshProfile = () => {
    supabase.auth.getSession().then(({data, error}) => {
      const {session} = data;
      if (session && !error) {
        getProfileFromSession(session);
        setSessionId(extractSessionId(session));
      } else {
        console.log('Error getting session', error);
      }
    });
  };

  return (
    <AuthContext.Provider
      value={{
        authStatus,
        profile,
        setProfile,
        sessionId,
        logout,
        refreshProfile,
        loginError,
      }}>
      {authStatus === 'LOADING' ? (
        <Center flex={1}>
          <ActivityLoader size="xl" />
        </Center>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return React.useContext(AuthContext);
}
