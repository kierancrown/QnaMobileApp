import {ScrollViewWithHeaders} from '@codeherence/react-native-header';
import React from 'react';
import HeaderComponent from '../components/Header';
import {useAppTheme} from 'app/styles/theme';
import {useBottomPadding} from 'app/hooks/useBottomPadding';
import {useHiddenTabBar} from 'app/context/tabBarContext';
import SettingsItem from '../components/SettingsItem';
import SettingsToggleItem from '../components/SettingsToggleItem';
import useSyncedPreference from 'app/hooks/useSyncedPreference';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {ProfileStackParamList} from 'app/navigation/ProfileStack';

interface TwoFAPreference {
  enabled: boolean;
  key: string;
}

const SettingsPrivacyScreen = () => {
  const theme = useAppTheme();
  const bottomListPadding = useBottomPadding(theme.spacing.mY);
  const {navigate} = useNavigation<NavigationProp<ProfileStackParamList>>();
  useHiddenTabBar();

  const [twoFA, setTwoFA, {loading: loading2FA}] =
    useSyncedPreference<TwoFAPreference>('2FA', {
      enabled: false,
      key: 'hello_world',
    });

  const setAuth2F = async (value: boolean) => {
    await setTwoFA({...twoFA, enabled: value});
  };

  return (
    <ScrollViewWithHeaders
      HeaderComponent={HeaderComponent}
      contentContainerStyle={{
        paddingTop: theme.spacing.mY,
        paddingBottom: bottomListPadding,
      }}>
      <SettingsToggleItem
        title="2 Factor Authentication"
        subtitle={
          twoFA.enabled
            ? '2FA is enabled for your account'
            : '2FA is disabled for your account'
        }
        // loading={loading2FA}
        value={twoFA.enabled}
        onValueChange={setAuth2F}
      />
      <SettingsItem
        title="Mentions"
        onPress={() => {
          navigate('SettingsMentionsScreen', {
            headerTitle: 'Mentions',
          });
        }}
      />
      <SettingsItem title="Blocked" onPress={() => {}} />
    </ScrollViewWithHeaders>
  );
};

export default SettingsPrivacyScreen;
