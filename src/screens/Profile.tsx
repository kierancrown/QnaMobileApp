import React, {FC, useCallback, useState} from 'react';
import {useAppDispatch} from 'app/redux/store';
import {Text, VStack, Button, HStack, SafeAreaView, Center} from 'ui';

import {useUser} from 'app/lib/supabase/context/auth';
import {useBottomPadding} from 'app/hooks/useBottomPadding';

import Profile from './Profile/Profile';
import {openAuthSheet} from 'app/redux/slices/authSheetSlice';
import {Typewriter} from 'app/components/sheets/AuthSheet/components/Typewriter';
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';

import GearIcon from 'app/assets/icons/gear.svg';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useAppTheme} from 'app/styles/theme';
import {ProfileStackParamList} from 'app/navigation/ProfileStack';

const ProfileScreen: FC = () => {
  const {navigate} = useNavigation<NavigationProp<ProfileStackParamList>>();
  const [typewriterEnabled, setTypewriterEnabled] = useState(false);
  const bottomListPadding = useBottomPadding();
  const dispatch = useAppDispatch();
  const theme = useAppTheme();
  const {user} = useUser();

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
      <HStack py="xsY" px="s" justifyContent="flex-end">
        <TouchableOpacity
          onPress={() => {
            navigate('Settings');
          }}
          hitSlop={8}>
          <GearIcon
            width={theme.iconSizes.intermediate}
            height={theme.iconSizes.intermediate}
          />
        </TouchableOpacity>
      </HStack>
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
