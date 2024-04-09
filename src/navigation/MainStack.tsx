import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import AuthScreen from '../screens/Auth';
import QuestionsScreen from '../screens/Questions';

export type MainStackNavigationProp =
  NativeStackNavigationProp<MainStackParamList>;

export type MainStackParamList = {
  Auth: undefined;
  Questions: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

const MainStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Auth"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="Questions" component={QuestionsScreen} />
    </Stack.Navigator>
  );
};

export default MainStack;
