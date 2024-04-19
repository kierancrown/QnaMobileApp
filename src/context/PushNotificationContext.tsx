import React, {createContext, useContext, useEffect} from 'react';
import {Platform, PermissionsAndroid, Alert} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import {supabase} from 'app/lib/supabase';
import {useUser} from 'app/lib/supabase/context/auth';
import {isEmulator} from 'react-native-device-info';

// Define the context
interface NotificationContextType {
  getToken: () => Promise<string>;
  requestPermission: (sessionId: string) => Promise<boolean>;
  registerOnDatabase: (sessionId: string, token: string) => Promise<void>;
  unRegisterNotifications: () => Promise<boolean>;
  silentTokenRegistration: (sessionId: string, skipUserCheck?: boolean) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

// Custom hook to use the notification context
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotification must be used within a NotificationProvider',
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

// Provider component
export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const {user} = useUser();

  const getToken = async () => {
    if (Platform.OS === 'ios') {
      const result = await messaging().getAPNSToken();
      if (result == null) {
        console.error('APNS token is null');
        return '';
      }
    }
    const token = await messaging().getToken();
    return token;
  };

  const registerOnDatabase = async (sessionId: string, token: string) => {
    if (
      Platform.OS !== 'android' &&
      Platform.OS !== 'ios' &&
      Platform.OS !== 'web'
    ) {
      return;
    }
    console.log('Registering token:', sessionId);
    if (!sessionId) {
      console.error('Session ID not found');
      return;
    }

    const {error} = await supabase.from('device_tokens').insert({
      device_token: token,
      type: Platform.OS,
      session_id: sessionId,
    });

    if (error) {
      if (error.code === '23505') {
        console.log('Token already registered');
        return;
      }
      console.error('Error registering token:', error);
    }
  };

  const unRegisterNotifications = async () => {
    const token = await getToken();
    const {error} = await supabase
      .from('device_tokens')
      .delete()
      .eq('device_token', token);

    if (error) {
      console.error('Error unregistering token:', error);
      return false;
    }
    return true;
  };

  const requestPermission = async (sessionId: string) => {
    if (Platform.OS === 'ios' && (await isEmulator())) {
      Alert.alert(
        'Emulator Detected',
        'Push notifications are not supported on the iOS emulator',
      );
      return false;
    }

    if (Platform.OS === 'android') {
      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );

      if (status !== PermissionsAndroid.RESULTS.GRANTED) {
        return false;
      }
    }

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      const token = await getToken();
      await registerOnDatabase(sessionId, token);
      return true;
    }
    return false;
  };

  const silentTokenRegistration = (
    sessionId: string,
    skipUserCheck = false,
  ) => {
    if (!skipUserCheck && !user) {
      return;
    }

    messaging()
      .hasPermission()
      .then(async enabled => {
        if (enabled) {
          const token = await getToken();
          await registerOnDatabase(sessionId, token);
        }
      });
  };

  useEffect(() => {
    const onMessageReceived = async (message: any) => {
      console.log('Message received:', message);
      await notifee.displayNotification({
        ...message.notification,
        android: {channelId: 'default'},
      });
    };

    messaging().onMessage(onMessageReceived);
    messaging().setBackgroundMessageHandler(onMessageReceived);

    return () => {
      messaging().onMessage(onMessageReceived);
      messaging().setBackgroundMessageHandler(onMessageReceived);
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        getToken,
        requestPermission,
        registerOnDatabase,
        unRegisterNotifications,
        silentTokenRegistration,
      }}>
      {children}
    </NotificationContext.Provider>
  );
};
