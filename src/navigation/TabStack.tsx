import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import HomeTabStack from './HomeStack';

import HomeTabBarIcon from 'app/components/common/TabBar/Icons/HomeTabBarIcon';
import SearchTabBarIcon from 'app/components/common/TabBar/Icons/SearchTabBarIcon';
import InboxTabBarIcon from 'app/components/common/TabBar/Icons/InboxTabBarIcon';
import ProfileTabBarIcon from 'app/components/common/TabBar/Icons/ProfileTabBarIcon';
import {useTheme} from '@shopify/restyle';
import {Theme} from 'app/styles/theme';

export type TabStackParamList = {
  HomeTab: undefined;
  SearchTab: undefined;
  InobxTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<TabStackParamList>();

export default function TabStack() {
  const insets = useSafeAreaInsets();
  const theme = useTheme<Theme>();

  return (
    <>
      <Tab.Navigator
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
              title: 'Questions',
            }}
            component={HomeTabStack}
          />
          <Tab.Screen
            name="SearchTab"
            options={{
              tabBarIcon: SearchTabBarIcon,
              title: 'Search',
            }}
            component={HomeTabStack}
          />
          <Tab.Screen
            name="InobxTab"
            options={{
              tabBarIcon: InboxTabBarIcon,
              title: 'Inbox',
            }}
            component={HomeTabStack}
          />
          <Tab.Screen
            name="ProfileTab"
            options={{
              tabBarIcon: ProfileTabBarIcon,
              title: 'Profile',
            }}
            component={HomeTabStack}
          />
        </Tab.Group>
      </Tab.Navigator>
    </>
  );
}
