import {HapticFeedbackTypes, useHaptics} from 'app/hooks/useHaptics';
import {useAppTheme} from 'app/styles/theme';
import React, {FC, useEffect} from 'react';
import {Pressable, StyleSheet, ViewProps} from 'react-native';
import Animated, {
  FadeInLeft,
  FadeOut,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  LinearTransition,
} from 'react-native-reanimated';
import Badge from './Badge';
import Center from './Center';
import Text from './Text';
import Box from './Box';
import HStack from './HStack';

interface TabItemProps extends ViewProps {
  selected?: boolean;
  onPress: () => void;
  title: string;
  count: number;
  small?: boolean;
  icon?: React.ReactNode;
  layoutAnimation?: boolean;
}

const TabItem: FC<TabItemProps> = ({
  onPress,
  title,
  count,
  selected = false,
  small = false,
  icon,
  layoutAnimation,
  ...rest
}) => {
  const theme = useAppTheme();
  const {triggerHaptic} = useHaptics();

  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  // 0 for unselected, 1 for selected
  const selectedAnimation = useSharedValue(0);

  useEffect(() => {
    selectedAnimation.value = withTiming(selected ? 1 : 0, {
      duration: 100,
    });
  }, [selected, selectedAnimation]);

  const internalOnPress = async () => {
    await triggerHaptic({
      iOS: HapticFeedbackTypes.selection,
      android: HapticFeedbackTypes.effectClick,
    });
    onPress();
  };

  const onPressIn = () => {
    opacity.value = withTiming(0.66, {duration: 88});
    scale.value = withTiming(0.98, {duration: 66});
  };

  const onPressOut = () => {
    opacity.value = withTiming(1, {duration: 88});
    scale.value = withTiming(1, {duration: 88});
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      borderRadius: theme.borderRadii.pill,
      borderColor: theme.colors.divider,
      opacity: opacity.value,
      transform: [{scale: scale.value}],
      borderWidth: StyleSheet.hairlineWidth,
      backgroundColor: interpolateColor(
        selectedAnimation.value,
        [0, 1],
        [
          theme.colors.pillUnselectedBackground,
          theme.colors.pillSelectedBackground,
        ],
      ),
    };
  }, [
    theme.borderRadii.pill,
    theme.colors.divider,
    theme.colors.pillUnselectedBackground,
    theme.colors.pillSelectedBackground,
  ]);

  return (
    <Animated.View
      entering={layoutAnimation ? FadeInLeft : undefined}
      exiting={layoutAnimation ? FadeOut : undefined}
      layout={layoutAnimation ? LinearTransition : undefined}>
      <Box {...rest}>
        <Pressable
          hitSlop={8}
          onPress={internalOnPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}>
          <Badge
            text={count.toString()}
            size={small ? 'xsmall' : 'small'}
            hidden={count === 0}>
            <Animated.View style={animatedStyle}>
              <Center py="xxsY" px="s">
                <HStack columnGap="xxs" alignItems="center">
                  {icon}
                  <Text variant={small ? 'smallBodyBold' : 'medium'}>
                    {title}
                  </Text>
                </HStack>
              </Center>
            </Animated.View>
          </Badge>
        </Pressable>
      </Box>
    </Animated.View>
  );
};

export default TabItem;
