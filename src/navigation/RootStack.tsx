import React from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';

import {useAppTheme} from 'app/styles/theme';
import {useUser} from 'app/lib/supabase/context/auth';

import AuthStack from './AuthStack';
import {useSelector} from 'react-redux';
import {RootState, useAppDispatch, useAppSelector} from 'app/redux/store';
import TabStack from './TabStack';
import OnboardingStack from './OnboardingStack';
import AuthSheet from 'app/components/sheets/AuthSheet';
import {closeAuthSheet} from 'app/redux/slices/authSheetSlice';

const RootStack = () => {
  const theme = useAppTheme();
  const {user} = useUser();
  const dispatch = useAppDispatch();
  const authData = useSelector((state: RootState) => state.persistent.auth);
  const authSheetOpen = useAppSelector(
    state => state.nonPersistent.authSheet.sheetOpen,
  );

  const authSheetDismissed = () => {
    dispatch(closeAuthSheet());
  };

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
      <AuthSheet open={authSheetOpen} onClose={authSheetDismissed} />
    </>
  );
};

export default RootStack;
