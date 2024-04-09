import {StyleProp, ViewStyle} from 'react-native';
import {BoxProps} from '@shopify/restyle';
import React, {ReactNode} from 'react';
import {Theme} from 'app/styles/theme';
import Box from './Box';

export interface FlexProps extends BoxProps<Theme> {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const Flex = ({children, ...rest}: FlexProps) => {
  return (
    <Box flex={1} flexDirection="column" {...rest}>
      {children}
    </Box>
  );
};

export default Flex;
