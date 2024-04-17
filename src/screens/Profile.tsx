import {Alert} from 'react-native';
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

import {launchImageLibrary} from 'react-native-image-picker';
import {decode} from 'base64-arraybuffer';
import Avatar from 'app/components/common/Avatar';
import Username from 'app/components/Username';
import {useNotification} from 'app/context/PushNotificationContext';

import messaging from '@react-native-firebase/messaging';

const ProfileScreen: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme<Theme>();

  const {requestPermission, unRegisterNotifications} = useNotification();
  const {user, logout} = useUser();
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

  const presentImagePicker = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: true,
        quality: 0.5,
      },
      response => {
        const imageBuffer = response.assets?.[0].base64;
        if (!imageBuffer) {
          console.log('No image selected');
          return;
        }
        // TODO: Fix duplicate image error
        supabase.storage
          .from('user_profile_pictures')
          .upload(`public/${user?.id}.jpg`, decode(imageBuffer), {
            contentType: response.assets?.[0].type ?? 'image/jpg',
          })
          .then(({data, error}) => {
            if (!error && data) {
              const url = data.path;
              supabase
                .from('user_metadata')
                .upsert(
                  {
                    user_id: user?.id,
                    profile_picture_key: url,
                  },
                  {onConflict: 'user_id'},
                )
                .then(({error: e}) => {
                  if (e) {
                    console.error('Error updating profile picture', e);
                  } else {
                    Alert.alert('Success', 'Profile picture updated');
                  }
                });
            }
          });
      },
    );
  };

  return (
    <SafeAreaView>
      {!user ? (
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
      ) : (
        <Flex>
          <Username
            variant="header"
            color="foreground"
            username={username}
            isVerified
          />
          {user && (
            <Center
              flex={1}
              style={{paddingBottom: bottomListPadding}}
              rowGap="mY">
              <Button title={user ? 'Logout' : 'Login'} onPress={logout} />
              <Button title="Update Username" onPress={updateUserPrompt} />
              <Button title="Change Avatar" onPress={presentImagePicker} />

              <Button
                title="Request push notifications"
                onPress={requestPermission}
              />

              <Button
                title="APNS?"
                onPress={() => {
                  messaging()
                    .getAPNSToken()
                    .then(token => {
                      if (!token) {
                        Alert.alert('Error', 'No token found');
                        return;
                      }
                      Alert.alert('APNS Token', token);
                    })
                    .catch(error => {
                      Alert.alert('Error', error.message);
                    });
                }}
              />

              <Button
                title="Unregister device token"
                onPress={unRegisterNotifications}
              />

              <Avatar size="xxxxl" />
            </Center>
          )}
        </Flex>
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;
