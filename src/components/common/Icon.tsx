import {StyleProp, ViewStyle} from 'react-native';
import {BoxProps} from '@shopify/restyle';
import React, {ReactElement, useMemo} from 'react';
import Box from './Box';
import {Theme, useAppTheme} from 'app/styles/theme';

export interface IconProps extends BoxProps<Theme> {
  icon: ReactElement;
  color?: keyof Theme['colors'];
  size?: keyof Theme['iconSizes'];
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const Icon = ({icon, color = 'foreground', size = 'm', ...rest}: IconProps) => {
  const theme = useAppTheme();

  // Ensure the icon styles update when the theme changes
  const iconStyles = useMemo(
    () => ({
      fill: theme.colors[color],
      width: theme.iconSizes[size],
      height: theme.iconSizes[size],
    }),
    [color, size, theme.colors, theme.iconSizes],
  );

  return (
    <Box justifyContent="center" alignItems="center" {...rest}>
      {React.cloneElement(icon, iconStyles)}
    </Box>
  );
};

export default Icon;
