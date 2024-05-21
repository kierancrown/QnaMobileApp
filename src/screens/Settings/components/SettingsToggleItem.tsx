import React, {FC} from 'react';
import {Text, HStack, Center} from 'ui';
import {Pressable} from 'react-native';
import {Theme, useAppTheme} from 'app/styles/theme';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Switch} from 'react-native-gesture-handler';

interface SettingsToggleItemProps {
  title: string;
  titleColor?: keyof Theme['colors'];
  icon?: React.ReactNode;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
}

const SettingsToggleItem: FC<SettingsToggleItemProps> = ({
  title,
  titleColor,
  icon,
  value,
  onValueChange,
}) => {
  const theme = useAppTheme();
  const bgAnimation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
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

  const onPress = () => {
    if (onValueChange) {
      onValueChange(!value);
    }
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
            {icon}
            <Text variant="body" color={titleColor}>
              {title}
            </Text>
          </HStack>
          <Center>
            <Switch
              value={value}
              onValueChange={onValueChange}
              thumbColor={theme.colors.foreground}
              trackColor={{
                false: theme.colors.cardText,
                true: theme.colors.brand,
              }}
              ios_backgroundColor={theme.colors.cardText}
            />
          </Center>
        </HStack>
      </Animated.View>
    </Pressable>
  );
};

export default SettingsToggleItem;
