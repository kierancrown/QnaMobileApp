import {Alert} from 'react-native';
import React, {FC} from 'react';
import {useDispatch} from 'react-redux';
import {AppDispatch} from 'app/redux/store';
import {resetAuth, resetCache} from 'app/redux/slices/authSlice';
import {Center, Flex, Text, VStack, Button, HStack} from 'ui';

import {Theme} from 'app/styles/theme';
import {useTheme} from '@shopify/restyle';
import {useUser} from 'app/lib/supabase/context/auth';
import {supabase} from 'app/lib/supabase';
import {useUsername} from 'app/hooks/useUsername';

import EyesIcon from 'app/assets/icons/Eyes.svg';
import LargeTitleHeader from 'app/components/common/Header/LargeTitleHeader';
import {useBottomPadding} from 'app/hooks/useBottomPadding';

const ProfileScreen: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme<Theme>();

  const {user} = useUser();
  const {username, updateUsername} = useUsername();

  const bottomListPadding = useBottomPadding();

  const login = () => {
    dispatch(resetAuth());
    if (user) {
      supabase.auth.signOut();
      dispatch(resetCache());
    }
  };

  const updateUserPrompt = () => {
    if (!user) {
      Alert.alert('Login Required', 'You must be logged in to update username');
      return;
    }
    Alert.prompt(
      'Update Username',
      'Enter your new username',
      async newUsername => {
        if (newUsername) {
          try {
            const success = await updateUsername(newUsername);
            if (success) {
              Alert.alert('Success', 'Username updated');
            } else {
              Alert.alert('Error', 'Failed to update username');
            }
          } catch (error) {
            const err = error as Error;
            Alert.alert('Error', err.message);
          }
        }
      },
    );
  };

  return !user ? (
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
          <Button title="Login" mt="lY" />
        </HStack>
      </VStack>
    </Center>
  ) : (
    <Flex>
      <LargeTitleHeader title="Profile" subtitle={username} />
      {user && (
        <Center flex={1} style={{paddingBottom: bottomListPadding}}>
          <Button title={user ? 'Logout' : 'Login'} onPress={login} />
          <Button title="Update Username" onPress={updateUserPrompt} />
        </Center>
      )}
    </Flex>
  );
};

export default ProfileScreen;
