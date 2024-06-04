import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import QuestionsScreen from '../screens/Questions';
import QuestionDetailScreen from '../screens/QuestionDetail';
import {ProfileScreenParams} from './ProfileStack';
import ProfileScreen from 'app/screens/Profile/Profile';
import TopicsFeedScreen from 'app/screens/TopicsFeed/Screen';

export type HomeStackNavigationProp =
  NativeStackNavigationProp<HomeStackParamList>;

export type TopicsFeedScreenParams = {
  topic: string;
};

export type QuestionDetailScreenParams = {
  questionId: number;
  responseCount?: number;
  isOwner?: boolean;
  ownerUsername: string;
  ownerVerified: boolean;
  skeletonLayout?: {
    hasMedia: boolean;
    hasBody: boolean;
    hasLocation: boolean;
  };
};

export type HomeStackParamList = {
  Auth: undefined;
  Questions: undefined;
  QuestionDetail: QuestionDetailScreenParams;
  Profile: ProfileScreenParams;
  TopicsFeed: TopicsFeedScreenParams;
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
      <Stack.Screen name="TopicsFeed" component={TopicsFeedScreen} />
    </Stack.Navigator>
  );
};

export default HomeStack;
