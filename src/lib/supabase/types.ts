import {Database} from 'app/types/supabase';

export type Username = Database['public']['Tables']['usernames']['Row'];
export type Question = Database['public']['Tables']['questions']['Row'];
export type Response = Database['public']['Tables']['responses']['Row'];
