import React from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';

import {useAppTheme} from 'app/styles/theme';

import {useAppDispatch, useAppSelector} from 'app/redux/store';
import TabStack from './TabStack';
import AuthSheet from 'app/components/sheets/AuthSheet';
import {closeAuthSheet} from 'app/redux/slices/authSheetSlice';

const RootStack = () => {
  const theme = useAppTheme();
  const dispatch = useAppDispatch();
  const authSheetOpen = useAppSelector(
    state => state.nonPersistent.authSheet.sheetOpen,
  );

  const authSheetDismissed = () => {
    dispatch(closeAuthSheet());
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
        <TabStack />
      </NavigationContainer>
      <AuthSheet open={authSheetOpen} onClose={authSheetDismissed} />
    </>
  );
};

export default RootStack;
