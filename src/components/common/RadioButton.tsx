import {HapticFeedbackTypes, useHaptics} from 'app/hooks/useHaptics';
import {useAppTheme} from 'app/styles/theme';
import React, {forwardRef, useImperativeHandle} from 'react';
import {Pressable} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {Box, Center} from 'ui';

interface RadioButtonProps {
  selected: boolean;
  onPress: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
}

export interface RadioButtonRef {
  onPressIn: () => void;
  onPressOut: () => void;
}

const RadioButton = (
  {
    selected,
    onPress,
    onPressIn: parentOnPressIn,
    onPressOut: parentOnPressOut,
  }: RadioButtonProps,
  ref: React.Ref<RadioButtonRef>,
) => {
  const theme = useAppTheme();
  const pressInState = useSharedValue(0);
  const {triggerHaptic} = useHaptics();

  const onPressIn = () => {
    parentOnPressIn?.();
    pressInState.value = withTiming(1, {
      duration: 88,
    });
    triggerHaptic({
      iOS: HapticFeedbackTypes.selection,
      android: HapticFeedbackTypes.virtualKey,
    });
  };

  const onPressOut = () => {
    parentOnPressOut?.();
    pressInState.value = withTiming(0, {
      duration: 66,
    });
    triggerHaptic({
      iOS: HapticFeedbackTypes.rigid,
      android: HapticFeedbackTypes.virtualKeyRelease,
    });
  };

  useImperativeHandle(ref, () => ({
    onPressIn,
    onPressOut,
  }));

  const outerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(pressInState.value, [0, 1], [1, 0.88]),
      transform: [{scale: interpolate(pressInState.value, [0, 1], [1, 1.1])}],
    };
  }, []);

  const innerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(selected ? 1 : 0, {duration: 200}),
      transform: [
        {
          scale: selected
            ? withSpring(1, {
                velocity: 10,
                damping: 12,
                stiffness: 100,
              })
            : withTiming(0, {duration: 200}),
        },
      ],
    };
  }, [selected]);

  return (
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={outerAnimatedStyle}>
        <Center
          width={theme.iconSizes.l}
          height={theme.iconSizes.l}
          borderRadius="pill"
          bg="inputBackground">
          <Animated.View style={innerAnimatedStyle}>
            <Box
              width={theme.iconSizes.m}
              height={theme.iconSizes.m}
              borderRadius="pill"
              bg="brand"
            />
          </Animated.View>
        </Center>
      </Animated.View>
    </Pressable>
  );
};

export default forwardRef<RadioButtonRef, RadioButtonProps>(RadioButton);
