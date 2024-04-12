import {Alert, KeyboardAvoidingView, Platform, StyleSheet} from 'react-native';
import React, {FC, useState} from 'react';
import {Text, Center, SafeAreaView, VStack, Button, HStack, Flex} from 'ui';
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
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.select({
          ios: 'padding',
          android: undefined,
        })}>
        <VStack flex={1} mx="l" py="lY">
          <VStack flex={1} rowGap="xxlY">
            <Center>
              <Logo
                width={theme.iconSizes.logo}
                height={theme.iconSizes.logo}
              />
            </Center>

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

          <VStack rowGap="lY">
            <Button
              title="Magic Link"
              disabled={!email.trim().length}
              loading={loading}
              onPress={sendMagicLink}
              fullWidth
            />

            <Button
              title="Skip Login"
              variant="text"
              onPress={skipLogin}
              disabled={loading}
              alignSelf="center"
            />
          </VStack>
        </VStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});

export default Auth;
