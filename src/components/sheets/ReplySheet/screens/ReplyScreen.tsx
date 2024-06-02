import {RouteProp, useRoute} from '@react-navigation/native';
import Username from 'app/components/Username';
import {Flex, HStack, Text, VStack} from 'app/components/common';
import OfflineAvatar from 'app/components/common/OfflineAvatar';
import Input from 'app/components/common/TextInput';
import {HapticFeedbackTypes, useHaptics} from 'app/hooks/useHaptics';
import {useAppTheme} from 'app/styles/theme';
import React, {FC, useEffect, useMemo, useState} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ReplyStackParamList} from '..';
import {MAX_REPLY_LENGTH} from 'app/constants';
import {useAppDispatch} from 'app/redux/store';
import {setShowBackdrop} from 'app/redux/slices/replySlice';

const ReplyScreen: FC = () => {
  const {
    params: {avatarImageUrl, replyingToUsername, replyingToVerified},
  } = useRoute<RouteProp<ReplyStackParamList, 'ReplyScreen'>>();

  const {triggerHaptic} = useHaptics();
  const [inputFocused, setInputFocused] = useState(false);
  const bottomInset = useSafeAreaInsets().bottom;
  const theme = useAppTheme();
  const dispatch = useAppDispatch();
  const [reply, setReply] = useState<string>('');

  const bottomViewOpacity = useSharedValue(0);
  const bottomViewTranslateY = useSharedValue(-theme.spacing.sY);

  const charsRemaining = useMemo(
    () => MAX_REPLY_LENGTH - reply.length,
    [reply.length],
  );

  useEffect(() => {
    (async () => {
      if (inputFocused) {
        bottomViewOpacity.value = withTiming(1);
        bottomViewTranslateY.value = withTiming(0);
        await triggerHaptic({
          iOS: HapticFeedbackTypes.selection,
          android: HapticFeedbackTypes.effectClick,
        });
      } else {
        bottomViewOpacity.value = withTiming(0);
        bottomViewTranslateY.value = withTiming(-theme.spacing.sY);
      }
    })();
  }, [
    bottomViewOpacity,
    bottomViewTranslateY,
    inputFocused,
    theme.spacing.sY,
    triggerHaptic,
  ]);

  const bottomAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: bottomViewOpacity.value,
      transform: [{translateY: bottomViewTranslateY.value}],
    };
  }, [bottomViewOpacity, bottomViewTranslateY]);

  return (
    <>
      <VStack flex={1} py="mY" px="s">
        <Input
          leftAdornment={<OfflineAvatar size="l" uri={avatarImageUrl} />}
          insideBottomSheet
          placeholder="Reply"
          minWidth="100%"
          clearButton
          onClear={() => {
            setReply('');
          }}
          value={reply}
          onChangeText={setReply}
          onFocus={() => {
            setInputFocused(true);
            dispatch(setShowBackdrop(true));
          }}
          onBlur={() => {
            setInputFocused(false);
            dispatch(setShowBackdrop(false));
          }}
          variant="composeInput"
          borderRadius="pill"
          bg="cardBackground"
          returnKeyType="send"
        />
      </VStack>
      <Animated.View style={bottomAnimatedStyle}>
        <HStack
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          columnGap="xxs"
          alignItems="center"
          px="m"
          height={bottomInset + theme.spacing.sY}>
          <Text variant="body">Replying to</Text>
          <Username
            username={replyingToUsername}
            isVerified={replyingToVerified}
            noHighlight
            variant="bodyBold"
          />
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
      </Animated.View>
    </>
  );
};

export default ReplyScreen;
