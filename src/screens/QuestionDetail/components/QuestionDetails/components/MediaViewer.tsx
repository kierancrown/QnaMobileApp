import {Center, Text} from 'app/components/common';
import {useAppTheme} from 'app/styles/theme';
import Color from 'color';
import React, {FC} from 'react';
import ImageView from 'react-native-image-viewing';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface ViewerFooterProps {
  imageIndex: number;
  totalImages: number;
}

const ViewerFooter: FC<ViewerFooterProps> = ({imageIndex, totalImages}) => {
  const theme = useAppTheme();
  const bottomInset = useSafeAreaInsets().bottom;
  const bottomColor = Color(theme.colors.mainBackground).alpha(0.4).hexa();

  return (
    <Center style={{paddingBottom: bottomInset}}>
      <Center
        borderRadius="pill"
        px="m"
        py="xsY"
        style={{backgroundColor: bottomColor}}>
        <Text variant="smallBodyBold" color="cardText">
          {imageIndex + 1} / {totalImages}
        </Text>
      </Center>
    </Center>
  );
};

interface ViewerProps {
  mediaUrls: string[];
  selectedIndex: number;
  isVisible: boolean;
  onClose: () => void;
}

const MediaViewer: FC<ViewerProps> = ({
  mediaUrls,
  selectedIndex,
  isVisible,
  onClose,
}) => {
  const theme = useAppTheme();

  return (
    <ImageView
      images={mediaUrls.map(url => ({uri: url}))}
      imageIndex={selectedIndex}
      visible={isVisible}
      backgroundColor={theme.colors.mainBackground}
      // eslint-disable-next-line react/no-unstable-nested-components
      FooterComponent={({imageIndex}) => (
        <ViewerFooter imageIndex={imageIndex} totalImages={mediaUrls.length} />
      )}
      onRequestClose={onClose}
    />
  );
};

export default MediaViewer;
