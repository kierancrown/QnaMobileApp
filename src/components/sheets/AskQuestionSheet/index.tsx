import React, {FC, useCallback, useMemo, useRef, useState} from 'react';
import BottomSheet, {SCREEN_HEIGHT} from '@gorhom/bottom-sheet';
import Screen from './Content';
import {Alert, Keyboard, Pressable, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import CustomBackground from '../../common/Sheets/Background';
import CustomBackdrop from './Backdrop';
import {Button, Center, Flex, HStack, Icon} from 'app/components/common';
import {useAppTheme} from 'app/styles/theme';
import CloseIcon from 'app/assets/icons/actions/Close.svg';

interface AskQuestionSheetProps {
  open?: boolean;
  onClose?: () => void;
}

const AskQuestionSheet: FC<AskQuestionSheetProps> = ({
  open = false,
  onClose,
}) => {
  const sheetRef = useRef<BottomSheet>(null);
  const animatedPosition = useSharedValue(0);
  const topSafeAreaInset = useSafeAreaInsets().top;

  const [loading, setLoading] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);

  const theme = useAppTheme();
  const BUTTON_CONTAINER_HEIGHT = theme.spacing.xlY;
  const snapPoints = useMemo(
    () => [
      SCREEN_HEIGHT -
        topSafeAreaInset -
        theme.spacing.mY -
        BUTTON_CONTAINER_HEIGHT,
    ],
    [topSafeAreaInset, theme, BUTTON_CONTAINER_HEIGHT],
  );

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose?.();
      }
    },
    [onClose],
  );

  const onDismiss = () => {
    sheetRef.current?.close();
  };

  const buttonsContainerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          animatedPosition.value,
          [-1, 0],
          [theme.spacing.lY, 0],
          Extrapolation.CLAMP,
        ),
      },
    ],
    opacity: interpolate(
      animatedPosition.value,
      [-0.5, 0],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  return (
    <>
      <Animated.View
        style={[
          styles.buttons,
          {bottom: snapPoints[0] + theme.spacing.sY},
          buttonsContainerAnimatedStyle,
        ]}>
        <HStack alignItems="center" height={BUTTON_CONTAINER_HEIGHT} px="m">
          <Pressable hitSlop={16} onPress={onDismiss}>
            <Center>
              <Icon icon={<CloseIcon />} color="foreground" size="l" />
            </Center>
          </Pressable>
          <Flex />
          <Button
            title="Ask"
            disabled={!canSubmit}
            py="none"
            height={BUTTON_CONTAINER_HEIGHT}
            justifyContent="center"
            borderRadius="pill"
            px="l"
            onPress={() => {
              Alert.alert('hi');
            }}
          />
        </HStack>
      </Animated.View>
      <BottomSheet
        snapPoints={snapPoints}
        index={open ? 0 : -1}
        ref={sheetRef}
        animateOnMount={false}
        animatedIndex={animatedPosition}
        enablePanDownToClose={!loading}
        keyboardBehavior="extend"
        maxDynamicContentSize={SCREEN_HEIGHT - topSafeAreaInset}
        onChange={handleSheetChanges}
        backdropComponent={CustomBackdrop}
        handleComponent={null}
        backgroundComponent={CustomBackground}
        onAnimate={(fromIndex, toIndex) => {
          if (fromIndex === 0 && toIndex === -1) {
            Keyboard.dismiss();
          }
        }}>
        <Screen
          open={open}
          onLoading={setLoading}
          animatedIndex={animatedPosition}
          onDismiss={onDismiss}
          onCanSubmit={setCanSubmit}
        />
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  buttons: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 999,
  },
});

export default AskQuestionSheet;
