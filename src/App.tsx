import React, {FC, useEffect, useState} from 'react';
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

import {PermissionsAndroid, Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import useMount from './hooks/useMount';
import notifee from '@notifee/react-native';

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

  useMount(() => {
    async function requestUserPermission() {
      Platform.OS === 'android' &&
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );

      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
        // Register the device with FCM
        await messaging().registerDeviceForRemoteMessages();
        // Get the token
        const token = await messaging().getToken();

        console.log('FCM Token:', token);
      }
    }
    requestUserPermission();
  });

  useEffect(() => {
    // @ts-ignore
    async function onMessageReceived(message) {
      console.log('Message received:', message);
      notifee.displayNotification(JSON.parse(message.data));
    }

    messaging().onMessage(onMessageReceived);
    messaging().setBackgroundMessageHandler(onMessageReceived);

    return () => {
      messaging().onMessage(onMessageReceived);
      messaging().setBackgroundMessageHandler(onMessageReceived);
    };
  }, []);

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
