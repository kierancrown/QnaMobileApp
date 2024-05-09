import React, {FC} from 'react';
import {Text, HStack, Center} from 'ui';
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
  titleColor?: keyof Theme['colors'];
  onPress: () => void;
  icon?: React.ReactNode;
}

const SettingsItem: FC<SettingsItemProps> = ({
  title,
  titleColor,
  onPress,
  icon,
}) => {
  const theme = useAppTheme();
  const bgAnimation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      borderRadius: theme.borderRadii.m,
      backgroundColor: interpolateColor(
        bgAnimation.value,
        [0, 1],
        [theme.colors.none, theme.colors.cardBackground],
      ),
    };
  }, []);

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

  return (
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={[animatedStyle]}>
        <HStack
          justifyContent="space-between"
          columnGap="s"
          alignItems="center"
          paddingVertical="mY"
          marginHorizontal="s">
          <HStack alignItems="center" columnGap="xs">
            {icon}
            <Text variant="body" color={titleColor}>
              {title}
            </Text>
          </HStack>
          <Center>
            <ChevronRightIcon
              width={theme.iconSizes.m}
              height={theme.iconSizes.m}
            />
          </Center>
        </HStack>
      </Animated.View>
    </Pressable>
  );
};

export default SettingsItem;
