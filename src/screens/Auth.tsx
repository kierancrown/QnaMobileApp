import {Alert, StyleSheet} from 'react-native';
import React, {FC, useState} from 'react';
import {Text, Center, SafeAreaView, VStack, Button} from 'ui';
import {supabase} from 'app/lib/supabase';
import {useDispatch} from 'react-redux';
import {AppDispatch} from 'app/redux/store';
import {skipAuth} from 'app/redux/slices/authSlice';
import {Theme} from 'app/styles/theme';
import {useTheme} from '@shopify/restyle';

import Logo from 'app/assets/Logo.svg';
import Input from 'app/components/common/TextInput';

const Auth: FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const theme = useTheme<Theme>();

  const dispatch = useDispatch<AppDispatch>();

  const skipLogin = () => {
    dispatch(skipAuth());
  };

  const sendMagicLink = async () => {
    setLoading(true);
    const {error} = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: 'qna://login',
      },
    });
    setLoading(false);
    if (error) {
      Alert.alert('Login Error', error.message);
      return;
    }
  };

  return (
    <SafeAreaView>
      <Center flex={1} rowGap="mY" mx="l">
        <Logo width={theme.iconSizes.logo} height={theme.iconSizes.logo} />
        <VStack width="100%">
          <Input
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />
        </VStack>

        <Button
          title="Magic Link"
          disabled={!email.trim().length}
          loading={loading}
          onPress={sendMagicLink}
        />

        <Button
          title="Skip Login"
          variant="text"
          onPress={skipLogin}
          disabled={loading}
        />
      </Center>
    </SafeAreaView>
  );
};

export default Auth;
