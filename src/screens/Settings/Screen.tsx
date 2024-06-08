import {ScrollViewWithHeaders} from '@codeherence/react-native-header';
import React from 'react';
import HeaderComponent from './components/Header';
import {useAppTheme} from 'app/styles/theme';
import {useBottomPadding} from 'app/hooks/useBottomPadding';
import {useHiddenTabBar} from 'app/context/tabBarContext';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import SettingsItem from './components/SettingsItem';
import {ProfileStackParamList} from 'app/navigation/ProfileStack';
import SectionHeader from './components/SectionHeader';

import AccountIcon from 'app/assets/icons/settings/Account.svg';
import NotificationsIcon from 'app/assets/icons/settings/Notifications.svg';
import PrivacyIcon from 'app/assets/icons/settings/Privacy.svg';
import HelpIcon from 'app/assets/icons/settings/Help.svg';
import AboutIcon from 'app/assets/icons/settings/About.svg';
import DebugIcon from 'app/assets/icons/settings/Debug.svg';
import {useUser} from 'app/lib/supabase/context/auth';

const SettingsScren = () => {
  const {user} = useUser();
  const theme = useAppTheme();
  const bottomListPadding = useBottomPadding(theme.spacing.mY);
  const {navigate} = useNavigation<NavigationProp<ProfileStackParamList>>();
  useHiddenTabBar();

  return (
    <ScrollViewWithHeaders
      HeaderComponent={HeaderComponent}
      contentContainerStyle={{
        paddingTop: theme.spacing.mY,
        paddingBottom: bottomListPadding,
      }}>
      <SectionHeader title="Account Settings" />
      <SettingsItem
        title="Account"
        disabled={!user}
        icon={
          <AccountIcon
            width={theme.iconSizes.intermediate}
            height={theme.iconSizes.intermediate}
          />
        }
        onPress={() => {
          navigate('SettingsAccount', {headerTitle: 'Account'});
        }}
      />
      <SettingsItem
        title="Notifications"
        disabled={!user}
        icon={
          <NotificationsIcon
            width={theme.iconSizes.intermediate}
            height={theme.iconSizes.intermediate}
          />
        }
        onPress={() => {
          navigate('SettingsNotifications', {headerTitle: 'Notifications'});
        }}
      />
      <SettingsItem
        title="Privacy & Security"
        disabled={!user}
        icon={
          <PrivacyIcon
            width={theme.iconSizes.intermediate}
            height={theme.iconSizes.intermediate}
          />
        }
        onPress={() => {
          navigate('SettingsPrivacySecurity', {
            headerTitle: 'Privacy',
          });
        }}
      />
      <SectionHeader title="App Settings" />
      <SettingsItem
        title="Help"
        icon={
          <HelpIcon
            width={theme.iconSizes.intermediate}
            height={theme.iconSizes.intermediate}
          />
        }
        onPress={() => {
          navigate('SettingsHelp', {headerTitle: 'Help'});
        }}
      />
      <SettingsItem
        title="About"
        icon={
          <AboutIcon
            width={theme.iconSizes.intermediate}
            height={theme.iconSizes.intermediate}
          />
        }
        onPress={() => {
          navigate('SettingsAbout', {headerTitle: 'About'});
        }}
      />
      {__DEV__ && (
        <>
          <SectionHeader title="Developer Mode" />
          <SettingsItem
            title="Debug"
            titleColor="destructiveAction"
            icon={
              <DebugIcon
                width={theme.iconSizes.intermediate}
                height={theme.iconSizes.intermediate}
                color={theme.colors.destructiveAction}
              />
            }
            onPress={() => {
              navigate('SettingsDebug', {headerTitle: 'Debug'});
            }}
          />
        </>
      )}
    </ScrollViewWithHeaders>
  );
};

export default SettingsScren;
