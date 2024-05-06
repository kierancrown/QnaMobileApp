import {Header} from '@codeherence/react-native-header';
import {SharedValue} from 'react-native-reanimated';
import {Center, Text} from 'app/components/common';
import React from 'react';

import BackIcon from 'app/assets/icons/arrows/ArrowLeft.svg';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {ProfileStackParamList} from 'app/navigation/ProfileStack';
import {useAppTheme} from 'app/styles/theme';

export const HeaderComponent = ({
  showNavBar,
}: {
  showNavBar: SharedValue<number>;
}) => {
  const {goBack} = useNavigation<NavigationProp<ProfileStackParamList>>();
  const theme = useAppTheme();

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
          <Text variant="medium">Settings</Text>
        </Center>
      }
    />
  );
};

export default HeaderComponent;
