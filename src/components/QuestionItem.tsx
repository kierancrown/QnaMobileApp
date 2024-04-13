import React, {FC} from 'react';
import {Box, Center, HStack, Text, VStack} from './common';
import dayjs from 'dayjs';

import AnswersIcon from 'app/assets/icons/Answers.svg';
import HeartIcon from 'app/assets/icons/actions/Heart.svg';
import HeartOutlineIcon from 'app/assets/icons/actions/Heart-Outline.svg';
import TimeIcon from 'app/assets/icons/TimeFive.svg';

import {formatNumber} from 'app/utils/numberFormatter';
import {Theme} from 'app/styles/theme';
import {useTheme} from '@shopify/restyle';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Pressable} from 'react-native';
import Username from './Username';

interface QuestionItemProps {
  onPress: () => void;
  username: string;
  question: string;
  answerCount: number;
  liked?: boolean;
  isOwner?: boolean;
  voteCount: number;
  timestamp: string;
  nsfw?: boolean;
  tags?: string[];
  userVerified?: boolean;
}

const ICON_SIZE = 13;

const QuestionItem: FC<QuestionItemProps> = ({
  onPress,
  username,
  question,
  answerCount,
  voteCount,
  timestamp,
  liked,
  nsfw,
  userVerified,
}) => {
  const theme = useTheme<Theme>();
  const votes = formatNumber(voteCount);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacity.value, {
        duration: 66,
      }),
    };
  }, []);

  const onPressIn = () => {
    opacity.value = 0.66;
  };

  const onPressOut = () => {
    opacity.value = 1;
  };

  return (
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={[animatedStyle]}>
        <VStack
          rowGap="sY"
          px="m"
          py="sY"
          my="xxsY"
          backgroundColor="cardBackground">
          <Text variant="questionBody">
            {question}
            {nsfw && (
              <HStack alignItems="center">
                <Box px="xxs" />
                <Center
                  backgroundColor="destructiveAction"
                  borderRadius="s"
                  px="xxs"
                  py="xxxs">
                  <Text variant="tag" color="foreground">
                    NSFW
                  </Text>
                </Center>
              </HStack>
            )}
          </Text>
          <VStack rowGap="xsY">
            <HStack alignItems="center">
              <Text variant="username" fontWeight="400">
                Asked by{' '}
              </Text>
              <Username
                variant="username"
                fontWeight="600"
                username={username}
                isVerified={userVerified}
              />
            </HStack>
            <HStack alignItems="center" columnGap="s">
              <HStack alignItems="center" columnGap="xxs">
                {liked ? (
                  <HeartIcon
                    fill={theme.colors.cardText}
                    width={ICON_SIZE}
                    height={ICON_SIZE}
                  />
                ) : (
                  <HeartOutlineIcon
                    fill={theme.colors.cardText}
                    width={ICON_SIZE}
                    height={ICON_SIZE}
                  />
                )}
                <Text color="cardText" variant="smaller">
                  {votes}
                </Text>
              </HStack>
              <HStack alignItems="center" columnGap="xxs">
                <AnswersIcon
                  fill={theme.colors.cardText}
                  width={ICON_SIZE}
                  height={ICON_SIZE}
                />
                <Text color="cardText" variant="smaller">
                  {answerCount}
                </Text>
              </HStack>
              <HStack alignItems="center" columnGap="xxs">
                <TimeIcon
                  fill={theme.colors.cardText}
                  width={ICON_SIZE}
                  height={ICON_SIZE}
                />
                <Text color="cardText" variant="smaller">
                  {dayjs(timestamp).fromNow(true)}
                </Text>
              </HStack>
            </HStack>
          </VStack>
        </VStack>
      </Animated.View>
    </Pressable>
  );
};

export default QuestionItem;
