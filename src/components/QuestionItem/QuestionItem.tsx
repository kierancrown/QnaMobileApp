import React, {FC} from 'react';
import {Box, Center, Flex, HStack, Text, VStack} from '../common';

import AnswersIcon from 'app/assets/icons/Answers.svg';
import HeartIcon from 'app/assets/icons/actions/Heart.svg';
import HeartOutlineIcon from 'app/assets/icons/actions/Heart-Outline.svg';
import LocationIcon from 'app/assets/icons/LocationPin.svg';

import {formatNumber} from 'app/utils/numberFormatter';
import {Theme} from 'app/styles/theme';
import {useTheme} from '@shopify/restyle';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Platform, Pressable} from 'react-native';

import Header from 'app/screens/QuestionDetail/components/QuestionDetails/components/Header';
import MediaPreview from './components/MediaPreview';

interface QuestionItemProps {
  onPress: () => void;
  id: number;
  userId: string;
  username: string;
  question: string;
  body?: string;
  answerCount: number;
  liked?: boolean;
  isOwner?: boolean;
  voteCount: number;
  timestamp: string;
  nsfw?: boolean;
  location?: string;
  topics?: string[];
  userVerified?: boolean;
  media: string[] | null;
  avatarImage: {
    uri?: string;
    blurhash?: string;
  };
}

const QuestionItem: FC<QuestionItemProps> = ({
  onPress,
  id,
  userId,
  username,
  userVerified,
  question,
  body,
  topics,
  answerCount,
  voteCount,
  timestamp,
  liked,
  nsfw,
  location,
  media,
  isOwner,
  avatarImage,
}) => {
  const theme = useTheme<Theme>();
  const votes = formatNumber(voteCount);
  const answers = formatNumber(answerCount);
  const opacity = useSharedValue(1);

  const ICON_SIZE = theme.iconSizes.m;
  const mediaUrls = media ?? [];

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
          mx={Platform.select({
            ios: 'xs',
            android: 's',
          })}
          borderRadius="xl"
          backgroundColor="cardBackground">
          <Header
            userId={userId}
            username={username}
            verified={userVerified ?? false}
            avatarImage={avatarImage}
            timestamp={timestamp}
            isOwner={isOwner}
            questionId={id}
          />

          {/* Main question body */}
          <VStack rowGap="xsY">
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

            {body && (
              <Text
                variant="questionDetail"
                numberOfLines={4}
                ellipsizeMode="tail">
                {body}
              </Text>
            )}

            {/* Media */}
            {mediaUrls.length > 0 && <MediaPreview media={mediaUrls} />}

            {/* Topics */}
            <HStack columnGap="xxs">
              {topics?.map(topic => (
                <Text key={topic} variant="tag" color="cardText">
                  #{topic}
                </Text>
              ))}
            </HStack>
          </VStack>

          {/* Question metadata: likes, comments, etc */}
          <VStack rowGap="xsY">
            <HStack alignItems="center" columnGap="s">
              <HStack alignItems="center" columnGap="xxs">
                {liked ? (
                  <HeartIcon
                    fill={theme.colors.heartAction}
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
                <Text color="cardText" variant="smallBody">
                  {votes}
                </Text>
              </HStack>
              <HStack alignItems="center" columnGap="xxs">
                <AnswersIcon
                  fill={theme.colors.cardText}
                  width={ICON_SIZE}
                  height={ICON_SIZE}
                />
                <Text color="cardText" variant="smallBody">
                  {answers}
                </Text>
              </HStack>
              <Flex />
              {location && (
                <HStack alignItems="center" columnGap="xxs">
                  <LocationIcon
                    fill={theme.colors.cardText}
                    width={ICON_SIZE}
                    height={ICON_SIZE}
                  />
                  <Text color="cardText" variant="small">
                    {location}
                  </Text>
                </HStack>
              )}
            </HStack>
          </VStack>
        </VStack>
      </Animated.View>
    </Pressable>
  );
};

export default QuestionItem;
