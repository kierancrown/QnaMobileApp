import {Button, TextInput} from 'react-native';
import React, {FC, useState} from 'react';
import {Text, Center, SafeAreaView} from 'ui';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigationProp} from 'app/navigation/MainStack';

const Auth: FC = () => {
  const {replace} = useNavigation<MainStackNavigationProp>();
  const [email, setEmail] = useState('');

  const skipLogin = () => {
    replace('Questions');
  };

  return (
    <SafeAreaView>
      <Center flex={1}>
        <Text variant="header">Login</Text>
        <TextInput value={email} onChangeText={setEmail} placeholder="Email" />
        <Button title="Login" onPress={() => {}} />
        <Button title="Skip Login" onPress={skipLogin} />
      </Center>
    </SafeAreaView>
  );
};

export default Auth;
