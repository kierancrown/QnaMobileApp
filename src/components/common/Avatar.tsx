import React, {FC} from 'react';
import {Box} from './';
import FastImage, {ImageStyle} from 'react-native-fast-image';
import {Theme} from 'app/styles/theme';
import {useTheme} from '@shopify/restyle';
import {useProfilePicture} from 'app/hooks/useProfilePicture';

interface AvatarProps {
  userId?: number;
  size?: keyof Theme['iconSizes'];
}

const styles: ImageStyle = {width: '100%', height: '100%'};

const Avatar: FC<AvatarProps> = ({userId, size}) => {
  const theme = useTheme<Theme>();
  const {profilePicture} = useProfilePicture(
    userId,
    theme.iconSizes[size ?? 'xl'],
  );

  return (
    <Box
      overflow="hidden"
      borderRadius="pill"
      bg="cardBackground"
      width={size ? theme.iconSizes[size] : theme.iconSizes.xl}
      height={size ? theme.iconSizes[size] : theme.iconSizes.xl}>
      <FastImage
        style={styles}
        resizeMode="cover"
        source={{
          uri: profilePicture ?? require('app/assets/images/avatar.jpg'),
          cache: FastImage.cacheControl.web,
        }}
      />
    </Box>
  );
};

export default Avatar;
