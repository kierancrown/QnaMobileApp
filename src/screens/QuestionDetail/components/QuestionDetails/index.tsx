import React, {FC, useState} from 'react';
import {Box, Center, Flex, HStack, Text, VStack} from 'app/components/common';
import {useAppTheme} from 'app/styles/theme';
import MediaViewer from './components/MediaViewer';
import QuestionItemHeader from './components/Header';
import Skeleton from 'react-native-reanimated-skeleton';
import {SCREEN_WIDTH, WINDOW_WIDTH} from '@gorhom/bottom-sheet';
import MediaPreview from 'app/components/QuestionItem/components/MediaPreview';
import {formatNumber} from 'app/utils/numberFormatter';

import AnswersIcon from 'app/assets/icons/Answers.svg';
import HeartOutlineIcon from 'app/assets/icons/actions/Heart-Outline.svg';
import LocationIcon from 'app/assets/icons/LocationPin.svg';
import ActionBar from './components/ActionBar';
import {QuestionsDetailData} from 'app/lib/supabase/queries/questionDetail';

interface QuestionDetailsProps {
  loading: boolean;
  question?: QuestionsDetailData;
  hasUpvoted: boolean;
  upvoteQuestion: () => Promise<boolean>;
}

const QuestionDetails: FC<QuestionDetailsProps> = ({
  loading,
  question,
  hasUpvoted,
  upvoteQuestion,
}) => {
  const theme = useAppTheme();
  const [bookmarked, setBookmarked] = useState(false);
  const [viewerVisible, setIsVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const ICON_SIZE = theme.iconSizes.m;
  const mediaUrls = question?.question_metadata?.media || [];

  return question ? (
    <VStack>
      <MediaViewer
        mediaUrls={mediaUrls}
        selectedIndex={viewerIndex}
        isVisible={viewerVisible}
        onClose={() => setIsVisible(false)}
      />
      <VStack rowGap="sY" px="m">
        <VStack rowGap="sY">
          {question?.user_id && question.created_at && (
            <QuestionItemHeader
              userId={question.user_id}
              loading={loading}
              username={question.user_metadata?.username ?? 'Anonymous'}
              verified={question.user_metadata?.verified ?? false}
              avatarImage={{
                uri: question.user_metadata?.profile_picture?.path ?? undefined,
                blurhash:
                  question.user_metadata?.profile_picture?.thumbhash ??
                  undefined,
              }}
              timestamp={question.created_at}
              hideActions
            />
          )}
          <VStack rowGap="xxsY">
            <Skeleton
              containerStyle={{
                padding: theme.spacing.none,
              }}
              isLoading={loading}
              boneColor={theme.colors.skeletonBackground}
              highlightColor={theme.colors.skeleton}
              layout={[
                {
                  width: SCREEN_WIDTH * 0.77,
                  height: theme.textVariants.medium.lineHeight,
                  borderRadius: theme.borderRadii.s,
                  marginBottom: theme.spacing.xsY,
                },
              ]}>
              <Text variant="medium">
                {question?.question}
                {question?.nsfw && (
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
            </Skeleton>

            {question?.body && (
              <Skeleton
                containerStyle={{
                  padding: theme.spacing.none,
                }}
                isLoading={loading}
                boneColor={theme.colors.skeletonBackground}
                highlightColor={theme.colors.skeleton}
                layout={[
                  {
                    width: SCREEN_WIDTH * 0.93 - theme.spacing.m * 2,
                    height: theme.textVariants.smallBody.fontSize,
                    borderRadius: theme.borderRadii.s,
                    marginBottom: theme.spacing.xxsY,
                  },
                  {
                    width: SCREEN_WIDTH * 0.97 - theme.spacing.m * 2,
                    height: theme.textVariants.smallBody.fontSize,
                    borderRadius: theme.borderRadii.s,
                    marginBottom: theme.spacing.xxsY,
                  },
                  {
                    width: SCREEN_WIDTH * 0.88 - theme.spacing.m * 2,
                    height: theme.textVariants.smallBody.fontSize,
                    borderRadius: theme.borderRadii.s,
                    marginBottom: theme.spacing.xxsY,
                  },
                  {
                    width: SCREEN_WIDTH * 0.99 - theme.spacing.m * 2,
                    height: theme.textVariants.smallBody.fontSize,
                    borderRadius: theme.borderRadii.s,
                    marginBottom: theme.spacing.xxsY,
                  },
                ]}>
                <Text variant="smallBody">{question.body}</Text>
              </Skeleton>
            )}

            {mediaUrls.length > 0 && (
              <Skeleton
                containerStyle={{
                  padding: theme.spacing.none,
                }}
                isLoading={loading}
                boneColor={theme.colors.skeletonBackground}
                highlightColor={theme.colors.skeleton}
                layout={[
                  {
                    width: WINDOW_WIDTH - theme.spacing.m * 2,
                    height: WINDOW_WIDTH - theme.spacing.m * 2,
                    borderRadius: theme.borderRadii.m,
                    marginBottom: theme.spacing.xxsY,
                  },
                ]}>
                <MediaPreview
                  media={mediaUrls}
                  isTouchEnabled
                  onImageTouch={index => {
                    setIsVisible(true);
                    setViewerIndex(index);
                  }}
                />
              </Skeleton>
            )}
          </VStack>
        </VStack>
        <VStack rowGap="sY">
          <Skeleton
            isLoading={loading}
            containerStyle={{}}
            boneColor={theme.colors.skeletonBackground}
            highlightColor={theme.colors.skeleton}
            layout={[
              {
                key: 'line1',
                height:
                  theme.textVariants.username.fontSize + theme.spacing.xxsY,
                width: '42%',
              },
            ]}>
            <HStack alignItems="center" columnGap="s">
              <HStack alignItems="center" columnGap="xxs">
                <HeartOutlineIcon
                  fill={theme.colors.cardText}
                  width={ICON_SIZE}
                  height={ICON_SIZE}
                />
                <Text color="cardText" variant="small">
                  {formatNumber(question?.question_metadata?.upvote_count || 0)}
                </Text>
              </HStack>
              <HStack alignItems="center" columnGap="xxs">
                <AnswersIcon
                  fill={theme.colors.cardText}
                  width={ICON_SIZE}
                  height={ICON_SIZE}
                />
                <Text color="cardText" variant="small">
                  {formatNumber(
                    question?.question_metadata?.response_count || 0,
                  )}
                </Text>
              </HStack>
              <Flex />
              {question?.question_metadata?.location && (
                <HStack alignItems="center" columnGap="xxs">
                  <LocationIcon
                    fill={theme.colors.cardText}
                    width={ICON_SIZE}
                    height={ICON_SIZE}
                  />
                  <Text color="cardText" variant="small">
                    {question.question_metadata.location.name}
                  </Text>
                </HStack>
              )}
            </HStack>
          </Skeleton>
          <ActionBar
            isLiked={hasUpvoted}
            isBookmarked={bookmarked}
            onLike={async () => {
              await upvoteQuestion();
            }}
            onBookmark={() => {
              setBookmarked(!bookmarked);
            }}
          />
        </VStack>
      </VStack>
    </VStack>
  ) : null;
};

export default QuestionDetails;
