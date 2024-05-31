import React, {createContext, useContext, useEffect, useState} from 'react';
import {Session, User} from '@supabase/supabase-js';
import {supabase} from '../';
import useMount from 'app/hooks/useMount';
import {Alert, Linking} from 'react-native';
import {useAppDispatch} from 'app/redux/store';
import {
  completeOnboarding,
  deletedAccount,
  resetAuth,
  resetCache,
  resetDeletedAccount,
  showOnboarding,
} from 'app/redux/slices/authSlice';
import {useNotification} from 'app/context/PushNotificationContext';
import {Buffer} from 'buffer';
import {useOnboarding} from 'app/hooks/useOnboarding';

export const AuthContext = createContext<{
  user: User | null;
  session: Session | null;
  sessionId?: string;
  deleteUser: () => Promise<boolean>;
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
  deleteUser: async () => false,
  logout: async () => {
    return false;
  },
});

export const AuthContextProvider = (props: any) => {
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [userSession, setUserSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const dispatch = useAppDispatch();
  const {hasOnboarded} = useOnboarding();

  // const {deleteProfilePicture} = useProfilePicture();

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

        if (event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED') {
          console.log('resetting deleted account');
          dispatch(resetDeletedAccount());
        } else if (event === 'SIGNED_IN') {
          setTimeout(async () => {
            const onboardingCompleted = await hasOnboarded(session?.user);
            if (!onboardingCompleted) {
              dispatch(showOnboarding());
            } else {
              dispatch(completeOnboarding());
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

  const deleteUser = async () => {
    if (!user) {
      return false;
    }
    console.log('Deleting user');
    // First delete profile picture
    // try {
    //   console.log('Deleting profile picture');
    //   const profilePictureDeletionSuccess = await deleteProfilePicture();
    //   if (!profilePictureDeletionSuccess) {
    //     // TODO: Log this on a backend DB to remove later on
    //     console.log('Error deleting profile picture');
    //   } else {
    //     console.log('Profile picture deleted');
    //   }
    // } catch {
    //   // TODO: Log this on a backend DB to remove later on
    //   console.log('Error deleting profile picture');
    // }

    // Logout from other devices
    await logout({allDevices: false, otherDevices: true});

    // Then delete user
    const {error} = await supabase.from('user_deletions').insert({
      user_id: user.id,
    });

    if (error) {
      console.log('Error deleting user', error);
      Alert.alert('Error deleting user', error.message, [{text: 'OK'}]);
      return false;
    }

    Alert.alert('User deleted', 'Your account has been deleted', [
      {text: 'OK'},
    ]);
    setUser(null);
    setUserSession(null);
    dispatch(deletedAccount());
    return true;
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
            console.log('Auth success', res);
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
    deleteUser,
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
