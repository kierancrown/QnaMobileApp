import React, {createContext, useContext, useEffect, useState} from 'react';
import {Session, User} from '@supabase/supabase-js';
import {supabase} from '../';
import useMount from 'app/hooks/useMount';
import {Alert, Linking} from 'react-native';
import {useDispatch} from 'react-redux';
import {AppDispatch} from 'app/redux/store';
import {
  resetAuth,
  resetCache,
  showOnboarding,
} from 'app/redux/slices/authSlice';
import {useNotification} from 'app/context/PushNotificationContext';
import {Buffer} from 'buffer';

export const AuthContext = createContext<{
  user: User | null;
  session: Session | null;
  sessionId?: string;
  logout: ({
    allDevices,
    otherDevices,
  }: {
    allDevices?: boolean;
    otherDevices?: boolean;
  }) => Promise<boolean>;
}>({
  user: null,
  session: null,
  logout: async () => {
    return false;
  },
});

export const AuthContextProvider = (props: any) => {
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [userSession, setUserSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const {silentTokenRegistration} = useNotification();

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

  useMount(() => {
    supabase.auth.getSession().then(({data: {session}}) => {
      setUserSession(session);
      setUser(session?.user ?? null);
    });

    const {data: authListener} = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUserSession(session);
        setUser(session?.user ?? null);

        if (event === 'SIGNED_IN') {
          setTimeout(async () => {
            // Check if onboarding is complete
            const {data} = await supabase
              .from('user_metadata')
              .select('has_onboarded')
              .eq('user_id', session?.user?.id ?? '')
              .single();
            console.log({data});
            if (data?.has_onboarded === false) {
              dispatch(showOnboarding());
            } else {
              // Register for push notifications
              if (session) {
                const sId = extractSessionId(session);
                if (sId) {
                  silentTokenRegistration(sId, true);
                }
              }
            }
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setUserSession(null);
          dispatch(resetAuth());
          dispatch(resetCache());
        }
      },
    );

    return () => {
      authListener.subscription;
    };
  });

  const logout = async ({allDevices = false, otherDevices = false}) => {
    const {error} = await supabase.auth.signOut({
      scope: otherDevices ? 'others' : allDevices ? 'global' : 'local',
    });

    return !error;
  };

  // Listen for auth deep links
  useMount(() => {
    Linking.addEventListener('url', event => {
      let urlString = event.url;
      if (event.url.includes('login#')) {
        urlString = event.url.replace('login#', 'login?');
      } else {
        console.log('Not a magic link', {url: event.url});
        return;
      }
      const url = new URL(urlString);

      console.log({url: url.toString()});

      if (url.searchParams.get('error')) {
        const error = url.searchParams.get('error');
        const errorCode = url.searchParams.get('error_code');
        const errorDescription = url.searchParams
          .get('error_description')
          ?.replace(/\+/g, ' ');

        Alert.alert(`Error ${errorCode}`, errorDescription, [{text: 'OK'}], {
          cancelable: false,
        });

        console.log({error, errorCode, errorDescription});

        return;
      }

      const refreshToken = url.searchParams.get('refresh_token');
      const accessToken = url.searchParams.get('access_token');

      if (accessToken && refreshToken) {
        supabase.auth
          .setSession({
            refresh_token: refreshToken,
            access_token: accessToken,
          })
          .then(res => {
            setUser(res.data.user);
          })
          .catch(err => console.log({err}));
      }
    });
    return () => {
      Linking.removeAllListeners('url');
    };
  });

  useEffect(() => {
    if (userSession) {
      const sId = extractSessionId(userSession);
      if (sId) {
        setSessionId(sId);
      }
    }
  }, [userSession]);

  const value = {
    userSession,
    user,
    logout,
    sessionId,
  };
  return <AuthContext.Provider value={value} {...props} />;
};

export const useUser = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a AuthContextProvider.');
  }
  return context;
};
