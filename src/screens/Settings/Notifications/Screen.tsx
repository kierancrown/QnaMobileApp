import {ScrollViewWithHeaders} from '@codeherence/react-native-header';
import React, {useState} from 'react';
import HeaderComponent from '../components/Header';
import {useAppTheme} from 'app/styles/theme';
import {useBottomPadding} from 'app/hooks/useBottomPadding';
import {useHiddenTabBar} from 'app/context/tabBarContext';
import SettingsItem from '../components/SettingsItem';
import SettingsToggleItem from '../components/SettingsToggleItem';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {ProfileStackParamList} from 'app/navigation/ProfileStack';
import SectionHeader from '../components/SectionHeader';

const SettingsNotificationScreen = () => {
  const theme = useAppTheme();
  const bottomListPadding = useBottomPadding(theme.spacing.mY);
  const {navigate} = useNavigation<NavigationProp<ProfileStackParamList>>();
  const {
    params: {headerTitle},
  } = useRoute<RouteProp<ProfileStackParamList, 'SettingsNotifications'>>();
  useHiddenTabBar();

  const [pushNotificationsEnabled, setPushNotificationsEnabled] =
    useState(true);

  // Questions and replies
  const [likesNotificationsEnabled, setLikesNotificationsEnabled] =
    useState(true);
  const [repliesNotificationsEnabled, setRepliesNotificationsEnabled] =
    useState(true);
  const [mentionsNotificationsEnabled, setMentionsNotificationsEnabled] =
    useState(true);
  const [pollsNotificationsEnabled, setPollsNotificationsEnabled] =
    useState(true);

  // Following and followers
  const [newFollowersEnabled, setNewFollowersEnabled] = useState(true);
  const [accountSuggestionsEnabled, setAccountSuggestionsEnabled] =
    useState(true);

  // Account and security
  const [newLoginActivityEnabled, setNewLoginActivityEnabled] = useState(true);

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
      />
      <SectionHeader title="Questions and replies" />
      <SettingsToggleItem
        title="Likes"
        subtitle="John Doe liked your reply"
        value={repliesNotificationsEnabled}
        onValueChange={setRepliesNotificationsEnabled}
      />
      <SettingsToggleItem
        title="Replies"
        subtitle="John Doe replied to your question"
        value={likesNotificationsEnabled}
        onValueChange={setLikesNotificationsEnabled}
      />
      <SettingsToggleItem
        title="Mentions"
        subtitle="John Doe mentioned you in a question"
        value={mentionsNotificationsEnabled}
        onValueChange={setMentionsNotificationsEnabled}
      />
      <SettingsToggleItem
        title="Polls"
        subtitle="46 people voted on your poll"
        value={pollsNotificationsEnabled}
        onValueChange={setPollsNotificationsEnabled}
      />
      <SectionHeader title="Following and followers" />
      <SettingsToggleItem
        title="New Followers"
        subtitle="John Doe started following you"
        value={newFollowersEnabled}
        onValueChange={setNewFollowersEnabled}
      />
      <SettingsToggleItem
        title="Account Suggestions"
        subtitle="John Doe, who you may know, joined"
        value={accountSuggestionsEnabled}
        onValueChange={setAccountSuggestionsEnabled}
      />
      <SectionHeader title="Account and security" />
      <SettingsToggleItem
        title="New Login Activity"
        subtitle="New login activity detected"
        value={newLoginActivityEnabled}
        onValueChange={setNewLoginActivityEnabled}
      />
    </ScrollViewWithHeaders>
  );
};

export default SettingsNotificationScreen;
