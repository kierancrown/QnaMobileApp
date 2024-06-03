import React, {FC, useCallback, useRef} from 'react';
import BottomSheet, {SCREEN_HEIGHT} from '@gorhom/bottom-sheet';
import Content from './Content';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CustomBackground from './Background';
import {useSharedValue} from 'react-native-reanimated';
import {useAppTheme} from 'app/styles/theme';
import CustomBackdrop from '../../common/Sheets/Backdrop';
import {HapticFeedbackTypes, useHaptics} from 'app/hooks/useHaptics';

interface MagicLinkSentSheetProps {
  open?: boolean;
  onClose?: () => void;
  sentTimestamp: number;
  onResend: () => void;
  resending?: boolean;
  email?: string;
}

const MagicLinkSentSheet: FC<MagicLinkSentSheetProps> = ({
  open = false,
  onClose,
  sentTimestamp,
  onResend,
  email,
  resending = false,
}) => {
  const theme = useAppTheme();
  const {triggerHaptic} = useHaptics();
  const sheetRef = useRef<BottomSheet>(null);
  const animatedPosition = useSharedValue(0);
  const {top: topSafeAreaInset, bottom: bottomSafeAreaInset} =
    useSafeAreaInsets();

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose?.();
      } else if (index === 0) {
        (async () => {
          await triggerHaptic(HapticFeedbackTypes.soft);
        })();
      }
    },
    [onClose, triggerHaptic],
  );

  return (
    <BottomSheet
      index={open ? 0 : -1}
      ref={sheetRef}
      animatedIndex={animatedPosition}
      enableDynamicSizing
      enablePanDownToClose
      keyboardBehavior="extend"
      maxDynamicContentSize={SCREEN_HEIGHT - topSafeAreaInset}
      onChange={handleSheetChanges}
      backdropComponent={CustomBackdrop}
      handleComponent={null}
      backgroundComponent={CustomBackground}
      detached={true}
      bottomInset={
        bottomSafeAreaInset > 0 ? bottomSafeAreaInset : theme.spacing.mY
      }>
      <Content
        onDismiss={() => {
          sheetRef.current?.close();
        }}
        sentTimestamp={sentTimestamp}
        onResend={onResend}
        resending={resending}
        email={email}
      />
    </BottomSheet>
  );
};

export default MagicLinkSentSheet;
