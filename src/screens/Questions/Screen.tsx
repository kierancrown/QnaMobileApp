import {RefreshControl} from 'react-native';
import React, {FC, useRef, useState} from 'react';
import {ActivityLoader, Center, Flex} from 'ui';

import {Theme} from 'app/styles/theme';
import {useTheme} from '@shopify/restyle';
import useMount from 'app/hooks/useMount';
import {useNavigation} from '@react-navigation/native';
import {HomeStackNavigationProp} from 'app/navigation/HomeStack';
import {
  QuestionsWithCount,
  questionsWithCountQuery,
} from 'app/lib/supabase/queries/questions';
import {useBottomPadding} from 'app/hooks/useBottomPadding';
import QuestionItem from 'app/components/QuestionItem';

import {HapticFeedbackTypes, useHaptics} from 'app/hooks/useHaptics';
import {useTabBarAnimation, useTabPress} from 'app/context/tabBarContext';
import {FlashList} from '@shopify/flash-list';
import HeaderComponent from './components/header';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAlert} from 'app/components/AlertsWrapper';
import {useAuth} from 'app/wrappers/AuthProvider';

const Questions: FC = () => {
  const {navigate} = useNavigation<HomeStackNavigationProp>();
  const theme = useTheme<Theme>();
  const bottomListPadding = useBottomPadding(theme.spacing.mY);
  const {triggerHaptic} = useHaptics();
  const {profile} = useAuth();
  const {openAlert} = useAlert();
  const [questions, setQuestions] = useState<QuestionsWithCount>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const scrollRef = useRef(null);

  const [headerHeight, setHeaderHeight] = useState(0);
  const topInset = useSafeAreaInsets().top;

  useTabPress({
    tabName: 'HomeTab',
    onPress: () => {
      if (scrollRef.current) {
        // @ts-ignore
        scrollRef.current.scrollToOffset({offset: 0, animated: true});
      }
    },
  });

  const {scrollHandlerWorklet} = useTabBarAnimation({
    scrollToTop: () => {
      if (scrollRef.current) {
        // @ts-ignore
        scrollRef.current.scrollToOffset({offset: 0, animated: true});
      }
    },
  });

  const refreshQuestions = async (initialLoad = false) => {
    setRefreshing(!initialLoad);
    setLoading(true);

    const {data, error} = await questionsWithCountQuery;

    if (error) {
      console.error(error);
      openAlert({
        title: 'Error',
        message: error.message,
      });
    } else {
      const questionsWithCount: QuestionsWithCount = data;
      setQuestions(questionsWithCount || []);
    }
    setRefreshing(false);
    setLoading(false);
  };

  useMount(() => {
    refreshQuestions(true);
  });

  return (
    <Flex>
      <HeaderComponent
        onSize={({height}) => {
          setHeaderHeight(height);
        }}
      />
      {loading && !refreshing ? (
        <Center flex={1}>
          <ActivityLoader />
        </Center>
      ) : (
        <FlashList
          ref={scrollRef}
          data={questions}
          scrollIndicatorInsets={{top: headerHeight - topInset}}
          keyExtractor={item => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={refreshQuestions} />
          }
          scrollEventThrottle={16}
          onScroll={({nativeEvent}) => {
            scrollHandlerWorklet(nativeEvent);
          }}
          refreshing={refreshing}
          onRefresh={refreshQuestions}
          contentContainerStyle={{
            paddingTop: theme.spacing.sY + headerHeight,
            paddingBottom: bottomListPadding,
          }}
          estimatedItemSize={220}
          renderItem={({item}) => (
            <QuestionItem
              onPress={() => {
                triggerHaptic({
                  iOS: HapticFeedbackTypes.selection,
                  android: HapticFeedbackTypes.effectClick,
                }).then();
                navigate('QuestionDetail', {
                  questionId: item.id,
                  responseCount: item.question_metadata?.response_count || 0,
                  isOwner: item.user_id === profile?.user_id,
                  ownerUsername: item.user_metadata?.username || 'Anonymous',
                  ownerVerified: item.user_metadata?.verified || false,
                  skeletonLayout: {
                    hasMedia:
                      (item.question_metadata?.media &&
                        item.question_metadata?.media.length > 0) ||
                      false,
                    hasBody: !!item.body,
                    hasLocation: !!item.question_metadata?.location,
                  },
                });
              }}
              onTopicPress={topic => {
                navigate('TopicsFeed', {topic});
              }}
              username={item.user_metadata?.username || 'Anonymous'}
              userId={item.user_id}
              question={item.question}
              body={item.body || undefined}
              topics={item.question_metadata?.topics || []}
              answerCount={item.question_metadata?.response_count || 0}
              voteCount={item.question_metadata?.upvote_count || 0}
              timestamp={item.created_at}
              liked={false}
              media={item.question_metadata?.media || null}
              location={
                item.question_metadata?.location
                  ? // @ts-ignore
                    item.question_metadata?.location.name
                  : undefined
              }
              nsfw={item.nsfw}
              userVerified={item.user_metadata?.verified || false}
              isOwner={item.user_id === profile?.user_id}
              id={item.id}
              avatarImage={{
                // @ts-ignore
                uri: item.user_metadata?.profile_picture?.path ?? undefined,
                blurhash:
                  // @ts-ignore
                  item.user_metadata?.profile_picture?.thumbhash ?? undefined,
              }}
            />
          )}
        />
      )}
    </Flex>
  );
};

export default Questions;
