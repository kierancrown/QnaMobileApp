import React, {useEffect, useState} from 'react';
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {useTheme} from '@shopify/restyle';
import {Theme} from 'app/styles/theme';

import HomeTabStack from './HomeStack';
import SearchTabStack from './SearchStack';
import InboxTabStack, {InboxStackParamList} from './InboxStack';
import ProfileTabStack from './ProfileStack';

import HomeTabBarIcon from 'app/components/common/TabBar/Icons/HomeTabBarIcon';
import SearchTabBarIcon from 'app/components/common/TabBar/Icons/SearchTabBarIcon';
import InboxTabBarIcon from 'app/components/common/TabBar/Icons/InboxTabBarIcon';
import ProfileTabBarIcon from 'app/components/common/TabBar/Icons/ProfileTabBarIcon';

import {
  ESTIMATED_TABBAR_HEIGHT,
  FloatingTabBar,
} from 'app/components/common/TabBar/FloatingTabBar';
import {Box} from 'app/components/common';
import {Platform, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Color from 'color';
import AskQuestionSheet from 'app/components/sheets/AskQuestionSheet';
import {HapticFeedbackTypes, useHaptics} from 'app/hooks/useHaptics';
import {TabBarProvider} from 'app/context/tabBarContext';
import {useSelector} from 'react-redux';
import {RootState, useAppDispatch, useAppSelector} from 'app/redux/store';
import {WINDOW_WIDTH} from '@gorhom/bottom-sheet';
import PostingFab from 'app/components/PostingFab';
import {useSubmitQuestion} from 'app/components/sheets/AskQuestionSheet/hooks/useSubmitQuestion';
import ReplySheet from 'app/components/sheets/ReplySheet';
import {closeReplySheet} from 'app/redux/slices/replySlice';
import {supabase} from 'app/lib/supabase';
import {setAvatarImageUrl} from 'app/redux/slices/authSlice';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import notifee, {EventType} from '@notifee/react-native';
import {openAuthSheet} from 'app/redux/slices/authSheetSlice';
import {useAuth} from 'app/hooks/useAuth';

export type TabStackParamList = {
  HomeTab: undefined;
  SearchTab: undefined;
  InboxTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<TabStackParamList>();

interface TabBarContainerProps extends BottomTabBarProps {
  onCtaPress: () => void;
}

const TabBarContainer = (props: TabBarContainerProps) => {
  const {bottom} = useSafeAreaInsets();
  const theme = useTheme<Theme>();
  const bottomColor = Color(theme.colors.mainBackground).alpha(0.9).hexa();
  const showPostingFab = useSelector(
    (state: RootState) => state.nonPersistent.askSheet.isLoading,
  );

  const bottomPadding =
    bottom === 0
      ? ESTIMATED_TABBAR_HEIGHT / 2
      : Platform.select({
          android: bottom + theme.spacing.mY,
          ios: bottom + theme.spacing.xsY,
        });

  return (
    <>
      <Box
        pointerEvents="none"
        position="absolute"
        bottom={0}
        px="l"
        height={ESTIMATED_TABBAR_HEIGHT * 2}
        width={WINDOW_WIDTH}>
        <LinearGradient
          colors={['transparent', bottomColor]}
          locations={[0, 1]}
          style={{
            ...StyleSheet.absoluteFillObject,
            right: -theme.spacing.l,
            left: -theme.spacing.l,
          }}
        />
      </Box>

      <PostingFab isVisible={showPostingFab} />
      <FloatingTabBar {...props} bottomPadding={bottomPadding} />
    </>
  );
};

export default function TabStack() {
  const {triggerHaptic} = useHaptics();
  const [questionSheetOpen, setQuestionSheetOpen] = useState(false);
  const {replySheetOpen, replyToUsername, replyToVerified, userAvatarImageUrl} =
    useAppSelector(state => state.nonPersistent.reply);
  const unreadNotificationCount = useSelector(
    (state: RootState) => state.persistent.notifications.unreadCount,
  );
  const {submit} = useSubmitQuestion();
  const dispatch = useAppDispatch();
  const {navigate} = useNavigation<NavigationProp<InboxStackParamList>>();
  const {authStatus, profile} = useAuth({});

  useEffect(() => {
    if (authStatus === 'SIGNED_IN' && profile?.user_id) {
      supabase
        .from('user_metadata')
        .select('profile_picture')
        .eq('user_id', profile.user_id)
        .single()
        .then(({data}) => {
          if (data?.profile_picture) {
            dispatch(setAvatarImageUrl(data?.profile_picture));
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authStatus, profile?.user_id]);

  useEffect(() => {
    return notifee.onForegroundEvent(({type, detail}) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);
          // TODO: Navigate to question detail
          const openQuestionDetail = async (questionId: number) => {
            const {data, error} = await supabase
              .from('questions')
              .select(
                `
              *,
              user_metadata (
                verified,
                profile_picture (
                  path,
                  thumbhash
                ),
                username
              ),
              question_metadata (
                upvote_count,
                response_count,
                view_count,
                visible,
                topics,
                media,
                location (
                  name
                )
              )
            `,
              )
              .eq('id', questionId)
              .single();

            if (data && !error) {
              const item = data;
              navigate('QuestionDetail', {
                questionId: item.id,
                responseCount: item.question_metadata?.response_count || 0,
                isOwner: item.user_id === profile?.user_id,
                ownerUsername: item.user_metadata?.username || 'Anonymous',
                ownerVerified: item.user_metadata?.verified || false,
                skeletonLayout: {
                  hasMedia:
                    (item.question_metadata?.media &&
                      item.question_metadata?.media.length > 0) ||
                    false,
                  hasBody: !!item.body,
                  hasLocation: !!item.question_metadata?.location,
                },
              });
            }
          };
          if (
            typeof detail.notification?.data === 'object' &&
            typeof detail.notification?.data?.questionId === 'string'
          ) {
            openQuestionDetail(
              parseInt(detail.notification.data.questionId, 10),
            );
          }

          break;
      }
    });
  }, [profile?.user_id, navigate]);

  return (
    <TabBarProvider>
      <Tab.Navigator
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBar={props => (
          <TabBarContainer
            onCtaPress={() => {
              triggerHaptic({
                iOS: HapticFeedbackTypes.impactMedium,
                android: HapticFeedbackTypes.effectHeavyClick,
              }).then();
              if (authStatus === 'SIGNED_IN' && profile?.user_id) {
                setQuestionSheetOpen(true);
              } else {
                dispatch(openAuthSheet({reason: 'post'}));
              }
            }}
            {...props}
          />
        )}
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
        }}>
        <Tab.Group>
          <Tab.Screen
            name="HomeTab"
            options={{
              tabBarIcon: HomeTabBarIcon,
              title: 'Home',
            }}
            component={HomeTabStack}
          />
          <Tab.Screen
            name="SearchTab"
            options={{
              tabBarIcon: SearchTabBarIcon,
              title: 'Search',
            }}
            component={SearchTabStack}
          />
          <Tab.Screen
            name="InboxTab"
            options={{
              tabBarIcon: InboxTabBarIcon,
              tabBarBadge:
                unreadNotificationCount > 0
                  ? unreadNotificationCount
                  : undefined,
              title: 'Inbox',
            }}
            component={InboxTabStack}
          />
          <Tab.Screen
            name="ProfileTab"
            options={{
              tabBarIcon: ProfileTabBarIcon,
              title: 'Profile',
            }}
            component={ProfileTabStack}
          />
        </Tab.Group>
      </Tab.Navigator>

      <AskQuestionSheet
        open={questionSheetOpen}
        onSubmit={() => {
          setQuestionSheetOpen(false);
          submit().then();
        }}
        onClose={() => {
          setQuestionSheetOpen(false);
        }}
      />

      <ReplySheet
        open={replySheetOpen}
        onClose={() => {
          dispatch(closeReplySheet());
        }}
        onSubmit={() => {}}
        avatarImageUrl={userAvatarImageUrl ?? ''}
        replyingToUsername={replyToUsername ?? 'Anonymous'}
        replyingToVerified={replyToVerified ?? false}
      />
    </TabBarProvider>
  );
}
