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
import HStack from './HStack';
import ActivityLoader from './ActivityLoader';

export interface ButtonProps extends BoxProps<Theme> {
  animateOnPress?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  variant?: 'primary' | 'text' | 'danger';
  title?: string;
  titleVariant?: keyof Theme['textVariants'];
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  testID?: string;
  leftNode?: React.ReactNode;
  rightNode?: React.ReactNode;
}

const Button = ({
  animateOnPress = true,
  variant = 'primary',
  title,
  titleVariant = 'headline',
  fullWidth,
  onLongPress,
  onPress,
  loading,
  disabled,
  leftNode,
  rightNode,
  ...rest
}: ButtonProps) => {
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  const buttonBackgroundColor: keyof Theme['colors'] =
    (disabled || loading) && variant !== 'text'
      ? 'buttonDisabled'
      : variant === 'text'
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
      scale.value = withTiming(0.99, {
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
      disabled={disabled || loading}
      hitSlop={8}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}>
      <Animated.View style={animatedStyle}>
        <Box
          backgroundColor={buttonBackgroundColor}
          alignSelf={fullWidth ? 'stretch' : 'flex-start'}
          opacity={disabled || loading ? 0.6 : 1}
          borderRadius="m"
          px={variant === 'text' ? 'none' : 'm'}
          py={variant === 'text' ? 'none' : 'sY'}
          {...rest}>
          <HStack alignItems="center" justifyContent="center" columnGap="xxs">
            {loading ? (
              <ActivityLoader
                size="xs"
                // color={variant === 'text' ? 'brand' : 'white'}
              />
            ) : null}
            {leftNode}
            <Text
              variant={titleVariant}
              color={variant === 'text' ? 'brand' : 'white'}>
              {title}
            </Text>
            {rightNode}
          </HStack>
        </Box>
      </Animated.View>
    </Pressable>
  );
};

export default Button;
