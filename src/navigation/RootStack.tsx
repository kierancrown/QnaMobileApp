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
import OnboardingStack from './OnboardingStack';

const RootStack = () => {
  const theme = useTheme<Theme>();
  const {user} = useUser();

  const authData = useSelector((state: RootState) => state.persistent.auth);

  const determineStack = () => {
    const {deletedAccount, showOnboarding, skippedAuth} = authData;

    if (deletedAccount) {
      if (skippedAuth) {
        return <TabStack />;
      } else {
        return <AuthStack />;
      }
    }
    if (showOnboarding) {
      return <OnboardingStack />;
    } else if (skippedAuth) {
      return <TabStack />;
    }
    if (user) {
      return <TabStack />;
    }
    return <AuthStack />;
  };

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
          {determineStack()}
        </NavigationContainer>
      </SafeAreaProvider>
    </>
  );
};

export default RootStack;
