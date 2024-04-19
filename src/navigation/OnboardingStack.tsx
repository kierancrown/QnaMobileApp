import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {PushNotifications, ProfileDetails} from 'app/screens/Onboarding';

export type OnboardingStackParamList = {
  PushNotifications: undefined;
  ProfileDetails: undefined;
};

// Define the navigation prop type for the AuthStack
export type OnboardingStackNavigationProp =
  NativeStackNavigationProp<OnboardingStackParamList>;

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

const OnboardingStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="PushNotifications"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="PushNotifications" component={PushNotifications} />
      <Stack.Screen name="ProfileDetails" component={ProfileDetails} />
    </Stack.Navigator>
  );
};

export default OnboardingStack;
