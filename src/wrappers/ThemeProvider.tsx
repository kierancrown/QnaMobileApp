import React, {FC} from 'react';
import {ThemeProvider as ShopifyThemeProvider} from '@shopify/restyle';
import theme from 'app/styles/theme';
import {StatusBar} from 'react-native';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: FC<ThemeProviderProps> = ({children}) => {
  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <ShopifyThemeProvider theme={theme}>{children}</ShopifyThemeProvider>
    </>
  );
};

export default ThemeProvider;
