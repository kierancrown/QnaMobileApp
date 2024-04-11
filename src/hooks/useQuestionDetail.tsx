import {useUser} from 'app/lib/supabase/context/auth';
import {Question} from 'app/lib/supabase/types';
import {useCallback, useMemo, useState} from 'react';
import useMount from './useMount';
import {supabase} from 'app/lib/supabase';

interface UseQuestionDetailProps {
  questionId: number;
}

export const useQuestionDetail = ({questionId}: UseQuestionDetailProps) => {
  const {user} = useUser();

  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [upvotes, setUpvotes] = useState(0);
  const [question, setQuestion] = useState<Question | null>(null);

  const [error, setError] = useState<string | null>(null);

  const [questionLoading, setQuestionLoading] = useState(true);
  const [upvoteLoading, setUpvoteLoading] = useState(false);
  const [upvoteCountLoading, setUpvoteCountLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loading = useMemo(
    () => questionLoading || deleteLoading,
    [questionLoading, deleteLoading],
  );

  const fetchUpvoteCount = useCallback(async () => {
    setUpvoteCountLoading(true);
    // Get count
    if (question) {
      const {data: countData, error: e} = await supabase
        .from('question_upvotes_count')
        .select('count')
        .eq('question_id', question.id)
        .single();
      if (e) {
        setError(e.message);
      }
      setUpvotes(countData?.count || 0);
    }
    setUpvoteCountLoading(false);
  }, [question]);

  const fetchUpvotedStatus = useCallback(async () => {
    setUpvoteLoading(true);
    // Get upvoted status
    if (question && user) {
      const {data, error: e} = await supabase
        .from('question_upvotes')
        .select('id')
        .eq('question_id', question.id)
        .eq('user_id', user.id);
      if (e) {
        setError(e.message);
      } else {
        setHasUpvoted(data?.length > 0);
      }
    }
    setUpvoteLoading(false);
  }, [question, user]);

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
    await fetchUpvotedStatus();
    await fetchUpvoteCount();
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
    const {data, error: e} = await supabase
      .from('questions')
      .select('*')
      .eq('id', questionId);

    if (e) {
      setError(e.message);
    } else {
      setQuestion(data?.[0] || null);
    }
    setQuestionLoading(false);
  };

  useMount(fetchQuestion);

  return {
    error,
    loading,
    question,
    upvotes,
    hasUpvoted,
    upvoteQuestion,
    deleteQuestion,
    deleteLoading,
    upvoteLoading,
    upvoteCountLoading,
    refetch: fetchQuestion,
  };
};
