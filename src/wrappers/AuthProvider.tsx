import React, {useEffect, useState} from 'react';
import {Alert, Linking} from 'react-native';
import {supabase} from '../lib/supabase';
import {Profile} from '../types/Profile';
import {useAppDispatch} from 'app/redux/store';
import {openAuthSheet} from 'app/redux/slices/authSheetSlice';
import {openAlert} from 'app/redux/slices/alertSlice';
import {useAuth} from 'app/hooks/useAuth';

interface AuthContextValue {
  profile?: Profile;
  sessionId?: string;
  loginError: boolean;
}

const AuthContext = React.createContext<AuthContextValue>({
  loginError: false,
  sessionId: undefined,
});

interface AuthProviderProps {
  children: React.ReactElement | React.ReactElement[];
}

export default function AuthProvider({children}: AuthProviderProps) {
  const [loginError, setLoginError] = useState(false);
  const [sessionId, setSessionId] = useState<string>();
  const {hasOnboarded, onboardingStep, authStatus, profile} = useAuth({});
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (authStatus === 'SIGNED_IN') {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authStatus]);

  useEffect(() => {
    const parseLink = (url: string) => {
      console.log('url', url);
      // url will contain two url params (email and code)
      if (url.startsWith('qna://login')) {
        const params = new URL(url).searchParams;
        const email = params.get('email');
        const code = params.get('code');
        if (email && code) {
          console.log('Email and code', email, code);
          supabase.auth
            .verifyOtp({
              type: 'email',
              email,
              token: code,
            })
            .then(({error}) => {
              if (error) {
                Alert.alert('Error', error.message);
              }
            });
        } else {
          openAlert({
            title: 'Invalid login link',
            message: 'Please use the link from the email you received.',
          });
        }
      } else {
        openAlert({
          title: 'Invalid link',
        });
      }
    };

    Linking.getInitialURL().then(url => {
      if (url) {
        parseLink(url!);
      }
    });

    function handler(res: {url: string}) {
      if (res.url) {
        parseLink(res.url);
      }
    }

    Linking.addEventListener('url', handler);

    return () => {
      Linking.removeAllListeners('url');
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        profile,
        sessionId,
        loginError,
      }}>
      {children}
      {/* {authStatus === 'LOADING' ? (
        <Center flex={1}>
          <ActivityLoader size="xl" />
        </Center>
      ) : (
        children
      )} */}
    </AuthContext.Provider>
  );
}
