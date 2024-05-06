import {LargeHeader, ScalingView} from '@codeherence/react-native-header';
import {Text} from 'app/components/common';
import {useAppTheme} from 'app/styles/theme';
import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {SharedValue} from 'react-native-reanimated';

export const LargeHeaderComponent = ({
  scrollY,
}: {
  scrollY: SharedValue<number>;
}) => {
  const theme = useAppTheme();
  const headerStyle: StyleProp<ViewStyle> = {
    paddingVertical: 0,
    marginBottom: theme.spacing.mY,
  };
  return (
    <LargeHeader headerStyle={headerStyle}>
      <ScalingView scrollY={scrollY}>
        <Text
          variant="largeHeader"
          marginVertical="none"
          paddingVertical="none">
          Settings
        </Text>
      </ScalingView>
    </LargeHeader>
  );
};

export default LargeHeaderComponent;
