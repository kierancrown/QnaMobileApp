import {HStack, Text, VStack} from 'app/components/common';
import {ReasonText} from 'app/redux/slices/authSheetSlice';
import {useAppSelector} from 'app/redux/store';
import {useAppTheme} from 'app/styles/theme';
import React, {FC, useEffect, useState} from 'react';
import TypeWriter from 'react-native-typewriter';

interface TypewriterProps {
  enabled: boolean;
}

export const Typewriter: FC<TypewriterProps> = ({enabled}) => {
  const theme = useAppTheme();
  const {promptReason} = useAppSelector(state => state.nonPersistent.authSheet);

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
    if (enabled) {
      setTypingDirection(1);
    } else {
      setTypingDirection(0);
    }
  }, [enabled]);

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
      if (!enabled) {
        setTypingDirection(0);
        return;
      }
    }, 100);
  };

  return (
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
              if (!enabled) {
                return;
              }
              if (typingDirection === 1) {
                setTimeout(() => {
                  if (!enabled) {
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
  );
};
