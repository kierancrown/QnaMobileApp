import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import QuestionsScreen from '../screens/Questions';
import QuestionDetailScreen from '../screens/QuestionDetail';

export type HomeStackNavigationProp =
  NativeStackNavigationProp<HomeStackParamList>;

export type HomeStackParamList = {
  Auth: undefined;
  Questions: undefined;
  QuestionDetail: {questionId: number};
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Questions"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Questions" component={QuestionsScreen} />
      <Stack.Screen name="QuestionDetail" component={QuestionDetailScreen} />
    </Stack.Navigator>
  );
};

export default HomeStack;
