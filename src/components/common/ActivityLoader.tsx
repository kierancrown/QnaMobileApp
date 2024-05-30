import React, {FC, useMemo} from 'react';
import LottieView from 'lottie-react-native';
import Animation from '../../assets/animations/circle-loader.json';
import {Theme, useAppTheme} from 'app/styles/theme';

interface ActivityLoaderProps {
  size?: keyof Theme['spinnerSizes'] | number;
}

export const ActivityLoader: FC<ActivityLoaderProps> = ({size}) => {
  const theme = useAppTheme();
  const spinnerSize = useMemo(
    () =>
      size
        ? typeof size === 'number'
          ? size
          : theme.spinnerSizes[size]
        : theme.spinnerSizes.m,
    [size, theme.spinnerSizes],
  );

  return (
    <LottieView
      source={Animation}
      autoPlay
      loop
      style={{
        width: spinnerSize,
        height: spinnerSize,
      }}
    />
  );
};

export default ActivityLoader;
