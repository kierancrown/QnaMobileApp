import {useUser} from 'app/lib/supabase/context/auth';
import {useCallback, useMemo, useState} from 'react';
import useMount from './useMount';
import {supabase} from 'app/lib/supabase';
import {
  QuestionsDetail,
  questionDetailQuery,
} from 'app/lib/supabase/queries/questionDetail';

interface UseQuestionDetailProps {
  questionId: number;
}

export const useQuestionDetail = ({questionId}: UseQuestionDetailProps) => {
  const {user} = useUser();

  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [question, setQuestion] = useState<QuestionsDetail[0] | null>(null);

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
    // Refetch question
    await fetchQuestion();
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

  const fetchQuestion = async () => {
    setQuestionLoading(true);
    const {data, error: e} = await questionDetailQuery.eq('id', questionId);

    console.log({data, error: e, questionId});

    if (e) {
      setError(e.message);
    } else {
      setQuestion(data[0] ?? null);
      await fetchUpvotedStatus(data?.[0]?.id);
    }
    setQuestionLoading(false);
  };

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
