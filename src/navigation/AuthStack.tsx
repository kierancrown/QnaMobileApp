import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import AuthScreen from 'app/screens/Auth';

export type AuthStackParamList = {
  Auth: undefined;
};

// Define the navigation prop type for the AuthStack
export type AuthStackNavigationProp =
  NativeStackNavigationProp<AuthStackParamList>;

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Auth"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Auth" component={AuthScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
