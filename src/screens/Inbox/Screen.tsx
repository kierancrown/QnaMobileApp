import React, {FC, useMemo, useRef, useState} from 'react';
import {ActivityLoader, Center, Flex, HStack, Text} from 'ui';
import {Database} from 'app/types/supabase';
import {supabase} from 'app/lib/supabase';
import {useBottomPadding} from 'app/hooks/useBottomPadding';
import {Theme} from 'app/styles/theme';
import {useTheme} from '@shopify/restyle';
import dayjs from 'dayjs';
import {HapticFeedbackTypes, useHaptics} from 'app/hooks/useHaptics';
import {useTabBarAnimation, useTabPress} from 'app/context/tabBarContext';
import {RefreshControl} from 'react-native';
import useMount from 'app/hooks/useMount';
import NotificationItem from 'app/components/NotificationItem';
import {useAppDispatch} from 'app/redux/store';
import {setUnreadCount} from 'app/redux/slices/notificationSlice';
import {FlashList} from '@shopify/flash-list';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import HeaderComponent from './components/Header';
import notifee from '@notifee/react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {InboxStackParamList} from 'app/navigation/InboxStack';
import Username from 'app/components/Username';
import {useAlert} from 'app/components/AlertsWrapper';
import InboxIcon from 'app/assets/icons/tabbar/Inbox.svg';
import {useAuth} from 'app/wrappers/AuthProvider';

export type Notification = Database['public']['Tables']['notifications']['Row'];

const InboxScreen: FC = () => {
  const theme = useTheme<Theme>();
  const bottomListPadding = useBottomPadding(theme.spacing.mY);
  const {triggerHaptic} = useHaptics();
  const {authStatus, profile} = useAuth();
  const {openAlert} = useAlert();
  const dispatch = useAppDispatch();
  const {navigate} = useNavigation<NavigationProp<InboxStackParamList>>();
  const [notifications, setNotifications] = useState<(string | Notification)[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const scrollRef = useRef(null);

  const [headerHeight, setHeaderHeight] = useState(0);
  const topInset = useSafeAreaInsets().top;

  const stickyHeaderIndices = useMemo(
    () =>
      notifications
        .map((item, index) => {
          if (typeof item === 'string') {
            return index;
          } else {
            return null;
          }
        })
        .filter(item => item !== null) as number[],
    [notifications],
  );

  useTabPress({
    tabName: 'InboxTab',
    onPress: () => {
      if (scrollRef.current) {
        // @ts-ignore
        scrollRef.current.scrollToOffset({offset: 0, animated: true});
      }
    },
  });

  const {scrollHandlerWorklet} = useTabBarAnimation({
    scrollToTop: () => {
      if (scrollRef.current) {
        // @ts-ignore
        scrollRef.current.scrollToOffset({offset: 0, animated: true});
      }
    },
  });

  const refreshNotifications = async (initialLoad = false) => {
    if (authStatus !== 'SIGNED_IN' || !profile?.user_id) {
      return;
    }

    setRefreshing(!initialLoad);
    setLoading(true);

    const {data, error} = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', profile.user_id)
      .order('created_at', {ascending: false});

    if (error) {
      console.error(error);
      openAlert({
        title: 'Error',
        message: error.message,
      });
    } else {
      // Group notifications by date
      const groupedNotifications = groupNotificationsByDate(data);
      setNotifications(groupedNotifications);
      // Bulk update notifications to read
      const unreadNotifications = data.filter(
        notification => notification.read_at === null,
      );
      if (unreadNotifications.length > 0) {
        const {error: updateError} = await supabase
          .from('notifications')
          .update({read_at: new Date().toISOString()})
          .in(
            'id',
            unreadNotifications.map(n => n.id),
          );
        if (updateError) {
          console.error(updateError);
          openAlert({
            title: 'Error',
            message: updateError.message,
          });
        } else {
          dispatch(setUnreadCount(0));
          notifee
            .setBadgeCount(0)
            .then(() => console.log('Badge count reset!'));
        }
      } else {
        dispatch(setUnreadCount(0));
        notifee.setBadgeCount(0).then(() => console.log('Badge count reset!'));
      }
    }
    setRefreshing(false);
    setLoading(false);
  };

  // Function to group notifications by date
  const groupNotificationsByDate = (
    data: Notification[],
  ): (string | Notification)[] => {
    const groupedNotifications: {[date: string]: Notification[]} = {};
    const today = dayjs().startOf('day');
    const yesterday = dayjs().subtract(1, 'day').startOf('day');

    data.forEach(n => {
      // Get the date without time for comparison
      const date = new Date(n.created_at!).toISOString().split('T')[0];
      const notificationDate = dayjs(date);

      if (notificationDate.isSame(today, 'day')) {
        // Group notifications for today
        if (!groupedNotifications.Today) {
          groupedNotifications.Today = [];
        }
        groupedNotifications.Today.push(n);
      } else if (notificationDate.isSame(yesterday, 'day')) {
        // Group notifications for yesterday
        if (!groupedNotifications.Yesterday) {
          groupedNotifications.Yesterday = [];
        }
        groupedNotifications.Yesterday.push(n);
      } else {
        // Group notifications for earlier dates
        if (!groupedNotifications.Earlier) {
          groupedNotifications.Earlier = [];
        }
        groupedNotifications.Earlier.push(n);
      }
    });

    const sections: (string | Notification)[] = [];

    if (groupedNotifications.Today) {
      sections.push('Today', ...groupedNotifications.Today);
    }
    if (groupedNotifications.Yesterday) {
      sections.push('Yesterday', ...groupedNotifications.Yesterday);
    }
    if (groupedNotifications.Earlier) {
      sections.push('Earlier', ...groupedNotifications.Earlier);
    }

    return sections;
  };

  useMount(() => {
    refreshNotifications(true);
  });

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

  return (
    <Flex>
      <HeaderComponent
        onSize={({height}) => {
          setHeaderHeight(height);
        }}
      />
      {loading && !refreshing ? (
        <Center flex={1}>
          <ActivityLoader />
        </Center>
      ) : notifications.length === 0 ? (
        <Center flex={1} rowGap="mY">
          <InboxIcon
            fill={theme.colors.cardText}
            width={theme.iconSizes.xxxl}
            height={theme.iconSizes.xxxl}
          />
          <Text variant="medium" color="cardText">
            No notifications yet
          </Text>
        </Center>
      ) : (
        <FlashList
          ref={scrollRef}
          data={notifications}
          scrollIndicatorInsets={{top: headerHeight - topInset}}
          keyExtractor={item =>
            typeof item === 'string' ? item : item.id.toString()
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshNotifications}
            />
          }
          scrollEventThrottle={16}
          onScroll={({nativeEvent}) => {
            scrollHandlerWorklet(nativeEvent);
          }}
          refreshing={refreshing}
          onRefresh={refreshNotifications}
          contentContainerStyle={{
            paddingTop: theme.spacing.sY + headerHeight - topInset,
            paddingBottom: bottomListPadding,
          }}
          estimatedItemSize={100}
          renderItem={({item}) => {
            if (typeof item === 'string') {
              return (
                <HStack
                  bg="mainBackground"
                  pb="sY"
                  px="m"
                  style={{marginTop: topInset}}>
                  <Text variant="medium">{item}</Text>
                </HStack>
              );
            } else {
              // Render item
              return (
                <NotificationItem
                  onPress={() => {
                    triggerHaptic({
                      iOS: HapticFeedbackTypes.selection,
                      android: HapticFeedbackTypes.effectClick,
                    }).then();
                    switch (item.type) {
                      case 'question_like':
                        openQuestionDetail(
                          // @ts-ignore
                          (item.data.question_id as number) ?? -1,
                        ).then();
                        break;
                    }
                  }}
                  id={item.id}
                  type={item.type}
                  title={
                    item.type === 'question_like' &&
                    // @ts-ignore
                    typeof item.data?.username === 'string' ? (
                      <HStack alignItems="center">
                        <Username
                          // @ts-ignore
                          username={item.data?.username}
                          // @ts-ignore
                          isVerified={item.data?.verified ?? false}
                          noHighlight
                          variant="small"
                        />
                        <Text variant="smaller"> liked your question</Text>
                      </HStack>
                    ) : (
                      // @ts-ignore
                      item.data?.title ?? undefined
                    )
                  }
                  body={item.body || ''}
                  timestamp={item.delivered_at || item.created_at}
                  read={item.read_at !== null}
                  // @ts-ignore
                  image={item.data?.avatarUrl ?? undefined}
                />
              );
            }
          }}
          stickyHeaderIndices={stickyHeaderIndices}
          getItemType={item => {
            // To achieve better performance, specify the type based on the item
            return typeof item === 'string' ? 'sectionHeader' : 'row';
          }}
        />
      )}
    </Flex>
  );
};

export default InboxScreen;
