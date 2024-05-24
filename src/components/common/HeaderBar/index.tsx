import {useAppTheme} from 'app/styles/theme';
import React, {FC, useCallback, useRef, useState} from 'react';
import {StyleProp, ViewStyle, LayoutChangeEvent} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Flex from '../Flex';
import LinearGradient from 'react-native-linear-gradient';
import {ScrollView} from 'react-native-gesture-handler';
import HStack from '../HStack';
import TabItem from '../TabItem';

interface HeaderBarProps {
  tabItems: string[];
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

const HeaderBar: FC<HeaderBarProps> = ({
  tabItems,
  selectedTab,
  setSelectedTab,
}) => {
  const theme = useAppTheme();
  const scrollX = useSharedValue(0);
  const scrollContentSize = useSharedValue(0);
  const scrollViewWidth = useSharedValue(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const [tabWidths, setTabWidths] = useState<number[]>([]);

  const linearGradientStyle = useCallback(
    (direction: 'left' | 'right') => {
      return {
        position: 'absolute',
        top: 0,
        [direction]: 0,
        bottom: 0,
        height: '100%',
        width: theme.spacing.l,
        zIndex: 10,
        pointerEvents: 'none',
      } as StyleProp<ViewStyle>;
    },
    [theme],
  );

  const startListGradientAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollX.value,
        [0, theme.spacing.l],
        [0, 1],
        Extrapolation.CLAMP,
      ),
    };
  }, [theme.spacing.l]);

  const endListGradientAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(
        scrollX.value <= 0
          ? 1
          : scrollX.value >=
            scrollContentSize.value -
              scrollViewWidth.value -
              theme.spacing.l / 2
          ? 0
          : 1,
      ),
    };
  }, [theme.spacing.l]);

  const handleTabPress = useCallback(
    (tab: string, index: number) => {
      setSelectedTab(tab);

      // Calculate the scroll position to ensure the selected tab is fully visible
      const tabOffset = tabWidths.slice(0, index).reduce((a, b) => a + b, 0);
      const tabWidth = tabWidths[index];

      let scrollPosition =
        tabOffset - (scrollViewWidth.value / 2 - tabWidth / 2);
      if (scrollPosition < 0) {
        scrollPosition = 0;
      }
      if (scrollPosition > scrollContentSize.value - scrollViewWidth.value) {
        scrollPosition = scrollContentSize.value - scrollViewWidth.value;
      }

      scrollViewRef.current?.scrollTo({
        x: scrollPosition,
        animated: true,
      });
    },
    [setSelectedTab, tabWidths, scrollContentSize, scrollViewWidth],
  );

  const onLayoutTab = useCallback((event: LayoutChangeEvent, index: number) => {
    const {width} = event.nativeEvent.layout;
    setTabWidths(prevWidths => {
      const newWidths = [...prevWidths];
      newWidths[index] = width;
      return newWidths;
    });
  }, []);

  return (
    <Flex>
      <Animated.View
        style={[linearGradientStyle('left'), startListGradientAnimatedStyle]}
        pointerEvents="none">
        <LinearGradient
          colors={[theme.colors.mainBackground, 'transparent']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={linearGradientStyle('left')}
        />
      </Animated.View>
      <ScrollView
        horizontal
        scrollEventThrottle={16}
        onLayout={e => {
          scrollViewWidth.value = e.nativeEvent.layout.width;
        }}
        onContentSizeChange={w => {
          scrollContentSize.value = w;
        }}
        onScroll={e => {
          scrollX.value = e.nativeEvent.contentOffset.x;
        }}
        ref={scrollViewRef}
        decelerationRate={0.9}
        showsHorizontalScrollIndicator={false}
        disableIntervalMomentum={true}
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.xs,
        }}>
        <HStack columnGap="xs" alignItems="center">
          {tabItems.map((tab, index) => (
            <TabItem
              key={tab}
              onPress={() => handleTabPress(tab, index)}
              title={tab}
              count={0}
              selected={selectedTab === tab}
              onLayout={event => onLayoutTab(event, index)}
            />
          ))}
        </HStack>
      </ScrollView>
      <Animated.View
        style={[linearGradientStyle('right'), endListGradientAnimatedStyle]}
        pointerEvents="none">
        <LinearGradient
          colors={['transparent', theme.colors.mainBackground]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={linearGradientStyle('right')}
        />
      </Animated.View>
    </Flex>
  );
};

export default HeaderBar;
