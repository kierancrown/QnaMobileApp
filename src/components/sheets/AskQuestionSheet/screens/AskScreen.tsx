import HStack from 'app/components/common/HStack';
import Text from 'app/components/common/Text';
import VStack from 'app/components/common/VStack';
import {useAppTheme} from 'app/styles/theme';
import React, {FC, useEffect, useMemo, useRef, useState} from 'react';
import {Pressable, StyleSheet, Alert, Linking} from 'react-native';
import {
  NativeViewGestureHandler,
  ScrollView,
  TextInput,
} from 'react-native-gesture-handler';
import {Box, Flex} from 'ui';
import {
  BottomSheetTextInput,
  TouchableOpacity,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {SafeAreaView} from 'react-native-safe-area-context';

import {request, PERMISSIONS} from 'react-native-permissions';

import PhotosIcon from 'app/assets/icons/compose/photos.svg';
import CameraIcon from 'app/assets/icons/compose/camera.svg';
import PollIcon from 'app/assets/icons/compose/poll.svg';
import PollFilledIcon from 'app/assets/icons/compose/pollFilled.svg';
import LocationIcon from 'app/assets/icons/compose/location-dot.svg';

import {
  Asset,
  launchImageLibrary,
  launchCamera,
} from 'react-native-image-picker';
import PhotoPreview from '../components/PhotoPreview';
import PollContainer, {PollOptionType} from '../components/Poll';
import Badge from 'app/components/common/Badge';
import {percentHeight} from 'app/utils/size';
import useKeyboardStatus from 'app/hooks/useKeyboardStatus';
import {ms} from 'react-native-size-matters';
import PopoverMenu from 'app/components/common/PopoverMenu';
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {AskQuestionStackParamList} from '..';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from 'app/redux/store';
import {setActionButton, setCanSubmit} from 'app/redux/slices/askSheetSlice';

const charLimit = 120;
const extraInfoLimit = 1000;
const ACTION_ICON_SIZE = ms(20);

const AskSheetContent: FC = () => {
  const [question, setQuestion] = useState('');
  const [extraInfo, setExtraInfo] = useState('');
  const [photos, setPhotos] = useState<Asset[]>([]);
  const [pollOptions, setPollOptions] = useState<PollOptionType[]>([]);
  const [showPoll, setShowPoll] = useState(false);

  const [selectedInput, setSelectedInput] = useState<'question' | 'extraInfo'>(
    'question',
  );

  const charsRemaining = useMemo(
    () =>
      selectedInput === 'question'
        ? charLimit - question.length
        : extraInfoLimit - extraInfo.length,
    [question, selectedInput, extraInfo],
  );

  // @ts-ignore
  const inputRef = useRef<TextInput>(null);
  // @ts-ignore
  const extraInfoRef = useRef<TextInput>('');

  const theme = useAppTheme();
  const {navigate} = useNavigation<NavigationProp<AskQuestionStackParamList>>();
  const {keyboardOpen} = useKeyboardStatus();
  const dispatch = useDispatch<AppDispatch>();
  const {isLoading, sheetState, selectedLocation} = useSelector(
    (state: RootState) => state.nonPersistent.askSheet,
  );

  useEffect(() => {
    dispatch(setCanSubmit(question.trim().length > 0 && !isLoading));
  }, [question, isLoading, dispatch]);

  const dismissKeyboard = () => {
    inputRef.current?.blur();
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (sheetState === 'open') {
      focusInput();
    }
  }, [sheetState]);

  useFocusEffect(() => {
    dispatch(setActionButton('close'));
  });

  const openPhotoLibrary = () => {
    if (photos.length >= 5) {
      Alert.alert('Maximum photos reached', 'You can only add 5 photos');
      return;
    }
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: true,
        quality: 0.5,
        selectionLimit: 5 - photos.length,
      },
      response => {
        setPhotos([...photos, ...(response.assets ?? [])]);
      },
    );
  };

  const openCamera = () => {
    if (photos.length >= 5) {
      Alert.alert('Maximum photos reached', 'You can only add 5 photos');
      return;
    }
    launchCamera(
      {
        mediaType: 'photo',
        includeBase64: true,
        quality: 0.5,
      },
      response => {
        if (response.assets) {
          setPhotos([...photos, response.assets[0]]);
        }
      },
    );
  };

  const locationPicker = () => {
    request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(result => {
      if (result === 'granted') {
        navigate('LocationScreen');
      } else {
        Alert.alert(
          'Location permission required',
          'Please allow location access to use this feature',
          [
            {text: 'Cancel', style: 'cancel'},
            {
              style: 'default',
              text: 'Open settings',
              onPress: () => {
                Linking.openSettings();
              },
            },
          ],
        );
      }
    });
  };

  return (
    <>
      <Pressable style={styles.wrapper} onPress={dismissKeyboard}>
        <VStack flex={1} overflow="hidden">
          <BottomSheetScrollView
            keyboardShouldPersistTaps="always"
            contentContainerStyle={{paddingBottom: theme.spacing.mY}}>
            <VStack flex={1} rowGap="mY">
              <Pressable onPress={focusInput}>
                <Box pt="sY" px="m">
                  <BottomSheetTextInput
                    blurOnSubmit={false}
                    placeholder="What do you want to know?"
                    returnKeyType="next"
                    onSubmitEditing={() => extraInfoRef.current?.focus()}
                    editable={!isLoading}
                    placeholderTextColor={theme.colors.inputPlaceholder}
                    onFocus={() => setSelectedInput('question')}
                    ref={inputRef}
                    style={[
                      styles.input,
                      {
                        ...theme.textVariants.extraLargeInput,
                        color: theme.colors.foreground,
                      },
                    ]}
                    cursorColor={theme.colors.foreground}
                    onChangeText={setQuestion}
                    value={question}
                  />
                </Box>
              </Pressable>
              {/* Extra info */}
              <Pressable>
                <Box px="m">
                  <BottomSheetTextInput
                    blurOnSubmit={false}
                    multiline
                    placeholder="Add extra info here... (optional)"
                    keyboardType="default"
                    editable={!isLoading}
                    ref={extraInfoRef}
                    placeholderTextColor={theme.colors.inputPlaceholder}
                    onFocus={() => setSelectedInput('extraInfo')}
                    style={[
                      styles.input,
                      {
                        ...theme.textVariants.largeInput,
                        color: theme.colors.foreground,
                      },
                    ]}
                    cursorColor={theme.colors.foreground}
                    onChangeText={setExtraInfo}
                    value={extraInfo}
                  />
                </Box>
              </Pressable>

              {showPoll ? (
                <PollContainer
                  options={pollOptions}
                  setOptions={setPollOptions}
                  onRemovePoll={() => {
                    setShowPoll(false);
                    setPollOptions([]);
                  }}
                />
              ) : (
                photos.length > 0 && (
                  <Box height={percentHeight(20)}>
                    <NativeViewGestureHandler disallowInterruption={true}>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyboardShouldPersistTaps="always"
                        contentContainerStyle={{
                          paddingHorizontal: theme.spacing.m,
                        }}>
                        <PhotoPreview
                          photos={photos}
                          removePhoto={(index: number) => {
                            setPhotos(photos.filter((_, i) => i !== index));
                          }}
                        />
                      </ScrollView>
                    </NativeViewGestureHandler>
                  </Box>
                )
              )}
            </VStack>
          </BottomSheetScrollView>
        </VStack>
      </Pressable>
      <Box bg="cardBackground">
        <SafeAreaView edges={!keyboardOpen ? ['bottom'] : []}>
          <HStack py="sY" px="s" alignItems="center" columnGap="m">
            <Badge
              text={photos.length.toString()}
              hidden={photos.length < 1}
              size={'small'}>
              <PopoverMenu
                onLongPress={openPhotoLibrary}
                triggerComponent={
                  <PhotosIcon
                    width={ACTION_ICON_SIZE}
                    height={ACTION_ICON_SIZE}
                    fill={theme.colors.inputPlaceholder}
                  />
                }
                items={[
                  {
                    title: 'Take a photo',
                    left: (
                      <CameraIcon
                        width={ACTION_ICON_SIZE}
                        height={ACTION_ICON_SIZE}
                        fill={theme.colors.inputPlaceholder}
                      />
                    ),
                    onPress: openCamera,
                  },
                  {
                    title: 'Choose from library',
                    left: (
                      <PhotosIcon
                        width={ACTION_ICON_SIZE}
                        height={ACTION_ICON_SIZE}
                        fill={theme.colors.inputPlaceholder}
                      />
                    ),
                    onPress: openPhotoLibrary,
                  },
                ]}
              />
            </Badge>

            <Badge
              text={pollOptions.length.toString()}
              hidden={pollOptions.length < 1}
              size={'small'}>
              <TouchableOpacity
                hitSlop={8}
                onPress={() => {
                  if (showPoll === false) {
                    if (pollOptions.length <= 0) {
                      setPollOptions([{name: 'Yes'}, {name: 'No'}]);
                    } else {
                      setPollOptions([]);
                    }
                  }
                  setShowPoll(!showPoll);
                }}>
                {showPoll ? (
                  <PollFilledIcon
                    width={ACTION_ICON_SIZE}
                    height={ACTION_ICON_SIZE}
                    fill={theme.colors.inputPlaceholder}
                  />
                ) : (
                  <PollIcon
                    width={ACTION_ICON_SIZE}
                    height={ACTION_ICON_SIZE}
                    fill={theme.colors.inputPlaceholder}
                  />
                )}
              </TouchableOpacity>
            </Badge>
            <TouchableOpacity onPress={locationPicker}>
              <HStack
                alignItems="center"
                columnGap="xxxs"
                marginLeft="xxxsMinus">
                <LocationIcon
                  width={ACTION_ICON_SIZE}
                  height={ACTION_ICON_SIZE}
                  fill={theme.colors.inputPlaceholder}
                />
                {selectedLocation && (
                  <Text variant="smallBody" color="inputPlaceholder">
                    {selectedLocation.name}
                  </Text>
                )}
              </HStack>
            </TouchableOpacity>
            <Flex />
            <Text
              variant="smallBody"
              color={
                charsRemaining < 0
                  ? 'minusCharLimit'
                  : charsRemaining < 11
                  ? 'reallyLowCharLimit'
                  : charsRemaining < 21
                  ? 'lowCharLimit'
                  : 'inputPlaceholder'
              }>
              {charsRemaining}
            </Text>
          </HStack>
        </SafeAreaView>
      </Box>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  input: {
    textAlignVertical: 'top',
    padding: 0,
    margin: 0,
  },
});

export default AskSheetContent;
