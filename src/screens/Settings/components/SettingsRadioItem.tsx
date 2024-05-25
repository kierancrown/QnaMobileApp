import React, {FC, useRef} from 'react';
import {Text, HStack, Center, VStack} from 'ui';
import {Theme, useAppTheme} from 'app/styles/theme';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import RadioButton, {RadioButtonRef} from 'app/components/common/RadioButton';
import {Pressable} from 'react-native';

export interface SettingsToggleItemProps {
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
  const bgAnimation = useSharedValue(0);
  const radioButtonRef = useRef<RadioButtonRef>(null);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: withTiming(disabled ? 0.5 : 1),
      backgroundColor: interpolateColor(
        bgAnimation.value,
        [0, 1],
        [theme.colors.none, theme.colors.cardBackground],
      ),
    };
  }, [disabled]);

  const onPressIn = (skipRef = false) => {
    if (disabled || loading) {
      return;
    }
    if (!skipRef) {
      radioButtonRef.current?.onPressIn();
    }
    bgAnimation.value = withTiming(1, {
      duration: 66,
    });
  };

  const onPressOut = (skipRef = false) => {
    if (disabled || loading) {
      return;
    }
    if (!skipRef) {
      radioButtonRef.current?.onPressOut();
    }
    bgAnimation.value = withTiming(0, {
      duration: 66,
    });
  };

  const onPress = () => {
    if (!disabled && !loading && onValueChange) {
      onValueChange(!value);
    }
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => onPressIn()}
      onPressOut={() => onPressOut()}>
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
            <RadioButton
              ref={radioButtonRef}
              selected={value || false}
              onPress={() => {
                if (!disabled && !loading && onValueChange) {
                  onValueChange(!value);
                }
              }}
              onPressIn={() => onPressIn(true)}
              onPressOut={() => onPressOut(true)}
            />
          </Center>
        </HStack>
      </Animated.View>
    </Pressable>
  );
};

export default SettingsToggleItem;
