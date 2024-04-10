import {useTheme} from '@shopify/restyle';
import {ESTIMATED_TABBAR_HEIGHT} from 'app/components/common/TabBar/FloatingTabBar';
import {Theme} from 'app/styles/theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export const useBottomPadding = (extraHeight = 0) => {
  const {bottom} = useSafeAreaInsets();
  const theme = useTheme<Theme>();

  return bottom + theme.spacing.mY + ESTIMATED_TABBAR_HEIGHT + extraHeight;
};
