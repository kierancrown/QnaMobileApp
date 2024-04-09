import {Alert, Button, StyleSheet, TextInput} from 'react-native';
import React, {FC, useState} from 'react';
import {Text, Center, SafeAreaView, VStack} from 'ui';
import {supabase} from 'app/lib/supabase';
import {useDispatch} from 'react-redux';
import {AppDispatch} from 'app/redux/store';
import {skipAuth} from 'app/redux/slices/authSlice';
import {Theme} from 'app/styles/theme';
import {useTheme} from '@shopify/restyle';

const Auth: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const theme = useTheme<Theme>();

  const dispatch = useDispatch<AppDispatch>();

  const skipLogin = () => {
    dispatch(skipAuth());
  };

  const login = async () => {
    setLoading(true);
    const {error} = await supabase.auth.signInWithPassword({
      email,
      password,
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
        <Text variant="header">Login</Text>
        <VStack width="100%">
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={[styles.input, {color: theme.colors.foreground}]}
            cursorColor={theme.colors.foreground}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            style={[styles.input, {color: theme.colors.foreground}]}
            cursorColor={theme.colors.foreground}
            placeholder="Password"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />
        </VStack>
        <Button
          title="Login"
          disabled={!email.trim().length || !password.trim().length || loading}
          onPress={login}
          color={theme.colors.brand}
        />
        <Button
          title="Skip Login"
          onPress={skipLogin}
          disabled={loading}
          color={theme.colors.brand}
        />
      </Center>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    padding: 8,
    marginVertical: 8,
    width: '100%',
  },
});

export default Auth;
