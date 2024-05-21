import {ScrollViewWithHeaders} from '@codeherence/react-native-header';
import React, {useState} from 'react';
import HeaderComponent from '../../components/Header';
import {useAppTheme} from 'app/styles/theme';
import {useBottomPadding} from 'app/hooks/useBottomPadding';
import {useHiddenTabBar} from 'app/context/tabBarContext';
import SettingsToggleItem from '../../components/SettingsToggleItem';

const SettingsNotificationQuestionRepliesScreen = () => {
  const theme = useAppTheme();
  const bottomListPadding = useBottomPadding(theme.spacing.mY);
  useHiddenTabBar();

  const [likesNotificationsEnabled, setLikesNotificationsEnabled] =
    useState(true);
  const [repliesNotificationsEnabled, setRepliesNotificationsEnabled] =
    useState(true);
  const [mentionsNotificationsEnabled, setMentionsNotificationsEnabled] =
    useState(true);
  const [pollsNotificationsEnabled, setPollsNotificationsEnabled] =
    useState(true);

  return (
    <ScrollViewWithHeaders
      HeaderComponent={HeaderComponent}
      contentContainerStyle={{
        paddingTop: theme.spacing.mY,
        paddingBottom: bottomListPadding,
      }}>
      <SettingsToggleItem
        title="Likes"
        subtitle="When someone likes your question or reply"
        value={repliesNotificationsEnabled}
        onValueChange={setRepliesNotificationsEnabled}
      />
      <SettingsToggleItem
        title="Replies"
        subtitle="When someone replies to your question or reply"
        value={likesNotificationsEnabled}
        onValueChange={setLikesNotificationsEnabled}
      />
      <SettingsToggleItem
        title="Mentions"
        subtitle="When someone mentions you in a question or reply"
        value={mentionsNotificationsEnabled}
        onValueChange={setMentionsNotificationsEnabled}
      />
      <SettingsToggleItem
        title="Polls"
        subtitle="When someone votes on your poll"
        value={pollsNotificationsEnabled}
        onValueChange={setPollsNotificationsEnabled}
      />
    </ScrollViewWithHeaders>
  );
};

export default SettingsNotificationQuestionRepliesScreen;
