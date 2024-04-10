import React, {FC, useCallback, useMemo, useRef, useState} from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import Screen from './Content';
import {Dimensions, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import theme from 'app/styles/theme';
import {useSharedValue} from 'react-native-reanimated';
import CustomBackground from '../../common/Sheets/Background';
import CustomBackdrop from '../../common/Sheets/Backdrop';

interface AskQuestionSheetProps {
  open?: boolean;
  onClose?: () => void;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;
const AskQuestionSheet: FC<AskQuestionSheetProps> = ({
  open = false,
  onClose,
}) => {
  const sheetRef = useRef<BottomSheet>(null);
  const animatedPosition = useSharedValue(0);
  const topSafeAreaInset = useSafeAreaInsets().top;
  const [loading, setLoading] = useState(false);
  const snapPoints = useMemo(
    () => [SCREEN_HEIGHT - topSafeAreaInset - theme.spacing.m],
    [topSafeAreaInset],
  );

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose?.();
      }
    },
    [onClose],
  );

  return (
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
      style={styles.sheet}>
      <Screen
        open={open}
        onLoading={setLoading}
        animatedIndex={animatedPosition}
        onDismiss={() => {
          sheetRef.current?.close();
        }}
      />
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  sheet: {},
  sheetContainer: {
    backgroundColor: theme.colors.mainBackground,
  },
});

export default AskQuestionSheet;
