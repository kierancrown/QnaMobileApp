import {ActivityIndicator, Alert, Button, RefreshControl} from 'react-native';
import React, {FC, useCallback, useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {AppDispatch} from 'app/redux/store';
import {resetAuth} from 'app/redux/slices/authSlice';
import {Box, Center, Flex, HStack, Text, VStack} from 'ui';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Theme} from 'app/styles/theme';
import {useTheme} from '@shopify/restyle';
import {useUser} from 'app/lib/supabase/context/auth';
import {supabase} from 'app/lib/supabase';
import useMount from 'app/hooks/useMount';
import {FlashList} from '@shopify/flash-list';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {useUsername} from 'app/hooks/useUsername';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {HomeStackParamList} from 'app/navigation/HomeStack';
import {Question, Response} from 'app/lib/supabase/types';

dayjs.extend(relativeTime);

const QuestionDetail: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme<Theme>();
  const {user} = useUser();
  const {username} = useUsername();

  const {
    params: {questionId},
  } = useRoute<RouteProp<HomeStackParamList, 'QuestionDetail'>>();

  const {goBack} = useNavigation();

  const [question, setQuestion] = useState<Question | null>(null);
  const [iUpvoted, setIUpvoted] = useState<boolean>(false);
  const [upvotes, setUpvotes] = useState<number>(0);
  const [responses, setResponses] = useState<Response[]>([]);

  const [loading, setLoading] = useState(true);
  const [responsesLoading, setResponsesLoading] = useState(true);

  const refreshResponses = async () => {
    setResponsesLoading(true);
    const {data, error} = await supabase
      .from('responses')
      .select('*')
      .eq('question_id', questionId)
      .order('created_at', {ascending: false});
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      // @ts-ignore
      setResponses(data || []);
    }
    setLoading(false);
  };

  const fetchQuestion = async () => {
    setLoading(true);
    const {data, error} = await supabase
      .from('questions')
      .select('*')
      .eq('id', questionId);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setLoading(false);
      setQuestion(data?.[0] || null);
    }
  };

  const fetchUpvoteCount = useCallback(async () => {
    if (!question) {
      return;
    }

    // Get count
    const {data: countData, error} = await supabase
      .from('question_upvotes_count')
      .select('count')
      .eq('question_id', question.id)
      .single();
    if (error) {
      Alert.alert('Error', error.message);
    }
    setUpvotes(countData?.count || 0);

    // Get upvoted state
    if (user) {
      const {data, error: err} = await supabase
        .from('question_upvotes')
        .select('created_at')
        .eq('question_id', question.id)
        .eq('user_id', user.id);
      if (err) {
        Alert.alert('Error', err.message);
      } else {
        setIUpvoted(data?.length > 0);
      }
    }
  }, [question, user]);

  useEffect(() => {
    if (question) {
      fetchUpvoteCount();
    }
  }, [fetchUpvoteCount, question]);

  useMount(refreshResponses);
  useMount(fetchQuestion);

  const login = () => {
    dispatch(resetAuth());
  };

  const showAnswer = () => {
    if (!user) {
      Alert.alert(
        'Login Required',
        'You must be logged in to post a response',
        [
          {
            text: 'Login',
            onPress: login,
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
          .insert({
            question_id: questionId,
            username,
            response: response,
          })
          .select();
        if (data != null) {
          setResponses([data[0], ...responses]);
        }
        if (error) {
          Alert.alert('Error', error.message);
        } else {
          Alert.alert('Success', 'Response posted');
        }
      }
    });
  };

  const deleteQuestion = async () => {
    if (!question || !user || question.user_id !== user.id) {
      Alert.alert('Error', 'You cannot delete this question');
      return;
    }
    const {error} = await supabase
      .from('questions')
      .delete()
      .eq('id', question.id);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      goBack();
    }
  };

  const upvoteQuestion = async () => {
    if (!question || !user) {
      Alert.alert('Error', 'You must be logged in to upvote');
      return;
    }
    if (iUpvoted) {
      const {error} = await supabase
        .from('question_upvotes')
        .delete()
        .eq('question_id', question.id)
        .eq('user_id', user.id);

      if (error) {
        Alert.alert('Error', error.message);
      }
    } else {
      const {error} = await supabase
        .from('question_upvotes')
        .insert({question_id: question.id, user_id: user.id});

      if (error) {
        Alert.alert('Error', error.message);
      }
    }
    fetchUpvoteCount();
  };

  return (
    <Flex>
      {questionId && question != null ? (
        loading ? (
          <Center flex={1}>
            <ActivityIndicator size="large" />
          </Center>
        ) : (
          <Flex>
            <Box
              backgroundColor="cardBackground"
              borderColor="segmentBackground"
              borderBottomWidth={1}>
              <SafeAreaView edges={['top', 'left', 'right']}>
                <HStack py="xxsY" px="xs">
                  <HStack
                    flex={1}
                    alignItems="center"
                    justifyContent="flex-start">
                    <Button
                      title="Back"
                      onPress={goBack}
                      color={theme.colors.brand}
                    />
                  </HStack>
                  <Center flex={2}>
                    <Text variant="medium">Questions</Text>
                  </Center>
                  <HStack
                    flex={1}
                    alignItems="center"
                    justifyContent="flex-end">
                    <Button
                      title="Answer"
                      onPress={showAnswer}
                      color={theme.colors.brand}
                    />
                  </HStack>
                </HStack>
              </SafeAreaView>
            </Box>
            <Flex p="s">
              <VStack rowGap="xsY">
                <HStack alignItems="center" justifyContent="space-between">
                  <Text variant="medium">{question.question}</Text>
                  {question.user_id === user?.id && (
                    <Button title="Delete" onPress={deleteQuestion} />
                  )}
                </HStack>
                <HStack alignItems="center" justifyContent="space-between">
                  <Text>
                    {upvotes} {upvotes === 1 ? 'upvote' : 'upvotes'}
                  </Text>
                  <Button
                    title={iUpvoted ? 'Upvoted' : 'Upvote'}
                    onPress={upvoteQuestion}
                  />
                </HStack>
                <HStack justifyContent="space-between">
                  <Text variant="small" color="cardText">
                    {dayjs(question.created_at).fromNow()}
                  </Text>
                  <Text variant="small" color="cardText">
                    {question.username}
                  </Text>
                </HStack>
              </VStack>
              <FlashList
                data={responses}
                keyExtractor={item => item.id.toString()}
                refreshControl={
                  <RefreshControl
                    refreshing={false}
                    onRefresh={refreshResponses}
                  />
                }
                ListEmptyComponent={
                  <Center flex={1}>
                    <Text variant="medium" my="xlY" color="cardText">
                      No responses yet
                    </Text>
                  </Center>
                }
                refreshing={responsesLoading}
                onRefresh={refreshResponses}
                contentContainerStyle={{
                  paddingTop: theme.spacing.sY,
                }}
                estimatedItemSize={100}
                renderItem={({item}) => (
                  <Box
                    backgroundColor="cardBackground"
                    my="xsY"
                    px="xs"
                    py="xsY"
                    borderRadius="m">
                    <VStack rowGap="xsY">
                      <HStack
                        alignItems="center"
                        justifyContent="space-between">
                        <Text
                          fontWeight="600"
                          color={
                            item.user_id === user?.id ? 'brand' : 'cardText'
                          }>
                          {item.username}
                        </Text>
                        <Text color="cardText">
                          {dayjs(item.created_at).fromNow()}
                        </Text>
                      </HStack>
                      <Text variant="body">{item.response}</Text>
                    </VStack>
                  </Box>
                )}
              />
            </Flex>
          </Flex>
        )
      ) : (
        <Center flex={1}>
          <Text variant="medium">No question selected</Text>
          <Button title="Fetch" onPress={fetchQuestion} />
        </Center>
      )}
    </Flex>
  );
};

export default QuestionDetail;
