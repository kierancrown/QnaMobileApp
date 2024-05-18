import {ScrollViewWithHeaders} from '@codeherence/react-native-header';
import React from 'react';
import HeaderComponent from '../components/Header';
import {useAppTheme} from 'app/styles/theme';
import {useBottomPadding} from 'app/hooks/useBottomPadding';
import {useHiddenTabBar} from 'app/context/tabBarContext';
import SettingsItem from '../components/SettingsItem';
import SectionHeader from '../components/SectionHeader';
import {Text} from 'app/components/common';
import {useNotification} from 'app/context/PushNotificationContext';
import useMount from 'app/hooks/useMount';
// import {clearCache} from '@candlefinance/faster-image';

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

  const clearCacheHandler = () => {
    // clearCache();
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
    </ScrollViewWithHeaders>
  );
};

export default SettingsDebugScreen;
