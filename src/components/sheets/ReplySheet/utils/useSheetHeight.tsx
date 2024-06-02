import {useAppTheme} from 'app/styles/theme';
import {useMemo} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const useSheetHeight = () => {
  const theme = useAppTheme();
  const bottomSafeAreaInset = useSafeAreaInsets().bottom;
  const height = useMemo(
    () =>
      bottomSafeAreaInset +
      theme.spacing.mY * 2 +
      theme.textVariants.composeInput.lineHeight +
      theme.spacing.sY * 2,
    [bottomSafeAreaInset, theme],
  );

  return height;
};

export default useSheetHeight;
