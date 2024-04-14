import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';

import {useTheme} from '@shopify/restyle';
import {Theme} from 'app/styles/theme';
import {useUser} from 'app/lib/supabase/context/auth';

import AuthStack from './AuthStack';
import {useSelector} from 'react-redux';
import {RootState} from 'app/redux/store';
import TabStack from './TabStack';

const RootStack = () => {
  const theme = useTheme<Theme>();
  const {user} = useUser();

  const skipAuth = useSelector(
    (state: RootState) => state.persistent.auth.skippedAuth,
  );

  console.log({skipAuth, user});

  return (
    <>
      <SafeAreaProvider>
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
          {skipAuth || user ? <TabStack /> : <AuthStack />}
        </NavigationContainer>
      </SafeAreaProvider>
    </>
  );
};

export default RootStack;
