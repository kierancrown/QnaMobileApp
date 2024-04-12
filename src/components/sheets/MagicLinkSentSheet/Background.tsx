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
  }));
  const containerStyle = useMemo(
    () => [
      style,
      containerAnimatedStyle,
      {
        backgroundColor: theme.colors.mainBackground,
        borderRadius: theme.borderRadii.xl,
        marginHorizontal: theme.spacing.m,
      },
    ],
    [
      style,
      containerAnimatedStyle,
      theme.colors.mainBackground,
      theme.borderRadii,
      theme.spacing,
    ],
  );
  //#endregion

  // render
  return <Animated.View pointerEvents="none" style={containerStyle} />;
};

export default CustomBackground;
