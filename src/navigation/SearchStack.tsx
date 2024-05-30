import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import SearchScreen from 'app/screens/Search';

export type SearchStackNavigationProp =
  NativeStackNavigationProp<SearchStackParamList>;

export type SearchStackParamList = {
  Search: undefined;
};

const Stack = createNativeStackNavigator<SearchStackParamList>();

const SearchStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Search" component={SearchScreen} />
    </Stack.Navigator>
  );
};

export default SearchStack;
