import {StyleProp, ViewStyle} from 'react-native';
import {BoxProps} from '@shopify/restyle';
import React, {ReactNode} from 'react';
import {Theme} from 'app/styles/theme';
import Box from './Box';

export interface VStackProps extends BoxProps<Theme> {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const VStack = ({children, ...rest}: VStackProps) => {
  return (
    <Box flexDirection="column" {...rest}>
      {children}
    </Box>
  );
};

export default VStack;
