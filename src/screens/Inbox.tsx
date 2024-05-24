import React, {FC, useMemo, useRef, useState} from 'react';
import {Center, Flex, HStack, Text, VStack} from 'ui';
import {Database} from 'app/types/supabase';
import {supabase} from 'app/lib/supabase';
import {useUser} from 'app/lib/supabase/context/auth';
import {useBottomPadding} from 'app/hooks/useBottomPadding';
import {Theme, useAppTheme} from 'app/styles/theme';
import {useTheme} from '@shopify/restyle';
import dayjs from 'dayjs';
import {HapticFeedbackTypes, useHaptics} from 'app/hooks/useHaptics';
import {useTabBarAnimation, useTabPress} from 'app/context/tabBarContext';
import {
  ActivityIndicator,
  Alert,
  StyleProp,
  ViewStyle,
  RefreshControl,
} from 'react-native';
import useMount from 'app/hooks/useMount';
import {
  Header,
  LargeHeader,
  ScalingView,
  FlashListWithHeaders,
} from '@codeherence/react-native-header';
import {SharedValue} from 'react-native-reanimated';
import NotificationItem from 'app/components/NotificationItem';
import {useDispatch} from 'react-redux';
import {AppDispatch} from 'app/redux/store';
import {setUnreadCount} from 'app/redux/slices/notificationSlice';
import ElipsisIcon from 'app/assets/icons/actions/ellipsis.svg';
import PopoverMenu from 'app/components/common/PopoverMenu';
import HeaderBar from 'app/components/common/HeaderBar';

export type Notification = Database['public']['Tables']['notifications']['Row'];
const HeaderTabs = ['All', 'Requested', 'Notifications'];

const HeaderComponent = ({showNavBar}: {showNavBar: SharedValue<number>}) => {
  const theme = useAppTheme();
  const [selectedTab, setSelectedTab] =
    useState<(typeof HeaderTabs)[number]>('All');

  return (
    <Header
      showNavBar={showNavBar}
      noBottomBorder
      headerCenterFadesIn={false}
      headerCenterStyle={{
        paddingHorizontal: theme.spacing.none,
        marginHorizontal: theme.spacing.none,
      }}
      headerCenter={
        <HStack flex={1} py="sY">
          <HeaderBar
            tabItems={HeaderTabs}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
          <PopoverMenu
            accessibilityLabel="Open Inbox Options"
            accessibilityRole="button"
            accessibilityHint="Mark all as read"
            triggerComponent={
              <Center py="xsY" px="xs">
                <ElipsisIcon
                  width={theme.iconSizes.l}
                  height={theme.iconSizes.l}
                />
              </Center>
            }
            items={[
              {
                title: 'Mark all as read',
                onPress: () => {},
              },
            ]}
          />
        </HStack>
      }
    />
  );
};

const LargeHeaderComponent = ({scrollY}: {scrollY: SharedValue<number>}) => {
  const theme = useTheme<Theme>();
  const headerStyle: StyleProp<ViewStyle> = {
    paddingVertical: 0,
    marginBottom: theme.spacing.mY,
  };

  return (
    <LargeHeader headerStyle={headerStyle}>
      <ScalingView scrollY={scrollY}>
        <VStack rowGap="xsY">
          <Text
            variant="largeHeader"
            marginVertical="none"
            paddingVertical="none">
            Inbox
          </Text>
        </VStack>
      </ScalingView>
    </LargeHeader>
  );
};

const InboxScreen: FC = () => {
  const theme = useTheme<Theme>();
  const bottomListPadding = useBottomPadding(theme.spacing.mY);
  const {triggerHaptic} = useHaptics();
  const {user} = useUser();
  const dispatch = useDispatch<AppDispatch>();

  const [notifications, setNotifications] = useState<(string | Notification)[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const scrollRef = useRef(null);

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
    if (!user) {
      return;
    }

    setRefreshing(!initialLoad);
    setLoading(true);

    const {data, error} = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', {ascending: false});

    if (error) {
      console.error(error);
      Alert.alert('Error', error.message);
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
          Alert.alert('Error', updateError.message);
        } else {
          dispatch(setUnreadCount(0));
        }
      } else {
        dispatch(setUnreadCount(0));
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

  return (
    <Flex>
      {loading && !refreshing ? (
        <Center flex={1}>
          <ActivityIndicator size="small" color={theme.colors.brand} />
        </Center>
      ) : (
        <FlashListWithHeaders
          ref={scrollRef}
          HeaderComponent={HeaderComponent}
          LargeHeaderComponent={LargeHeaderComponent}
          data={notifications}
          keyExtractor={item =>
            typeof item === 'string' ? item : item.id.toString()
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshNotifications}
            />
          }
          onScrollWorklet={scrollHandlerWorklet}
          refreshing={refreshing}
          onRefresh={refreshNotifications}
          contentContainerStyle={{
            paddingTop: theme.spacing.sY,
            paddingBottom: bottomListPadding,
          }}
          estimatedItemSize={100}
          renderItem={({item}) => {
            if (typeof item === 'string') {
              // Rendering header
              return (
                <HStack bg="mainBackground" py="sY" px="m">
                  <Text variant="medium">{item}</Text>
                </HStack>
              );
            } else {
              // Render item
              return (
                <NotificationItem
                  onPress={() => {
                    triggerHaptic(HapticFeedbackTypes.selection).then();
                    // TODO: Decide based on notification type
                  }}
                  id={item.id}
                  title={item.type}
                  body={item.body || ''}
                  timestamp={item.delivered_at || item.created_at}
                  read={item.read_at !== null}
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
