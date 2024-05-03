import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import ProfileScreen from 'app/screens/Profile';

export type ProfileStackNavigationProp =
  NativeStackNavigationProp<ProfileStackParamList>;

export type ProfileScreenParams = {
  displayBackButton?: boolean;
  userId?: string;
};

export type ProfileStackParamList = {
  Profile: ProfileScreenParams;
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
    </Stack.Navigator>
  );
};

export default ProfileStack;
