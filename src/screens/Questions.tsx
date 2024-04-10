import {Alert, Pressable} from 'react-native';
import React, {FC, useState} from 'react';
import {Box, Flex, HStack, Text, VStack} from 'ui';

import {Theme} from 'app/styles/theme';
import {useTheme} from '@shopify/restyle';
import {useUser} from 'app/lib/supabase/context/auth';
import useMount from 'app/hooks/useMount';
import {FlashList} from '@shopify/flash-list';
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
import LargeTitleHeader from 'app/components/common/Header/LargeTitleHeader';

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
      <LargeTitleHeader title="Questions" collapsed={false} />
      <Flex px="s">
        <FlashList
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
              <Box
                backgroundColor="cardBackground"
                my="xsY"
                px="xs"
                py="xsY"
                borderRadius="m">
                <VStack rowGap="xsY">
                  <HStack alignItems="center" justifyContent="space-between">
                    <Text
                      fontWeight="600"
                      color={item.user_id === user?.id ? 'brand' : 'cardText'}>
                      {item.username}
                    </Text>
                    <Text color="cardText">
                      {dayjs(item.created_at).fromNow()}
                    </Text>
                  </HStack>
                  <Text variant="body">{item.question}</Text>
                  <HStack rowGap="xsY">
                    <Text color="cardText">
                      Upvotes: {item.question_upvotes_count?.count || 0}
                    </Text>
                  </HStack>
                </VStack>
              </Box>
            </Pressable>
          )}
        />
      </Flex>
    </Flex>
  );
};

export default Questions;
