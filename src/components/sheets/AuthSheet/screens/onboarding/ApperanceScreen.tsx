import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {Button, Center, Text, VStack} from 'app/components/common';
import React, {FC, useState} from 'react';
import {AuthStackParamList} from '../..';
import {useAppTheme} from 'app/styles/theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SCREEN_HEIGHT} from '@gorhom/bottom-sheet';
import {useSheetNavigationHeight} from '../../hooks/useSheetNavigationHeight';
import {Keyboard, Pressable} from 'react-native';
import {FlexStyle} from 'app/helpers/commonStyles';
import {useOnboarding} from 'app/hooks/useOnboarding';
import OfflineAvatar from 'app/components/common/OfflineAvatar';

const ApperanceScreen: FC = () => {
  const {
    params: {},
  } = useRoute<RouteProp<AuthStackParamList, 'AuthScreen'>>();
  const theme = useAppTheme();
  const {top: topSafeAreaInset, bottom: bottomSafeAreaInset} =
    useSafeAreaInsets();
  const {navigate} = useNavigation<NavigationProp<AuthStackParamList>>();
  useSheetNavigationHeight(
    SCREEN_HEIGHT - topSafeAreaInset - theme.spacing.mY,
    false,
  );
  const {} = useOnboarding();
  const [settingInformation, setSettingInformation] = useState(false);

  const nextStep = async () => {
    setSettingInformation(true);
    // const result = await completeStep1(username, bio);
    // if (result) {
    //   // navigate('AuthScreen');
    // } else {
    //   setSettingInformation(false);
    //   openAlert({
    //     title: 'Something went wrong',
    //     message: 'Please try again',
    //   });
    // }
  };

  return (
    <Pressable style={FlexStyle} onPress={() => Keyboard.dismiss()}>
      <VStack py="mY" px="s" pt="xlY" flex={1}>
        <VStack px="s" pb="xxlY" rowGap="xsY">
          <Text variant="header">Let's get started</Text>
          <Text variant="bodyBold">Show people what you look like</Text>
        </VStack>

        <Center>
          <OfflineAvatar size="xxxxl" defaultAvatar />
        </Center>
      </VStack>
      <VStack px="s" style={{paddingBottom: bottomSafeAreaInset}}>
        <Button
          variant="primary"
          title="Next"
          titleVariant="bodyBold"
          borderRadius="textInput"
          minWidth="100%"
        />
      </VStack>
    </Pressable>
  );
};

export default ApperanceScreen;
