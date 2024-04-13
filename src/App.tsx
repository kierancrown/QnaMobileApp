import React, {FC, useState} from 'react';
import RootStack from './navigation/RootStack';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor, store} from './redux/store';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {SafeAreaProvider} from 'react-native-safe-area-context';

import ThemeProvider from './wrappers/ThemeProvider';
import {AuthContextProvider} from './lib/supabase/context/auth';

import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
import relativeTime from 'dayjs/plugin/relativeTime';
import SplashScreen from './screens/SplashScreen';
import {SystemBars} from 'react-native-bars';
import theme from './styles/theme';

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'just now',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1d',
    dd: '%dd',
    M: '1mo',
    MM: '%dmo',
    y: '1yr',
    yy: '%dyr',
  },
});

const gestureStyle = {flex: 1, backgroundColor: theme.colors.black};

const App: FC = () => {
  const [displaySplash, setDisplaySplash] = useState(true);

  return (
    <>
      <GestureHandlerRootView style={gestureStyle}>
        <SafeAreaProvider>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <ThemeProvider>
                <AuthContextProvider>
                  <RootStack />
                  {displaySplash && (
                    <SplashScreen onDismiss={() => setDisplaySplash(false)} />
                  )}
                </AuthContextProvider>
              </ThemeProvider>
            </PersistGate>
          </Provider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
      <SystemBars barStyle="dark-content" />
    </>
  );
};

export default App;
