import React from 'react';
import {HStack, Text, VStack} from 'ui';
import {FC} from 'react';
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
import OfflineAvatar from '../../OfflineAvatar';

interface QuestionItemHeaderProps {
  userId: string;
  username: string;
  verified: boolean;
  avatarImage: {
    uri?: string;
    blurhash?: string;
  };
  isOwner?: boolean;
  timestamp: string;
  hideActions?: boolean;
  loading?: boolean;
  size?: 'small' | 'large';
}

const QuestionItemHeader: FC<QuestionItemHeaderProps> = ({
  userId,
  username,
  verified,
  avatarImage,
  timestamp,
  isOwner,
  hideActions,
  loading = false,
  size,
}) => {
  const theme = useAppTheme();
  const {navigate} = useNavigation<NavigationProp<HomeStackParamList>>();

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
            width:
              size === 'small'
                ? theme.iconSizes.commentAvatar
                : theme.iconSizes.xl,
            height:
              size === 'small'
                ? theme.iconSizes.commentAvatar
                : theme.iconSizes.xl,
            borderRadius: theme.borderRadii.pill,
          },
        ]}>
        <Pressable onPress={onUserPress}>
          <OfflineAvatar
            uri={avatarImage.uri}
            blurhash={avatarImage.blurhash}
            size={size === 'small' ? 'commentAvatar' : 'xl'}
          />
        </Pressable>
      </Skeleton>
      <VStack rowGap={size === 'small' ? 'none' : 'xxxsY'} flex={1}>
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
                width: size === 'small' ? 100 : 133,
                height:
                  size === 'small'
                    ? theme.textVariants.smaller.fontSize
                    : theme.textVariants.headline.fontSize,
                borderRadius: theme.borderRadii.s,
              },
            ]}>
            <Pressable onPress={onUserPress}>
              <Username
                variant={size === 'small' ? 'smaller' : 'headline'}
                username={username ?? 'Anonymous'}
                isVerified={verified}
                noHighlight
              />
            </Pressable>
          </Skeleton>
          {!hideActions && size !== 'small' && (
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
              width: size === 'small' ? 96 : 118,
              height:
                size === 'small'
                  ? theme.textVariants.tiny.fontSize
                  : theme.textVariants.smaller.fontSize,
              borderRadius: theme.borderRadii.s,
            },
          ]}>
          <Text
            variant={size === 'small' ? 'tiny' : 'smaller'}
            color="cardText">
            {dayjs(timestamp).fromNow(false)}
          </Text>
        </Skeleton>
      </VStack>
    </HStack>
  );
};

export default QuestionItemHeader;
