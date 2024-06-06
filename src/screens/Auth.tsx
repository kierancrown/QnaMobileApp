import {KeyboardAvoidingView, Platform, StyleSheet} from 'react-native';
import React, {FC, useMemo, useState} from 'react';
import {Center, SafeAreaView, VStack, Button} from 'ui';
import {supabase} from 'app/lib/supabase';
import {useAppDispatch} from 'app/redux/store';
import {skipAuth} from 'app/redux/slices/authSlice';
import {Theme} from 'app/styles/theme';
import {useTheme} from '@shopify/restyle';

import Logo from 'app/assets/logo_new_text.svg';
import Input from 'app/components/common/TextInput';
import {verifyEmail} from 'app/utils/emailVerification';
import MagicLinkSentSheet from 'app/components/sheets/MagicLinkSentSheet';
import {useAlert} from 'app/components/AlertsWrapper';

const Auth: FC = () => {
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [magicLinkSentTimestamp, setMagicLinkSentTimestamp] = useState(0);
  const [email, setEmail] = useState('');
  const validEmail = useMemo(() => {
    return verifyEmail(email);
  }, [email]);
  const [loading, setLoading] = useState(false);
  const {openAlert} = useAlert();
  const theme = useTheme<Theme>();

  const dispatch = useAppDispatch();

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
      openAlert({
        title: 'Login Error',
        message: error.message,
      });
      return;
    } else {
      setMagicLinkSentTimestamp(Date.now());
      setMagicLinkSent(true);
    }
  };

  return (
    <>
      <SafeAreaView>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.select({
            ios: 'padding',
            android: 'padding',
          })}>
          <VStack flex={1} mx="l" py="lY">
            <VStack flex={1} rowGap="xxlY">
              <Center>
                <Logo
                  width={theme.iconSizes.logo * 3}
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
                disabled={!validEmail}
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
      <MagicLinkSentSheet
        open={magicLinkSent}
        onClose={() => {
          setMagicLinkSent(false);
        }}
        sentTimestamp={magicLinkSentTimestamp}
        onResend={sendMagicLink}
        resending={loading}
        email={email}
      />
    </>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});

export default Auth;
