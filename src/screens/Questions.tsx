import {ActivityIndicator, Alert, StyleProp, ViewStyle} from 'react-native';
import React, {FC, useRef, useState} from 'react';
import {Center, Flex, Text} from 'ui';

import {Theme} from 'app/styles/theme';
import {useTheme} from '@shopify/restyle';
import useMount from 'app/hooks/useMount';
import {RefreshControl} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {HomeStackNavigationProp} from 'app/navigation/HomeStack';
import {
  QuestionsWithCount,
  questionsWithCountQuery,
} from 'app/lib/supabase/queries/questions';
import {useBottomPadding} from 'app/hooks/useBottomPadding';
import QuestionItem from 'app/components/QuestionItem';

import {
  Header,
  LargeHeader,
  ScalingView,
  FlashListWithHeaders,
} from '@codeherence/react-native-header';

import {SharedValue} from 'react-native-reanimated';
import {HapticFeedbackTypes, useHaptics} from 'app/hooks/useHaptics';
import {useTabBarAnimation} from 'app/context/tabBarContext';

const HeaderComponent = ({showNavBar}: {showNavBar: SharedValue<number>}) => (
  <Header
    showNavBar={showNavBar}
    noBottomBorder
    headerCenter={
      <Center py="xxsY">
        <Text variant="medium">Questions</Text>
      </Center>
    }
  />
);

const LargeHeaderComponent = ({scrollY}: {scrollY: SharedValue<number>}) => {
  const theme = useTheme<Theme>();
  const headerStyle: StyleProp<ViewStyle> = {
    paddingVertical: 0,
    marginBottom: theme.spacing.mY,
  };
  return (
    <LargeHeader headerStyle={headerStyle}>
      <ScalingView scrollY={scrollY}>
        <Text
          variant="largeHeader"
          marginVertical="none"
          paddingVertical="none">
          Questions
        </Text>
      </ScalingView>
    </LargeHeader>
  );
};

const Questions: FC = () => {
  const {navigate} = useNavigation<HomeStackNavigationProp>();
  const theme = useTheme<Theme>();
  const bottomListPadding = useBottomPadding(theme.spacing.mY);
  const {triggerHaptic} = useHaptics();

  const [questions, setQuestions] = useState<QuestionsWithCount>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const scrollRef = useRef(null);

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
      Alert.alert('Error', error.message);
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
      {loading && !refreshing ? (
        <Center flex={1}>
          <ActivityIndicator size="small" color={theme.colors.brand} />
        </Center>
      ) : (
        <FlashListWithHeaders
          ref={scrollRef}
          HeaderComponent={HeaderComponent}
          LargeHeaderComponent={LargeHeaderComponent}
          data={questions}
          keyExtractor={item => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={refreshQuestions} />
          }
          onScrollWorklet={scrollHandlerWorklet}
          refreshing={refreshing}
          onRefresh={refreshQuestions}
          contentContainerStyle={{
            paddingTop: theme.spacing.sY,
            paddingBottom: bottomListPadding,
          }}
          estimatedItemSize={100}
          renderItem={({item}) => (
            <QuestionItem
              onPress={() => {
                triggerHaptic(HapticFeedbackTypes.selection).then();
                navigate('QuestionDetail', {questionId: item.id});
              }}
              username={item.user_metadata?.username || 'Anonymous'}
              question={item.question}
              answerCount={item.question_metadata?.response_count || 0}
              voteCount={item.question_metadata?.upvote_count || 0}
              timestamp={item.created_at}
              liked={false}
              nsfw={item.nsfw}
              userVerified={item.user_metadata?.verified || false}
            />
          )}
        />
      )}
    </Flex>
  );
};

export default Questions;
