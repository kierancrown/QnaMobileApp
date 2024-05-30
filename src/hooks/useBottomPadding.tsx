import {useTheme} from '@shopify/restyle';
import {ESTIMATED_TABBAR_HEIGHT} from 'app/components/common/TabBar/FloatingTabBar';
import {useTabBar} from 'app/context/tabBarContext';
import {Theme} from 'app/styles/theme';
import {useMemo} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export const useBottomPadding = (extraHeight = 0) => {
  const {bottom} = useSafeAreaInsets();
  const {hidden} = useTabBar();
  const theme = useTheme<Theme>();

  const value = useMemo(
    () =>
      bottom +
      theme.spacing.mY +
      extraHeight +
      (hidden ? 0 : ESTIMATED_TABBAR_HEIGHT),
    [bottom, theme.spacing.mY, extraHeight, hidden],
  );

  return value;
};
