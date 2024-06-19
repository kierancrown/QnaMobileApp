import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {Button, Flex, SafeAreaView, Text, VStack} from 'app/components/common';
import React, {FC, useEffect, useRef, useState} from 'react';
import {AuthStackParamList} from '..';
import {useAppSelector} from 'app/redux/store';
import {useAppTheme} from 'app/styles/theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SCREEN_HEIGHT} from '@gorhom/bottom-sheet';
import {useSheetNavigationHeight} from '../hooks/useSheetNavigationHeight';

import {supabase} from 'app/lib/supabase';
import {openAlert} from 'app/redux/slices/alertSlice';
import OtpInput, {OtpInputHandle} from '../components/OtpInput';
import useMount from 'app/hooks/useMount';
import {getEmailClients, openInbox} from 'react-native-email-link';
import {isEmulatorSync} from 'react-native-device-info';
import dayjs from 'dayjs';
import {Alert, Linking} from 'react-native';

const OtpScreen: FC = () => {
  const {
    params: {email, sentTimestamp},
  } = useRoute<RouteProp<AuthStackParamList, 'OtpScreen'>>();
  const open = useAppSelector(state => state.nonPersistent.authSheet.sheetOpen);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<OtpInputHandle>(null);
  const theme = useAppTheme();
  const topSafeAreaInset = useSafeAreaInsets().top;
  const {navigate} = useNavigation<NavigationProp<AuthStackParamList>>();
  const [resending, setResending] = useState(false);
  const [openEmailAvailable, setOpenEmailAvailable] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const resendTimestamp = dayjs(sentTimestamp).add(60, 'second').valueOf();
  useSheetNavigationHeight(SCREEN_HEIGHT - topSafeAreaInset - theme.spacing.mY);

  useMount(() => {
    if (isEmulatorSync()) {
      return;
    }
    getEmailClients().then(clients => {
      if (clients.length > 0) {
        setOpenEmailAvailable(true);
      }
    });
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft(
        parseInt(
          dayjs(resendTimestamp).diff(dayjs(), 'second', true).toFixed(0),
          10,
        ),
      );
      if (dayjs().isAfter(resendTimestamp)) {
        setSecondsLeft(0);
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [resendTimestamp]);

  const openWebView = () => {
    // Extract the domain from the email
    const domain = email?.split('@')[1];
    const url = `https://${domain}`;
    Linking.openURL(url);
  };

  const onResend = async () => {
    setResending(true);
    const {error} = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: 'qna://login',
      },
    });
    setResending(false);
    if (error) {
      openAlert({
        title: 'Login Error',
        message: error.message,
      });
    }
  };

  useEffect(() => {
    if (!open) {
      inputRef.current?.blur();
    }
  }, [open]);

  const submit = async (code: string) => {
    setLoading(true);
    const {error} = await supabase.auth.verifyOtp({
      type: 'email',
      email,
      token: code,
    });
    setLoading(false);
    if (error) {
      console.log(error.message);
      Alert.alert('Invalid code', error.message);
      openAlert({
        title: 'Invalid code',
        message: error.message,
      });
      return;
    }
  };

  useMount(() => {
    const {data: authListener} = supabase.auth.onAuthStateChange(event => {
      if (event === 'SIGNED_IN') {
        navigate('SuccessScreen');
      }
    });
    return () => {
      return authListener.subscription.unsubscribe();
    };
  });

  return (
    <SafeAreaView edges={['bottom']}>
      <VStack py="mY" px="s" rowGap="xxlY" pt="xlY">
        <VStack px="s" rowGap="xsY">
          <Text variant="header">Verify Code</Text>
          <Text variant="bodyBold">We've sent a code to your email</Text>
        </VStack>
        <OtpInput
          codeLength={6}
          onSubmit={code => {
            submit(code).then();
          }}
          ref={inputRef}
        />
      </VStack>
      <Flex />
      <VStack rowGap="mY" px="s">
        {openEmailAvailable ? (
          <Button
            title={loading ? 'Verifying code' : 'Open Email App'}
            onPress={openInbox}
            minWidth="100%"
            titleVariant="bodyBold"
            disabled={loading}
          />
        ) : email ? (
          <Button
            title={
              loading
                ? 'Verifying code'
                : `Open ${email?.split('@')[1]} in browser`
            }
            onPress={openWebView}
            minWidth="100%"
            titleVariant="bodyBold"
            disabled={loading}
          />
        ) : null}
        <Button
          title={
            resending
              ? 'Sending email'
              : secondsLeft <= 0
              ? 'Resend Email'
              : `Resend in ${secondsLeft}s`
          }
          onPress={onResend}
          disabled={secondsLeft !== 0 || loading}
          loading={resending}
          variant="text"
          minWidth="100%"
        />
      </VStack>
    </SafeAreaView>
  );
};

export default OtpScreen;
