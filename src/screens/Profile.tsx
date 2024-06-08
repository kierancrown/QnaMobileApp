import React, {FC, useCallback, useState} from 'react';
import {useAppDispatch} from 'app/redux/store';
import {Text, VStack, Button, HStack, SafeAreaView, Center} from 'ui';

import {useUser} from 'app/lib/supabase/context/auth';
import {useBottomPadding} from 'app/hooks/useBottomPadding';

import Profile from './Profile/Profile';
import {openAuthSheet} from 'app/redux/slices/authSheetSlice';
import {Typewriter} from 'app/components/sheets/AuthSheet/components/Typewriter';
import {useFocusEffect} from '@react-navigation/native';

const ProfileScreen: FC = () => {
  const dispatch = useAppDispatch();
  const {user} = useUser();
  const bottomListPadding = useBottomPadding();
  const [typewriterEnabled, setTypewriterEnabled] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setTypewriterEnabled(true);
      return () => {
        setTypewriterEnabled(false);
      };
    }, []),
  );

  const login = () => {
    dispatch(openAuthSheet({reason: 'none', initialScreen: 'AuthScreen'}));
  };

  return !user ? (
    <SafeAreaView>
      <Center
        flex={1}
        pt="xlY"
        style={{
          paddingBottom: bottomListPadding,
        }}>
        <VStack rowGap="sY" px="l">
          <Text variant="header" textAlign="left">
            {"You're currently\nannoymous"}
          </Text>
          <Typewriter enabled={typewriterEnabled} />

          <HStack>
            <Button title="Login" borderRadius="pill" mt="lY" onPress={login} />
          </HStack>
        </VStack>
      </Center>
    </SafeAreaView>
  ) : (
    <Profile />
  );
};

export default ProfileScreen;
