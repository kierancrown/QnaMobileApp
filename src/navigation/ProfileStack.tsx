import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import ProfileScreen from 'app/screens/Profile';
import SettingsScren from 'app/screens/Settings/Screen';
import SettingsAboutScreen from 'app/screens/Settings/About/Screen';
import SettingsHelpScreen from 'app/screens/Settings/Help/Screen';
import SettingsDebugScreen from 'app/screens/Settings/Debug/Screen';
import SettingsAboutDocumentViewScreen from 'app/screens/Settings/About/PublicDocViewer/Screen';

export type ProfileStackNavigationProp =
  NativeStackNavigationProp<ProfileStackParamList>;

export type ProfileScreenParams = {
  displayBackButton?: boolean;
  userId?: string;
};

export type SettingsScreenParams = {
  headerTitle: string;
};

type SettingsDocViewerScreenParams = {
  documentName: string;
};

export type ProfileStackParamList = {
  Profile: ProfileScreenParams;
  Settings: SettingsScreenParams;
  SettingsHelp: SettingsScreenParams;
  SettingsAbout: SettingsScreenParams;
  SettingsDocumentViewer: SettingsScreenParams & SettingsDocViewerScreenParams;
  SettingsDebug: SettingsScreenParams;
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
      <Stack.Screen
        name="Settings"
        initialParams={{headerTitle: 'Settings'}}
        component={SettingsScren}
      />
      <Stack.Screen
        name="SettingsHelp"
        initialParams={{headerTitle: 'Help'}}
        component={SettingsHelpScreen}
      />
      <Stack.Screen
        name="SettingsAbout"
        initialParams={{headerTitle: 'About'}}
        component={SettingsAboutScreen}
      />
      <Stack.Screen
        name="SettingsDocumentViewer"
        component={SettingsAboutDocumentViewScreen}
      />
      <Stack.Screen
        name="SettingsDebug"
        initialParams={{headerTitle: 'Debug'}}
        component={SettingsDebugScreen}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;
