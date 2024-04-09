import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';

import {StatusBar} from 'react-native';
import useColorScheme from './useColorScheme';
import {useTheme} from '@shopify/restyle';
import {Theme} from 'app/styles/theme';
import {useUser} from 'app/lib/supabase/context/auth';

import MainStack from './MainStack';
import AuthStack from './AuthStack';
import {useSelector} from 'react-redux';
import {RootState} from 'app/redux/store';

const RootStack = () => {
  const colorScheme = useColorScheme();
  const theme = useTheme<Theme>();
  const {user} = useUser();

  const skipAuth = useSelector(
    (state: RootState) => state.persistent.auth.skippedAuth,
  );

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
          {skipAuth || user ? <MainStack /> : <AuthStack />}
        </NavigationContainer>
      </SafeAreaProvider>
    </>
  );
};

export default RootStack;
