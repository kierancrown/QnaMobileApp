import {Alert, Button} from 'react-native';
import React, {FC} from 'react';
import {useDispatch} from 'react-redux';
import {AppDispatch} from 'app/redux/store';
import {resetAuth, resetCache} from 'app/redux/slices/authSlice';
import {Box, Center, Flex, HStack, Text} from 'ui';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Theme} from 'app/styles/theme';
import {useTheme} from '@shopify/restyle';
import {useUser} from 'app/lib/supabase/context/auth';
import {supabase} from 'app/lib/supabase';
import {useUsername} from 'app/hooks/useUsername';

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
      <Box
        backgroundColor="cardBackground"
        borderColor="segmentBackground"
        borderBottomWidth={1}>
        <SafeAreaView edges={['top', 'left', 'right']}>
          <HStack py="xxsY" px="xs">
            <HStack flex={1} alignItems="center" justifyContent="flex-start">
              <Button
                title={user ? 'Logout' : 'Login'}
                onPress={login}
                color={theme.colors.brand}
              />
            </HStack>
            <Center flex={2}>
              <Text variant="medium">{username ? username : 'Profile'}</Text>
            </Center>
            <HStack flex={1} alignItems="center" justifyContent="flex-end">
              <Button
                title="UU"
                onPress={updateUserPrompt}
                color={theme.colors.brand}
              />
            </HStack>
          </HStack>
        </SafeAreaView>
      </Box>
      <Flex>
        <Center>
          <Text variant="medium">Hello</Text>
        </Center>
      </Flex>
    </Flex>
  );
};

export default ProfileScreen;
