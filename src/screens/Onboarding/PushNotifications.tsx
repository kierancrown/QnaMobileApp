import React, {useEffect, useRef} from 'react';
import {Button, Center, Flex, SafeAreaView, Text, VStack} from 'ui';
import LottieView from 'lottie-react-native';

import Animation from 'app/assets/animations/push-notifications.json';
import {percentWidth} from 'app/utils/size';
import {Linking, StyleSheet} from 'react-native';
import {useNotification} from 'app/context/PushNotificationContext';
import {useNavigation} from '@react-navigation/native';
import {OnboardingStackNavigationProp} from 'app/navigation/OnboardingStack';
import {useUser} from 'app/lib/supabase/context/auth';
import {isEmulator} from 'react-native-device-info';
import useMount from 'app/hooks/useMount';
import {useAlert} from 'app/components/AlertsWrapper';

const PushNotifications = () => {
  const {sessionId} = useUser();
  const animation = useRef<LottieView>(null);
  const {requestPermission, checkPermission} = useNotification();
  const {navigate} = useNavigation<OnboardingStackNavigationProp>();
  const {openAlert} = useAlert();

  useEffect(() => {
    const timeout = setTimeout(() => {
      animation.current?.play();
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  useMount(async () => {
    if (await checkPermission()) {
      nextStep();
    }
  });

  const nextStep = () => {
    navigate('ProfileDetails');
  };

  const handleAllow = async () => {
    if (!sessionId) {
      return;
    }
    const granted = await requestPermission(sessionId);
    if (!granted && !(await isEmulator())) {
      openAlert({
        title: 'Permission Denied',
        message: 'You can enable it in settings',
        buttons: [
          {
            text: 'Open Settings',
            onPress: () => {
              Linking.openSettings();
            },
          },
          {text: 'OK'},
        ],
      });
    }
    nextStep();
  };

  return (
    <SafeAreaView>
      <Flex px="m" alignItems="center">
        <Flex mt="mY">
          <LottieView
            loop={false}
            ref={animation}
            source={Animation}
            style={styles.animation}
          />
        </Flex>
        <Center flex={1}>
          <VStack rowGap="mY">
            <Text variant="navbarTitle" textAlign="center">
              Don't miss out on the action
            </Text>
            <Text variant="body" textAlign="center">
              We will send you notifications when you have new responses or
              likes
            </Text>
          </VStack>
        </Center>
        <Flex justifyContent="flex-end" pb="mY">
          <VStack rowGap="mY" alignItems="center">
            <Button title="Allow Notifications" onPress={handleAllow} />
            <Button title="Skip for now" variant="text" onPress={nextStep} />
          </VStack>
        </Flex>
      </Flex>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  animation: {
    width: percentWidth(80),
    aspectRatio: 1,
  },
});

export default PushNotifications;
