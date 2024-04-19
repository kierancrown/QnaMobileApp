import {Flex, SafeAreaView, Text, VStack} from 'ui';
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
import {ActivityIndicator} from 'react-native';

const ProfileDetails = () => {
  const {user} = useUser();
  const avatarRef = useRef<AvatarRef>(null);

  const [loadingUsername, setLoadingUsername] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean>();
  const [debouncedUsername] = useDebounceValue(username, 1000);

  const checkUsernameAvailability = useCallback(async () => {
    setLoadingUsername(true);
    const response = axios.post<{
      available: boolean;
    }>('https://api.askthat.co/functions/v1/username-available', {
      username: username,
    });

    setLoadingUsername(false);
    return (await response).data.available;
  }, [username]);

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

  return (
    <SafeAreaView>
      <Flex px="m" py="lY">
        <VStack rowGap="xxsY">
          <Text variant="navbarTitle">Complete your profile</Text>
          <Text variant="body">
            Add a profile picture and a username to get started
          </Text>
        </VStack>

        <TouchableOpacity onPress={presentImagePicker}>
          <Avatar ref={avatarRef} size="xxxxl" />
        </TouchableOpacity>

        <Text variant="body" mt="lY">
          {loadingUsername ? 'Checking username availability...' : ''}
        </Text>

        <Input
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your username"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="username-new"
          rightAdornment={
            loadingUsername ? (
              <ActivityIndicator />
            ) : isUsernameAvailable === false ? (
              <Text variant="body" color="destructiveAction">
                N
              </Text>
            ) : (
              <Text variant="body" color="successfulAction">
                Y
              </Text>
            )
          }
        />
      </Flex>
    </SafeAreaView>
  );
};

export default ProfileDetails;
