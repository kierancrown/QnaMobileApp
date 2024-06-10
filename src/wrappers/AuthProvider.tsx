import React from 'react';
import {Session} from '@supabase/supabase-js';
import {PostgrestError} from '@supabase/postgrest-js';
import {Linking} from 'react-native';
import {supabase} from '../lib/supabase';
import {Profile, profileQuery} from '../types/Profile';
import {ActivityLoader, Center} from 'app/components/common';

type AuthStatus = 'SIGNED_IN' | 'SIGNED_OUT' | 'LOADING';

interface AuthContextValue {
  authStatus: AuthStatus;
  profile?: Profile;
  loginError: boolean;
  setProfile: (profile: Profile) => void;
  signOut: () => void;
}

const AuthContext = React.createContext<AuthContextValue>({
  loginError: false,
  authStatus: 'SIGNED_OUT',
  setProfile: (profile: Profile) => {},
  signOut: () => {},
});

interface AuthProviderProps {
  children: React.ReactElement | React.ReactElement[];
}

export default function AuthProvider({children}: AuthProviderProps) {
  const [authStatus, setAuthStatus] = React.useState<AuthStatus>('SIGNED_OUT');
  const [loginError, setLoginError] = React.useState(false);

  const [profile, setProfile] = React.useState<Profile>();

  async function extractSessionFromLink(link: string) {
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
  }

  React.useEffect(() => {
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
  }, []);

  async function getProfile(
    id: string,
  ): Promise<{profile: Profile | null; error: PostgrestError | null}> {
    const {data, error} = await profileQuery(id);

    if (data) {
      return {profile: data, error};
    } else {
      return {profile: null, error};
    }
  }

  function getProfileFromSession(session: Session) {
    if (session?.user) {
      getProfile(session.user.id).then(({profile, error}) => {
        if (profile) {
          setProfile(profile);
          setAuthStatus('SIGNED_IN');
        } else {
          setAuthStatus('SIGNED_OUT');
        }
      });
    } else {
      setAuthStatus('SIGNED_OUT');
    }
  }

  function signOut() {
    supabase.auth.signOut().then(() => {
      setProfile(undefined);
    });
  }

  React.useEffect(() => {
    supabase.auth.getSession().then(({data, error}) => {
      const {session} = data;
      if (session && !error) {
        getProfileFromSession(session);
      }
    });

    supabase.auth.onAuthStateChange((event, session) => {
      session && getProfileFromSession(session);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{authStatus, profile, setProfile, signOut, loginError}}>
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
