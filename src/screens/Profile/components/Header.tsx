import React, {useMemo} from 'react';
import {Header} from '@codeherence/react-native-header';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {SharedValue} from 'react-native-reanimated';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {Center, HStack} from 'app/components/common';
import {ProfileStackParamList} from 'app/navigation/ProfileStack';
import Avatar from 'app/components/common/Avatar';

import useProfile from 'app/hooks/useProfile';

import BackIcon from 'app/assets/icons/arrows/ArrowLeft.svg';
import ElipsisIcon from 'app/assets/icons/actions/ellipsis.svg';
import {useUser} from 'app/lib/supabase/context/auth';
import Username from 'app/components/Username';

import {useAppTheme} from 'app/styles/theme';

import PopoverMenu, {
  PopoverMenuItemProps,
} from 'app/components/common/PopoverMenu';

import LikedIcon from 'app/assets/icons/actions/Heart-Outline.svg';
import BookmarkedIcon from 'app/assets/icons/actions/Bookmark-Outline.svg';
import GearIcon from 'app/assets/icons/gear.svg';
import LockIcon from 'app/assets/icons/Lock.svg';
import FlagIcon from 'app/assets/icons/Flag.svg';
import BanIcon from 'app/assets/icons/Ban.svg';
import AskUserIcon from 'app/assets/icons/actions/AskUserThick.svg';

const BACK_ICON_SIZE = 24;

const HeaderComponent = ({showNavBar}: {showNavBar: SharedValue<number>}) => {
  const {goBack} = useNavigation();
  const {
    params: {userId, displayBackButton},
  } = useRoute<RouteProp<ProfileStackParamList, 'Profile'>>();
  const {username, verified} = useProfile(userId);
  const {user} = useUser();
  const {logout} = useUser();
  const theme = useAppTheme();
  const isOwnProfile = useMemo(
    () => userId == null || user?.id === userId,
    [user, userId],
  );
  const menuItems: (PopoverMenuItemProps | 'divider')[] = isOwnProfile
    ? [
        {
          title: 'Your likes',
          right: (
            <LikedIcon
              fill={theme.colors.cardText}
              width={theme.iconSizes.m}
              height={theme.iconSizes.m}
            />
          ),
        },
        {
          title: 'Bookmarked',
          right: (
            <BookmarkedIcon
              fill={theme.colors.cardText}
              width={theme.iconSizes.m}
              height={theme.iconSizes.m}
            />
          ),
        },
        'divider',
        {
          title: 'App Settings',
          right: (
            <GearIcon
              fill={theme.colors.cardText}
              width={theme.iconSizes.m}
              height={theme.iconSizes.m}
            />
          ),
        },
        'divider',
        {
          title: 'Sign Out',
          titleColor: 'destructiveAction',
          right: (
            <LockIcon
              color={theme.colors.destructiveAction}
              width={theme.iconSizes.m}
              height={theme.iconSizes.m}
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
          right: (
            <AskUserIcon
              fill={theme.colors.cardText}
              width={theme.iconSizes.m}
              height={theme.iconSizes.m}
            />
          ),
        },
        'divider',
        {
          title: 'Report Profile',
          right: (
            <FlagIcon
              fill={theme.colors.cardText}
              width={theme.iconSizes.m}
              height={theme.iconSizes.m}
            />
          ),
        },
        {
          title: `Block ${username}`,
          titleColor: 'destructiveAction',
          right: (
            <BanIcon
              color={theme.colors.destructiveAction}
              width={theme.iconSizes.m}
              height={theme.iconSizes.m}
            />
          ),
        },
      ];

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
            <Avatar userId={userId} size="l" />
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
              <ElipsisIcon width={BACK_ICON_SIZE} height={BACK_ICON_SIZE} />
            </Center>
          }
          items={menuItems}
        />
      }
    />
  );
};

export default HeaderComponent;
