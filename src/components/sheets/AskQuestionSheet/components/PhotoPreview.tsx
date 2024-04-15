import {Box, Center, HStack} from 'app/components/common';
import {useAppTheme} from 'app/styles/theme';
import {percentHeight} from 'app/utils/size';
import React, {FC} from 'react';
import {
  Image,
  ImageStyle,
  StyleProp,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {Asset} from 'react-native-image-picker';
import CloseIcon from 'app/assets/icons/actions/Close.svg';

interface PhotoPreviewProps {
  photos: Asset[];
  removePhoto: (index: number) => void;
}

const PhotoPreview: FC<PhotoPreviewProps> = ({photos, removePhoto}) => {
  const theme = useAppTheme();
  return (
    <HStack columnGap="s">
      {photos.map((photo, index) => {
        const style: StyleProp<ImageStyle> = {
          width: '100%',
          height: '100%',
          aspectRatio:
            !photo.height || !photo.width ? 1 : photo.width / photo.height,
        };

        const shadowStyle: StyleProp<ViewStyle> = {
          shadowColor: theme.colors.black,
          shadowOffset: {width: -2, height: 2},
          shadowOpacity: 0.66,
          shadowRadius: 8,
        };

        return (
          <Box
            key={index}
            maxHeight={percentHeight(20)}
            borderRadius="m"
            overflow="hidden">
            <Image source={{uri: photo.uri}} style={style} />
            <Box
              position="absolute"
              top={theme.spacing.xxsY}
              right={theme.spacing.xxs}>
              <TouchableOpacity hitSlop={8} onPress={() => removePhoto(index)}>
                <Center
                  borderRadius="pill"
                  p="xxs"
                  backgroundColor="segmentItemText">
                  <CloseIcon
                    width={theme.iconSizes.m}
                    height={theme.iconSizes.m}
                    fill={theme.colors.foreground}
                    style={shadowStyle}
                  />
                </Center>
              </TouchableOpacity>
            </Box>
          </Box>
        );
      })}
    </HStack>
  );
};

export default PhotoPreview;
