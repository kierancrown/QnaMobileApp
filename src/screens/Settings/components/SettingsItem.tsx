import React, {FC} from 'react';
import {Text, HStack, Center, VStack} from 'ui';
import {Pressable} from 'react-native';
import ChevronRightIcon from 'app/assets/icons/arrows/chevron-right.svg';
import {Theme, useAppTheme} from 'app/styles/theme';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface SettingsItemProps {
  title: string;
  subtitle?: string;
  disabled?: boolean;
  titleColor?: keyof Theme['colors'];
  onPress?: () => void;
  icon?: React.ReactNode;
}

const SettingsItem: FC<SettingsItemProps> = ({
  title,
  subtitle,
  titleColor,
  disabled,
  onPress,
  icon,
}) => {
  const theme = useAppTheme();
  const bgAnimation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(disabled ? 0.5 : 1),
      backgroundColor: interpolateColor(
        bgAnimation.value,
        [0, 1],
        [theme.colors.none, theme.colors.cardBackground],
      ),
    };
  }, []);

  const onPressIn = () => {
    if (!onPress || disabled) {
      return;
    }
    bgAnimation.value = withTiming(1, {
      duration: 66,
    });
  };

  const onPressOut = () => {
    if (!onPress || disabled) {
      return;
    }
    bgAnimation.value = withTiming(0, {
      duration: 66,
    });
  };

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}>
      <Animated.View style={[animatedStyle]}>
        <HStack
          justifyContent="space-between"
          columnGap="s"
          alignItems="center"
          paddingVertical="mY"
          paddingHorizontal="s">
          <HStack alignItems="center" columnGap="xs" flex={1}>
            {icon}
            <VStack rowGap="xxsY" width="100%">
              <Text variant="body" color={titleColor}>
                {title}
              </Text>
              {subtitle && (
                <Text variant="smallBody" color="cardText">
                  {subtitle}
                </Text>
              )}
            </VStack>
          </HStack>
          {onPress && (
            <Center>
              <ChevronRightIcon
                width={theme.iconSizes.m}
                height={theme.iconSizes.m}
              />
            </Center>
          )}
        </HStack>
      </Animated.View>
    </Pressable>
  );
};

export default SettingsItem;
