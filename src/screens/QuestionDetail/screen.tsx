import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  StyleProp,
  ViewStyle,
} from 'react-native';
import React, {FC, useRef, useState} from 'react';
import {useDispatch} from 'react-redux';
import {AppDispatch} from 'app/redux/store';
import {resetAuth} from 'app/redux/slices/authSlice';
import {Box, Center, Flex, HStack, Text, VStack} from 'ui';
import {SharedValue} from 'react-native-reanimated';

import {Theme} from 'app/styles/theme';
import {useTheme} from '@shopify/restyle';
import {useUser} from 'app/lib/supabase/context/auth';
import {supabase} from 'app/lib/supabase';
import useMount from 'app/hooks/useMount';
import dayjs from 'dayjs';
import {useUsername} from 'app/hooks/useUsername';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {HomeStackParamList} from 'app/navigation/HomeStack';
import {Response} from 'app/lib/supabase/types';

import AnswersIcon from 'app/assets/icons/Answers.svg';
import HeartOutlineIcon from 'app/assets/icons/actions/Heart-Outline.svg';
import TimeIcon from 'app/assets/icons/TimeFive.svg';
import BackIcon from 'app/assets/icons/arrows/ArrowLeft.svg';

import {
  Header,
  LargeHeader,
  ScalingView,
  FlashListWithHeaders,
} from '@codeherence/react-native-header';
import {useQuestionDetail} from 'app/hooks/useQuestionDetail';
import {formatNumber} from 'app/utils/numberFormatter';
import ActionBar from './components/ActionBar';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useBottomPadding} from 'app/hooks/useBottomPadding';
import {useTabBarAnimation} from 'app/context/tabBarContext';

const ICON_SIZE = 13;
const BACK_ICON_SIZE = 24;

const HeaderComponent = ({showNavBar}: {showNavBar: SharedValue<number>}) => {
  const {goBack} = useNavigation();

  return (
    <Header
      showNavBar={showNavBar}
      noBottomBorder
      headerLeft={
        <TouchableOpacity
          onPress={goBack}
          hitSlop={8}
          accessibilityLabel="Go back"
          accessibilityRole="button"
          accessibilityHint="Go back to previous screen">
          <Center py="xxsY" px="xxs">
            <BackIcon width={BACK_ICON_SIZE} height={BACK_ICON_SIZE} />
          </Center>
        </TouchableOpacity>
      }
      headerCenter={
        <Center py="xxsY">
          <Text variant="medium">Question</Text>
        </Center>
      }
    />
  );
};

const LargeHeaderComponent = ({scrollY}: {scrollY: SharedValue<number>}) => {
  const {
    params: {questionId},
  } = useRoute<RouteProp<HomeStackParamList, 'QuestionDetail'>>();

  const {loading, question, hasUpvoted, upvotes, upvoteQuestion} =
    useQuestionDetail({
      questionId,
    });
  const {user} = useUser();
  const isOwner = user?.id === question?.user_id;
  const theme = useTheme<Theme>();

  const [bookmarked, setBookmarked] = useState(false);

  const headerStyle: StyleProp<ViewStyle> = {
    paddingVertical: 0,
    paddingHorizontal: 0,
    marginBottom: theme.spacing.mY,
  };

  const scalingViewStyle: StyleProp<ViewStyle> = {
    flex: 1,
  };

  return (
    <LargeHeader headerStyle={headerStyle}>
      <ScalingView scrollY={scrollY} style={scalingViewStyle}>
        {loading ? (
          <Center flex={1}>
            <ActivityIndicator size="large" />
          </Center>
        ) : question ? (
          <VStack rowGap="sY" px="m">
            <Text variant="medium">
              {question.question}
              {question.nsfw && (
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
            <VStack rowGap="xsY">
              <HStack alignItems="center" justifyContent="space-between">
                <Text variant="username" fontWeight="400">
                  Asked by{' '}
                  <Text
                    variant="username"
                    fontWeight="600"
                    color={isOwner ? 'brand' : 'foreground'}>
                    {question.username}
                  </Text>
                </Text>
              </HStack>
              <HStack alignItems="center" columnGap="s">
                <HStack alignItems="center" columnGap="xxs">
                  <HeartOutlineIcon
                    fill={theme.colors.cardText}
                    width={ICON_SIZE}
                    height={ICON_SIZE}
                  />
                  <Text color="cardText" variant="smaller">
                    {formatNumber(upvotes)}
                  </Text>
                </HStack>
                <HStack alignItems="center" columnGap="xxs">
                  <AnswersIcon
                    fill={theme.colors.cardText}
                    width={ICON_SIZE}
                    height={ICON_SIZE}
                  />
                  <Text color="cardText" variant="smaller">
                    0
                  </Text>
                </HStack>
                <HStack alignItems="center" columnGap="xxs">
                  <TimeIcon
                    fill={theme.colors.cardText}
                    width={ICON_SIZE}
                    height={ICON_SIZE}
                  />
                  <Text color="cardText" variant="smaller">
                    {dayjs(question.created_at).fromNow(true)}
                  </Text>
                </HStack>
              </HStack>
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
        ) : (
          <Center flex={1}>
            <Text variant="medium" color="destructiveAction">
              Question not found
            </Text>
          </Center>
        )}
      </ScalingView>
    </LargeHeader>
  );
};

const QuestionDetail: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme<Theme>();
  const {user} = useUser();
  const {username} = useUsername();

  const scrollRef = useRef(null);
  const {scrollHandlerWorklet} = useTabBarAnimation(() => {
    if (scrollRef.current) {
      // @ts-ignore
      scrollRef.current.scrollToOffset({offset: 0, animated: true});
    }
  });

  const {
    params: {questionId},
  } = useRoute<RouteProp<HomeStackParamList, 'QuestionDetail'>>();

  const [responses, setResponses] = useState<Response[]>([]);
  const bottomListPadding = useBottomPadding(theme.spacing.mY);
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

  useMount(refreshResponses);

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

  return (
    <Flex>
      <FlashListWithHeaders
        HeaderComponent={HeaderComponent}
        LargeHeaderComponent={LargeHeaderComponent}
        data={responses}
        ref={scrollRef}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refreshResponses} />
        }
        onScrollWorklet={scrollHandlerWorklet}
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
          paddingBottom: bottomListPadding,
        }}
        estimatedItemSize={100}
        renderItem={({item}) => (
          <Box
            backgroundColor="cardBackground"
            my="xsY"
            px="xs"
            mx="xs"
            py="xsY"
            borderRadius="m">
            <VStack rowGap="xsY">
              <HStack alignItems="center" justifyContent="space-between">
                <Text
                  fontWeight="600"
                  color={item.user_id === user?.id ? 'brand' : 'cardText'}>
                  {item.username}
                </Text>
                <Text color="cardText">{dayjs(item.created_at).fromNow()}</Text>
              </HStack>
              <Text variant="body">{item.response}</Text>
            </VStack>
          </Box>
        )}
      />
    </Flex>
  );
};

export default QuestionDetail;
