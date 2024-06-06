import HStack from 'app/components/common/HStack';
import Text from 'app/components/common/Text';
import VStack from 'app/components/common/VStack';
import {useAppTheme} from 'app/styles/theme';
import React, {FC, useEffect, useMemo, useRef, useState} from 'react';
import {Pressable, StyleSheet, Linking, Platform, Keyboard} from 'react-native';
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
import PlusIcon from 'app/assets/icons/compose/plus-large.svg';

import {
  Asset,
  launchImageLibrary,
  launchCamera,
} from 'react-native-image-picker';
import PhotoPreview from '../components/PhotoPreview';
import PollContainer from '../components/Poll';
import Badge from 'app/components/common/Badge';
import {percentHeight} from 'app/utils/size';
import useKeyboardStatus from 'app/hooks/useKeyboardStatus';
import PopoverMenu, {PopoverRef} from 'app/components/common/PopoverMenu';
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {AskQuestionStackParamList} from '..';
import {useSelector} from 'react-redux';
import {RootState, useAppDispatch} from 'app/redux/store';
import {
  removeTopic,
  setActionButton,
  setCanSubmit,
  setQuestion,
  setQuestionDetail,
  setQuestionMedia,
  setQuestionPoll,
} from 'app/redux/slices/askSheetSlice';
import TabItem from 'app/components/common/TabItem';
import {
  MAX_QUESTION_DETAIL_LENGTH,
  MAX_QUESTION_LENGTH,
  MEDIA_LIMIT,
} from 'app/constants';
import {useAlert} from 'app/components/AlertsWrapper';

const AskSheetContent: FC = () => {
  const {
    isLoading,
    sheetState,
    selectedLocation,
    question,
    questionDetail,
    questionMedia,
    questionPoll,
    selectedTopics,
  } = useSelector((state: RootState) => state.nonPersistent.askSheet);
  const {openAlert} = useAlert();
  const [showPoll, setShowPoll] = useState(false);
  const [selectedInput, setSelectedInput] = useState<
    'question' | 'extraInfo' | null
  >(null);
  const charsRemaining = useMemo(
    () =>
      selectedInput !== 'extraInfo'
        ? MAX_QUESTION_LENGTH - question.length
        : MAX_QUESTION_DETAIL_LENGTH - questionDetail.length,
    [question, selectedInput, questionDetail],
  );

  // @ts-ignore
  const inputRef = useRef<TextInput>(null);
  // @ts-ignore
  const extraInfoRef = useRef<TextInput>('');

  const theme = useAppTheme();
  const {navigate} = useNavigation<NavigationProp<AskQuestionStackParamList>>();
  const {keyboardOpen} = useKeyboardStatus();
  const dispatch = useAppDispatch();
  const mediaPopover = useRef<PopoverRef>(null);

  useEffect(() => {
    dispatch(setCanSubmit(question.trim().length > 0 && !isLoading));
  }, [question, isLoading, dispatch]);

  const dismissKeyboard = () => {
    inputRef.current?.blur();
    extraInfoRef.current?.blur();
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

  useEffect(() => {
    Keyboard.addListener('keyboardDidHide', () => {
      if (
        !inputRef.current?.isFocused() &&
        !extraInfoRef.current?.isFocused()
      ) {
        setSelectedInput(null);
      }
    });
    return () => {
      Keyboard.removeAllListeners('keyboardDidHide');
    };
  });

  const openPhotoLibrary = () => {
    if (questionMedia.length >= MEDIA_LIMIT) {
      openAlert({
        title: 'Maximum photos reached',
        message: 'You can only add 4 photos',
      });
      mediaPopover.current?.closePopover();
      return;
    }
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: true,
        quality: 0.5,
        selectionLimit: MEDIA_LIMIT - questionMedia.length,
      },
      response => {
        dispatch(
          setQuestionMedia([...questionMedia, ...(response.assets ?? [])]),
        );
        mediaPopover.current?.closePopover();
      },
    );
  };

  const openCamera = () => {
    if (questionMedia.length >= MEDIA_LIMIT) {
      openAlert({
        title: 'Maximum photos reached',
        message: 'You can only add 4 photos',
      });
      mediaPopover.current?.closePopover();
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
          dispatch(
            setQuestionMedia([...questionMedia, response.assets[0] as Asset]),
          );
        }
        mediaPopover.current?.closePopover();
      },
    );
  };

  const openLocationManager = () => {
    if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
      return;
    }

    request(
      Platform.select({
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      }) ?? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    ).then(result => {
      if (result === 'granted') {
        navigate('LocationScreen');
      } else {
        openAlert({
          title: 'Location permission required',
          message: 'Please allow location access to use this feature',
          buttons: [
            {
              text: 'Cancel',
              variant: 'destructive',
            },
            {
              text: 'Open settings',
              onPress: () => {
                Linking.openSettings();
              },
            },
          ],
        });
      }
    });
  };

  const openTopicsManager = () => {
    navigate('ManageTagsScreen');
  };

  const handleChangeText = (text: string) => {
    // Remove any new line characters
    const sanitizedText = text.replace(/\n/g, '');
    dispatch(setQuestion(sanitizedText));
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
                    multiline
                    onKeyPress={e => {
                      const {nativeEvent} = e;
                      if (nativeEvent.key === 'Enter') {
                        extraInfoRef.current?.focus();
                      }
                    }}
                    placeholder="What do you want to know?"
                    returnKeyType="next"
                    selectionColor={theme.colors.brand}
                    cursorColor={theme.colors.brand}
                    selectionHandleColor={theme.colors.brand}
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
                    onChangeText={handleChangeText}
                    value={question}
                  />
                </Box>
              </Pressable>
              {/* Extra info */}
              <Pressable
                onPress={() => {
                  extraInfoRef.current?.focus();
                }}>
                <Box px="m">
                  <BottomSheetTextInput
                    blurOnSubmit={false}
                    multiline
                    onKeyPress={({nativeEvent}) => {
                      if (nativeEvent.key === 'Backspace') {
                        if (questionDetail.length === 0) {
                          focusInput();
                        }
                      }
                    }}
                    placeholder="Add extra info here... (optional)"
                    keyboardType="default"
                    selectionColor={theme.colors.brand}
                    cursorColor={theme.colors.brand}
                    selectionHandleColor={theme.colors.brand}
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
                    onChangeText={text => {
                      dispatch(setQuestionDetail(text));
                    }}
                    value={questionDetail}
                  />
                </Box>
              </Pressable>

              <HStack
                flexWrap="wrap"
                columnGap="xs"
                rowGap="xsY"
                px="s"
                py="sY">
                {selectedTopics.map(topic => (
                  <TabItem
                    key={topic.id}
                    title={topic.name}
                    count={0}
                    layoutAnimation
                    small
                    selected={false}
                    onPress={() => {
                      openAlert({
                        title: 'Remove tag',
                        message: 'Are you sure you want to remove?',
                        buttons: [
                          {
                            text: 'Cancel',
                          },
                          {
                            text: 'Remove',
                            variant: 'destructive',
                            onPress: () => {
                              dispatch(removeTopic(topic.id));
                            },
                          },
                        ],
                      });
                    }}
                  />
                ))}
                <TabItem
                  icon={
                    <PlusIcon
                      width={theme.iconSizes.s}
                      height={theme.iconSizes.s}
                    />
                  }
                  title="Add topics"
                  layoutAnimation
                  count={0}
                  small
                  selected={false}
                  onPress={openTopicsManager}
                />
              </HStack>

              {showPoll ? (
                <PollContainer
                  options={questionPoll}
                  setOptions={options => {
                    dispatch(setQuestionPoll(options));
                  }}
                  onRemovePoll={() => {
                    setShowPoll(false);
                    dispatch(setQuestionPoll([]));
                  }}
                />
              ) : (
                questionMedia.length > 0 && (
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
                          photos={questionMedia}
                          removePhoto={(index: number) => {
                            dispatch(
                              setQuestionMedia(
                                questionMedia.filter((_, i) => i !== index),
                              ),
                            );
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
              text={questionMedia.length.toString()}
              hidden={questionMedia.length < 1}
              size={'small'}>
              <PopoverMenu
                ref={mediaPopover}
                handleKeyboard={selectedInput != null}
                onLongPress={openPhotoLibrary}
                triggerComponent={
                  <PhotosIcon
                    width={theme.iconSizes.intermediate}
                    height={theme.iconSizes.intermediate}
                    fill={theme.colors.inputPlaceholder}
                  />
                }
                items={[
                  {
                    title: 'Take a photo',
                    left: (
                      <CameraIcon
                        width={theme.iconSizes.intermediate}
                        height={theme.iconSizes.intermediate}
                        fill={theme.colors.inputPlaceholder}
                      />
                    ),
                    onPress: openCamera,
                  },
                  {
                    title: 'Choose from library',
                    left: (
                      <PhotosIcon
                        width={theme.iconSizes.intermediate}
                        height={theme.iconSizes.intermediate}
                        fill={theme.colors.inputPlaceholder}
                      />
                    ),
                    onPress: openPhotoLibrary,
                  },
                ]}
              />
            </Badge>

            <Badge
              text={questionPoll.length.toString()}
              hidden={questionPoll.length < 1}
              size={'small'}>
              <TouchableOpacity
                hitSlop={8}
                onPress={() => {
                  if (showPoll === false) {
                    if (questionPoll.length <= 0) {
                      dispatch(setQuestionPoll([{name: 'Yes'}, {name: 'No'}]));
                    } else {
                      dispatch(setQuestionPoll([]));
                    }
                  }
                  setShowPoll(!showPoll);
                }}>
                {showPoll ? (
                  <PollFilledIcon
                    width={theme.iconSizes.intermediate}
                    height={theme.iconSizes.intermediate}
                    fill={theme.colors.inputPlaceholder}
                  />
                ) : (
                  <PollIcon
                    width={theme.iconSizes.intermediate}
                    height={theme.iconSizes.intermediate}
                    fill={theme.colors.inputPlaceholder}
                  />
                )}
              </TouchableOpacity>
            </Badge>
            <TouchableOpacity onPress={openLocationManager}>
              <HStack
                alignItems="center"
                columnGap="xxxs"
                marginLeft="xxxsMinus">
                <LocationIcon
                  width={theme.iconSizes.intermediate}
                  height={theme.iconSizes.intermediate}
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
