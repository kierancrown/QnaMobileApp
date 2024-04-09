import {useCallback, useEffect} from 'react';
import {supabase} from 'app/lib/supabase';
import {useUser} from 'app/lib/supabase/context/auth';
import {setUsernameCache} from 'app/redux/slices/authSlice';
import {AppDispatch, RootState} from 'app/redux/store';
import {useDispatch, useSelector} from 'react-redux';

export const useUsername = () => {
  const {user} = useUser();
  const username = useSelector(
    (state: RootState) => state.persistent.auth.username,
  );
  const dispatch = useDispatch<AppDispatch>();

  const setUsername = useCallback(
    (value: Username | undefined) => {
      dispatch(setUsernameCache(value));
    },
    [dispatch],
  );

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
          setUsername(data[0]);
        }
      });
  }, [setUsername, user]);

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
