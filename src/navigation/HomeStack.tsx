import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import QuestionsScreen from '../screens/Questions';
import QuestionDetailScreen from '../screens/QuestionDetail';
import {ProfileScreenParams} from './ProfileStack';
import ProfileScreen from 'app/screens/Profile/Profile';

export type HomeStackNavigationProp =
  NativeStackNavigationProp<HomeStackParamList>;

export type HomeStackParamList = {
  Auth: undefined;
  Questions: undefined;
  QuestionDetail: {
    questionId: number;
    responseCount?: number;
    isOwner?: boolean;
  };
  Profile: ProfileScreenParams;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Questions"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Questions" component={QuestionsScreen} />
      <Stack.Screen name="QuestionDetail" component={QuestionDetailScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default HomeStack;
