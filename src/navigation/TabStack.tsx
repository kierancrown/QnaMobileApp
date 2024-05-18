import React, {useState} from 'react';
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {useTheme} from '@shopify/restyle';
import {Theme} from 'app/styles/theme';

import HomeTabStack from './HomeStack';
import SearchTabStack from './SearchStack';
import InboxTabStack from './InboxStack';
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
import {RootState} from 'app/redux/store';

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

  const bottomPadding =
    bottom === 0
      ? ESTIMATED_TABBAR_HEIGHT / 2
      : Platform.select({
          android: bottom + theme.spacing.mY,
          ios: bottom + theme.spacing.xsY,
        });

  return (
    <Box
      px="l"
      position="absolute"
      bottom={0}
      style={{
        paddingBottom: bottomPadding,
      }}>
      <LinearGradient
        colors={['transparent', bottomColor]}
        locations={[0, 1]}
        style={{
          ...StyleSheet.absoluteFillObject,
          right: -theme.spacing.l,
          left: -theme.spacing.l,
        }}
      />
      <FloatingTabBar {...props} />
    </Box>
  );
};

export default function TabStack() {
  const {triggerHaptic} = useHaptics();
  const insets = useSafeAreaInsets();
  const theme = useTheme<Theme>();
  const [questionSheetOpen, setQuestionSheetOpen] = useState(false);

  const unreadNotificationCount = useSelector(
    (state: RootState) => state.persistent.notifications.unreadCount,
  );

  return (
    <TabBarProvider>
      <Tab.Navigator
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBar={props => (
          <TabBarContainer
            onCtaPress={() => {
              triggerHaptic({
                iOS: HapticFeedbackTypes.impactMedium,
                android: HapticFeedbackTypes.impactMedium,
              }).then();
              setQuestionSheetOpen(true);
            }}
            {...props}
          />
        )}
        screenOptions={{
          headerShown: false,
          tabBarLabelStyle: {
            paddingBottom: 5,
            fontSize: 12,
            fontWeight: 'bold',
          },
          tabBarStyle: {
            padding: 10,
            height: insets.bottom + 66,
            backgroundColor: theme.colors.cardBackground,
            borderTopColor: theme.colors.segmentBackground,
          },
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
        onClose={() => {
          setQuestionSheetOpen(false);
        }}
      />
    </TabBarProvider>
  );
}
