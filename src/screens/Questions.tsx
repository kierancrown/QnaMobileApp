import {ActivityIndicator, Alert, NativeScrollEvent} from 'react-native';
import React, {FC, useState} from 'react';
import {Center, Flex, Text} from 'ui';

import {Theme} from 'app/styles/theme';
import {useTheme} from '@shopify/restyle';
import {useUser} from 'app/lib/supabase/context/auth';
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

import {SharedValue, runOnJS} from 'react-native-reanimated';
import {HapticFeedbackTypes, useHaptics} from 'app/hooks/useHaptics';
import {useTabBar} from 'app/context/tabBarContext';

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

const LargeHeaderComponent = ({scrollY}: {scrollY: SharedValue<number>}) => (
  <LargeHeader>
    <ScalingView scrollY={scrollY}>
      <Text variant="largeHeader">Questions</Text>
    </ScalingView>
  </LargeHeader>
);

const Questions: FC = () => {
  const {navigate} = useNavigation<HomeStackNavigationProp>();
  const theme = useTheme<Theme>();
  const {user} = useUser();
  const bottomListPadding = useBottomPadding(theme.spacing.mY);
  const {triggerHaptic} = useHaptics();

  const [questions, setQuestions] = useState<QuestionsWithCount>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const {setScrollY, setContentSize} = useTabBar();

  const refreshQuestions = async (initialLoad = false) => {
    setRefreshing(!initialLoad);
    setLoading(true);

    const {data, error} = await questionsWithCountQuery;

    if (error) {
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

  const scrollHandlerWorklet = (evt: NativeScrollEvent) => {
    'worklet';
    const maxScrollY = evt.contentSize.height - evt.layoutMeasurement.height;
    runOnJS(setContentSize)(maxScrollY);
    runOnJS(setScrollY)(evt.contentOffset.y);
  };

  return (
    <Flex>
      {loading && !refreshing ? (
        <Center flex={1}>
          <ActivityIndicator size="small" color={theme.colors.brand} />
        </Center>
      ) : (
        <FlashListWithHeaders
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
              username={item.username}
              question={item.question}
              answerCount={0}
              voteCount={item.question_upvotes_count?.count || 0}
              timestamp={item.created_at}
              liked={false}
              nsfw={item.nsfw}
              isOwner={user?.id === item.user_id}
            />
          )}
        />
      )}
    </Flex>
  );
};

export default Questions;
