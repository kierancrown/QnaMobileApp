import React from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';

import {useAppTheme} from 'app/styles/theme';
import {useUser} from 'app/lib/supabase/context/auth';

import AuthStack from './AuthStack';
import {useSelector} from 'react-redux';
import {RootState} from 'app/redux/store';
import TabStack from './TabStack';
import OnboardingStack from './OnboardingStack';

const RootStack = () => {
  const theme = useAppTheme();
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
    </>
  );
};

export default RootStack;
