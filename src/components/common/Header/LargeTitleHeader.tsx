import React, {FC, useEffect} from 'react';
import Animated, {
  clamp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';
import {mvs} from 'react-native-size-matters';
import {HStack, Text} from 'ui';

interface LargeTitleHeaderProps {
  title: string;
  collapsed?: boolean;
}

const HEADER_HEIGHT = mvs(48);
const HEADER_COLLAPSED_HEIGHT = mvs(33);

const LargeTitleHeader: FC<LargeTitleHeaderProps> = ({
  title,
  collapsed = false,
}) => {
  const headerCollapsed = useSharedValue(0);

  useEffect(() => {
    headerCollapsed.value = withTiming(collapsed ? 1 : 0);
  }, [collapsed, headerCollapsed]);

  const animatedTextStyles = useAnimatedStyle(() => {
    const scale = clamp(
      interpolate(headerCollapsed.value, [0, 1], [1, 0.2]),
      0.5,
      1,
    );

    return {
      opacity: 1,
      transform: [
        {scale},
        {
          translateX: interpolate(headerCollapsed.value, [0, 1], [0, -160]),
        },
        {
          translateY: interpolate(headerCollapsed.value, [0, 1], [0, -20]),
        },
      ],
      height: interpolate(
        headerCollapsed.value,
        [0, 1],
        [HEADER_HEIGHT, HEADER_COLLAPSED_HEIGHT],
      ),
    };
  }, []);

  return (
    <SafeAreaView edges={['top', 'left', 'right']}>
      <HStack alignItems="center" px="m" py="xsY">
        <Animated.View style={animatedTextStyles}>
          <Text variant="largeHeader">{title}</Text>
        </Animated.View>
      </HStack>
    </SafeAreaView>
  );
};

export default LargeTitleHeader;
