import {StyleProp, ViewStyle} from 'react-native';
import {BoxProps} from '@shopify/restyle';
import React, {ReactNode} from 'react';
import {Theme} from 'app/styles/theme';
import Box from './Box';

export interface CenterProps extends BoxProps<Theme> {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const Center = ({children, ...rest}: CenterProps) => {
  return (
    <Box
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      {...rest}>
      {children}
    </Box>
  );
};

export default Center;
