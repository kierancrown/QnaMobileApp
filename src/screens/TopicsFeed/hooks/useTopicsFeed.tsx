import {QueryData} from '@supabase/supabase-js';
import {useAlert} from 'app/components/AlertsWrapper';
import {supabase} from 'app/lib/supabase';
import {useCallback, useState} from 'react';

export const useTopicsFeed = ({topic}: {topic?: string}) => {
  const [results, setResults] = useState<QuestionsForTopic>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [noMoreResults, setNoMoreResults] = useState(false);
  const {openAlert} = useAlert();

  const questionsForTopic = supabase
    .from('questions')
    .select(
      `
    *,
    user_metadata (
      verified,
      profile_picture (
        path,
        thumbhash
      ),
      username
    ),
    question_metadata (
      upvote_count,
      response_count,
      view_count,
      visible,
      topics,
      media,
      location (
        name
      )
    )
  `,
    )
    // .contains('basics->channels->>value', '3335557777')
    .contains('question_metadata->topics', topic || '')
    .order('created_at', {ascending: false});

  type QuestionsForTopic = QueryData<typeof questionsForTopic>;

  const refreshResponses = useCallback(async () => {
    setLoading(true);
    const {data, error} = await questionsForTopic.range(0, 20); // TODO: Replace 20 for estimated page size
    if (error) {
      console.error(error);
      openAlert({
        title: 'Error',
        message: error.message,
      });
    } else {
      setResults(data || []);
    }
    setLoading(false);
  }, [openAlert, questionsForTopic]);

  const fetchNextPage = async () => {
    setFetching(true);
    const prevOffset = offset;
    const {data, error} = await questionsForTopic.range(
      prevOffset,
      prevOffset + 20, // TODO: Replace 20 for estimated page size
    );
    setFetching(false);

    if (error) {
      openAlert({
        title: 'Error',
        message: error.message,
      });
      return;
    } else if (data) {
      // Filter out duplicates
      const mergedData = [...results, ...data].reduce(
        (unique: QuestionsForTopic, item) => {
          if (!unique.some(response => response.id === item.id)) {
            unique.push(item);
          }
          return unique;
        },
        [],
      );

      if (data.length === 0) {
        setNoMoreResults(true);
      } else {
        if (noMoreResults) {
          setNoMoreResults(false);
        }
        setResults(mergedData);
        setOffset(prevOffset + data.length); // Update offset
      }
    } else {
      setNoMoreResults(true);
    }
  };

  return {
    results,
    loading,
    fetching,
    noMoreResults,
    fetchNextPage,
    refreshResponses,
  };
};

export default useTopicsFeed;
