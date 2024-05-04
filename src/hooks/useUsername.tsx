import {useCallback, useEffect, useState} from 'react';
import {supabase} from 'app/lib/supabase';
import {useUser} from 'app/lib/supabase/context/auth';
import {setUsernameCache} from 'app/redux/slices/authSlice';
import {AppDispatch, RootState} from 'app/redux/store';
import {useDispatch, useSelector} from 'react-redux';

interface useUsernameProps {
  userId?: string;
}

export const useUsername = (props: useUsernameProps | undefined) => {
  const userId = props?.userId;
  const {user} = useUser();
  const dispatch = useDispatch<AppDispatch>();
  const [otherUsername, setOtherUsername] = useState('');
  const [otherVerified, setOtherVerified] = useState(false);

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
        setOtherUsername(value?.username ?? '');
        setOtherVerified(value?.isVerified ?? false);
      } else {
        dispatch(setUsernameCache(value));
      }
    },
    [dispatch, user],
  );

  useEffect(() => {
    if (!user && !userId) {
      setUsername(undefined);
      return;
    }
    supabase
      .from('user_metadata')
      .select('username, verified')
      .eq('user_id', user ? user.id : userId!)
      .then(({data, error}) => {
        if (error) {
          console.error('Error getting username', error);
          return;
        }
        if (data.length && data[0].username) {
          setUsername({
            username: data[0].username,
            isVerified: data[0].verified,
          });
        }
      });
  }, [setUsername, user, userId]);

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
    username: userId ? otherUsername : username,
    isVerified: userId ? otherVerified : isVerified,
    updateUsername,
  };
};
