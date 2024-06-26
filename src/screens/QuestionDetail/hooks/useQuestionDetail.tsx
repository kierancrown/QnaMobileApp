import {useCallback, useMemo, useState} from 'react';
import useMount from '../../../hooks/useMount';
import {supabase} from 'app/lib/supabase';
import {QuestionsDetailData} from 'app/lib/supabase/queries/questionDetail';
import {useAuth} from 'app/wrappers/AuthProvider';

interface UseQuestionDetailProps {
  questionId: number;
}

export const useQuestionDetail = ({questionId}: UseQuestionDetailProps) => {
  const {authStatus, profile} = useAuth();

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
      if ((id || question) && authStatus === 'SIGNED_IN' && profile) {
        const {data, error: e} = await supabase
          .from('question_upvotes')
          .select('id')
          .eq('question_id', id ?? question!.id)
          .eq('user_id', profile.user_id);
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
    [question, authStatus, profile],
  );

  const upvoteQuestion = async () => {
    if (!question || authStatus !== 'SIGNED_IN' || !profile) {
      setError('You must be logged in to upvote a question');
      return false;
    }
    if (hasUpvoted) {
      // delete upvote
      const {error: e} = await supabase
        .from('question_upvotes')
        .delete()
        .eq('question_id', question.id)
        .eq('user_id', profile.user_id);

      if (e) {
        setError(e.message);
        return false;
      }
    } else {
      // add upvote
      const {error: e} = await supabase
        .from('question_upvotes')
        .insert({question_id: question.id, user_id: profile.user_id});

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
    if (
      !question ||
      authStatus !== 'SIGNED_IN' ||
      !profile ||
      question.user_id !== profile.user_id
    ) {
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
          location (
            name
          ),
          media
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
