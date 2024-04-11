import {Alert, Pressable} from 'react-native';
import React, {FC, useState} from 'react';
import {Center, Flex, Text} from 'ui';

import {Theme} from 'app/styles/theme';
import {useTheme} from '@shopify/restyle';
import {useUser} from 'app/lib/supabase/context/auth';
import useMount from 'app/hooks/useMount';
import {RefreshControl} from 'react-native-gesture-handler';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
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

dayjs.extend(relativeTime);

const Questions: FC = () => {
  const {navigate} = useNavigation<HomeStackNavigationProp>();
  const theme = useTheme<Theme>();
  const {user} = useUser();
  const bottomListPadding = useBottomPadding(theme.spacing.mY);

  const [questions, setQuestions] = useState<QuestionsWithCount>([]);
  const [loading, setLoading] = useState(false);

  const refreshQuestions = async () => {
    setLoading(true);

    const {data, error} = await questionsWithCountQuery;

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      const questionsWithCount: QuestionsWithCount = data;
      setQuestions(questionsWithCount || []);
    }
    setLoading(false);
  };

  useMount(refreshQuestions);

  return (
    <Flex>
      <FlashListWithHeaders
        HeaderComponent={HeaderComponent}
        LargeHeaderComponent={LargeHeaderComponent}
        data={questions}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refreshQuestions} />
        }
        refreshing={loading}
        onRefresh={refreshQuestions}
        contentContainerStyle={{
          paddingTop: theme.spacing.sY,
          paddingBottom: bottomListPadding,
        }}
        scrollEventThrottle={16}
        estimatedItemSize={100}
        renderItem={({item}) => (
          <Pressable
            onPress={() => {
              navigate('QuestionDetail', {questionId: item.id});
            }}>
            <QuestionItem
              username={item.username}
              question={item.question}
              answerCount={0}
              voteCount={item.question_upvotes_count?.count || 0}
              timestamp={item.created_at}
              liked={false}
              nsfw={item.nsfw}
              isOwner={user?.id === item.user_id}
            />
          </Pressable>
        )}
      />
    </Flex>
  );
};

export default Questions;
