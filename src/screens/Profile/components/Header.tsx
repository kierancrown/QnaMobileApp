import React, {useMemo} from 'react';
import {Header} from '@codeherence/react-native-header';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {SharedValue} from 'react-native-reanimated';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {Center, HStack} from 'app/components/common';
import {ProfileStackParamList} from 'app/navigation/ProfileStack';

import useProfile from 'app/hooks/useProfile';

import BackIcon from 'app/assets/icons/arrows/ArrowLeft.svg';
import ElipsisIcon from 'app/assets/icons/actions/ellipsis.svg';
import {useUser} from 'app/lib/supabase/context/auth';
import Username from 'app/components/Username';

import {useAppTheme} from 'app/styles/theme';

import PopoverMenu, {
  PopoverMenuItemsProps,
} from 'app/components/common/PopoverMenu';

import LikedIcon from 'app/assets/icons/actions/Heart-Outline.svg';
import BookmarkedIcon from 'app/assets/icons/actions/Bookmark-Outline.svg';
import GearIcon from 'app/assets/icons/gear.svg';
import LockIcon from 'app/assets/icons/Lock.svg';
import FlagIcon from 'app/assets/icons/Flag.svg';
import BanIcon from 'app/assets/icons/Ban.svg';
import AskUserIcon from 'app/assets/icons/actions/AskUserThick.svg';
import OfflineAvatar from 'app/components/common/OfflineAvatar';

const HeaderComponent = ({showNavBar}: {showNavBar: SharedValue<number>}) => {
  const {goBack, navigate} =
    useNavigation<NavigationProp<ProfileStackParamList>>();
  const {
    params: {userId, displayBackButton},
  } = useRoute<RouteProp<ProfileStackParamList, 'Profile'>>();
  const {username, verified, avatar} = useProfile(userId);
  const {user} = useUser();
  const {logout} = useUser();
  const theme = useAppTheme();

  const menuItems: PopoverMenuItemsProps = useMemo(
    () =>
      userId == null || user?.id === userId
        ? [
            {
              title: 'Your likes',
              left: (
                <LikedIcon
                  fill={theme.colors.cardText}
                  width={theme.iconSizes.intermediate}
                  height={theme.iconSizes.intermediate}
                />
              ),
            },
            {
              title: 'Bookmarked',
              left: (
                <BookmarkedIcon
                  fill={theme.colors.cardText}
                  width={theme.iconSizes.intermediate}
                  height={theme.iconSizes.intermediate}
                />
              ),
            },
            'divider',
            {
              title: 'App Settings',
              left: (
                <GearIcon
                  fill={theme.colors.cardText}
                  width={theme.iconSizes.intermediate}
                  height={theme.iconSizes.intermediate}
                />
              ),
              closeOnPress: true,
              onPress: () => {
                navigate('Settings');
              },
            },
            'divider',
            {
              title: 'Sign Out',
              titleColor: 'destructiveAction',
              left: (
                <LockIcon
                  color={theme.colors.destructiveAction}
                  width={theme.iconSizes.intermediate}
                  height={theme.iconSizes.intermediate}
                />
              ),
              onPress: () => {
                (async () => {
                  await logout({allDevices: false, otherDevices: false});
                })();
              },
            },
          ]
        : [
            {
              title: 'Ask Question',
              left: (
                <AskUserIcon
                  fill={theme.colors.cardText}
                  width={theme.iconSizes.intermediate}
                  height={theme.iconSizes.intermediate}
                />
              ),
            },
            'divider',
            {
              title: 'Report Profile',
              left: (
                <FlagIcon
                  fill={theme.colors.cardText}
                  width={theme.iconSizes.intermediate}
                  height={theme.iconSizes.intermediate}
                />
              ),
            },
            {
              title: `Block ${username}`,
              titleColor: 'destructiveAction',
              left: (
                <BanIcon
                  color={theme.colors.destructiveAction}
                  width={theme.iconSizes.intermediate}
                  height={theme.iconSizes.intermediate}
                />
              ),
              closeOnPress: true,
            },
          ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userId, user],
  );

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
              <BackIcon width={theme.iconSizes.l} height={theme.iconSizes.l} />
            </Center>
          </TouchableOpacity>
        )
      }
      headerCenter={
        <Center py="xxsY">
          <HStack columnGap="xs">
            <OfflineAvatar uri={avatar} size="l" />
            <Username
              username={username ?? 'Profile'}
              isVerified={verified}
              noHighlight
              variant="medium"
            />
          </HStack>
        </Center>
      }
      headerRight={
        <PopoverMenu
          accessibilityLabel="Open Account Options"
          accessibilityRole="button"
          accessibilityHint="Sign out, change username, change profile picture"
          triggerComponent={
            <Center py="xxsY" px="xxs">
              <ElipsisIcon
                width={theme.iconSizes.l}
                height={theme.iconSizes.l}
              />
            </Center>
          }
          items={menuItems}
        />
      }
    />
  );
};

export default HeaderComponent;
