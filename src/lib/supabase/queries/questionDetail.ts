import {QueryData} from '@supabase/supabase-js';
import {supabase} from '../init';

export const questionDetailQuery = supabase.from('questions').select(
  `
  *,
  question_upvotes_count (
    count
  ),
  user_metadata (
    verified,
    profile_picture_key,
    username
  )
`,
);

export type QuestionsDetail = QueryData<typeof questionDetailQuery>;
