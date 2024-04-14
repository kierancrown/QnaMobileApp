import {QueryData} from '@supabase/supabase-js';
import {supabase} from '../init';

export const questionsWithCountQuery = supabase
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
    visible
  )
`,
  )
  .order('created_at', {ascending: false});

export type QuestionsWithCount = QueryData<typeof questionsWithCountQuery>;
