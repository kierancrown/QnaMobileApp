import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import InboxScreen from 'app/screens/Inbox';
import QuestionDetailScreen from 'app/screens/QuestionDetail/Screen';
import {QuestionDetailScreenParams} from './HomeStack';

export type SearchStackNavigationProp =
  NativeStackNavigationProp<InboxStackParamList>;

export type InboxStackParamList = {
  Inbox: undefined;
  QuestionDetail: QuestionDetailScreenParams;
};

const Stack = createNativeStackNavigator<InboxStackParamList>();

const InboxStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Inbox" component={InboxScreen} />
      <Stack.Screen name="QuestionDetail" component={QuestionDetailScreen} />
    </Stack.Navigator>
  );
};

export default InboxStack;
