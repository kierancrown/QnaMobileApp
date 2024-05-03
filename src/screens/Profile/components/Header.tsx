import React from 'react';
import {Alert} from 'react-native';
import {Header} from '@codeherence/react-native-header';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {SharedValue} from 'react-native-reanimated';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {useUsername} from 'app/hooks/useUsername';
import {Center, HStack} from 'app/components/common';
import {ProfileStackParamList} from 'app/navigation/ProfileStack';
import Avatar from 'app/components/common/Avatar';

import BackIcon from 'app/assets/icons/arrows/ArrowLeft.svg';
import ElipsisIcon from 'app/assets/icons/actions/ellipsis.svg';
import {useUser} from 'app/lib/supabase/context/auth';
import Username from 'app/components/Username';

const BACK_ICON_SIZE = 24;

const HeaderComponent = ({showNavBar}: {showNavBar: SharedValue<number>}) => {
  const {goBack} = useNavigation();
  const {username, isVerified} = useUsername();
  const {logout} = useUser();

  const {
    params: {displayBackButton},
  } = useRoute<RouteProp<ProfileStackParamList, 'Profile'>>();

  const openMenu = () => {
    Alert.alert('Account Options', 'What would you like to do?', [
      {text: 'Change Username', onPress: () => {}},
      {text: 'Change Profile Picture', onPress: () => {}},

      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          (async () => {
            await logout({allDevices: false, otherDevices: false});
          })();
        },
      },
      {text: 'Cancel', style: 'cancel'},
    ]);
  };

  return (
    <Header
      showNavBar={showNavBar}
      noBottomBorder
      headerLeft={
        displayBackButton === true && (
          <TouchableOpacity
            onPress={goBack}
            hitSlop={8}
            accessibilityLabel="Go back"
            accessibilityRole="button"
            accessibilityHint="Go back to previous screen">
            <Center py="xxsY" px="xxs">
              <BackIcon width={BACK_ICON_SIZE} height={BACK_ICON_SIZE} />
            </Center>
          </TouchableOpacity>
        )
      }
      headerCenter={
        <Center py="xxsY">
          <HStack columnGap="xs">
            <Avatar size="l" />
            <Username
              username={username ?? 'Profile'}
              isVerified={isVerified}
              noHighlight
              variant="medium"
            />
          </HStack>
        </Center>
      }
      headerRight={
        <TouchableOpacity
          onPress={openMenu}
          hitSlop={8}
          accessibilityLabel="Open Account Options"
          accessibilityRole="button"
          accessibilityHint="Sign out, change username, change profile picture">
          <Center py="xxsY" px="xxs">
            <ElipsisIcon width={BACK_ICON_SIZE} height={BACK_ICON_SIZE} />
          </Center>
        </TouchableOpacity>
      }
    />
  );
};

export default HeaderComponent;
