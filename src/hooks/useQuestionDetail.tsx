import {useUser} from 'app/lib/supabase/context/auth';
import {useCallback, useMemo, useState} from 'react';
import useMount from './useMount';
import {supabase} from 'app/lib/supabase';
import {QuestionsDetailData} from 'app/lib/supabase/queries/questionDetail';

interface UseQuestionDetailProps {
  questionId: number;
}

export const useQuestionDetail = ({questionId}: UseQuestionDetailProps) => {
  const {user} = useUser();

  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [question, setQuestion] = useState<QuestionsDetailData | null>(null);

  const [error, setError] = useState<string | null>(null);

  const [questionLoading, setQuestionLoading] = useState(true);
  const [upvoteLoading, setUpvoteLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loading = useMemo(
    () => questionLoading || deleteLoading,
    [questionLoading, deleteLoading],
  );

  const fetchUpvotedStatus = useCallback(
    async (id?: number) => {
      setUpvoteLoading(true);
      // Get upvoted status
      if ((id || question) && user) {
        const {data, error: e} = await supabase
          .from('question_upvotes')
          .select('id')
          .eq('question_id', id ?? question!.id)
          .eq('user_id', user.id);
        if (e) {
          setError(e.message);
        } else {
          setHasUpvoted(data?.length > 0);
        }

        const {data: totalCount, error: countErr} = await supabase
          .from('question_metadata')
          .select('upvote_count')
          .eq('question_id', id ?? question!.id)
          .single();

        if (countErr) {
          setError(countErr.message);
        } else {
          // @ts-ignore
          setQuestion(q => ({
            ...q!,
            question_metadata: {
              ...q!.question_metadata,
              upvote_count: totalCount?.upvote_count,
            },
          }));
        }
      }

      setUpvoteLoading(false);
    },
    [question, user],
  );

  const upvoteQuestion = async () => {
    if (!question || !user) {
      setError('You must be logged in to upvote a question');
      return false;
    }
    if (hasUpvoted) {
      // delete upvote
      const {error: e} = await supabase
        .from('question_upvotes')
        .delete()
        .eq('question_id', question.id)
        .eq('user_id', user.id);

      if (e) {
        setError(e.message);
        return false;
      }
    } else {
      // add upvote
      const {error: e} = await supabase
        .from('question_upvotes')
        .insert({question_id: question.id, user_id: user.id});

      if (e) {
        setError(e.message);
        return false;
      }
    }
    await fetchUpvotedStatus(question.id);
    return true;
  };

  const deleteQuestion = async () => {
    setDeleteLoading(true);
    if (!question || !user || question.user_id !== user.id) {
      setError('You do not have permission to delete this question');
    } else {
      const {error: e} = await supabase
        .from('questions')
        .delete()
        .eq('id', question.id);
      if (e) {
        setError(e.message);
      } else {
        setDeleteLoading(false);
        return true;
      }
    }
    setDeleteLoading(false);
    return false;
  };

  const fetchQuestion = useCallback(async () => {
    setQuestionLoading(true);
    const {data, error: e} = await supabase
      .from('questions')
      .select(
        `
        *,
        user_metadata (
          verified,
          profile_picture_key,
          username
        ),
        question_metadata (
          upvote_count,
          response_count,
          view_count,
          visible,
          location (
            name
          )
        )
      `,
      )
      .eq('id', questionId);

    if (e) {
      setError(e.message);
    } else {
      // @ts-ignore
      setQuestion(data[0] ?? null);
      await fetchUpvotedStatus(data?.[0]?.id);
    }
    setQuestionLoading(false);
  }, [fetchUpvotedStatus, questionId]);

  useMount(fetchQuestion);

  return {
    error,
    loading,
    question,
    hasUpvoted,
    upvoteQuestion,
    deleteQuestion,
    deleteLoading,
    upvoteLoading,
    refetch: fetchQuestion,
  };
};
