import {RefreshControl} from 'react-native';
import React, {FC, useRef, useState} from 'react';
import {ActivityLoader, Flex, HStack, Text, VStack} from 'ui';

import {Theme} from 'app/styles/theme';
import {useTheme} from '@shopify/restyle';
import {useUser} from 'app/lib/supabase/context/auth';
import {RouteProp, useFocusEffect, useRoute} from '@react-navigation/native';
import {HomeStackParamList} from 'app/navigation/HomeStack';
import {useHiddenTabBar, useTabBarAnimation} from 'app/context/tabBarContext';
import ResponseItem, {
  ESTIMATED_RESPONSE_ITEM_HEIGHT,
  ResponseItemSkeleton,
} from './components/ResponseItem';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import HeaderComponent from './components/Header';
import {FlashList} from '@shopify/flash-list';
import QuestionDetails from './components/QuestionDetails';
import useResponses from './hooks/useResponses';
import {useQuestionDetail} from './hooks/useQuestionDetail';
import ReplySheet from 'app/components/sheets/ReplySheet';
import useSheetHeight from 'app/components/sheets/ReplySheet/utils/useSheetHeight';

const QuestionDetailScreen: FC = () => {
  const {
    params: {questionId, skeletonLayout},
  } = useRoute<RouteProp<HomeStackParamList, 'QuestionDetail'>>();

  const theme = useTheme<Theme>();
  const {user} = useUser();
  useHiddenTabBar();
  const scrollRef = useRef(null);
  const [refreshing] = useState(false);
  const [showReplySheet, setShowReplySheet] = useState(false);
  // Question detail hook
  const {loading, question, hasUpvoted, upvoteQuestion} = useQuestionDetail({
    questionId,
  });
  // Responses hook
  const {
    responses,
    responsesLoading,
    loadingMoreResponses,
    noMoreResponses,
    refreshResponses,
    fetchNextPage,
  } = useResponses({questionId});

  const isOwner = question?.user_id === user?.id;

  const {scrollHandlerWorklet} = useTabBarAnimation({
    scrollToTop: () => {
      if (scrollRef.current) {
        // @ts-ignore
        scrollRef.current.scrollToOffset({offset: 0, animated: true});
      }
    },
  });
  const bottomInset = useSafeAreaInsets().bottom;
  const replySheetHeight = useSheetHeight();
  const [headerHeight, setHeaderHeight] = useState(0);
  const topInset = useSafeAreaInsets().top;

  // const showAnswer = useCallback(() => {
  //   if (!user) {
  //     Alert.alert(
  //       'Login Required',
  //       'You must be logged in to post a response',
  //       [
  //         {
  //           text: 'Login',
  //           onPress: () => {
  //             dispatch(resetAuth());
  //           },
  //           style: 'default',
  //         },
  //         {
  //           text: 'Cancel',
  //           style: 'cancel',
  //         },
  //       ],
  //     );
  //     return;
  //   }
  //   Alert.prompt('New Answer', 'Enter your response', async response => {
  //     if (response) {
  //       const {data, error} = await supabase
  //         .from('responses')
  //         // @ts-expect-error user_meta is not defined
  //         .insert({
  //           question_id: questionId,
  //           response: response,
  //         })
  //         .select();
  //       if (data != null) {
  //         // @ts-expect-error user_meta is not defined
  //         setResponses([data[0], ...responses]);
  //       }
  //       if (error) {
  //         Alert.alert('Error', error.message);
  //       } else {
  //         Alert.alert('Success', 'Response posted');
  //       }
  //     }
  //   });
  // }, [dispatch, questionId, responses, user]);

  useFocusEffect(() => {
    setShowReplySheet(true);

    return () => {
      setShowReplySheet(false);
    };
  });

  return (
    <>
      <Flex>
        <HeaderComponent
          onSize={({height}) => {
            setHeaderHeight(height);
          }}
          isOwner={isOwner}
          responseCount={question?.question_metadata?.response_count ?? 0}
          questionId={questionId}
        />
        <FlashList
          indicatorStyle="white"
          scrollIndicatorInsets={{
            top: headerHeight - topInset,
            bottom: replySheetHeight - bottomInset,
          }}
          data={responses}
          ref={scrollRef}
          keyExtractor={item => item.id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshResponses}
            />
          }
          scrollEventThrottle={16}
          onScroll={({nativeEvent}) => {
            scrollHandlerWorklet(nativeEvent);
          }}
          ListHeaderComponent={
            <QuestionDetails
              loading={loading}
              question={question ?? undefined}
              hasUpvoted={hasUpvoted}
              upvoteQuestion={upvoteQuestion}
              skeletonLayout={skeletonLayout}
            />
          }
          ListHeaderComponentStyle={{
            paddingBottom: theme.spacing.xlY,
          }}
          ListEmptyComponent={
            responsesLoading ? (
              <Flex>
                <ResponseItemSkeleton />
                <ResponseItemSkeleton />
                <ResponseItemSkeleton />
              </Flex>
            ) : null
          }
          refreshing={responsesLoading}
          onRefresh={refreshResponses}
          ListFooterComponent={
            loadingMoreResponses && !responsesLoading ? (
              <HStack
                my="xlY"
                alignItems="center"
                justifyContent="center"
                columnGap="xs">
                <ActivityLoader size="s" />
                <Text variant="medium" color="cardText">
                  Loading more responses...
                </Text>
              </HStack>
            ) : noMoreResponses && responses.length > 0 ? (
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
            paddingTop: theme.spacing.sY + headerHeight,
            paddingBottom: theme.spacing.mY + replySheetHeight,
          }}
          estimatedItemSize={ESTIMATED_RESPONSE_ITEM_HEIGHT}
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
      <ReplySheet
        open={showReplySheet}
        onClose={() => {}}
        onSubmit={() => {}}
        avatarImageUrl={user?.user_metadata?.profile_picture?.path}
        replyingToUsername={question?.user_metadata?.username ?? 'Anonymous'}
        replyingToVerified={question?.user_metadata?.verified ?? false}
      />
    </>
  );
};

export default QuestionDetailScreen;
