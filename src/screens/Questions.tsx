import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  StyleProp,
  ViewStyle,
} from 'react-native';
import React, {FC, useRef, useState} from 'react';
import {Center, Flex, HStack, Text, VStack} from 'ui';

import {Theme, useAppTheme} from 'app/styles/theme';
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

import {
  Header,
  LargeHeader,
  ScalingView,
  FlashListWithHeaders,
} from '@codeherence/react-native-header';

import {SharedValue} from 'react-native-reanimated';
import {HapticFeedbackTypes, useHaptics} from 'app/hooks/useHaptics';
import {useTabBarAnimation, useTabPress} from 'app/context/tabBarContext';
import {useUser} from 'app/lib/supabase/context/auth';

import FilterIcon from 'app/assets/icons/actions/Filter.svg';
import {TouchableOpacity} from 'react-native-gesture-handler';
import HeaderBar from 'app/components/common/HeaderBar';

const HeaderTabs = ['For You', 'Trending', 'Near Me', 'Discover'];
const HeaderComponent = ({showNavBar}: {showNavBar: SharedValue<number>}) => {
  const theme = useAppTheme();
  const [selectedTab, setSelectedTab] =
    useState<(typeof HeaderTabs)[number]>('For You');

  return (
    <Header
      showNavBar={showNavBar}
      noBottomBorder
      headerCenterStyle={{
        paddingHorizontal: theme.spacing.none,
        marginHorizontal: theme.spacing.none,
      }}
      headerCenterFadesIn={false}
      headerCenter={
        <Flex py="sY">
          <HStack columnGap="xs" alignItems="center">
            <HeaderBar
              tabItems={HeaderTabs}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
            <Center paddingEnd="xs">
              <TouchableOpacity hitSlop={8}>
                <FilterIcon
                  width={theme.iconSizes.intermediate}
                  height={theme.iconSizes.intermediate}
                />
              </TouchableOpacity>
            </Center>
          </HStack>
        </Flex>
      }
    />
  );
};

const LargeHeaderComponent = ({scrollY}: {scrollY: SharedValue<number>}) => {
  const theme = useTheme<Theme>();

  const headerStyle: StyleProp<ViewStyle> = {
    paddingVertical: 0,
    marginBottom: theme.spacing.mY,
  };
  return (
    <LargeHeader headerStyle={headerStyle}>
      <ScalingView scrollY={scrollY}>
        <VStack rowGap="xsY">
          <Text
            variant="largeHeader"
            marginVertical="none"
            paddingVertical="none">
            Questions
          </Text>
        </VStack>
      </ScalingView>
    </LargeHeader>
  );
};

const Questions: FC = () => {
  const {navigate} = useNavigation<HomeStackNavigationProp>();
  const theme = useTheme<Theme>();
  const bottomListPadding = useBottomPadding(theme.spacing.mY);
  const {triggerHaptic} = useHaptics();
  const {user} = useUser();

  const [questions, setQuestions] = useState<QuestionsWithCount>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const scrollRef = useRef(null);

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
      Alert.alert('Error', error.message);
    } else {
      const questionsWithCount: QuestionsWithCount = data;
      setQuestions(
        [
          ...questionsWithCount,
          ...questionsWithCount.map(q => ({
            ...q,
            id: q.id + 1,
          })),
          ...questionsWithCount.map(q => ({
            ...q,
            id: q.id + 2,
          })),
          ...questionsWithCount.map(q => ({
            ...q,
            id: q.id + 3,
          })),
          ...questionsWithCount.map(q => ({
            ...q,
            id: q.id + 4,
          })),
          ...questionsWithCount.map(q => ({
            ...q,
            id: q.id + 5,
          })),
          ...questionsWithCount.map(q => ({
            ...q,
            id: q.id + 6,
          })),
          ...questionsWithCount.map(q => ({
            ...q,
            id: q.id + 7,
          })),
          ...questionsWithCount.map(q => ({
            ...q,
            id: q.id + 8,
          })),
          ...questionsWithCount.map(q => ({
            ...q,
            id: q.id + 9,
          })),
          ...questionsWithCount.map(q => ({
            ...q,
            id: q.id + 10,
          })),
        ] || [],
      );
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
                navigate('QuestionDetail', {
                  questionId: item.id,
                  responseCount: item.question_metadata?.response_count || 0,
                  isOwner: item.user_id === user?.id,
                });
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
              nsfw={item.nsfw}
              userVerified={item.user_metadata?.verified || false}
              isOwner={item.user_id === user?.id}
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
