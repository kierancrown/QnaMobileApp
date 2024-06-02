import React, {FC, useState} from 'react';
import {Box, Center, Flex, HStack, Text, VStack} from 'app/components/common';
import {useAppTheme} from 'app/styles/theme';
import MediaViewer from './components/MediaViewer';
import QuestionItemHeader, {
  QuestionItemHeaderSkeleton,
} from './components/Header';
import Skeleton from 'react-native-reanimated-skeleton';
import {SCREEN_WIDTH, WINDOW_WIDTH} from '@gorhom/bottom-sheet';
import MediaPreview from 'app/components/QuestionItem/components/MediaPreview';
import {formatNumber} from 'app/utils/numberFormatter';

import AnswersIcon from 'app/assets/icons/Answers.svg';
import HeartOutlineIcon from 'app/assets/icons/actions/Heart-Outline.svg';
import HeartIcon from 'app/assets/icons/actions/Heart.svg';
import LocationIcon from 'app/assets/icons/LocationPin.svg';
import {QuestionsDetailData} from 'app/lib/supabase/queries/questionDetail';
import {Pressable} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {HapticFeedbackTypes, useHaptics} from 'app/hooks/useHaptics';

interface QuestionDetailsProps {
  loading: boolean;
  question?: QuestionsDetailData;
  hasUpvoted: boolean;
  upvoteQuestion: () => Promise<boolean>;
  skeletonLayout?: {
    hasMedia?: boolean;
    hasBody?: boolean;
    hasLocation?: boolean;
  };
}

const QuestionDetails: FC<QuestionDetailsProps> = ({
  loading,
  question,
  hasUpvoted,
  upvoteQuestion,
  skeletonLayout,
}) => {
  const theme = useAppTheme();
  const [viewerVisible, setIsVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const ICON_SIZE = theme.iconSizes.intermediate;
  const mediaUrls = question?.question_metadata?.media || [];
  const {triggerHaptic} = useHaptics();

  const heartScale = useSharedValue(1);
  const heartAnimatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: heartScale.value,
        },
      ],
    };
  }, []);

  return question && !loading ? (
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
              questionId={question.id}
              hideActions
            />
          )}
          <VStack rowGap="xxsY">
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

            {question?.body && <Text variant="smallBody">{question.body}</Text>}

            {mediaUrls.length > 0 && (
              <VStack py="xsY">
                <MediaPreview
                  media={mediaUrls}
                  isTouchEnabled
                  onImageTouch={index => {
                    setIsVisible(true);
                    setViewerIndex(index);
                  }}
                />
              </VStack>
            )}
          </VStack>
        </VStack>
        <VStack rowGap="sY">
          <HStack alignItems="center" columnGap="s">
            <Pressable
              hitSlop={16}
              onPressIn={() => {
                heartScale.value = withTiming(0.9, {duration: 88});
              }}
              onPressOut={() => {
                heartScale.value = withTiming(1, {duration: 88});
              }}
              onPress={async () => {
                await triggerHaptic({
                  iOS: HapticFeedbackTypes.selection,
                  android: HapticFeedbackTypes.effectClick,
                });
                await upvoteQuestion();
              }}>
              <HStack alignItems="center" columnGap="xxs">
                <Animated.View style={heartAnimatedStyles}>
                  {hasUpvoted ? (
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
                </Animated.View>
                <Text color="cardText" variant="bodyBold">
                  {formatNumber(question?.question_metadata?.upvote_count || 0)}
                </Text>
              </HStack>
            </Pressable>

            <HStack alignItems="center" columnGap="xxs">
              <AnswersIcon
                fill={theme.colors.cardText}
                width={ICON_SIZE}
                height={ICON_SIZE}
              />
              <Text color="cardText" variant="bodyBold">
                {formatNumber(question?.question_metadata?.response_count || 0)}
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
                <Text color="cardText" variant="bodyBold">
                  {question.question_metadata.location.name}
                </Text>
              </HStack>
            )}
          </HStack>
        </VStack>
      </VStack>
    </VStack>
  ) : (
    <QuestionDetailsSkeleton
      hasMedia={skeletonLayout?.hasMedia}
      hasBody={skeletonLayout?.hasBody}
      hasLocation={skeletonLayout?.hasLocation}
    />
  );
};

interface QuestionDetailsSkeletonProps {
  hasMedia?: boolean;
  hasBody?: boolean;
  hasLocation?: boolean;
}

const QuestionDetailsSkeleton: FC<QuestionDetailsSkeletonProps> = ({
  hasMedia,
  hasBody,
  hasLocation,
}) => {
  const theme = useAppTheme();

  return (
    <VStack minWidth="100%">
      <VStack rowGap="sY" px="m">
        <VStack rowGap="sY">
          <QuestionItemHeaderSkeleton />
          <VStack rowGap="xxsY">
            <Skeleton
              containerStyle={{
                padding: theme.spacing.none,
              }}
              isLoading
              boneColor={theme.colors.skeletonBackground}
              highlightColor={theme.colors.skeleton}
              layout={[
                {
                  width: SCREEN_WIDTH * 0.77,
                  height: theme.textVariants.medium.lineHeight,
                  borderRadius: theme.borderRadii.s,
                  marginBottom: theme.spacing.xsY,
                },
              ]}
            />
            {hasBody && (
              <Skeleton
                containerStyle={{
                  padding: theme.spacing.none,
                }}
                isLoading
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
                ]}
              />
            )}
            {hasMedia && (
              <Skeleton
                containerStyle={{
                  padding: theme.spacing.none,
                }}
                isLoading
                boneColor={theme.colors.skeletonBackground}
                highlightColor={theme.colors.skeleton}
                layout={[
                  {
                    width: WINDOW_WIDTH - theme.spacing.m * 2,
                    height: WINDOW_WIDTH - theme.spacing.m * 2,
                    borderRadius: theme.borderRadii.m,
                    marginBottom: theme.spacing.xxsY,
                  },
                ]}
              />
            )}
          </VStack>
        </VStack>
        <VStack rowGap="sY">
          <HStack>
            <Skeleton
              isLoading
              boneColor={theme.colors.skeletonBackground}
              highlightColor={theme.colors.skeleton}
              layout={[
                {
                  key: 'line1',
                  height:
                    theme.textVariants.username.fontSize + theme.spacing.xxsY,
                  width: '100%',
                },
              ]}
            />
            <Flex />
            {hasLocation && (
              <Skeleton
                isLoading
                boneColor={theme.colors.skeletonBackground}
                highlightColor={theme.colors.skeleton}
                layout={[
                  {
                    key: 'line2',
                    height:
                      theme.textVariants.username.fontSize + theme.spacing.xxsY,
                    width: '100%',
                  },
                ]}
              />
            )}
          </HStack>
        </VStack>
      </VStack>
    </VStack>
  );
};

export default QuestionDetails;
