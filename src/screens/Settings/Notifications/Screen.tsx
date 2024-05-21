import {ScrollViewWithHeaders} from '@codeherence/react-native-header';
import React, {useState} from 'react';
import HeaderComponent from '../components/Header';
import {useAppTheme} from 'app/styles/theme';
import {useBottomPadding} from 'app/hooks/useBottomPadding';
import {useHiddenTabBar} from 'app/context/tabBarContext';
import SettingsItem from '../components/SettingsItem';
import SettingsToggleItem from '../components/SettingsToggleItem';

const SettingsNotificationScreen = () => {
  const theme = useAppTheme();
  const bottomListPadding = useBottomPadding(theme.spacing.mY);
  useHiddenTabBar();

  const [pushNotificationsEnabled, setPushNotificationsEnabled] =
    useState(true);

  return (
    <ScrollViewWithHeaders
      HeaderComponent={HeaderComponent}
      contentContainerStyle={{
        paddingTop: theme.spacing.mY,
        paddingBottom: bottomListPadding,
      }}>
      <SettingsToggleItem
        title="Push Notifications"
        value={pushNotificationsEnabled}
        onValueChange={setPushNotificationsEnabled}
      />
      <SettingsItem title="Report an issue" onPress={() => {}} />
      <SettingsItem title="Send Feedback" onPress={() => {}} />
      <SettingsItem title="FAQs" onPress={() => {}} />
    </ScrollViewWithHeaders>
  );
};

export default SettingsNotificationScreen;
