import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  StyleProp,
  ViewStyle,
} from 'react-native';
import React, {FC, useCallback, useRef, useState} from 'react';
import {useDispatch} from 'react-redux';
import {AppDispatch} from 'app/redux/store';
import {resetAuth} from 'app/redux/slices/authSlice';
import {Box, Button, Center, Flex, HStack, Text, VStack} from 'ui';
import {SharedValue} from 'react-native-reanimated';

import {Theme, useAppTheme} from 'app/styles/theme';
import {useTheme} from '@shopify/restyle';
import {useUser} from 'app/lib/supabase/context/auth';
import {supabase} from 'app/lib/supabase';
import useMount from 'app/hooks/useMount';
import {RouteProp, useFocusEffect, useRoute} from '@react-navigation/native';
import {HomeStackParamList} from 'app/navigation/HomeStack';
import ImageView from 'react-native-image-viewing';

import AnswersIcon from 'app/assets/icons/Answers.svg';
import HeartOutlineIcon from 'app/assets/icons/actions/Heart-Outline.svg';
import LocationIcon from 'app/assets/icons/LocationPin.svg';

import Header from 'app/components/common/QuestionItem/components/Header';

import {
  LargeHeader,
  ScalingView,
  FlashListWithHeaders,
} from '@codeherence/react-native-header';
import {useQuestionDetail} from 'app/hooks/useQuestionDetail';
import {formatNumber} from 'app/utils/numberFormatter';
import ActionBar from './components/ActionBar';
import {useBottomPadding} from 'app/hooks/useBottomPadding';
import {
  FabAction,
  useTabBar,
  useTabBarAnimation,
} from 'app/context/tabBarContext';
import {Responses} from 'app/lib/supabase/queries/questionResponses';
import HeaderComponent from './components/Header';
import Skeleton from 'react-native-reanimated-skeleton';
import {SCREEN_HEIGHT, SCREEN_WIDTH, WINDOW_WIDTH} from '@gorhom/bottom-sheet';
import ResponseItem from 'app/components/common/ResponseItem';
import MediaPreview from 'app/components/QuestionItem/components/MediaPreview';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Color from 'color';

interface ViewerFooterProps {
  imageIndex: number;
  totalImages: number;
}

const ViewerFooter: FC<ViewerFooterProps> = ({imageIndex, totalImages}) => {
  const theme = useAppTheme();
  const bottomInset = useSafeAreaInsets().bottom;
  const bottomColor = Color(theme.colors.mainBackground).alpha(0.4).hexa();

  return (
    <Center style={{paddingBottom: bottomInset}}>
      <Center
        borderRadius="pill"
        px="m"
        py="xsY"
        style={{backgroundColor: bottomColor}}>
        <Text variant="smallBodyBold" color="cardText">
          {imageIndex + 1} / {totalImages}
        </Text>
      </Center>
    </Center>
  );
};

const LargeHeaderComponent = ({scrollY}: {scrollY: SharedValue<number>}) => {
  const {
    params: {questionId},
  } = useRoute<RouteProp<HomeStackParamList, 'QuestionDetail'>>();
  const {loading, question, hasUpvoted, upvoteQuestion} = useQuestionDetail({
    questionId,
  });
  const theme = useTheme<Theme>();
  const {setFabAction} = useTabBar();
  const [bookmarked, setBookmarked] = useState(false);
  const [viewerVisible, setIsVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const ICON_SIZE = theme.iconSizes.m;

  const mediaUrls =
    question?.question_metadata.media?.map(path => {
      return supabase.storage.from('question_attatchments').getPublicUrl(path)
        .data.publicUrl;
    }) || [];

  const headerStyle: StyleProp<ViewStyle> = {
    paddingVertical: 0,
    paddingHorizontal: 0,
    marginBottom: theme.spacing.mY,
  };

  const scalingViewStyle: StyleProp<ViewStyle> = {
    flex: 1,
  };

  useFocusEffect(() => {
    setFabAction(FabAction.REPLY);

    return () => {
      setFabAction(FabAction.ADD);
    };
  });

  return question ? (
    <LargeHeader headerStyle={headerStyle}>
      <ImageView
        images={mediaUrls.map(url => ({uri: url}))}
        imageIndex={viewerIndex}
        visible={viewerVisible}
        backgroundColor={theme.colors.mainBackground}
        // eslint-disable-next-line react/no-unstable-nested-components
        FooterComponent={({imageIndex}) => (
          <ViewerFooter
            imageIndex={imageIndex}
            totalImages={mediaUrls.length}
          />
        )}
        onRequestClose={() => setIsVisible(false)}
      />
      <ScalingView scrollY={scrollY} style={scalingViewStyle}>
        <VStack rowGap="sY" px="m">
          <VStack rowGap="sY">
            {question?.user_id && question.created_at && (
              <Header
                userId={question.user_id}
                loading={loading}
                username={question.user_metadata?.username ?? 'Anonymous'}
                verified={question.user_metadata?.verified ?? false}
                avatarImage={{
                  uri:
                    question.user_metadata?.profile_picture?.path ?? undefined,
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
                    {formatNumber(
                      question?.question_metadata?.upvote_count || 0,
                    )}
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
      </ScalingView>
    </LargeHeader>
  ) : null;
};

const ESTIMATED_PAGE_SIZE = parseInt(
  ((SCREEN_HEIGHT * 2) / 100).toFixed(0),
  10,
);

const QuestionDetail: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme<Theme>();
  const {user} = useUser();
  const {fabEventEmitter} = useTabBar();

  const scrollRef = useRef(null);
  const {scrollHandlerWorklet} = useTabBarAnimation({
    scrollToTop: () => {
      if (scrollRef.current) {
        // @ts-ignore
        scrollRef.current.scrollToOffset({offset: 0, animated: true});
      }
    },
  });

  const {
    params: {questionId},
  } = useRoute<RouteProp<HomeStackParamList, 'QuestionDetail'>>();

  const [responses, setResponses] = useState<Responses>([]);
  const [offset, setOffset] = useState(0);
  const [loadingMoreResponses, setLoadingMoreResponses] = useState(false);
  const [noMoreResponses, setNoMoreResponses] = useState(false);
  const bottomListPadding = useBottomPadding(theme.spacing.mY);
  // const [loading, setLoading] = useState(true);
  const [refreshing] = useState(false);
  const [responsesLoading, setResponsesLoading] = useState(true);

  const refreshResponses = async () => {
    setResponsesLoading(true);
    const {data, error} = await supabase
      .from('responses')
      .select(
        `
      *,
      user_metadata (
        verified,
        profile_picture (
          path,
          thumbhash
        ),
        username
      )
    `,
      )
      .eq('question_id', questionId)
      .order('created_at', {ascending: false})
      .range(0, ESTIMATED_PAGE_SIZE);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setResponses(data || []);
    }
    // setLoading(false);
  };

  useMount(refreshResponses);

  const fetchNextPage = async () => {
    setLoadingMoreResponses(true);
    const prevOffset = offset;
    const {data, error} = await supabase
      .from('responses')
      .select(
        `
    *,
    user_metadata (
      verified,
      profile_picture (
        path,
        thumbhash
      ),
      username
    )
  `,
      )
      .eq('question_id', questionId)
      .order('created_at', {ascending: false})
      .range(prevOffset, prevOffset + ESTIMATED_PAGE_SIZE);

    setLoadingMoreResponses(false);

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    if (data) {
      // Filter out duplicates
      const mergedData = [...responses, ...data].reduce(
        (unique: Responses, item) => {
          if (!unique.some(response => response.id === item.id)) {
            unique.push(item);
          }
          return unique;
        },
        [],
      );

      if (data.length === 0) {
        setNoMoreResponses(true);
      } else {
        if (noMoreResponses) {
          setNoMoreResponses(false);
        }
        setResponses(mergedData);
        setOffset(prevOffset + data.length); // Update offset
      }
    } else {
      setNoMoreResponses(true);
    }
  };

  const showAnswer = useCallback(() => {
    if (!user) {
      Alert.alert(
        'Login Required',
        'You must be logged in to post a response',
        [
          {
            text: 'Login',
            onPress: () => {
              dispatch(resetAuth());
            },
            style: 'default',
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
      );
      return;
    }
    Alert.prompt('New Answer', 'Enter your response', async response => {
      if (response) {
        const {data, error} = await supabase
          .from('responses')
          // @ts-expect-error user_meta is not defined
          .insert({
            question_id: questionId,
            response: response,
          })
          .select();
        if (data != null) {
          // @ts-expect-error user_meta is not defined
          setResponses([data[0], ...responses]);
        }
        if (error) {
          Alert.alert('Error', error.message);
        } else {
          Alert.alert('Success', 'Response posted');
        }
      }
    });
  }, [dispatch, questionId, responses, user]);

  useFocusEffect(() => {
    const listener = fabEventEmitter.addListener('ctaPress', showAnswer);
    return () => {
      listener.remove();
    };
  });

  return (
    <Flex>
      <FlashListWithHeaders
        HeaderComponent={HeaderComponent}
        LargeHeaderComponent={LargeHeaderComponent}
        indicatorStyle="white"
        data={responses}
        ref={scrollRef}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshResponses}
          />
        }
        onScrollWorklet={scrollHandlerWorklet}
        ListEmptyComponent={
          <Center flex={1}>
            <Text variant="medium" my="xlY" color="cardText">
              No responses yet
            </Text>
            <Button onPress={showAnswer} variant="primary" title="Answer" />
          </Center>
        }
        refreshing={responsesLoading}
        onRefresh={refreshResponses}
        ListFooterComponent={
          loadingMoreResponses ? (
            <HStack my="xlY" justifyContent="center" columnGap="xs">
              <ActivityIndicator size="small" />
              <Text variant="medium" color="cardText">
                Loading more responses...
              </Text>
            </HStack>
          ) : noMoreResponses ? (
            <VStack my="xlY" alignItems="center">
              <Text variant="medium" color="cardText">
                Insert cool statement here
              </Text>
              <Text variant="smallBody" color="cardText">
                You've reached the end cheif
              </Text>
            </VStack>
          ) : null
        }
        contentContainerStyle={{
          paddingTop: theme.spacing.sY,
          paddingBottom: bottomListPadding,
        }}
        estimatedItemSize={100}
        onEndReachedThreshold={0.5}
        onEndReached={fetchNextPage}
        renderItem={({item}) => (
          <ResponseItem
            avatarImage={{
              // @ts-expect-error user_meta is not defined
              uri: item.user_metadata?.profile_picture?.path ?? undefined,
              blurhash:
                // @ts-expect-error user_meta is not defined
                item.user_metadata?.profile_picture?.thumbhash ?? undefined,
            }}
            response={item.response}
            likes={0}
            timestamp={item.created_at}
            username={item.user_metadata?.username ?? 'Anonymous'}
            verified={item.user_metadata?.verified ?? false}
            userId={item.user_id}
            isOwner={item.user_id === user?.id}
          />
        )}
      />
    </Flex>
  );
};

export default QuestionDetail;
