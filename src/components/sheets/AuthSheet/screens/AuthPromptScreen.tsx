import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {Button, Center, SafeAreaView, VStack} from 'app/components/common';
import React, {FC} from 'react';
import {AuthStackParamList} from '..';
import {useAppSelector} from 'app/redux/store';
import Logo from 'app/assets/logo_new_text.svg';
import {useAppTheme} from 'app/styles/theme';
import {SCREEN_HEIGHT} from '@gorhom/bottom-sheet';
import {Typewriter} from '../components/Typewriter';

const AuthPromptScreen: FC = () => {
  const {
    params: {},
  } = useRoute<RouteProp<AuthStackParamList, 'AuthScreen'>>();
  const theme = useAppTheme();
  const {sheetOpen} = useAppSelector(state => state.nonPersistent.authSheet);
  const {navigate} = useNavigation<NavigationProp<AuthStackParamList>>();

  return (
    <SafeAreaView edges={['bottom']} style={{maxHeight: SCREEN_HEIGHT / 2}}>
      <VStack flex={1} py="mY" px="l" justifyContent="space-between">
        <VStack rowGap="mY" flex={1} py="mY">
          <Logo height={theme.iconSizes.xxxl} width="100%" />
          <Center flex={1} rowGap="mY">
            <Typewriter enabled={sheetOpen} />
          </Center>
        </VStack>

        <VStack rowGap="lY">
          <Button
            variant="primary"
            title="Login"
            titleVariant="bodyBold"
            borderRadius="textInput"
            minWidth="100%"
            // @ts-ignore
            onPress={() => navigate('AuthScreen')}
          />
        </VStack>
      </VStack>
    </SafeAreaView>
  );
};

export default AuthPromptScreen;
