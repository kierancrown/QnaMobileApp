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
import {openAlert} from 'app/redux/slices/alertSlice';

const TopicsScreen: FC = () => {
  const {
    params: {},
  } = useRoute<RouteProp<AuthStackParamList, 'AuthScreen'>>();
  const theme = useAppTheme();
  const {top: topSafeAreaInset, bottom: bottomSafeAreaInset} =
    useSafeAreaInsets();
  useSheetNavigationHeight(
    SCREEN_HEIGHT - topSafeAreaInset - theme.spacing.mY,
    false,
  );
  const {navigate} = useNavigation<NavigationProp<AuthStackParamList>>();
  const {completeOnboarding} = useOnboarding();
  const [settingInformation, setSettingInformation] = useState(false);

  const nextStep = async () => {
    console.log('nextStep');
    setSettingInformation(true);
    const result = await completeOnboarding();
    if (result) {
      navigate('OnboardingCommunityGuidelinesScreen');
    } else {
      setSettingInformation(false);
      openAlert({
        title: 'Something went wrong',
        message: 'Please try again',
      });
    }
  };

  return (
    <Pressable style={FlexStyle} onPress={() => Keyboard.dismiss()}>
      <VStack py="mY" px="s" pt="xlY" flex={1}>
        <VStack px="s" pb="xxlY" rowGap="xsY">
          <Text variant="header">Let's get started</Text>
          <Text variant="bodyBold">
            Pick some topics you're interested in to customise your experiance
          </Text>
        </VStack>

        <Center>
          <Text textAlign="center">
            Well this is embarassing... I haven't coded this yet
          </Text>
        </Center>
      </VStack>
      <VStack px="s" style={{paddingBottom: bottomSafeAreaInset}}>
        <Button
          variant="primary"
          title="Next"
          titleVariant="bodyBold"
          borderRadius="textInput"
          minWidth="100%"
          onPress={nextStep}
          disabled={settingInformation}
        />
      </VStack>
    </Pressable>
  );
};

export default TopicsScreen;
