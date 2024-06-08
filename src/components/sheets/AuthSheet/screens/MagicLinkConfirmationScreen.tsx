import {RouteProp, useRoute} from '@react-navigation/native';
import {
  Button,
  Center,
  SafeAreaView,
  Text,
  VStack,
} from 'app/components/common';
import React, {FC, useEffect, useRef, useState} from 'react';
import {AuthStackParamList} from '..';
import {SCREEN_HEIGHT} from '@gorhom/bottom-sheet';
import dayjs from 'dayjs';
import useMount from 'app/hooks/useMount';
import {isEmulatorSync} from 'react-native-device-info';
import {getEmailClients, openInbox} from 'react-native-email-link';
import {Linking} from 'react-native';

import Animation from 'app/assets/animations/magic-link-sent-alt.json';
import LottieView from 'lottie-react-native';
import {useAppTheme} from 'app/styles/theme';
import {supabase} from 'app/lib/supabase';
import {openAlert} from 'app/redux/slices/alertSlice';

const MagicLinkConfirmationScreen: FC = () => {
  const {
    params: {email, sentTimestamp},
  } = useRoute<RouteProp<AuthStackParamList, 'MagicLinkConfirmationScreen'>>();
  const theme = useAppTheme();
  const [resending, setResending] = useState(false);
  const [openEmailAvailable, setOpenEmailAvailable] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const resendTimestamp = dayjs(sentTimestamp).add(60, 'second').valueOf();
  const animationRef = useRef<LottieView>(null);

  useMount(() => {
    setTimeout(() => {
      animationRef.current?.play();
    }, 500);
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

  return (
    <SafeAreaView edges={['bottom']} style={{maxHeight: SCREEN_HEIGHT / 2}}>
      <VStack flex={1} pt="mY" px="l" justifyContent="space-between">
        <VStack rowGap="sY" py="mY">
          <Text variant="authSheetHeader" textAlign="center">
            Magic link on the way
          </Text>
          <Text variant="headline" textAlign="center">
            sent to {email}
          </Text>
        </VStack>

        <Center flex={1}>
          <LottieView
            ref={animationRef}
            source={Animation}
            autoPlay={false}
            loop={false}
            style={{
              width: theme.iconSizes.magicLinkSent,
              height: theme.iconSizes.magicLinkSent,
            }}
          />
        </Center>

        <VStack rowGap="mY">
          {openEmailAvailable ? (
            <Button
              title="Open Email App"
              onPress={openInbox}
              minWidth="100%"
              titleVariant="bodyBold"
            />
          ) : email ? (
            <Button
              title={`Open ${email?.split('@')[1]} in browser`}
              onPress={openWebView}
              minWidth="100%"
              titleVariant="bodyBold"
            />
          ) : null}
          <Button
            title={
              resending
                ? 'Delivering magic'
                : secondsLeft <= 0
                ? 'Resend Email'
                : `Resend in ${secondsLeft}s`
            }
            onPress={onResend}
            disabled={secondsLeft !== 0}
            loading={resending}
            variant="text"
            minWidth="100%"
          />
        </VStack>
      </VStack>
    </SafeAreaView>
  );
};

export default MagicLinkConfirmationScreen;
