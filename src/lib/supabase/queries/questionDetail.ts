import {QueryData} from '@supabase/supabase-js';
import {supabase} from '../init';

export const questionDetailQuery = supabase.from('questions').select(
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
);

export type QuestionsDetail = QueryData<typeof questionDetailQuery>;
