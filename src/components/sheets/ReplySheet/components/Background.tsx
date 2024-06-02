import React, {useMemo} from 'react';
import {BottomSheetBackgroundProps} from '@gorhom/bottom-sheet';
import Animated, {useAnimatedStyle, interpolate} from 'react-native-reanimated';
import {useAppTheme} from 'app/styles/theme';

const CustomBackground: React.FC<BottomSheetBackgroundProps> = ({
  style,
  animatedIndex,
}) => {
  const theme = useAppTheme();

  //#region styles
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animatedIndex.value, [-1, 0], [0.66, 1]),
    backgroundColor: theme.colors.inputBackground,
    borderTopStartRadius: interpolate(
      animatedIndex.value,
      [-1, 0],
      [0, theme.borderRadii.xl],
    ),
    borderTopEndRadius: interpolate(
      animatedIndex.value,
      [-1, 0],
      [0, theme.borderRadii.xl],
    ),
  }));
  const containerStyle = useMemo(
    () => [
      style,
      containerAnimatedStyle,
      {
        backgroundColor: theme.colors.inputBackground,
      },
    ],
    [style, containerAnimatedStyle, theme.colors.inputBackground],
  );
  //#endregion

  // render
  return <Animated.View pointerEvents="none" style={containerStyle} />;
};

export default CustomBackground;
