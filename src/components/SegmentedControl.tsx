import {useAppTheme} from 'app/styles/theme';
import {useHaptics, HapticFeedbackTypes} from 'app/hooks/useHaptics';
import React, {useEffect} from 'react';
import {Dimensions, Pressable, StyleSheet} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Text from './common/Text';
import HStack from './common/HStack';

const {width: SCREEN_WIDTH} = Dimensions.get('screen');

interface SegmentedControlProps {
  segments: Array<string>;
  currentIndex: number;
  onChange: (index: number) => void;
  isRTL?: boolean;
  containerMargin?: number;
}

const defaultShadowStyle = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.025,
  shadowRadius: 1,
  elevation: 1,
};

const DEFAULT_SPRING_CONFIG = {
  stiffness: 150,
  damping: 20,
  mass: 1,
  overshootClamping: false,
  restSpeedThreshold: 0.001,
  restDisplacementThreshold: 0.001,
};

const SegmentedControl: React.FC<SegmentedControlProps> = ({
  segments,
  currentIndex,
  onChange,
  isRTL = false,
  containerMargin = 0,
}: SegmentedControlProps) => {
  const width = SCREEN_WIDTH - containerMargin * 2;
  const translateValue = width / segments.length;
  const tabTranslateValue = useSharedValue(0);
  const {triggerHaptic} = useHaptics();
  const theme = useAppTheme();

  // useCallBack with an empty array as input, which will call inner lambda only once and memoize the reference for future calls
  const memoizedTabPressCallback = React.useCallback(
    (index: number) => {
      triggerHaptic({
        iOS: HapticFeedbackTypes.impactMedium,
        android: HapticFeedbackTypes.soft,
      });
      onChange(index);
    },
    [onChange, triggerHaptic],
  );

  useEffect(() => {
    // If phone is set to RTL, make sure the animation does the correct transition.
    const transitionMultiplier = isRTL ? -1 : 1;
    tabTranslateValue.value = withSpring(
      currentIndex * (translateValue * transitionMultiplier),
      DEFAULT_SPRING_CONFIG,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  const tabTranslateAnimatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{translateX: tabTranslateValue.value}],
    };
  });

  return (
    <Animated.View
      style={[
        styles.defaultSegmentedControlWrapper,
        {
          backgroundColor: theme.colors.segmentBackground,
          borderRadius: theme.borderRadii.m,
        },
        defaultShadowStyle,
      ]}>
      <Animated.View
        style={[
          styles.movingSegmentStyle,
          {
            backgroundColor: theme.colors.segmentItemBackground,
            borderRadius: theme.borderRadii.m,
          },
          StyleSheet.absoluteFill,
          {
            width: width / segments.length - 4,
          },
          tabTranslateAnimatedStyles,
        ]}
      />
      {segments.map((segment, index) => {
        return (
          <Pressable
            onPress={() => memoizedTabPressCallback(index)}
            key={index}
            style={[styles.segmentStyle, {height: theme.spacing.xlY}]}>
            <HStack
              flex={1}
              py="xsY"
              height={66}
              justifyContent="center"
              alignItems="center">
              <Text
                variant="headline"
                fontWeight={currentIndex === index ? '800' : '500'}
                color={
                  currentIndex === index
                    ? 'segmentItemTextSelected'
                    : 'segmentItemText'
                }>
                {segment}
              </Text>
            </HStack>
          </Pressable>
        );
      })}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  defaultSegmentedControlWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  movingSegmentStyle: {
    top: 0,
    marginVertical: 2,
    marginHorizontal: 2,
  },
  segmentStyle: {
    flex: 1,
  },
});

export default SegmentedControl;
