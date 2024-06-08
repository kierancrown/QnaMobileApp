import {RouteProp, useRoute} from '@react-navigation/native';
import {HStack, Text, VStack} from 'app/components/common';
import React, {FC, useEffect, useRef, useState} from 'react';
import {AuthStackParamList} from '..';
import Input from 'app/components/common/TextInput';
import {TextInput} from 'react-native';
import {useAppSelector} from 'app/redux/store';

const AuthScreen: FC = () => {
  const {
    params: {},
  } = useRoute<RouteProp<AuthStackParamList, 'AuthScreen'>>();
  const open = useAppSelector(state => state.nonPersistent.authSheet.sheetOpen);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!open) {
      setEmail('');
      inputRef.current?.blur();
    }
  }, [open]);

  return (
    <>
      <VStack flex={1} py="mY" px="s" rowGap="mY">
        <HStack px="s">
          <Text variant="authSheetHeader">Login to continue</Text>
        </HStack>
        <Input
          value={email}
          ref={inputRef}
          autoFocus
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
          insideBottomSheet
        />
      </VStack>
    </>
  );
};

export default AuthScreen;
