import React, {FC} from 'react';
import {Text, HStack, Center, VStack} from 'ui';
import {Theme, useAppTheme} from 'app/styles/theme';
import {Switch} from 'react-native-gesture-handler';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';

interface SettingsToggleItemProps {
  title: string;
  titleColor?: keyof Theme['colors'];
  subtitle?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
}

const SettingsToggleItem: FC<SettingsToggleItemProps> = ({
  title,
  titleColor,
  subtitle,
  loading,
  disabled,
  icon,
  value,
  onValueChange,
}) => {
  const theme = useAppTheme();

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: withTiming(disabled ? 0.5 : 1),
    };
  }, [disabled]);

  return (
    <Animated.View style={animatedStyles}>
      <HStack
        justifyContent="space-between"
        columnGap="m"
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
        <Center>
          <Switch
            disabled={disabled || loading}
            hitSlop={16}
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
  );
};

export default SettingsToggleItem;
