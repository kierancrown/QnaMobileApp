import {QueryData} from '@supabase/supabase-js';
import {supabase} from '../init';

export const questionsWithCountQuery = supabase
  .from('questions')
  .select(
    `
  *,
  question_upvotes_count (
    count
  )
`,
  )
  .order('created_at', {ascending: false});

export type QuestionsWithCount = QueryData<typeof questionsWithCountQuery>;
