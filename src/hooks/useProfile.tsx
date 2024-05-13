import {useUser} from 'app/lib/supabase/context/auth';
import {useEffect, useMemo, useState} from 'react';
import {supabase} from 'app/lib/supabase';

export const useProfile = (userId?: string) => {
  const {user} = useUser();
  const uid = useMemo(() => userId || user?.id, [userId, user]);

  const [username, setUsername] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('');
  const [verified, setVerified] = useState<boolean>(false);

  useEffect(() => {
    if (!uid) {
      setUsername('');
      setVerified(false);
      return;
    }
    supabase
      .from('user_metadata')
      .select('username, verified, profile_picture')
      .eq('user_id', uid)
      .single()
      .then(({data, error}) => {
        if (error) {
          console.error('Error getting username', error);
          return;
        }
        if (data) {
          setUsername(data.username || 'Anonymous');
          setAvatar(data.profile_picture || '');
          setVerified(data.verified);
        }
      });
  }, [uid, user, userId]);

  return {username, avatar, verified};
};

export default useProfile;
