import React, {forwardRef, useImperativeHandle} from 'react';
import {Box} from './';
import FastImage, {ImageStyle} from 'react-native-fast-image';
import {Theme} from 'app/styles/theme';
import {useTheme} from '@shopify/restyle';
import {useProfilePicture} from 'app/hooks/useProfilePicture';
import {Image, StyleProp} from 'react-native';

interface AvatarProps {
  userId?: number;
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

const Avatar = forwardRef<AvatarRef, AvatarProps>((props, ref) => {
  const {userId, size, defaultAvatar} = props;
  const theme = useTheme<Theme>();
  const {profilePicture, refreshProfilePicture} = useProfilePicture(
    userId,
    theme.iconSizes[size ?? 'xl'],
  );

  useImperativeHandle(ref, () => ({
    refresh: () => {
      refreshProfilePicture();
    },
  }));

  return (
    <Box
      overflow="hidden"
      borderRadius="pill"
      bg="cardBackground"
      width={size ? theme.iconSizes[size] : theme.iconSizes.xl}
      height={size ? theme.iconSizes[size] : theme.iconSizes.xl}>
      {defaultAvatar || profilePicture == null ? (
        <Image
          // @ts-ignore
          style={styles}
          source={require('app/assets/images/avatar.jpg')}
        />
      ) : (
        <FastImage
          style={styles}
          resizeMode="cover"
          fallback
          source={{
            uri: profilePicture,
            cache: FastImage.cacheControl.web,
          }}
        />
      )}
    </Box>
  );
});

export default Avatar;
