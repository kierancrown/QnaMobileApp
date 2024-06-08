import React, {useMemo} from 'react';
import {BottomSheetBackdropProps} from '@gorhom/bottom-sheet';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {useAppTheme} from 'app/styles/theme';

const CustomBackdrop = ({animatedIndex, style}: BottomSheetBackdropProps) => {
  const theme = useAppTheme();
  // animated variables
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [-1, 0],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  // styles
  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: theme.colors.sheetBackdrop,
      },
      containerAnimatedStyle,
    ],
    [style, containerAnimatedStyle, theme.colors.sheetBackdrop],
  );

  return (
    <Animated.View
      pointerEvents={animatedIndex.value < 0 ? 'none' : 'auto'}
      style={containerStyle}
    />
  );
};

export default CustomBackdrop;
