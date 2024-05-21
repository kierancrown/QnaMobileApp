import {ScrollViewWithHeaders} from '@codeherence/react-native-header';
import React, {useState} from 'react';
import HeaderComponent from '../components/Header';
import {useAppTheme} from 'app/styles/theme';
import {useBottomPadding} from 'app/hooks/useBottomPadding';
import {useHiddenTabBar} from 'app/context/tabBarContext';
import SettingsItem from '../components/SettingsItem';
import SettingsToggleItem from '../components/SettingsToggleItem';

const SettingsPrivacyScreen = () => {
  const theme = useAppTheme();
  const bottomListPadding = useBottomPadding(theme.spacing.mY);
  useHiddenTabBar();

  const [auth2F, setAuth2F] = useState(true);

  return (
    <ScrollViewWithHeaders
      HeaderComponent={HeaderComponent}
      contentContainerStyle={{
        paddingTop: theme.spacing.mY,
        paddingBottom: bottomListPadding,
      }}>
      <SettingsToggleItem
        title="2 Factor Authentication"
        subtitle="Enable 2FA for your account"
        value={auth2F}
        onValueChange={setAuth2F}
      />
      <SettingsItem title="Mentions" onPress={() => {}} />
      <SettingsItem title="Blocked" onPress={() => {}} />
    </ScrollViewWithHeaders>
  );
};

export default SettingsPrivacyScreen;
