import React, {createContext, useContext, useState} from 'react';
import {Session, User} from '@supabase/supabase-js';
import {supabase} from '../';
import useMount from 'app/hooks/useMount';
import {Alert, Linking} from 'react-native';
import {useDispatch} from 'react-redux';
import {AppDispatch} from 'app/redux/store';
import {resetAuth, resetCache} from 'app/redux/slices/authSlice';
import {useNotification} from 'app/context/PushNotificationContext';
import messaging from '@react-native-firebase/messaging';

export const AuthContext = createContext<{
  user: User | null;
  session: Session | null;
  logout: () => void;
}>({
  user: null,
  session: null,
  logout: () => {},
});

export const AuthContextProvider = (props: any) => {
  const [userSession, setUserSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const {unRegisterNotifications, registerOnDatabase} = useNotification();

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
            const token = await messaging().getToken();
            // await on other Supabase function here
            // this runs right after the callback has finished
            await registerOnDatabase(token);
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

  const logout = async () => {
    const success = await unRegisterNotifications();
    if (!success) {
      console.log('Failed to unregister notifications');
    }
    await supabase.auth.signOut();
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

  const value = {
    userSession,
    user,
    logout,
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
