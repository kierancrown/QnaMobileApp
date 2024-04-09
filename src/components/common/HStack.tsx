import {StyleProp, ViewStyle} from 'react-native';
import {BoxProps} from '@shopify/restyle';
import React, {ReactNode} from 'react';
import {Theme} from 'app/styles/theme';
import Box from './Box';

export interface HStackProps extends BoxProps<Theme> {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const HStack = ({children, ...rest}: HStackProps) => {
  return (
    <Box flexDirection="row" {...rest}>
      {children}
    </Box>
  );
};

export default HStack;
