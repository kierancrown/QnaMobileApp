import {Text, TextStyle, View, ViewStyle} from 'react-native';
import React, {ReactElement, useEffect, useState} from 'react';
import theme from 'app/styles/theme';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | number;
  display?: 'icon' | 'both' | 'none';
  color?: string;
  text?: string;
  icon?: ReactElement<any>;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children?: ReactElement<any>;
  position?: 'topRight' | 'bottomRight' | 'topLeft' | 'bottomLeft';
  opacity?: number;
  animateOnMount?: boolean;
  hidden?: boolean;
}
const Badge = ({
  size,
  display = 'none',
  color = theme.colors.badgeBackground,
  text,
  style,
  icon,
  children,
  position = 'topRight',
  animateOnMount = false,
  hidden = false,
  opacity = 1,
}: Props) => {
  const IS_NUMBER = /^\d+$/.test(text || '');
  const SIZE =
    typeof size === 'number'
      ? size
      : size === 'xsmall'
      ? 8
      : size === 'small'
      ? 16
      : size === 'medium'
      ? 24
      : size === 'large'
      ? 32
      : size === 'xlarge'
      ? 40
      : 24;

  const [actualWidth, setActualWidth] = useState(SIZE);
  const badgeScale = useSharedValue(1);

  const backgroundStyle: ViewStyle = {
    minWidth: SIZE,
    height: SIZE,
    paddingHorizontal: IS_NUMBER || !text ? 0 : SIZE / 2.5,
    borderRadius: 99999,
    backgroundColor: color,
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: children ? 'absolute' : 'relative',
    top: children
      ? position === 'topRight' || position === 'topLeft'
        ? -(SIZE / 3)
        : undefined
      : undefined,
    bottom: children
      ? position === 'bottomRight' || position === 'bottomLeft'
        ? -(SIZE / 3)
        : undefined
      : undefined,
    left: children
      ? position === 'topLeft' || position === 'bottomLeft'
        ? -(actualWidth / 3)
        : undefined
      : undefined,
    right: children
      ? position === 'bottomRight' || position === 'topRight'
        ? -(actualWidth / 3)
        : undefined
      : undefined,
    opacity,
    ...style,
  };

  const textStyle: TextStyle = {
    fontSize: SIZE / 2,
    fontWeight: icon ? '800' : '600',
    color: 'white',
    marginLeft: icon ? 4 : 0,
  };

  const iconStyle = {
    width: SIZE / 2,
    height: SIZE / 2,
  };

  useEffect(() => {
    if (animateOnMount === true) {
      badgeScale.value = 0;
      badgeScale.value = withSpring(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animateOnMount]);

  useEffect(() => {
    if (hidden === true) {
      badgeScale.value = withTiming(0, {duration: 250});
    } else {
      badgeScale.value = withSpring(1, {
        stiffness: 200,
        damping: 10,
        mass: 1,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hidden]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: badgeScale.value}],
    };
  }, [badgeScale.value]);

  return (
    <View>
      <View>{children}</View>
      <Animated.View
        style={[backgroundStyle, animatedStyle]}
        onLayout={e => setActualWidth(e.nativeEvent.layout.width)}>
        {icon && display !== 'none'
          ? React.cloneElement(icon, {
              style: iconStyle,
              fill: theme.colors.foreground,
            })
          : null}
        {text && text !== '' && size !== 'xsmall' && display !== 'icon' ? (
          <Text
            style={[textStyle, {color: theme.colors.foreground}]}
            numberOfLines={1}>
            {text}
          </Text>
        ) : null}
      </Animated.View>
    </View>
  );
};

export default Badge;
