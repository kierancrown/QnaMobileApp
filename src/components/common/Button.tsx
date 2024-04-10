import {Pressable} from 'react-native';
import {BoxProps} from '@shopify/restyle';
import React from 'react';
import {Theme} from 'app/styles/theme';
import Box from './Box';
import Text from './Text';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export interface ButtonProps extends BoxProps<Theme> {
  animateOnPress?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  variant?: 'primary' | 'text' | 'danger';
  title?: string;
  testID?: string;
}

const Button = ({
  animateOnPress = true,
  variant = 'primary',
  title,
  onLongPress,
  onPress,
  ...rest
}: ButtonProps) => {
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  const buttonBackgroundColor: keyof Theme['colors'] =
    variant === 'text'
      ? 'none'
      : variant === 'danger'
      ? 'destructiveAction'
      : 'brand';

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{scale: scale.value}],
    };
  }, []);

  const onPressIn = () => {
    if (animateOnPress) {
      opacity.value = withTiming(0.88, {
        duration: 100,
      });
      scale.value = withTiming(0.95, {
        duration: 66,
      });
    }
  };

  const onPressOut = () => {
    if (animateOnPress) {
      opacity.value = withTiming(1, {
        duration: 88,
      });
      scale.value = withTiming(1, {
        duration: 46,
      });
    }
  };

  return (
    <Pressable
      hitSlop={8}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}>
      <Animated.View style={animatedStyle}>
        <Box
          backgroundColor={buttonBackgroundColor}
          borderRadius="m"
          px={variant === 'text' ? 'none' : 'm'}
          py={variant === 'text' ? 'none' : 'sY'}
          {...rest}>
          <Text
            variant="headline"
            color={variant === 'text' ? 'brand' : 'white'}>
            {title}
          </Text>
        </Box>
      </Animated.View>
    </Pressable>
  );
};

export default Button;
