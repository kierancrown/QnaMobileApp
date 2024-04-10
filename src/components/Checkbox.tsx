import {Pressable, Text, TextStyle, View, ViewStyle} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useHaptics, HapticFeedbackTypes} from 'app/hooks/useHaptics';
import Check from 'assets/check.svg';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useAppTheme} from 'app/styles/theme';

interface Props {
  size?: 'small' | 'medium' | 'large' | 'xlarge' | number;
  haptics?: HapticFeedbackTypes;
  color?: string;
  checkColor?: string;
  disabled?: boolean;
  style?: ViewStyle;
  text?: string;
  textPressable?: boolean;
  textPosition?: 'right' | 'left';
  animate?: boolean;
  state?: 'unchecked' | 'checked' | 'indeterminate';
  onPress?: (checked: boolean) => void;
  onStateChanged?: (state: 'unchecked' | 'checked' | 'indeterminate') => void;
}
const Checkbox = ({
  size,
  color: colorProp,
  disabled = false,
  checkColor,
  haptics,
  style,
  text,
  textPressable = false,
  state = 'unchecked',
  textPosition = 'right',
  animate = true,
  onPress,
  onStateChanged,
}: Props) => {
  const theme = useAppTheme();
  const color = colorProp || theme.colors.brand;
  const [internalState, setInternalState] = useState(state);
  const {triggerHaptic} = useHaptics();

  const SIZE =
    typeof size === 'number'
      ? size
      : size === 'small'
      ? 16
      : size === 'medium'
      ? 24
      : size === 'large'
      ? 32
      : size === 'xlarge'
      ? 40
      : 24;

  const checkboxScale = useSharedValue(1);
  const checkScale = useSharedValue(0);
  const checkOpacity = useSharedValue(0);

  const backgroundStyle: ViewStyle = {
    flexDirection: textPosition === 'left' ? 'row-reverse' : 'row',
    alignItems: 'center',
    ...style,
  };

  const checkBoxStyle: ViewStyle = {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 4,
    backgroundColor: disabled ? 'gray' : color,
    justifyContent: 'center',
    alignItems: 'center',
  };

  const textStyle: TextStyle = {
    fontSize: SIZE * 0.66,
    fontWeight: '600',
    color: theme.colors.foreground,
    marginLeft: textPosition === 'right' ? 6 : 0,
    marginRight: textPosition === 'left' ? 6 : 0,
  };

  const checkboxAnimatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{scale: checkboxScale.value}],
    };
  }, []);

  const checkAnimatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{scale: checkScale.value}],
      opacity: checkOpacity.value,
    };
  }, []);

  useEffect(() => {
    setInternalState(state);
  }, [state]);

  useEffect(() => {
    if (animate === true) {
      if (internalState === 'checked') {
        checkScale.value = withTiming(1, {duration: 100});
        checkOpacity.value = withTiming(1, {duration: 100});
      } else if (internalState === 'unchecked') {
        checkScale.value = withTiming(0, {duration: 100});
        checkOpacity.value = withTiming(0, {duration: 100});
      }
    }
    if (onStateChanged) {
      onStateChanged(internalState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internalState, onStateChanged]);

  const internalOnPress = () => {
    if (haptics) {
      triggerHaptic(haptics);
    }
    if (onPress) {
      onPress(internalState === 'checked' ? false : true);
    } else {
      if (internalState === 'unchecked') {
        setInternalState('checked');
      } else if (internalState === 'checked') {
        setInternalState('unchecked');
      }
    }
  };

  return (
    <View style={backgroundStyle}>
      <Animated.View style={animate === true && checkboxAnimatedStyles}>
        <Pressable
          disabled={disabled}
          style={checkBoxStyle}
          hitSlop={10}
          onPress={internalOnPress}
          onPressIn={() =>
            (checkboxScale.value = withTiming(0.9, {duration: 100}))
          }
          onPressOut={() =>
            (checkboxScale.value = withTiming(1, {duration: 100}))
          }>
          <Animated.View style={animate === true && checkAnimatedStyles}>
            <Check
              width={SIZE * 0.66}
              height={SIZE * 0.66}
              fill={checkColor ? checkColor : theme.colors.foreground}
            />
          </Animated.View>
        </Pressable>
      </Animated.View>
      {text ? (
        <Pressable
          hitSlop={10}
          disabled={disabled || !textPressable}
          onPress={internalOnPress}
          onPressIn={() =>
            (checkboxScale.value = withTiming(0.9, {duration: 100}))
          }
          onPressOut={() =>
            (checkboxScale.value = withTiming(1, {duration: 100}))
          }>
          <Text style={textStyle}>{text}</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

export default Checkbox;
