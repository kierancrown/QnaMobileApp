import {ScrollViewWithHeaders} from '@codeherence/react-native-header';
import React from 'react';
import HeaderComponent from '../components/Header';
import {useAppTheme} from 'app/styles/theme';
import {useBottomPadding} from 'app/hooks/useBottomPadding';
import {useHiddenTabBar} from 'app/context/tabBarContext';
import SettingsItem from '../components/SettingsItem';

const SettingsHelpScreen = () => {
  const theme = useAppTheme();
  const bottomListPadding = useBottomPadding(theme.spacing.mY);
  useHiddenTabBar();

  return (
    <ScrollViewWithHeaders
      HeaderComponent={HeaderComponent}
      contentContainerStyle={{
        paddingTop: theme.spacing.mY,
        paddingBottom: bottomListPadding,
      }}>
      <SettingsItem title="Report an issue" onPress={() => {}} />
      <SettingsItem title="Send Feedback" onPress={() => {}} />
      <SettingsItem title="FAQs" onPress={() => {}} />
    </ScrollViewWithHeaders>
  );
};

export default SettingsHelpScreen;
