import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
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
import {SCREEN_HEIGHT} from '@gorhom/bottom-sheet';

const AuthPromptScreen: FC = () => {
  const {
    params: {},
  } = useRoute<RouteProp<AuthStackParamList, 'AuthScreen'>>();
  const theme = useAppTheme();
  const {promptReason, sheetOpen} = useAppSelector(
    state => state.nonPersistent.authSheet,
  );
  const {navigate} = useNavigation<NavigationProp<AuthStackParamList>>();
  const [typingDirection, setTypingDirection] = useState<0 | 1 | -1>(1);
  const [reasonText, setReasonText] = useState<string>(
    ReasonText[promptReason],
  );

  useEffect(() => {
    setReasonText(ReasonText[promptReason]);
  }, [promptReason]);

  useEffect(() => {
    setTypingDirection(1);
  }, [reasonText]);

  useEffect(() => {
    if (sheetOpen) {
      setTypingDirection(1);
    } else {
      setTypingDirection(0);
    }
  }, [sheetOpen]);

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
      if (!sheetOpen) {
        setTypingDirection(0);
        return;
      }
    }, 100);
  };

  return (
    <SafeAreaView edges={['bottom']} style={{maxHeight: SCREEN_HEIGHT / 2}}>
      <VStack flex={1} py="mY" px="l" justifyContent="space-between">
        <VStack rowGap="mY" flex={1} py="mY">
          <Logo height={theme.iconSizes.xxxl} width="100%" />
          <Center flex={1} rowGap="mY">
            <VStack minWidth="100%">
              <Text variant="authSheetHeader" textAlign="left">
                You must be logged in to
              </Text>
              <HStack
                minWidth="100%"
                minHeight={theme.textVariants.authSheetHeader.lineHeight}
                flexWrap="wrap">
                <Text variant="authSheetHeader" color="brand">
                  <TypeWriter
                    typing={typingDirection}
                    onTypingEnd={() => {
                      if (!sheetOpen) {
                        return;
                      }
                      if (typingDirection === 1) {
                        setTimeout(() => {
                          if (!sheetOpen) {
                            return;
                          }
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
            // @ts-ignore
            onPress={() => navigate('AuthScreen')}
          />
        </VStack>
      </VStack>
    </SafeAreaView>
  );
};

export default AuthPromptScreen;
