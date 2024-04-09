import {StyleProp, ViewStyle} from 'react-native';
import {BoxProps} from '@shopify/restyle';
import React, {useEffect} from 'react';
import {Theme} from 'app/styles/theme';
import Box from './Box';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

export interface SkeletonProps extends BoxProps<Theme> {
  animate?: boolean;
  height?: number;
  width?: number;
  color?: keyof Theme['colors'];
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const Skeleton = ({
  animate = true,
  height = 50,
  width = 50,
  color = 'skeleton',
  ...rest
}: SkeletonProps) => {
  const opacity = useSharedValue(0.66);

  useEffect(() => {
    if (animate) {
      opacity.value = withRepeat(
        withTiming(0.33, {duration: 440, easing: Easing.inOut(Easing.ease)}),
        -1,
        true,
      );
    } else {
      opacity.value = 0.66;
    }
  }, [animate, opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  }, []);

  return (
    <Animated.View style={animatedStyle}>
      <Box width={width} height={height} backgroundColor={color} {...rest} />
    </Animated.View>
  );
};

export default Skeleton;
