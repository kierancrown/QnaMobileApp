import React, {FC} from 'react';
import {Text, HStack, Center, VStack} from 'ui';
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
  subtitle?: string;
  titleColor?: keyof Theme['colors'];
  onSelected?: () => void;
  selected?: boolean;
}

const SelectionItem: FC<SelectionItemProps> = ({
  title,
  subtitle,
  titleColor,
  onSelected,
  selected,
}) => {
  const theme = useAppTheme();
  const bgAnimation = useSharedValue(selected ? 1 : 0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        bgAnimation.value,
        [0, 1],
        [theme.colors.none, theme.colors.cardBackground],
      ),
    };
  }, [selected]);

  const onPressIn = () => {
    if (selected) {
      return;
    }
    bgAnimation.value = withTiming(1, {
      duration: 66,
    });
  };

  const onPressOut = () => {
    if (selected) {
      return;
    }
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
          paddingVertical={subtitle ? 'xsY' : 'mY'}
          paddingHorizontal="s">
          <HStack alignItems="center" columnGap="xs" flex={1}>
            <VStack rowGap="xxsY">
              <Text variant="body" numberOfLines={1} color={titleColor}>
                {title}
              </Text>
              {subtitle && (
                <Text variant="smallBody" numberOfLines={1} color="cardText">
                  {subtitle}
                </Text>
              )}
            </VStack>
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
