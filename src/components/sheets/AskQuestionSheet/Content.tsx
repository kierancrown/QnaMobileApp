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
import {Box, Flex, Button, Center} from 'ui';
import SegmentedControl from '../../SegmentedControl';
import {BottomSheetTextInput} from '@gorhom/bottom-sheet';
import {Edges, SafeAreaView} from 'react-native-safe-area-context';
import {supabase} from 'app/lib/supabase';

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
    if (question.trim().length === 0) {
      return;
    }
    setLoading(true);
    supabase
      .from('questions')
      .insert({
        username: 'kieran',
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
        <VStack flex={1} px="m">
          <HStack alignItems="center" py="mY" px="xs" mb="s">
            <Pressable hitSlop={16} onPress={dismissSheet}>
              <Center>
                <Animated.View style={animatedChevronStyles}>
                  <Icon icon={<ChevronUp />} color="foreground" size="l" />
                </Animated.View>
              </Center>
            </Pressable>
            <Flex />
            <Text variant="navbarTitle">Submit Question</Text>
            <Flex />
            <Center>
              <Box width={theme.spacing.l} height={theme.spacing.l} />
            </Center>
          </HStack>

          <SegmentedControl
            segments={['Question', 'Poll']}
            currentIndex={selectedType}
            containerMargin={theme.spacing.m}
            onChange={setSelectedType}
          />

          <VStack flex={1} my="xlY" rowGap="m">
            <Pressable onPress={focusInput}>
              <Box
                py="sY"
                px="m"
                backgroundColor="inputBackground"
                borderRadius="l">
                <BottomSheetTextInput
                  multiline
                  placeholder='Start your question with "What if..." or "How do I..." etc'
                  editable={!loading}
                  placeholderTextColor={theme.colors.inputPlaceholder}
                  ref={inputRef}
                  style={[
                    styles.input,
                    {
                      ...theme.textVariants.largeInput,
                      color: theme.colors.foreground,
                      minHeight: theme.spacing.xxxlY,
                    },
                  ]}
                  cursorColor={theme.colors.foreground}
                  onChangeText={setQuestion}
                  value={question}
                />
                <Box
                  position="absolute"
                  right={theme.spacing.s}
                  bottom={theme.spacing.sY}>
                  <Text variant="tiny" color="inputPlaceholder">
                    {charsRemaining}
                  </Text>
                </Box>
              </Box>
            </Pressable>
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
