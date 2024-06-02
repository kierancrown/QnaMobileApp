import React, {forwardRef, useImperativeHandle} from 'react';
import {Box} from './';
import {Theme} from 'app/styles/theme';
import {useTheme} from '@shopify/restyle';
import {ImageStyle, StyleProp} from 'react-native';

import {FasterImageView} from '@candlefinance/faster-image';
import {DEFAULT_AVATAR} from 'app/constants';

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

const OfflineAvatar = forwardRef<AvatarRef, AvatarProps>((props, ref) => {
  const {uri, blurhash, size, defaultAvatar} = props;
  const theme = useTheme<Theme>();

  useImperativeHandle(ref, () => ({
    refresh: () => {},
  }));

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
          url: defaultAvatar ? DEFAULT_AVATAR : uri ?? DEFAULT_AVATAR,
        }}
      />
    </Box>
  );
});

export default OfflineAvatar;
