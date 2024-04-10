import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import InboxScreen from 'app/screens/Inbox';

export type SearchStackNavigationProp =
  NativeStackNavigationProp<InboxStackParamList>;

export type InboxStackParamList = {
  Inbox: undefined;
};

const Stack = createNativeStackNavigator<InboxStackParamList>();

const InboxStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Inbox" component={InboxScreen} />
    </Stack.Navigator>
  );
};

export default InboxStack;
