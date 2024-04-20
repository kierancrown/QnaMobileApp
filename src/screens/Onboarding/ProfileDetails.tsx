import {Button, Center, Flex, HStack, SafeAreaView, Text, VStack} from 'ui';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import Avatar, {AvatarRef} from 'app/components/common/Avatar';
import {TouchableOpacity} from 'react-native-gesture-handler';
import axios from 'axios';
import {launchImageLibrary} from 'react-native-image-picker';
import {supabase} from 'app/lib/supabase';
import {useUser} from 'app/lib/supabase/context/auth';
import {decode} from 'base64-arraybuffer';
import {useDebounceValue} from 'usehooks-ts';
import Input from 'app/components/common/TextInput';
import {ActivityIndicator, Alert} from 'react-native';
import {useUsername} from 'app/hooks/useUsername';
import {useOnboarding} from 'app/hooks/useOnboarding';

const ProfileDetails = () => {
  const {user} = useUser();
  const avatarRef = useRef<AvatarRef>(null);
  const {updateUsername} = useUsername();
  const {completeOnboarding} = useOnboarding();

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingUsername, setLoadingUsername] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean>();
  const [debouncedUsername] = useDebounceValue(username, 1000);

  useEffect(() => {
    if (username.trim().length > 2) {
      setLoadingUsername(true);
    }
  }, [username]);

  const checkUsernameAvailability = useCallback(async () => {
    if (debouncedUsername.trim().length < 3) {
      return;
    }

    const response = await axios.post<{
      available: boolean;
    }>('https://api.askthat.co/functions/v1/username-available', {
      username: debouncedUsername,
    });

    setLoadingUsername(false);
    return response.data.available;
  }, [debouncedUsername]);

  useEffect(() => {
    if (!debouncedUsername || debouncedUsername.trim().length < 3) {
      return;
    }
    checkUsernameAvailability().then(setIsUsernameAvailable);
  }, [checkUsernameAvailability, debouncedUsername]);

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
                    avatarRef.current?.refresh();
                  }
                });
            }
          });
      },
    );
  };

  const saveUsername = async () => {
    setLoading(true);
    try {
      const success = await updateUsername(username.trim());
      if (success && user) {
        await completeOnboarding(user);
      } else {
        Alert.alert(
          'Something went wrong',
          'We seem to be having trouble connecting. Check your connection and try again later.',
        );
      }
    } catch (error) {
      const err = error as Error;
      console.error(err);
      Alert.alert(
        'Something went wrong',
        'We seem to be having trouble connecting. Check your connection and try again later.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView>
      <Flex px="m" alignItems="center">
        <Flex mt="mY">
          <Center>
            <VStack rowGap="sY">
              <Text variant="navbarTitle" textAlign="center">
                Complete your profile
              </Text>
              <Text variant="body" textAlign="center">
                Add a profile picture and a username to get started
              </Text>
            </VStack>
          </Center>
        </Flex>

        <Flex
          flex={2}
          alignItems="center"
          justifyContent="flex-start"
          rowGap="l">
          <TouchableOpacity onPress={presentImagePicker}>
            <Avatar ref={avatarRef} size="xxxxl" />
          </TouchableOpacity>

          <Input
            minWidth="100%"
            value={username}
            onChangeText={setUsername}
            placeholder="Enter your username"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="username-new"
          />
          <HStack
            minWidth="100%"
            mt="mMinus"
            justifyContent="flex-start"
            alignItems="center">
            {username.trim().length < 3 ? (
              <Text variant="body" color="destructiveAction">
                Username must be at least 3 characters
              </Text>
            ) : loadingUsername ? (
              <HStack columnGap="xs" alignItems="center">
                <ActivityIndicator color="white" />
                <Text>Checking username availability</Text>
              </HStack>
            ) : isUsernameAvailable === undefined ||
              username.trim().length < 3 ? null : isUsernameAvailable ===
              false ? (
              <Text variant="body" color="destructiveAction">
                Username unavailable
              </Text>
            ) : (
              <Text variant="body" color="successfulAction">
                Username available
              </Text>
            )}
          </HStack>
        </Flex>

        <Flex justifyContent="flex-end" pb="mY">
          <VStack rowGap="mY" alignItems="center">
            <Button
              title="Complete Profile"
              disabled={
                loading ||
                !(username.trim().length > 2 && isUsernameAvailable === true)
              }
              onPress={saveUsername}
            />
          </VStack>
        </Flex>
      </Flex>
    </SafeAreaView>
  );
};

export default ProfileDetails;
