import React, {FC, useState} from 'react';
import Box from '../Box';
import {useTabBar} from 'app/context/tabBarContext';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {MeasureSize} from 'app/components/utils/MeasureSize';
import {View, ViewStyle} from 'react-native';

interface HeaderProps {
  children: React.ReactNode;
  onSize?: (size: {width: number; height: number}) => void;
  absoluteFill?: boolean;
}

const absoluteFillStyle: ViewStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 99999,
};

export const AnimatedHeader: FC<HeaderProps> = ({
  children,
  onSize,
  absoluteFill = true,
}) => {
  const {scrollDirection} = useTabBar();
  const [headerHeight, setHeaderHeight] = useState(0);
  const topInset = useSafeAreaInsets().top;

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: scrollDirection === 'down' ? withTiming(0) : withTiming(1),
      transform: [
        {
          translateY:
            scrollDirection === 'down'
              ? withTiming(-headerHeight)
              : withTiming(0),
        },
      ],
    };
  }, [scrollDirection, headerHeight]);

  return (
    <View
      pointerEvents={scrollDirection === 'down' ? 'none' : 'auto'}
      style={absoluteFill ? absoluteFillStyle : undefined}>
      <Box
        position="absolute"
        width="100%"
        height={topInset}
        zIndex={10}
        bg="mainBackground"
      />
      <MeasureSize
        onSize={size => {
          setHeaderHeight(size.height);
          onSize?.(size);
        }}>
        <Animated.View style={animatedStyles}>
          <Box bg="mainBackground">
            <SafeAreaView edges={['top', 'left', 'right']}>
              <Box>{children}</Box>
            </SafeAreaView>
          </Box>
        </Animated.View>
      </MeasureSize>
    </View>
  );
};

export default AnimatedHeader;
