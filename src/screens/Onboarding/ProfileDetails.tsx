import {Button, Center, Flex, HStack, SafeAreaView, Text, VStack} from 'ui';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Keyboard} from 'react-native';
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

import ImageResizer from '@bam.tech/react-native-image-resizer';
import RNFetchBlob from 'rn-fetch-blob';
import {rgbaToThumbHash, rgbaToDataURL} from 'thumbhash';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

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

  const keyboardOpen = useSharedValue(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        keyboardOpen.value = withTiming(1);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => {
        keyboardOpen.value = withTiming(0);
      },
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [keyboardOpen]);

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

  const imageToBase64 = async (uri: string) => {
    try {
      // Check if URI starts with file:///
      if (uri.startsWith('file:///')) {
        const filePath = uri.replace('file://', '');

        // Read the file and convert it to base64
        const base64String = await RNFetchBlob.fs.readFile(filePath, 'base64');
        return base64String;
      } else {
        throw new Error('Not a file URI');
      }
    } catch (error) {
      console.error('Error converting image to base64:', error);
      return null;
    }
  };

  const fileToArrayLikeNumber = async (uri: string) => {
    try {
      // Check if URI starts with file:///
      if (uri.startsWith('file:///')) {
        const filePath = uri.replace('file://', '');

        // Read the file and convert it to base64
        const base64String = await RNFetchBlob.fs.readFile(filePath, 'base64');

        // Convert base64 to Uint8Array

        const binaryString = atob(base64String);

        const bytes = new Uint8Array(binaryString.length);

        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        return bytes;
      } else {
        throw new Error('Not a file URI');
      }
    } catch (error) {
      console.error('Error converting image to base64:', error);
      return null;
    }
  };

  function base64ToArray(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    console.log({bytes});
    return bytes;
  }

  const presentImagePicker = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: true,
        quality: 0.5,
      },
      response => {
        const input = response.assets?.[0];
        const imageBuffer = input?.base64;
        if (!imageBuffer || !input) {
          console.log('No image selected');
          return;
        }

        ImageResizer.createResizedImage(
          input.uri!,
          100,
          100,
          'JPEG',
          100,
          0,
          undefined,
          false,
          {
            mode: 'cover',
            onlyScaleDown: true,
          },
        )
          .then(res => {
            fileToArrayLikeNumber(res.uri).then(data => {
              console.log(data);
              const t = rgbaToDataURL(res.width, res.height, data!);
              console.log(t);
              const thumbhash = rgbaToThumbHash(res.width, res.height, data!);
              console.log(thumbhash);
            });
          })
          .catch(err => {});

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
                    // profile_picture_thumbhash: thumbhash.toString(),
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

  const headerAnimatedStyles = useAnimatedStyle(() => {
    return {
      flex: 1,
      opacity: interpolate(
        keyboardOpen.value,
        [0, 1],
        [1, 0],
        Extrapolation.CLAMP,
      ),
      translateY: interpolate(
        keyboardOpen.value,
        [0, 1],
        [0, -100],
        Extrapolation.CLAMP,
      ),
    };
  }, []);

  return (
    <SafeAreaView>
      <Flex px="m" alignItems="center">
        <Animated.View style={headerAnimatedStyles}>
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
        </Animated.View>

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
