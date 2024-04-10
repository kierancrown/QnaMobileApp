import {Alert, Button} from 'react-native';
import React, {FC} from 'react';
import {useDispatch} from 'react-redux';
import {AppDispatch} from 'app/redux/store';
import {resetAuth, resetCache} from 'app/redux/slices/authSlice';
import {Center, Flex, HStack, Text} from 'ui';

import {Theme} from 'app/styles/theme';
import {useTheme} from '@shopify/restyle';
import {useUser} from 'app/lib/supabase/context/auth';
import {supabase} from 'app/lib/supabase';
import {useUsername} from 'app/hooks/useUsername';
import {Header} from 'app/components/common/Header/CustomHeader';

import CircleUserIcon from 'app/assets/icons/CircleUser.svg';
import {ScrollView} from 'react-native-gesture-handler';

const ProfileScreen: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme<Theme>();

  const {user} = useUser();
  const {username, updateUsername} = useUsername();

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

  return (
    <Flex>
      <Header
        title={username ? username : 'Profile'}
        leftButton={
          <HStack flex={1} alignItems="center" justifyContent="flex-start">
            <Button
              title={user ? 'Logout' : 'Login'}
              onPress={login}
              color={theme.colors.brand}
            />
          </HStack>
        }
      />
      {user && (
        <Flex>
          <Button
            title="Update Username"
            onPress={updateUserPrompt}
            color={theme.colors.brand}
          />
        </Flex>
      )}

      {!user && (
        <Flex>
          <ScrollView>
            <Center px="xxxl" pt="xxlY" flexDirection="column" rowGap="mY">
              <CircleUserIcon fill={theme.colors.cardText} />
              <Text variant="title" color="cardText">
                No User Logged In
              </Text>
            </Center>
          </ScrollView>
        </Flex>
      )}
    </Flex>
  );
};

export default ProfileScreen;
