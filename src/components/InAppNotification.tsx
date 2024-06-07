import React, {FC, useCallback, useEffect} from 'react';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {NotificationItemProps} from './NotificationItem';
import useMount from 'app/hooks/useMount';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Box, Center, Flex, HStack, Text, VStack} from './common';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import OfflineAvatar from './common/OfflineAvatar';
import Username from './Username';
import {useAppTheme} from 'app/styles/theme';
import {HapticFeedbackTypes, useHaptics} from 'app/hooks/useHaptics';
import {Platform} from 'react-native';
import BlurBackground from './BlurBackground';

interface InAppNotificationProps {
  notification: NotificationItemProps;
  removeSelf: () => void;
}

const ESTIMATED_HEIGHT = 220;

const InAppNotification: FC<InAppNotificationProps> = ({
  notification,
  removeSelf,
}) => {
  const theme = useAppTheme();
  const topInset = useSafeAreaInsets().top;
  const pressed = useSharedValue<boolean>(false);
  const translateY = useSharedValue(-theme.spacing.xsY);
  const opacity = useSharedValue(0);
  const {triggerHaptic} = useHaptics();

  useMount(() => {
    translateY.value = withTiming(0, {
      duration: 220,
      easing: Easing.in(Easing.sin),
    });
    opacity.value = withTiming(1, {
      duration: 330,
      easing: Easing.in(Easing.sin),
    });
  });

  const closeNotification = useCallback(
    (swipe = false) => {
      if (swipe) {
        triggerHaptic({
          iOS: HapticFeedbackTypes.rigid,
          android: HapticFeedbackTypes.virtualKeyRelease,
        });
      }

      opacity.value = withTiming(0, {
        duration: 330,
        easing: Easing.out(Easing.sin),
      });

      translateY.value = withTiming(
        -(swipe ? ESTIMATED_HEIGHT : theme.spacing.xsY),
        {
          duration: 220,
          easing: Easing.inOut(Easing.sin),
        },
        () => {
          runOnJS(removeSelf)();
        },
      );
    },
    [opacity, removeSelf, theme.spacing.xsY, translateY, triggerHaptic],
  );

  useEffect(() => {
    const timeout = setTimeout(closeNotification, 3000);

    return () => clearTimeout(timeout);
  }, [closeNotification]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY.value}],
      opacity: opacity.value,
      height: ESTIMATED_HEIGHT + topInset,
    };
  }, [SCREEN_WIDTH, topInset]);

  const pan = Gesture.Pan()
    .onBegin(() => {
      pressed.value = true;
      runOnJS(triggerHaptic)({
        iOS: HapticFeedbackTypes.selection,
        android: HapticFeedbackTypes.virtualKey,
      });
    })
    .onChange(event => {
      if (event.translationY < 0) {
        translateY.value = event.translationY;
      }
      opacity.value = interpolate(
        translateY.value,
        [ESTIMATED_HEIGHT, 0],
        [0, 1],
      );
    })
    .onFinalize(() => {
      if (translateY.value < -theme.spacing.xsY) {
        runOnJS(closeNotification)(true);
      } else {
        translateY.value = withTiming(0, {
          duration: 220,
          easing: Easing.out(Easing.sin),
        });
      }
      pressed.value = false;
    });

  return (
    <Box position="absolute" zIndex={99999} width={SCREEN_WIDTH}>
      <GestureDetector gesture={pan}>
        <Animated.View style={animatedStyle}>
          <HStack
            style={{paddingTop: topInset}}
            overflow="hidden"
            justifyContent="center">
            {Platform.OS === 'android' ? (
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bg="mainBackground"
              />
            ) : (
              <BlurBackground />
            )}

            <Flex flexWrap="wrap" p="xs">
              <HStack alignItems="flex-start" columnGap="xs">
                {notification.type === 'question_like' && (
                  <OfflineAvatar
                    size="intermediate"
                    // @ts-ignore
                    uri={notification.data.avatarUrl}
                  />
                )}
                <VStack rowGap="xxsY" flex={1}>
                  {notification.type === 'question_like' &&
                  // @ts-ignore
                  notification.data.username &&
                  // @ts-ignore
                  notification.data.verified ? (
                    <HStack alignItems="center">
                      <Username
                        // @ts-ignore
                        username={notification.data.username}
                        // @ts-ignore
                        isVerified={notification.data.verified}
                        noHighlight
                        variant="smallInput"
                      />

                      <Text variant="smallInput"> liked your question</Text>
                    </HStack>
                  ) : (
                    // @ts-ignore
                    <Text variant="smallInput">{notification.data.title}</Text>
                  )}
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    variant="smallBody">
                    {notification.body}
                  </Text>
                </VStack>
              </HStack>
              <Center pb="xxsY" py="mY">
                <Box
                  width={theme.spacing.xl}
                  height={theme.spacing.xxsY}
                  bg="cardText"
                  borderRadius="pill"
                />
              </Center>
            </Flex>
          </HStack>
        </Animated.View>
      </GestureDetector>
    </Box>
  );
};

export default InAppNotification;
