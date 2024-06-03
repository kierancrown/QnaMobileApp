import {useCallback, useEffect} from 'react';
import {supabase} from 'app/lib/supabase';
import {useUser} from 'app/lib/supabase/context/auth';
import {setAvatarImageUrl, setUsernameCache} from 'app/redux/slices/authSlice';
import {RootState, useAppDispatch} from 'app/redux/store';
import {useSelector} from 'react-redux';

export const useUsername = () => {
  const {user} = useUser();
  const dispatch = useAppDispatch();

  const username = useSelector(
    (state: RootState) => state.persistent.auth.username,
  );
  const isVerified = useSelector(
    (state: RootState) => state.persistent.auth.isVerified,
  );

  const setUsername = useCallback(
    (
      value:
        | {
            username: string;
            isVerified: boolean;
          }
        | undefined,
    ) => {
      if (!user) {
      } else {
        dispatch(setUsernameCache(value));
      }
    },
    [dispatch, user],
  );

  useEffect(() => {
    if (!user) {
      setUsername(undefined);
      return;
    }
    supabase
      .from('user_metadata')
      .select('username, verified, profile_picture')
      .eq('user_id', user.id!)
      .then(({data, error}) => {
        if (error) {
          console.error('Error getting username', error);
          return;
        }
        if (data.length) {
          if (data[0].username) {
            setUsername({
              username: data[0].username,
              isVerified: data[0].verified,
            });
          }
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    }
    setUsername({
      username: data[0].username,
      isVerified,
    });
    return true;
  };

  return {
    username,
    isVerified,
    updateUsername,
  };
};
