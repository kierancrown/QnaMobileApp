import React, {FC} from 'react';
import {ThemeProvider as ShopifyThemeProvider} from '@shopify/restyle';
import theme, {darkTheme} from 'app/styles/theme';
import {useColorScheme} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from 'app/redux/store';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: FC<ThemeProviderProps> = ({children}) => {
  const themeSettings = useSelector(
    (state: RootState) => state.persistent.theme,
  );
  const systemColorScheme = useColorScheme();
  const colorScheme =
    themeSettings.mode === 'system' ? systemColorScheme : themeSettings.mode;

  return (
    <ShopifyThemeProvider theme={colorScheme === 'dark' ? darkTheme : theme}>
      {children}
    </ShopifyThemeProvider>
  );
};

export default ThemeProvider;
