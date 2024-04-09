import {useEffect, useState} from 'react';
import {supabase} from 'app/lib/supabase';
import {useUser} from 'app/lib/supabase/context/auth';
import {Database} from 'app/types/supabase';

type Username = Database['public']['Tables']['usernames']['Row'];

export const useUsername = () => {
  const [username, setUsername] = useState<Username>();
  const {user} = useUser();

  useEffect(() => {
    if (!user) {
      setUsername(undefined);
      return;
    }
    supabase
      .from('usernames')
      .select('*')
      .eq('user_id', user?.id)
      .eq('active', true)
      .then(({data, error}) => {
        if (error) {
          console.error('Error getting username', error);
          return;
        }
        if (data?.length > 0) {
          console.log('data', JSON.stringify(data, null, 2));
          setUsername(data[0]);
        }
      });
  }, [user]);

  const updateUsername = async (newUsername: string) => {
    if (!user) {
      return;
    }
    // Insert new username
    const {data, error} = await supabase
      .from('usernames')
      .insert([{user_id: user.id, username: newUsername}])
      .select();
    if (error) {
      if (error.code === '23505') {
        throw new Error('Username already taken');
      } else {
        throw error;
      }
    } else if (data.length) {
      if (username) {
        // Deactivate old username
        const {error: err} = await supabase
          .from('usernames')
          .update({active: false})
          .eq('id', username.id)
          .select();
        if (err) {
          throw err;
        }
      }
      setUsername(data[0]);
      return true;
    }
  };

  return {username: username?.username, updateUsername};
};
