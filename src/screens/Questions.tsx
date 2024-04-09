import {Alert, Button} from 'react-native';
import React, {FC, useState} from 'react';
import {useDispatch} from 'react-redux';
import {AppDispatch} from 'app/redux/store';
import {resetAuth} from 'app/redux/slices/authSlice';
import {Box, Center, Flex, HStack, Text, VStack} from 'ui';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Theme} from 'app/styles/theme';
import {useTheme} from '@shopify/restyle';
import {useUser} from 'app/lib/supabase/context/auth';
import {supabase} from 'app/lib/supabase';
import {Database} from 'app/types/supabase';
import useMount from 'app/hooks/useMount';
import {FlashList} from '@shopify/flash-list';
import {RefreshControl} from 'react-native-gesture-handler';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {useUsername} from 'app/hooks/useUsername';
dayjs.extend(relativeTime);

type Question = Database['public']['Tables']['questions']['Row'];

const Questions: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme<Theme>();
  const {user} = useUser();
  const {username, updateUsername} = useUsername();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshQuestions = async () => {
    setLoading(true);
    const {data, error} = await supabase
      .from('questions')
      .select('*')
      .order('created_at', {ascending: false});
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setQuestions(data || []);
    }
    setLoading(false);
  };

  useMount(refreshQuestions);

  const login = () => {
    dispatch(resetAuth());
    if (user) {
      supabase.auth.signOut();
    }
  };

  const showPostNew = () => {
    if (!user) {
      Alert.alert(
        'Login Required',
        'You must be logged in to post a question',
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
    Alert.prompt('New Question', 'Enter your question', async question => {
      if (question) {
        const {data, error} = await supabase
          .from('questions')
          .insert({
            username: 'kieran',
            question: question,
            tags: [],
          })
          .select();
        if (data) {
          setQuestions([data[0], ...questions]);
        }
        if (error) {
          Alert.alert('Error', error.message);
        } else {
          Alert.alert('Success', 'Question posted');
        }
      }
    });
  };

  const updateUserPrompt = () => {
    Alert.prompt(
      'Update Username',
      'Enter your new username',
      async newUsername => {
        if (newUsername) {
          try {
            const success = await updateUsername(newUsername);
            if (success) {
              Alert.alert('Success', 'Username updated');
            } else {
              Alert.alert('Error', 'Failed to update username');
            }
          } catch (error) {
            const err = error as Error;
            Alert.alert('Error', err.message);
          }
        }
      },
    );
  };

  return (
    <Flex>
      <Box
        backgroundColor="cardBackground"
        borderColor="segmentBackground"
        borderBottomWidth={1}>
        <SafeAreaView edges={['top', 'left', 'right']}>
          <HStack py="xxsY" px="xs">
            <HStack flex={1} alignItems="center" justifyContent="flex-start">
              <Button
                title={user ? 'Logout' : 'Login'}
                onPress={login}
                color={theme.colors.brand}
              />
            </HStack>
            <Center flex={2}>
              <Text variant="medium">Questions</Text>
            </Center>
            <HStack flex={1} alignItems="center" justifyContent="flex-end">
              <Button
                title="New"
                onPress={showPostNew}
                color={theme.colors.brand}
              />
            </HStack>
          </HStack>
        </SafeAreaView>
      </Box>
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
                <HStack alignItems="center" justifyContent="space-between">
                  <Text fontWeight="600">{item.username}</Text>
                  <Text color="cardText">
                    {dayjs(item.created_at).fromNow()}
                  </Text>
                </HStack>
                <Text variant="body">{item.question}</Text>
              </VStack>
            </Box>
          )}
        />
      </Flex>
      <SafeAreaView edges={['bottom', 'left', 'right']}>
        <Center px="m">
          <Button
            title="Update username"
            onPress={updateUserPrompt}
            color={theme.colors.brand}
          />
          <Text>{username}</Text>
        </Center>
      </SafeAreaView>
    </Flex>
  );
};

export default Questions;
