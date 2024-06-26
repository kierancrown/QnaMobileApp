import {
  NavigationProp,
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {
  ActivityLoader,
  Box,
  Button,
  Center,
  Flex,
  SafeAreaView,
  Text,
  VStack,
} from 'app/components/common';
import React, {FC, useEffect, useRef, useState} from 'react';
import {AuthStackParamList} from '..';
import Input from 'app/components/common/TextInput';
import {TextInput} from 'react-native';
import {useAppSelector} from 'app/redux/store';
import {useAppTheme} from 'app/styles/theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SCREEN_HEIGHT} from '@gorhom/bottom-sheet';
import {useSheetNavigationHeight} from '../hooks/useSheetNavigationHeight';

import AtIcon from 'app/assets/icons/envelope.svg';
import {supabase} from 'app/lib/supabase';
import {openAlert} from 'app/redux/slices/alertSlice';

const isValidEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const AuthScreen: FC = () => {
  const {
    params: {authType},
  } = useRoute<RouteProp<AuthStackParamList, 'AuthScreen'>>();
  const open = useAppSelector(state => state.nonPersistent.authSheet.sheetOpen);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const theme = useAppTheme();
  const topSafeAreaInset = useSafeAreaInsets().top;
  const {navigate} = useNavigation<NavigationProp<AuthStackParamList>>();
  useSheetNavigationHeight(
    SCREEN_HEIGHT - topSafeAreaInset - theme.spacing.mY,
    false,
  );

  useEffect(() => {
    if (!open) {
      setEmail('');
      inputRef.current?.blur();
    }
  }, [open]);

  useFocusEffect(() => {
    inputRef.current?.focus();
  });

  const submit = async () => {
    setLoading(true);
    const {error} = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: authType === 'magic_link' ? 'qna://login' : undefined,
        // shouldCreateUser: false,
      },
    });
    setLoading(false);
    if (error) {
      openAlert({
        title: 'Login Error',
        message: error.message,
      });
      return;
    } else {
      navigate(
        authType === 'magic_link' ? 'MagicLinkConfirmationScreen' : 'OtpScreen',
        {
          email,
          sentTimestamp: Date.now(),
        },
      );
    }
  };

  return (
    <SafeAreaView edges={['bottom']}>
      <VStack py="mY" px="s" rowGap="xxlY" pt="xlY">
        <VStack px="s" rowGap="xsY">
          <Text variant="header">Login</Text>
          <Text variant="bodyBold">
            We'll send a {authType === 'magic_link' ? 'magic link' : 'code'} to
            your email
          </Text>
        </VStack>
        <Input
          value={email}
          ref={inputRef}
          leftAdornment={
            loading ? (
              <Box
                width={theme.iconSizes.intermediate}
                height={theme.iconSizes.intermediate}>
                <Center
                  position="absolute"
                  width={theme.iconSizes.intermediate}
                  height={theme.iconSizes.intermediate}>
                  <ActivityLoader size={theme.iconSizes.xl} />
                </Center>
              </Box>
            ) : (
              <AtIcon
                width={theme.iconSizes.intermediate}
                height={theme.iconSizes.intermediate}
                color={theme.colors.inputPlaceholder}
              />
            )
          }
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
          clearButton
          onClear={() => setEmail('')}
          insideBottomSheet
        />
      </VStack>
      <Flex />
      <VStack px="s">
        <Button
          variant="primary"
          disabled={loading || !isValidEmail(email)}
          title={
            loading
              ? `Delivering ${
                  authType === 'magic_link' ? 'magic link' : 'code'
                }`
              : `Send ${authType === 'magic_link' ? 'magic link' : 'code'}`
          }
          titleVariant="bodyBold"
          borderRadius="textInput"
          minWidth="100%"
          onPress={submit}
        />
      </VStack>
    </SafeAreaView>
  );
};

export default AuthScreen;
