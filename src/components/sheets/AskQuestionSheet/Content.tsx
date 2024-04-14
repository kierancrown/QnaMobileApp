import HStack from 'app/components/common/HStack';
import Text from 'app/components/common/Text';
import VStack from 'app/components/common/VStack';
import {useAppTheme} from 'app/styles/theme';
import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {Pressable, StyleSheet, Keyboard, Alert} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import Animated, {
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import ChevronUp from 'app/assets/icons/arrows/chevron-up.svg';
import Icon from 'app/components/common/Icon';
import {Box, Button} from 'ui';
import {BottomSheetTextInput} from '@gorhom/bottom-sheet';
import {Edges, SafeAreaView} from 'react-native-safe-area-context';
import {supabase} from 'app/lib/supabase';
import {useUsername} from 'app/hooks/useUsername';

import PhotosIcon from 'app/assets/icons/compose/photos.svg';
import CameraIcon from 'app/assets/icons/compose/camera.svg';
import PollIcon from 'app/assets/icons/compose/poll.svg';
import HashtagIcon from 'app/assets/icons/compose/hashtag.svg';

interface ILocationsSheetContentProps {
  onLoading?: (loading: boolean) => void;
  animatedIndex: SharedValue<number>;
  onDismiss?: () => void;
  open: boolean;
}

const charLimit = 500;
const FeedbackSheetContent: FC<ILocationsSheetContentProps> = ({
  onLoading,
  animatedIndex,
  onDismiss,
  open,
}) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const charsRemaining = useMemo(() => charLimit - question.length, [question]);
  const inputRef = useRef<TextInput>(null);
  const theme = useAppTheme();
  const {username} = useUsername();

  const [selectedType, setSelectedType] = useState<number>(0);
  const [edges, setEdges] = useState<Edges>(['bottom', 'right', 'left']);

  useEffect(() => {
    onLoading?.(loading);
  }, [loading, onLoading]);

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

  const dismissSheet = useCallback(() => {
    dismissKeyboard();
    onDismiss?.();
    fullReset();
  }, [onDismiss]);

  const fullReset = () => {
    setQuestion('');
    setSelectedType(0);
    setLoading(false);
  };

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

  const submit = () => {
    if (question.trim().length === 0 || !username) {
      return;
    }
    setLoading(true);
    supabase
      .from('questions')
      .insert({
        question: question,
        tags: [],
      })
      .select()
      .then(({data, error}) => {
        if (data) {
          // TODO: add new message to top of list
        }
        if (error) {
          Alert.alert('Error', error.message);
        } else {
          // TODO: Show success message
          dismissSheet();
        }
        setLoading(false);
      });
  };

  const animatedChevronStyles = useAnimatedStyle(() => {
    const deg = interpolate(animatedIndex.value, [-1, 0], [0, 180]);
    return {
      transform: [{rotate: `${deg}deg`}],
    };
  }, []);

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
                <Box
                  position="absolute"
                  right={theme.spacing.s}
                  bottom={theme.spacing.mY}>
                  <Text variant="tiny" color="inputPlaceholder">
                    {charsRemaining}
                  </Text>
                </Box>
              </Box>
            </Pressable>

            <HStack alignItems="center" px="m" columnGap="l">
              <PhotosIcon
                width={26}
                height={26}
                fill={theme.colors.inputPlaceholder}
              />
              <CameraIcon
                width={26}
                height={26}
                fill={theme.colors.inputPlaceholder}
              />
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
            </HStack>
          </VStack>

          <Box py="sY">
            <Button
              title="Submit"
              loading={loading}
              disabled={question.trim().length === 0}
              onPress={submit}
            />
          </Box>
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
