import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import ProfileScreen from 'app/screens/Profile';
import SettingsScren from 'app/screens/Settings/Screen';

export type ProfileStackNavigationProp =
  NativeStackNavigationProp<ProfileStackParamList>;

export type ProfileScreenParams = {
  displayBackButton?: boolean;
  userId?: string;
};

export type SettingsScreenParams = undefined;

export type ProfileStackParamList = {
  Profile: ProfileScreenParams;
  Settings: SettingsScreenParams;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{
          displayBackButton: false,
          userId: undefined,
        }}
      />
      <Stack.Screen name="Settings" component={SettingsScren} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
