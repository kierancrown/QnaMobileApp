import {useEffect, useState} from 'react';
import {supabase} from 'app/lib/supabase';
import {useUser} from 'app/lib/supabase/context/auth';
import {PixelRatio} from 'react-native';

export const useProfilePicture = (userId?: number, size?: number) => {
  const {user} = useUser();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const imageSize = parseInt(((size ?? 100) * PixelRatio.get()).toFixed(), 10);

  useEffect(() => {
    if (!user) {
      setProfilePicture(null);
      return;
    }
    supabase
      .from('user_metadata')
      .select('profile_picture_key')
      .eq('user_id', userId ?? user.id)
      .then(({data, error}) => {
        if (error) {
          console.error('Error getting profile picture', error);
          return;
        }
        if (data?.length > 0 && data[0].profile_picture_key) {
          const d = supabase.storage
            .from('user_profile_pictures')
            .getPublicUrl(data[0].profile_picture_key, {
              transform: {
                width: imageSize,
                height: imageSize,
              },
            }).data;
          setProfilePicture(d.publicUrl);
        }
      });
  }, [imageSize, user, userId]);

  return {profilePicture};
};
