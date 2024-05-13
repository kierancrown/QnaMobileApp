import {Header} from '@codeherence/react-native-header';
import {SharedValue, useSharedValue} from 'react-native-reanimated';
import {Center, Text} from 'app/components/common';
import React from 'react';

import BackIcon from 'app/assets/icons/arrows/ArrowLeft.svg';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {ProfileStackParamList} from 'app/navigation/ProfileStack';
import {useAppTheme} from 'app/styles/theme';

export const HeaderComponent = ({}: {showNavBar: SharedValue<number>}) => {
  const {goBack} = useNavigation<NavigationProp<ProfileStackParamList>>();
  const {
    params: {headerTitle},
  } = useRoute<RouteProp<ProfileStackParamList, 'Settings'>>();
  const theme = useAppTheme();
  const showNavBar = useSharedValue(1);

  return (
    <Header
      showNavBar={showNavBar}
      noBottomBorder
      headerLeft={
        <TouchableOpacity
          onPress={goBack}
          hitSlop={8}
          accessibilityLabel="Go back"
          accessibilityRole="button"
          accessibilityHint="Go back to previous screen">
          <Center py="xxsY" px="xxs">
            <BackIcon width={theme.iconSizes.l} height={theme.iconSizes.l} />
          </Center>
        </TouchableOpacity>
      }
      headerCenter={
        <Center py="xxsY">
          <Text variant="medium">{headerTitle}</Text>
        </Center>
      }
    />
  );
};

export default HeaderComponent;
