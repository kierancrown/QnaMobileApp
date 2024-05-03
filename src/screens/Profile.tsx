import React, {FC} from 'react';
import {useDispatch} from 'react-redux';
import {AppDispatch} from 'app/redux/store';
import {resetAuth, resetCache} from 'app/redux/slices/authSlice';
import {Center, Flex, Text, VStack, Button, HStack, SafeAreaView} from 'ui';

import {Theme} from 'app/styles/theme';
import {useTheme} from '@shopify/restyle';
import {useUser} from 'app/lib/supabase/context/auth';
import {supabase} from 'app/lib/supabase';
import {useUsername} from 'app/hooks/useUsername';

import EyesIcon from 'app/assets/icons/Eyes.svg';
import {useBottomPadding} from 'app/hooks/useBottomPadding';

import Avatar from 'app/components/common/Avatar';
import Username from 'app/components/Username';
import {useNotification} from 'app/context/PushNotificationContext';
import {Alert} from 'react-native';
import Profile from './Profile/Profile';

const ProfileScreen: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme<Theme>();

  const {requestPermission} = useNotification();
  const {user, logout, sessionId, deleteUser} = useUser();
  const {username} = useUsername();

  const bottomListPadding = useBottomPadding();

  const login = () => {
    dispatch(resetAuth());
    if (user) {
      supabase.auth.signOut();
      dispatch(resetCache());
    }
  };

  const deleteAccountPrompt = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Heads up',
              'Deleting your account is permanent. All of your questions and responses will be deleted. Are you sure you want to continue?',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: () => {
                    if (user) {
                      deleteUser().then();
                    }
                  },
                },
              ],
            );
          },
        },
      ],
    );
  };

  return !user ? (
    <SafeAreaView>
      <Center
        flex={1}
        style={{
          paddingBottom: bottomListPadding,
          paddingTop: bottomListPadding / 2,
        }}>
        <VStack rowGap="sY" px="l">
          <EyesIcon
            fill={theme.colors.foreground}
            width={theme.iconSizes.xxxxl}
            height={theme.iconSizes.xxxxl}
          />
          <Text variant="header" textAlign="left">
            {"You're currently\nannoymous"}
          </Text>
          <Text variant="subheader" color="cardText" textAlign="left">
            Login to ask questions and get answers
          </Text>

          <HStack>
            <Button title="Login" mt="lY" onPress={login} />
          </HStack>
        </VStack>
      </Center>
    </SafeAreaView>
  ) : (
    <Profile />
  );
};

export default ProfileScreen;
