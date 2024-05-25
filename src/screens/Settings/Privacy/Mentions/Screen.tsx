import {ScrollViewWithHeaders} from '@codeherence/react-native-header';
import React from 'react';
import HeaderComponent from '../../components/Header';
import {useAppTheme} from 'app/styles/theme';
import {useBottomPadding} from 'app/hooks/useBottomPadding';
import {useHiddenTabBar} from 'app/context/tabBarContext';
import SettingsItem from '../../components/SettingsItem';
import SettingsRadioList from '../../components/SettingsRadioList';
import useSyncedPreference from 'app/hooks/useSyncedPreference';

const SettingsMentionsScreen = () => {
  useHiddenTabBar();
  const theme = useAppTheme();
  const bottomListPadding = useBottomPadding(theme.spacing.mY);

  const [menionedBy, setMentionedBy, {loading: loadingMentionedBy}] =
    useSyncedPreference<number>('mentionedBy', 0);

  return (
    <ScrollViewWithHeaders
      HeaderComponent={HeaderComponent}
      contentContainerStyle={{
        paddingTop: theme.spacing.mY,
        paddingBottom: bottomListPadding,
      }}>
      <SettingsItem
        title="Allow mentions from"
        subtitle="Choose who can mention you to link your profile to their questions and replies. When people try to mention you, they'll see that you don't allow mentions."
      />

      <SettingsRadioList
        // disabled={loadingMentionedBy}
        defaultIndex={menionedBy}
        onValueChange={setMentionedBy}
        items={[
          {
            title: 'Everyone',
          },
          {
            title: 'People you follow',
          },
          {
            title: 'Nobody',
          },
        ]}
      />
    </ScrollViewWithHeaders>
  );
};

export default SettingsMentionsScreen;
