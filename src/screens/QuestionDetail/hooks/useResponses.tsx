import {SCREEN_HEIGHT} from '@gorhom/bottom-sheet';
import useMount from 'app/hooks/useMount';
import {supabase} from 'app/lib/supabase';
import {Responses} from 'app/lib/supabase/queries/questionResponses';
import {useState} from 'react';
import {Alert} from 'react-native';
import {ESTIMATED_RESPONSE_ITEM_HEIGHT} from '../components/ResponseItem';

interface useResponsesProps {
  questionId: number;
}

export const ESTIMATED_RESPONSES_PAGE_SIZE = parseInt(
  ((SCREEN_HEIGHT * 2) / ESTIMATED_RESPONSE_ITEM_HEIGHT).toFixed(0),
  10,
);

const useResponses = ({questionId}: useResponsesProps) => {
  const [responses, setResponses] = useState<Responses>([]);
  const [offset, setOffset] = useState(0);
  const [responsesLoading, setResponsesLoading] = useState(true);
  const [loadingMoreResponses, setLoadingMoreResponses] = useState(false);
  const [noMoreResponses, setNoMoreResponses] = useState(false);

  const refreshResponses = async () => {
    setResponsesLoading(true);
    const {data, error} = await supabase
      .from('responses')
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
      )
    `,
      )
      .eq('question_id', questionId)
      .order('created_at', {ascending: false})
      .range(0, ESTIMATED_RESPONSES_PAGE_SIZE);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setResponses(data || []);
    }
    setResponsesLoading(false);
  };

  useMount(refreshResponses);

  const fetchNextPage = async () => {
    setLoadingMoreResponses(true);
    const prevOffset = offset;
    const {data, error} = await supabase
      .from('responses')
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
    )
  `,
      )
      .eq('question_id', questionId)
      .order('created_at', {ascending: false})
      .range(prevOffset, prevOffset + ESTIMATED_RESPONSES_PAGE_SIZE);

    setLoadingMoreResponses(false);

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    if (data) {
      // Filter out duplicates
      const mergedData = [...responses, ...data].reduce(
        (unique: Responses, item) => {
          if (!unique.some(response => response.id === item.id)) {
            unique.push(item);
          }
          return unique;
        },
        [],
      );

      if (data.length === 0) {
        setNoMoreResponses(true);
      } else {
        if (noMoreResponses) {
          setNoMoreResponses(false);
        }
        setResponses(mergedData);
        setOffset(prevOffset + data.length); // Update offset
      }
    } else {
      setNoMoreResponses(true);
    }
  };

  return {
    responses,
    refreshResponses,
    responsesLoading,
    fetchNextPage,
    loadingMoreResponses,
    noMoreResponses,
  };
};

export default useResponses;
