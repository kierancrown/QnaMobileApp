import {supabase} from 'app/lib/supabase';
import {useAuth} from './useAuth';

export const useUsername = () => {
  const {authStatus, profile} = useAuth({});

  const username = profile?.username ?? undefined;
  const isVerified = profile?.verified ?? false;

  const updateUsername = async (newUsername: string) => {
    if (authStatus !== 'SIGNED_IN' || !profile?.user_id) {
      return;
    }
    // Insert new username
    const {error} = await supabase
      .from('usernames')
      .insert([{user_id: profile.user_id, username: newUsername}])
      .select();
    if (error) {
      if (error.code === '23505') {
        throw new Error('Username already taken');
      } else {
        throw error;
      }
    }
    // refreshProfile();
    return true;
  };

  return {
    username,
    isVerified,
    updateUsername,
  };
};
