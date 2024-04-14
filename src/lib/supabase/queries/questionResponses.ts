import {QueryData} from '@supabase/supabase-js';
import {supabase} from '../init';

export const questionResponsesQuery = supabase.from('responses').select(
  `
  *,
  user_metadata (
    verified,
    profile_picture_key,
    username
  )
`,
);

export type Responses = QueryData<typeof questionResponsesQuery>;
