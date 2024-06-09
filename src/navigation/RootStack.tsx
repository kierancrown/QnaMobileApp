import React from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';

import {useAppTheme} from 'app/styles/theme';
import TabStack from './TabStack';
import AuthSheet from 'app/components/sheets/AuthSheet';

const RootStack = () => {
  const theme = useAppTheme();

  return (
    <>
      <NavigationContainer
        theme={{
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            background: theme.colors.mainBackground,
            primary: theme.colors.brand,
            text: theme.colors.foreground,
          },
        }}>
        <TabStack />
      </NavigationContainer>
      <AuthSheet />
    </>
  );
};

export default RootStack;
