import {RouteProp, useRoute} from '@react-navigation/native';
import {Text, VStack} from 'app/components/common';
import React, {FC} from 'react';
import {AuthStackParamList} from '..';

const AuthPromptScreen: FC = () => {
  const {
    params: {},
  } = useRoute<RouteProp<AuthStackParamList, 'AuthScreen'>>();

  return (
    <>
      <VStack flex={1} py="mY" px="s">
        <Text>Auth Prompt</Text>
      </VStack>
    </>
  );
};

export default AuthPromptScreen;
