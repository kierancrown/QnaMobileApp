import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {Platform, PermissionsAndroid, Alert} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import {supabase} from 'app/lib/supabase';
import {isEmulator} from 'react-native-device-info';
import {useAppDispatch} from 'app/redux/store';
import {setUnreadCount} from 'app/redux/slices/notificationSlice';
import theme from 'app/styles/theme';
import {Notification} from 'app/screens/Inbox/Screen';
import {Flex} from 'app/components/common';
import InAppNotification from 'app/components/InAppNotification';
import {useAuth} from 'app/hooks/useAuth';

// Define the context
interface NotificationContextType {
  getToken: () => Promise<string>;
  checkPermission: () => Promise<boolean>;
  requestPermission: (sessionId: string) => Promise<boolean>;
  registerOnDatabase: (sessionId: string, token: string) => Promise<void>;
  unRegisterNotifications: () => Promise<boolean>;
  silentTokenRegistration: (sessionId: string, skipUserCheck?: boolean) => void;
  currentNotification?: Notification;
  clearCurrentNotification: () => void;
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
  const dispatch = useAppDispatch();
  const {profile, authStatus} = useAuth({});
  const [currentNotification, setCurrentNotification] =
    useState<Notification>();

  const getUnreadCount = useCallback(async () => {
    const userId = profile?.user_id;
    if (!userId) {
      return 0;
    }
    const {data, error} = await supabase
      .from('notifications')
      .select('id')
      .is('read_at', null)
      .eq('user_id', userId);

    if (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }

    console.log('Unread count:', data?.length);

    return data?.length || 0;
  }, [profile?.user_id]);

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

    const fbAuthStatus = await messaging().requestPermission();
    const enabled =
      fbAuthStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      fbAuthStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      const token = await getToken();
      await registerOnDatabase(sessionId, token);
      return true;
    }
    return false;
  };

  const checkPermission = async () => {
    const enabled = await messaging().hasPermission();
    return enabled === messaging.AuthorizationStatus.AUTHORIZED;
  };

  const silentTokenRegistration = (
    sessionId: string,
    skipUserCheck = false,
  ) => {
    if (!skipUserCheck && authStatus !== 'SIGNED_IN') {
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

  const clearCurrentNotification = () => {
    setCurrentNotification(undefined);
  };

  useEffect(() => {
    const onMessageReceived = async (message: any) => {
      const unreadCount = await getUnreadCount();
      dispatch(setUnreadCount(unreadCount));
      // console.log('Message received:', JSON.stringify(message, null, 2));

      await notifee.displayNotification({
        ...message.notification,
        ios: {
          badgeCount: unreadCount,
        },
        data: {
          ...message.data,
        },
        android: {
          channelId: 'default',
          badgeCount: unreadCount,
          smallIcon: 'ic_stat_qna',
          largeIcon:
            message.data && message.data.image ? message.data.image : undefined,
          color: theme.colors.brand,
        },
      });
    };

    const onForegroundMessage = async (detail: any) => {
      const unreadCount = await getUnreadCount();
      dispatch(setUnreadCount(unreadCount));
      await notifee.setBadgeCount(unreadCount);

      const currentNotificationId =
        typeof detail.data.id === 'string'
          ? parseInt(detail.data.id, 10)
          : undefined;

      if (!currentNotificationId) {
        return;
      }

      const {data, error} = await supabase
        .from('notifications')
        .select('*')
        .eq('id', currentNotificationId)
        .single();
      if (error) {
        console.error(error);
      }
      setCurrentNotification((data as Notification) || undefined);
    };

    messaging().onMessage(onForegroundMessage);
    messaging().setBackgroundMessageHandler(onMessageReceived);

    return () => {
      messaging().onMessage(onForegroundMessage);
      messaging().setBackgroundMessageHandler(onMessageReceived);
    };
  }, [dispatch, getUnreadCount, authStatus]);

  useEffect(() => {
    (async () => {
      const userId = profile?.user_id;
      if (userId) {
        const unreadCount = await getUnreadCount();
        dispatch(setUnreadCount(unreadCount));
      } else {
        console.log('User not found');
      }
    })();
  }, [dispatch, getUnreadCount, profile?.user_id]);

  return (
    <NotificationContext.Provider
      value={{
        getToken,
        checkPermission,
        requestPermission,
        registerOnDatabase,
        unRegisterNotifications,
        silentTokenRegistration,
        currentNotification,
        clearCurrentNotification,
      }}>
      <Flex>
        {currentNotification && (
          <InAppNotification
            // @ts-ignore
            notification={currentNotification}
            removeSelf={clearCurrentNotification}
          />
        )}
        {children}
      </Flex>
    </NotificationContext.Provider>
  );
};

export const useCurrentNotification = () => {
  const {currentNotification, clearCurrentNotification} = useNotification();
  return {currentNotification, clearCurrentNotification};
};
