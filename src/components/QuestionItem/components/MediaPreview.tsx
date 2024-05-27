import React, {FC} from 'react';
import {VStack, HStack, Box} from 'app/components/common';
import {FasterImageView} from '@candlefinance/faster-image';
import {ImageStyle, Pressable} from 'react-native';

interface MediaPreviewProps {
  media: string[];
  isTouchEnabled?: boolean;
}

const imageStyle: ImageStyle = {width: '101%', height: '101%'};
const MediaPreview: FC<MediaPreviewProps> = ({media, isTouchEnabled}) => {
  const rows = media.length > 2 ? 2 : 1;

  return (
    <Box
      overflow="hidden"
      width={'100%'}
      aspectRatio={1}
      bg="cardBackground"
      borderRadius="m">
      <VStack flex={1} rowGap="xxs">
        <HStack flex={1} columnGap="xxs">
          <Box bg="cardText" flex={1} overflow="hidden" borderRadius="s">
            <Pressable disabled={!isTouchEnabled}>
              <FasterImageView
                source={{url: media[0], resizeMode: 'cover'}}
                style={imageStyle}
              />
            </Pressable>
          </Box>
          {media.length > 1 && (
            <Box bg="cardText" flex={1} overflow="hidden" borderRadius="s">
              <Pressable disabled={!isTouchEnabled}>
                <FasterImageView
                  source={{url: media[1], resizeMode: 'cover'}}
                  style={imageStyle}
                />
              </Pressable>
            </Box>
          )}
        </HStack>
        {rows === 2 && (
          <HStack flex={1} columnGap="xxs">
            <Box bg="cardText" flex={1} overflow="hidden" borderRadius="s">
              <Pressable disabled={!isTouchEnabled}>
                <FasterImageView
                  source={{url: media[2], resizeMode: 'cover'}}
                  style={imageStyle}
                />
              </Pressable>
            </Box>
            {media.length > 3 && (
              <Box bg="cardText" flex={1} overflow="hidden" borderRadius="s">
                <Pressable disabled={!isTouchEnabled}>
                  <FasterImageView
                    source={{url: media[3], resizeMode: 'cover'}}
                    style={imageStyle}
                  />
                </Pressable>
              </Box>
            )}
          </HStack>
        )}
      </VStack>
    </Box>
  );
};

export default MediaPreview;
