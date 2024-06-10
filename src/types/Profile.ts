import {supabase} from '../lib/supabase';
import {Database} from './supabase';

export const profileQuery = (userId: string) =>
  supabase.from('user_metadata').select('*').eq('user_id', userId).single();
export type Profile = Database['public']['Tables']['user_metadata']['Row'];
