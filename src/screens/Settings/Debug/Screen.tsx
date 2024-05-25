import {ScrollViewWithHeaders} from '@codeherence/react-native-header';
import React from 'react';
import HeaderComponent from '../components/Header';
import {useAppTheme} from 'app/styles/theme';
import {useBottomPadding} from 'app/hooks/useBottomPadding';
import {useHiddenTabBar} from 'app/context/tabBarContext';
import SettingsItem from '../components/SettingsItem';
import SectionHeader from '../components/SectionHeader';
import {Button, Text} from 'app/components/common';
import {useNotification} from 'app/context/PushNotificationContext';
import useMount from 'app/hooks/useMount';
import {clearCache} from '@candlefinance/faster-image';
import {
  getFreeDiskStorageSync,
  getTotalDiskCapacitySync,
} from 'react-native-device-info';
import {Alert} from 'react-native';
import RNReactNativeHapticFeedback from 'react-native-haptic-feedback';

const convertBytesToMB = (bytes: number) => {
  return Math.round(bytes / 1024 / 1024);
};

const SettingsDebugScreen = () => {
  const theme = useAppTheme();
  const bottomListPadding = useBottomPadding(theme.spacing.mY);
  const [fcmToken, setFcmToken] = React.useState<string | null>(null);
  const {getToken} = useNotification();
  useHiddenTabBar();

  useMount(() => {
    (async () => {
      setFcmToken(await getToken());
    })();
  });

  const clearCacheHandler = async () => {
    const result = await clearCache();
    if (result === true) {
      Alert.alert('Cache Cleared', 'The cache has been cleared successfully');
    }
  };

  return (
    <ScrollViewWithHeaders
      HeaderComponent={HeaderComponent}
      contentContainerStyle={{
        paddingTop: theme.spacing.mY,
        paddingBottom: bottomListPadding,
      }}>
      <SectionHeader title="Notifications" />
      <SettingsItem title="Resend FCM Token" onPress={() => {}} />
      <Text
        variant="smaller"
        color="cardText"
        paddingHorizontal="s"
        marginBottom="mY">
        {fcmToken || 'Loading FCM token...'}
      </Text>
      <SectionHeader title="Cache" />
      <SettingsItem
        title="Clear Cache"
        titleColor="destructiveAction"
        onPress={clearCacheHandler}
      />
      <Text
        variant="smaller"
        color="cardText"
        paddingHorizontal="s"
        marginBottom="mY">
        {`Free Disk Space: ${convertBytesToMB(
          getFreeDiskStorageSync(),
        )}Mb / Total Disk Space: ${convertBytesToMB(
          getTotalDiskCapacitySync(),
        )}Mb`}
      </Text>
      <SectionHeader title="Haptics" />
      <Button
        title="Vibrate"
        onPress={() => {
          RNReactNativeHapticFeedback.trigger('soft', {
            enableVibrateFallback: false,
            ignoreAndroidSystemSettings: true,
          });
        }}
      />
    </ScrollViewWithHeaders>
  );
};

export default SettingsDebugScreen;
