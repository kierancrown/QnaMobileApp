// IMPORTANT
// - https://shopify.github.io/flash-list/docs/guides/section-list/

import React, {FC, useEffect, useRef, useState} from 'react';
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
  Pressable,
  StyleProp,
  StyleSheet,
  ViewStyle,
  RefreshControl,
} from 'react-native';
import useMount from 'app/hooks/useMount';
import {
  SectionListWithHeaders,
  Header,
  LargeHeader,
  ScalingView,
} from '@codeherence/react-native-header';
import Animated, {
  SharedValue,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import NotificationItem from 'app/components/NotificationItem';
import Badge from 'app/components/common/Badge';
import {useDispatch} from 'react-redux';
import {AppDispatch} from 'app/redux/store';
import {setUnreadCount} from 'app/redux/slices/notificationSlice';
import ElipsisIcon from 'app/assets/icons/actions/ellipsis.svg';
import PopoverMenu from 'app/components/common/PopoverMenu';

export type Notification = Database['public']['Tables']['notifications']['Row'];
const HeaderTabs = ['All', 'Requested', 'Notifications'] as const;

const HeaderComponent = ({showNavBar}: {showNavBar: SharedValue<number>}) => {
  const theme = useAppTheme();

  return (
    <Header
      showNavBar={showNavBar}
      noBottomBorder
      headerCenter={
        <Center py="xxsY">
          <Text variant="medium">Inbox - All</Text>
        </Center>
      }
      headerRight={
        <HStack alignItems="center" columnGap="xs">
          <PopoverMenu
            accessibilityLabel="Open Inbox Options"
            accessibilityRole="button"
            accessibilityHint="Mark all as read"
            triggerComponent={
              <Center py="xxsY" px="xxs">
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
  const [selectedTab, setSelectedTab] =
    useState<(typeof HeaderTabs)[number]>('All');
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
          <HStack columnGap="xs">
            {HeaderTabs.map(tab => (
              <TabItem
                key={tab}
                onPress={() => setSelectedTab(tab)}
                title={tab}
                count={0}
                selected={selectedTab === tab}
              />
            ))}
          </HStack>
        </VStack>
      </ScalingView>
    </LargeHeader>
  );
};

interface TabItemProps {
  selected?: boolean;
  onPress: () => void;
  title: string;
  count: number;
}

const TabItem: FC<TabItemProps> = ({
  onPress,
  title,
  count,
  selected = false,
}) => {
  const theme = useAppTheme();
  const {triggerHaptic} = useHaptics();

  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  // 0 for unselected, 1 for selected
  const selectedAnimation = useSharedValue(0);

  useEffect(() => {
    selectedAnimation.value = withTiming(selected ? 1 : 0, {
      duration: 100,
    });
  }, [selected, selectedAnimation]);

  const internalOnPress = async () => {
    await triggerHaptic({
      iOS: HapticFeedbackTypes.selection,
      android: HapticFeedbackTypes.impactLight,
    });
    onPress();
  };

  const onPressIn = () => {
    opacity.value = withTiming(0.66, {duration: 88});
    scale.value = withTiming(0.98, {duration: 66});
  };

  const onPressOut = () => {
    opacity.value = withTiming(1, {duration: 88});
    scale.value = withTiming(1, {duration: 88});
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      borderRadius: theme.borderRadii.pill,
      borderColor: theme.colors.divider,
      opacity: opacity.value,
      transform: [{scale: scale.value}],
      borderWidth: StyleSheet.hairlineWidth,
      backgroundColor: interpolateColor(
        selectedAnimation.value,
        [0, 1],
        [
          theme.colors.pillUnselectedBackground,
          theme.colors.pillSelectedBackground,
        ],
      ),
    };
  }, [
    theme.borderRadii.pill,
    theme.colors.divider,
    theme.colors.pillUnselectedBackground,
    theme.colors.pillSelectedBackground,
  ]);

  return (
    <Pressable
      onPress={internalOnPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}>
      <Badge text={count.toString()} size="small" hidden={count === 0}>
        <Animated.View style={animatedStyle}>
          <Center py="xxsY" px="s">
            <Text variant="medium">{title}</Text>
          </Center>
        </Animated.View>
      </Badge>
    </Pressable>
  );
};

const InboxScreen: FC = () => {
  const theme = useTheme<Theme>();
  const bottomListPadding = useBottomPadding(theme.spacing.mY);
  const {triggerHaptic} = useHaptics();
  const {user} = useUser();
  const dispatch = useDispatch<AppDispatch>();

  const [notifications, setNotifications] = useState<
    {date: string; data: Notification[]}[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const scrollRef = useRef(null);

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
  ): {date: string; data: Notification[]}[] => {
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

    const sections = [];

    if (groupedNotifications.Today) {
      sections.push({date: 'Today', data: groupedNotifications.Today});
    }
    if (groupedNotifications.Yesterday) {
      sections.push({
        date: 'Yesterday',
        data: groupedNotifications.Yesterday,
      });
    }
    if (groupedNotifications.Earlier) {
      sections.push({date: 'Earlier', data: groupedNotifications.Earlier});
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
        <SectionListWithHeaders
          ref={scrollRef}
          HeaderComponent={HeaderComponent}
          LargeHeaderComponent={LargeHeaderComponent}
          sections={notifications}
          renderSectionHeader={({section}) => (
            <HStack bg="mainBackground" py="sY" px="m">
              <Text variant="medium">{section.date}</Text>
            </HStack>
          )}
          data={notifications}
          keyExtractor={item => item.id.toString()}
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
          renderItem={({item}) => (
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
          )}
        />
      )}
    </Flex>
  );
};

export default InboxScreen;
