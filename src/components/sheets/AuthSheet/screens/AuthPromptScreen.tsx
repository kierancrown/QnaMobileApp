import {RouteProp, useRoute} from '@react-navigation/native';
import {
  Button,
  Center,
  HStack,
  SafeAreaView,
  Text,
  VStack,
} from 'app/components/common';
import React, {FC, useEffect, useState} from 'react';
import {AuthStackParamList} from '..';
import {useAppSelector} from 'app/redux/store';
import Logo from 'app/assets/logo_new_text.svg';
import {useAppTheme} from 'app/styles/theme';
import TypeWriter from 'react-native-typewriter';
import {ReasonText} from 'app/redux/slices/authSheetSlice';
import {HapticFeedbackTypes} from 'react-native-haptic-feedback';
import {useHaptics} from 'app/hooks/useHaptics';

const AuthPromptScreen: FC = () => {
  const {
    params: {},
  } = useRoute<RouteProp<AuthStackParamList, 'AuthScreen'>>();
  const {triggerHaptic} = useHaptics();
  const theme = useAppTheme();
  const promptReason = useAppSelector(
    state => state.nonPersistent.authSheet.promptReason,
  );
  const [typingDirection, setTypingDirection] = useState<0 | 1 | -1>(1);
  const [reasonText, setReasonText] = useState<string>(
    ReasonText[promptReason],
  );

  useEffect(() => {
    setReasonText(ReasonText[promptReason]);
  }, [promptReason]);

  useEffect(() => {
    console.log({reasonText});
    setTypingDirection(1);
  }, [reasonText]);

  const cycleReasonText = () => {
    setTypingDirection(0);
    setTimeout(() => {
      switch (reasonText) {
        case ReasonText.reply:
          setReasonText(ReasonText.post);
          break;
        case ReasonText.post:
          setReasonText(ReasonText.follow);
          break;
        case ReasonText.follow:
          setReasonText(ReasonText.bookmarks);
          break;
        case ReasonText.bookmarks:
          setReasonText(ReasonText.like);
          break;
        case ReasonText.like:
          setReasonText(ReasonText.reply);
          break;
      }
      setTypingDirection(1);
    }, 100);
  };

  return (
    <SafeAreaView edges={['bottom']}>
      <VStack flex={1} py="mY" px="l" justifyContent="space-between">
        <VStack rowGap="mY" flex={1} py="mY">
          <Logo height={theme.iconSizes.xxxl} width="100%" />
          <Center flex={1} rowGap="mY">
            <VStack>
              <Text variant="authSheetHeader" textAlign="left">
                You must be logged in to
              </Text>
              <HStack
                minHeight={theme.textVariants.authSheetHeader.lineHeight}
                flexWrap="wrap">
                <Text variant="authSheetHeader" color="brand">
                  <TypeWriter
                    typing={typingDirection}
                    onTyped={() => {
                      triggerHaptic({
                        iOS: HapticFeedbackTypes.soft,
                        android: HapticFeedbackTypes.soft,
                      }).then();
                    }}
                    onTypingEnd={() => {
                      if (typingDirection === 1) {
                        setTimeout(() => {
                          setTypingDirection(-1);
                        }, 1000);
                      } else if (typingDirection === -1) {
                        cycleReasonText();
                      }
                    }}>
                    {reasonText}
                  </TypeWriter>
                </Text>
              </HStack>
            </VStack>
          </Center>
        </VStack>

        <VStack rowGap="lY">
          <Button
            variant="primary"
            title="Login"
            titleVariant="bodyBold"
            borderRadius="textInput"
            minWidth="100%"
          />
        </VStack>
      </VStack>
    </SafeAreaView>
  );
};

export default AuthPromptScreen;
