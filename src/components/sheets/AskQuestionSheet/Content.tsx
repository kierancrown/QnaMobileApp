import HStack from 'app/components/common/HStack';
import Text from 'app/components/common/Text';
import VStack from 'app/components/common/VStack';
import {useAppTheme} from 'app/styles/theme';
import React, {FC, useEffect, useMemo, useRef, useState} from 'react';
import {Pressable, StyleSheet, Keyboard} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {SharedValue} from 'react-native-reanimated';
import {Box, Flex} from 'ui';
import {BottomSheetTextInput, TouchableOpacity} from '@gorhom/bottom-sheet';
import {Edges, SafeAreaView} from 'react-native-safe-area-context';

import PhotosIcon from 'app/assets/icons/compose/photos.svg';
import CameraIcon from 'app/assets/icons/compose/camera.svg';
import PollIcon from 'app/assets/icons/compose/poll.svg';
import HashtagIcon from 'app/assets/icons/compose/hashtag.svg';
import {
  Asset,
  launchImageLibrary,
  launchCamera,
} from 'react-native-image-picker';
import PhotoPreview from './components/PhotoPreview';

interface ILocationsSheetContentProps {
  onLoading?: (loading: boolean) => void;
  animatedIndex: SharedValue<number>;
  onDismiss?: () => void;
  onCanSubmit?: (canSubmit: boolean) => void;
  open: boolean;
}

const charLimit = 120;
const FeedbackSheetContent: FC<ILocationsSheetContentProps> = ({
  onLoading,
  onCanSubmit,
  open,
}) => {
  const [question, setQuestion] = useState('');

  const charsRemaining = useMemo(() => charLimit - question.length, [question]);
  const [edges, setEdges] = useState<Edges>(['bottom', 'right', 'left']);
  const [photos, setPhotos] = useState<Asset[]>([]);
  const inputRef = useRef<TextInput>(null);
  const [loading] = useState(false);
  const theme = useAppTheme();

  useEffect(() => {
    onLoading?.(loading);
  }, [loading, onLoading]);

  useEffect(() => {
    onCanSubmit?.(question.trim().length > 0 && !loading);
  }, [question, loading, onCanSubmit]);

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      () => {
        setEdges(['right', 'left']);
      },
    );
    const keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => {
        setEdges(['bottom', 'right', 'left']);
      },
    );

    return () => {
      keyboardWillHideListener.remove();
      keyboardWillShowListener.remove();
    };
  }, []);

  // const dismissSheet = useCallback(() => {
  //   dismissKeyboard();
  //   onDismiss?.();
  //   fullReset();
  // }, [onDismiss]);

  // const fullReset = () => {
  //   setQuestion('');
  //   setLoading(false);
  // };

  const dismissKeyboard = () => {
    inputRef.current?.blur();
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (open) {
      focusInput();
    }
  }, [open]);

  const openPhotoLibrary = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: true,
        quality: 0.5,
        selectionLimit: 5,
      },
      response => {
        setPhotos(response.assets || []);
      },
    );
  };

  const openCamera = () => {
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

  return (
    <Pressable style={styles.wrapper} onPress={dismissKeyboard}>
      <SafeAreaView style={styles.wrapper} edges={edges}>
        <VStack flex={1} overflow="hidden">
          <VStack flex={1} rowGap="mY">
            <Pressable onPress={focusInput}>
              <Box pt="sY" px="m">
                <BottomSheetTextInput
                  multiline
                  placeholder="What do you want to know?"
                  keyboardType="twitter"
                  editable={!loading}
                  placeholderTextColor={theme.colors.inputPlaceholder}
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

            {photos.length > 0 ? (
              <PhotoPreview
                photos={photos}
                removePhoto={(index: number) => {
                  setPhotos(photos.filter((_, i) => i !== index));
                }}
              />
            ) : (
              <HStack alignItems="center" px="m" columnGap="l">
                <TouchableOpacity hitSlop={8} onPress={openPhotoLibrary}>
                  <PhotosIcon
                    width={26}
                    height={26}
                    fill={theme.colors.inputPlaceholder}
                  />
                </TouchableOpacity>
                <TouchableOpacity hitSlop={8} onPress={openCamera}>
                  <CameraIcon
                    width={26}
                    height={26}
                    fill={theme.colors.inputPlaceholder}
                  />
                </TouchableOpacity>
                <PollIcon
                  width={26}
                  height={26}
                  fill={theme.colors.inputPlaceholder}
                />
                <HashtagIcon
                  width={26}
                  height={26}
                  fill={theme.colors.inputPlaceholder}
                />
                <Flex />
                <Text variant="smallBody" color="inputPlaceholder">
                  {charsRemaining}
                </Text>
              </HStack>
            )}
          </VStack>
        </VStack>
      </SafeAreaView>
    </Pressable>
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

export default FeedbackSheetContent;
