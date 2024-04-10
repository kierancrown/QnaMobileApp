import React, {FC} from 'react';
import {Box, Center, Flex, HStack, Text, VStack} from './common';
import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
import relativeTime from 'dayjs/plugin/relativeTime';

import AnswersIcon from 'app/assets/icons/Answers.svg';
import HeartIcon from 'app/assets/icons/actions/Heart.svg';
import HeartOutlineIcon from 'app/assets/icons/actions/Heart-Outline.svg';
import TimeIcon from 'app/assets/icons/TimeFive.svg';

import {formatNumber} from 'app/utils/numberFormatter';
import {Theme} from 'app/styles/theme';
import {useTheme} from '@shopify/restyle';

interface QuestionItemProps {
  username: string;
  question: string;
  answerCount: number;
  liked?: boolean;
  isOwner?: boolean;
  voteCount: number;
  timestamp: string;
  nsfw?: boolean;
  tags?: string[];
}

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'just now',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1d',
    dd: '%dd',
    M: '1mo',
    MM: '%dmo',
    y: '1yr',
    yy: '%dyr',
  },
});

const ICON_SIZE = 16;

const QuestionItem: FC<QuestionItemProps> = ({
  username,
  question,
  answerCount,
  voteCount,
  timestamp,
  liked,
  nsfw,
  isOwner,
}) => {
  const theme = useTheme<Theme>();
  const votes = formatNumber(voteCount);

  return (
    <VStack
      rowGap="xsY"
      px="m"
      py="sY"
      my="xxsY"
      backgroundColor="cardBackground">
      <HStack alignItems="center" justifyContent="space-between">
        <Text variant="username" color={isOwner ? 'brand' : 'foreground'}>
          {username}
        </Text>
      </HStack>
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
          <Text color="cardText" variant="small">
            {votes}
          </Text>
        </HStack>
        <HStack alignItems="center" columnGap="xxs">
          <AnswersIcon
            fill={theme.colors.cardText}
            width={ICON_SIZE}
            height={ICON_SIZE}
          />
          <Text color="cardText" variant="small">
            {answerCount}
          </Text>
        </HStack>
        <Flex />
        <HStack alignItems="center" columnGap="xxs">
          <TimeIcon
            fill={theme.colors.cardText}
            width={ICON_SIZE * 0.8}
            height={ICON_SIZE * 0.8}
          />
          <Text color="cardText" variant="smaller">
            {dayjs(timestamp).fromNow()}
          </Text>
        </HStack>
      </HStack>
    </VStack>
  );
};

export default QuestionItem;
