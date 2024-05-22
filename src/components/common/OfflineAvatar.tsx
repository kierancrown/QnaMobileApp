import React, {forwardRef, useEffect, useImperativeHandle} from 'react';
import {Box} from './';
import {Theme} from 'app/styles/theme';
import {useTheme} from '@shopify/restyle';
import {ImageStyle, StyleProp} from 'react-native';

import {FasterImageView} from '@candlefinance/faster-image';
import {supabase} from 'app/lib/supabase';

interface AvatarProps {
  uri?: string;
  blurhash?: string;
  defaultAvatar?: boolean;
  size?: keyof Theme['iconSizes'];
}

export interface AvatarRef {
  refresh: () => void;
}

const styles: StyleProp<ImageStyle> = {
  width: '100%',
  height: '100%',
};

const DEFAULT_AVATAR =
  'https://api.askthat.co/storage/v1/object/public/user_profile_pictures/default.jpg';

const OfflineAvatar = forwardRef<AvatarRef, AvatarProps>((props, ref) => {
  const [url, setUrl] = React.useState<string>();
  const {uri, blurhash, size, defaultAvatar} = props;
  const theme = useTheme<Theme>();

  useImperativeHandle(ref, () => ({
    refresh: () => {},
  }));

  useEffect(() => {
    if (!uri) {
      return;
    }
    const generatedUrl = supabase.storage
      .from('user_profile_pictures')
      .getPublicUrl(uri).data;
    setUrl(generatedUrl.publicUrl);
  }, [uri]);

  return (
    <Box
      overflow="hidden"
      borderRadius="pill"
      bg="cardBackground"
      width={size ? theme.iconSizes[size] : theme.iconSizes.xl}
      height={size ? theme.iconSizes[size] : theme.iconSizes.xl}>
      <FasterImageView
        style={styles}
        onError={event => console.warn(event.nativeEvent.error)}
        source={{
          transitionDuration: 0.3,
          cachePolicy: 'discWithCacheControl',
          resizeMode: 'cover',
          blurhash: blurhash,
          progressiveLoadingEnabled: true,
          showActivityIndicator: true,
          failureImage: DEFAULT_AVATAR,
          url: defaultAvatar ? DEFAULT_AVATAR : url ?? DEFAULT_AVATAR,
        }}
      />
    </Box>
  );
});

export default OfflineAvatar;
