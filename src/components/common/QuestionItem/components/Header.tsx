import React, {useMemo} from 'react';
import {HStack, Text, VStack} from 'ui';
import Avatar from '../../Avatar';
import {FC} from 'react';
import useProfile from 'app/hooks/useProfile';
import Username from 'app/components/Username';
import dayjs from 'dayjs';

import PopoverMenu from 'app/components/common/PopoverMenu';

import ElipsisIcon from 'app/assets/icons/actions/ellipsis.svg';
import {menuItems} from 'app/screens/QuestionDetail/components/Header';
import {useAppTheme} from 'app/styles/theme';
import {Pressable} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {HomeStackParamList} from 'app/navigation/HomeStack';
import Skeleton from 'react-native-reanimated-skeleton';

interface QuestionItemHeaderProps {
  userId: string;
  isOwner?: boolean;
  timestamp: string;
  hideActions?: boolean;
}

const QuestionItemHeader: FC<QuestionItemHeaderProps> = ({
  userId,
  timestamp,
  isOwner,
  hideActions,
}) => {
  const theme = useAppTheme();
  const {username, verified} = useProfile(userId);
  const {navigate} = useNavigation<NavigationProp<HomeStackParamList>>();
  const loading = useMemo(() => !username, [username]);

  const onUserPress = () => {
    navigate('Profile', {userId, displayBackButton: true});
  };

  return (
    <HStack columnGap="xs" width="100%">
      <Skeleton
        containerStyle={{
          padding: theme.spacing.none,
        }}
        isLoading={loading}
        boneColor={theme.colors.skeletonBackground}
        highlightColor={theme.colors.skeleton}
        layout={[
          {
            width: theme.iconSizes.xl,
            height: theme.iconSizes.xl,
            borderRadius: theme.borderRadii.pill,
          },
        ]}>
        <Pressable onPress={onUserPress}>
          <Avatar userId={userId} size="xl" />
        </Pressable>
      </Skeleton>
      <VStack rowGap="xxxsY" flex={1}>
        <HStack alignItems="center" flex={1} justifyContent="space-between">
          <Skeleton
            containerStyle={{
              padding: theme.spacing.none,
            }}
            isLoading={loading}
            boneColor={theme.colors.skeletonBackground}
            highlightColor={theme.colors.skeleton}
            layout={[
              {
                width: 133,
                height: theme.textVariants.headline.fontSize,
                borderRadius: theme.borderRadii.s,
              },
            ]}>
            <Pressable onPress={onUserPress}>
              <Username
                variant="headline"
                username={username ?? 'Profile'}
                isVerified={verified}
                noHighlight
              />
            </Pressable>
          </Skeleton>
          {!hideActions && (
            <PopoverMenu
              accessibilityLabel="Open Question Options"
              accessibilityRole="button"
              accessibilityHint="Report or hide this question"
              triggerComponent={
                <ElipsisIcon
                  width={theme.iconSizes.m}
                  height={theme.iconSizes.m}
                />
              }
              items={menuItems(isOwner ?? false, theme)}
            />
          )}
        </HStack>
        <Skeleton
          containerStyle={{
            padding: theme.spacing.none,
          }}
          isLoading={loading}
          boneColor={theme.colors.skeletonBackground}
          highlightColor={theme.colors.skeleton}
          layout={[
            {
              width: 118,
              height: theme.textVariants.smaller.fontSize,
              borderRadius: theme.borderRadii.s,
            },
          ]}>
          <Text variant="smaller" color="cardText">
            {dayjs(timestamp).fromNow(false)}
          </Text>
        </Skeleton>
      </VStack>
    </HStack>
  );
};

export default QuestionItemHeader;
