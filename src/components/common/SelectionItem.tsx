import React, {FC} from 'react';
import {Text, HStack, Center} from 'ui';
import {Pressable} from 'react-native';
import CheckIcon from 'app/assets/icons/check.svg';
import {Theme, useAppTheme} from 'app/styles/theme';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface SelectionItemProps {
  title: string;
  titleColor?: keyof Theme['colors'];
  onSelected?: () => void;
  selected?: boolean;
}

const SelectionItem: FC<SelectionItemProps> = ({
  title,
  titleColor,
  onSelected,
  selected,
}) => {
  const theme = useAppTheme();
  const bgAnimation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        selected ? withTiming(1) : bgAnimation.value,
        [0, 1],
        [theme.colors.none, theme.colors.cardBackground],
      ),
    };
  }, [selected]);

  const onPressIn = () => {
    bgAnimation.value = withTiming(1, {
      duration: 66,
    });
  };

  const onPressOut = () => {
    bgAnimation.value = withTiming(0, {
      duration: 66,
    });
  };

  const onPress = () => {
    onSelected?.();
  };

  return (
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={[animatedStyle]}>
        <HStack
          justifyContent="space-between"
          columnGap="s"
          alignItems="center"
          paddingVertical="mY"
          paddingHorizontal="s">
          <HStack alignItems="center" columnGap="xs">
            <Text variant="body" color={titleColor}>
              {title}
            </Text>
          </HStack>
          <Center>
            {selected && (
              <CheckIcon width={theme.iconSizes.m} height={theme.iconSizes.m} />
            )}
          </Center>
        </HStack>
      </Animated.View>
    </Pressable>
  );
};

export default SelectionItem;
