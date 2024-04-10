import * as React from 'react';
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

import {FloatingTabBar} from 'app/components/common/TabBar/FloatingTabBar';
import {Box} from 'app/components/common';
import {Platform, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Color from 'color';

export type TabStackParamList = {
  HomeTab: undefined;
  SearchTab: undefined;
  InobxTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<TabStackParamList>();

const TabBarContainer = (props: BottomTabBarProps) => {
  const {bottom} = useSafeAreaInsets();
  const theme = useTheme<Theme>();
  const bottomColor = Color(theme.colors.mainBackground).alpha(0.9).hexa();
  return (
    <Box
      px="l"
      position="absolute"
      bottom={0}
      style={{
        paddingBottom: Platform.select({
          android: bottom + theme.spacing.mY,
          ios: bottom + theme.spacing.xsY,
        }),
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
  const insets = useSafeAreaInsets();
  const theme = useTheme<Theme>();

  return (
    <>
      <Tab.Navigator
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBar={props => <TabBarContainer {...props} />}
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
            name="InobxTab"
            options={{
              tabBarIcon: InboxTabBarIcon,
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
    </>
  );
}
