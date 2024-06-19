import {useCallback, useEffect, useState} from 'react';
import {supabase} from 'app/lib/supabase';
import {PixelRatio} from 'react-native';
import {useAuth} from 'app/wrappers/AuthProvider';

export const useProfilePicture = (userId?: string, size?: number) => {
  const {profile, authStatus} = useAuth();
  const [profilePictureThumbhash, setProfilePictureThumbhash] =
    useState<string>();
  const [profilePicture, setProfilePicture] = useState<string>();
  const imageSize = parseInt(((size ?? 100) * PixelRatio.get()).toFixed(), 10);

  const refreshProfilePicture = useCallback(() => {
    if (authStatus !== 'SIGNED_IN' || !profile?.user_id) {
      setProfilePicture(undefined);
      return;
    }
    supabase
      .from('user_metadata')
      .select(
        `
        user_id,
        profile_picture (
          path,
          thumbhash
        )
        `,
      )
      .eq('user_id', userId ?? profile.user_id)
      .single()
      .then(({data, error}) => {
        if (error) {
          console.error('Error getting profile picture', error);
          return;
        }
        // @ts-ignore
        if (data && data.profile_picture && data.profile_picture.path) {
          const d = supabase.storage
            .from('user_profile_pictures')
            // @ts-ignore
            .getPublicUrl(data.profile_picture.path, {
              transform: {
                width: imageSize,
                height: imageSize,
              },
            }).data;
          // @ts-ignore
          setProfilePictureThumbhash(data.profile_picture.thumbhash);
          setProfilePicture(d.publicUrl);
        }
      });
  }, [authStatus, imageSize, profile?.user_id, userId]);

  // const deleteProfilePicture = async (): Promise<boolean> => {
  //   return new Promise((resolve, reject) => {
  //     if (!user) {
  //       setProfilePicture(null);
  //       resolve(false);
  //       return;
  //     }

  //     supabase
  //       .from('user_metadata')
  //       .select('profile_picture_key')
  //       .eq('user_id', userId ?? user.id)
  //       .then(({data, error}) => {
  //         if (error) {
  //           console.error('Error getting profile picture', error);
  //           reject(error);
  //         }
  //         if (data?.length && data.length > 0 && data[0].profile_picture_key) {
  //           supabase.storage
  //             .from('user_profile_pictures')
  //             .remove([data[0].profile_picture_key])
  //             .then(({error: innerErr}) => {
  //               if (innerErr) {
  //                 console.error('Error deleting profile picture', innerErr);
  //                 reject(innerErr);
  //               }
  //             });
  //           setProfilePicture(null);
  //         } else {
  //           console.log('No profile picture found');
  //         }
  //         resolve(true);
  //       });

  //     resolve(false);
  //   });
  // };

  useEffect(() => {
    refreshProfilePicture();
  }, [userId, size, refreshProfilePicture]);

  return {
    profilePicture,
    profilePictureThumbhash,
    refreshProfilePicture,
  };
};
