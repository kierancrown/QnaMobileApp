import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';

import MainStack from './MainStack';
import {StatusBar} from 'react-native';
import useColorScheme from './useColorScheme';
import {useTheme} from '@shopify/restyle';
import {Theme} from 'app/styles/theme';

const RootStack = () => {
  const colorScheme = useColorScheme();
  const theme = useTheme<Theme>();

  return (
    <>
      <SafeAreaProvider>
        <StatusBar
          barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={'transparent'}
        />
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
          <MainStack />
        </NavigationContainer>
      </SafeAreaProvider>
    </>
  );
};

export default RootStack;
