import {ScrollViewWithHeaders} from '@codeherence/react-native-header';
import React from 'react';
import HeaderComponent from '../components/Header';
import {useAppTheme} from 'app/styles/theme';
import {useBottomPadding} from 'app/hooks/useBottomPadding';
import {useHiddenTabBar} from 'app/context/tabBarContext';
import SettingsToggleItem from '../components/SettingsToggleItem';
import SectionHeader from '../components/SectionHeader';
import usePreference from 'app/hooks/usePreference';

const SettingsNotificationScreen = () => {
  useHiddenTabBar();
  const theme = useAppTheme();
  const bottomListPadding = useBottomPadding(theme.spacing.mY);

  const [
    pushNotificationsEnabled,
    setPushNotificationsEnabled,
    {loading: pushNotificationsLoading},
  ] = usePreference('push_global_enabled', true);

  // Questions and replies
  const [likesNotificationsEnabled, setLikesNotificationsEnabled] =
    usePreference('likes_notifications_enabled', true);
  const [repliesNotificationsEnabled, setRepliesNotificationsEnabled] =
    usePreference('replies_notifications_enabled', true);
  const [mentionsNotificationsEnabled, setMentionsNotificationsEnabled] =
    usePreference('mentions_notifications_enabled', true);
  const [pollsNotificationsEnabled, setPollsNotificationsEnabled] =
    usePreference('polls_notifications_enabled', true);

  // Following and followers
  const [newFollowersEnabled, setNewFollowersEnabled] = usePreference(
    'new_followers_enabled',
    true,
  );
  const [accountSuggestionsEnabled, setAccountSuggestionsEnabled] =
    usePreference('account_suggestions_enabled', true);

  // Account and security
  const [newLoginActivityEnabled, setNewLoginActivityEnabled] = usePreference(
    'new_login_activity_enabled',
    true,
  );

  return (
    <ScrollViewWithHeaders
      HeaderComponent={HeaderComponent}
      contentContainerStyle={{
        paddingTop: theme.spacing.mY,
        paddingBottom: bottomListPadding,
      }}>
      <SettingsToggleItem
        title="Push Notifications"
        subtitle="Globally enable or disable push notifications"
        value={pushNotificationsEnabled}
        onValueChange={setPushNotificationsEnabled}
        loading={pushNotificationsLoading}
      />
      <SectionHeader title="Questions and replies" />
      <SettingsToggleItem
        title="Likes"
        subtitle="John Doe liked your reply"
        value={repliesNotificationsEnabled}
        onValueChange={setRepliesNotificationsEnabled}
        disabled={!pushNotificationsEnabled}
      />
      <SettingsToggleItem
        title="Replies"
        subtitle="John Doe replied to your question"
        value={likesNotificationsEnabled}
        onValueChange={setLikesNotificationsEnabled}
        disabled={!pushNotificationsEnabled}
      />
      <SettingsToggleItem
        title="Mentions"
        subtitle="John Doe mentioned you in a question"
        value={mentionsNotificationsEnabled}
        onValueChange={setMentionsNotificationsEnabled}
        disabled={!pushNotificationsEnabled}
      />
      <SettingsToggleItem
        title="Polls"
        subtitle="46 people voted on your poll"
        value={pollsNotificationsEnabled}
        onValueChange={setPollsNotificationsEnabled}
        disabled={!pushNotificationsEnabled}
      />
      <SectionHeader title="Following and followers" />
      <SettingsToggleItem
        title="New Followers"
        subtitle="John Doe started following you"
        value={newFollowersEnabled}
        onValueChange={setNewFollowersEnabled}
        disabled={!pushNotificationsEnabled}
      />
      <SettingsToggleItem
        title="Account Suggestions"
        subtitle="John Doe, who you may know, joined"
        value={accountSuggestionsEnabled}
        onValueChange={setAccountSuggestionsEnabled}
        disabled={!pushNotificationsEnabled}
      />
      <SectionHeader title="Account and security" />
      <SettingsToggleItem
        title="New Login Activity"
        subtitle="New login activity detected"
        value={newLoginActivityEnabled}
        onValueChange={setNewLoginActivityEnabled}
        disabled={!pushNotificationsEnabled}
      />
    </ScrollViewWithHeaders>
  );
};

export default SettingsNotificationScreen;
