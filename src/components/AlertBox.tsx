import React, {FC} from 'react';
import {Box, Center, HStack, Text, VStack} from './common';
import {Pressable} from 'react-native';
import Animated, {
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useAppTheme} from 'app/styles/theme';
import useMount from 'app/hooks/useMount';
import {useAlert} from './AlertsWrapper';

export interface AlertBoxProps {
  id: number;
  title: string;
  message?: string;
  buttons?: {
    text: string;
    variant?: 'primary' | 'secondary' | 'destructive' | 'success';
    onPress?: () => void;
    preventDefault?: boolean;
  }[];
}

const AlertBox: FC<AlertBoxProps> = ({id, title, message, buttons}) => {
  const theme = useAppTheme();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(theme.spacing.sY);
  const {closeAlert} = useAlert();

  useMount(() => {
    opacity.value = withTiming(1, {duration: 300});
    translateY.value = withTiming(0, {duration: 300});
  });

  const close = () => {
    opacity.value = withTiming(0, {duration: 300});
    translateY.value = withTiming(theme.spacing.sY, {duration: 300}, () => {
      runOnJS(closeAlert)(id);
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      opacity: opacity.value,
      transform: [{translateY: translateY.value}],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <Box
        bg="cardBackground"
        borderRadius="l"
        overflow="hidden"
        minWidth="50%"
        rowGap="xxsY">
        <VStack px="m" py="sY" rowGap="xsY">
          <Text textAlign="center" variant="title">
            {title}
          </Text>
          <Text textAlign="center" variant="body">
            {message}
          </Text>
        </VStack>
        <VStack borderTopWidth={1} borderColor="divider">
          {buttons?.length === 1 ? (
            <HStack>
              <AlertButton
                {...buttons[0]}
                onPress={() => {
                  buttons[0].onPress?.();
                  if (!buttons[0].preventDefault) {
                    close();
                  }
                }}
              />
            </HStack>
          ) : buttons?.length === 2 ? (
            <HStack>
              <AlertButton
                {...buttons[0]}
                onPress={() => {
                  buttons[0].onPress?.();
                  if (!buttons[0].preventDefault) {
                    close();
                  }
                }}
              />
              <Box height="100%" width={1} bg="divider" />
              <AlertButton
                {...buttons[1]}
                onPress={() => {
                  buttons[1].onPress?.();
                  if (!buttons[1].preventDefault) {
                    close();
                  }
                }}
              />
            </HStack>
          ) : (
            <VStack>
              {buttons?.map((button, index) => (
                <AlertButton key={index} {...button} />
              ))}
            </VStack>
          )}
        </VStack>
      </Box>
    </Animated.View>
  );
};

interface AlertButtonProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'destructive' | 'success';
  onPress?: () => void;
}

const AlertButton: FC<AlertButtonProps> = ({text, variant, onPress}) => {
  const alertButtonPressed = useSharedValue(0);
  const theme = useAppTheme();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      flex: 1,
      backgroundColor: interpolateColor(
        alertButtonPressed.value,
        [0, 1],
        [theme.colors.none, theme.colors.mainBackgroundHalf],
      ),
    };
  }, [theme.colors]);

  const onPressIn = () => {
    alertButtonPressed.value = withTiming(1, {duration: 100});
  };

  const onPressOut = () => {
    alertButtonPressed.value = withTiming(0, {duration: 100});
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}>
        <Center py="xsY">
          <Text
            variant="medium"
            color={
              variant === 'destructive' ? 'destructiveAction' : 'foreground'
            }>
            {text}
          </Text>
        </Center>
      </Pressable>
    </Animated.View>
  );
};

export default AlertBox;
