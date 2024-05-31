import React, {FC} from 'react';
import {HStack, Text, VStack} from 'ui';
import Username from 'app/components/Username';
import dayjs from 'dayjs';
import {useAppTheme} from 'app/styles/theme';
import {Pressable} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {HomeStackParamList} from 'app/navigation/HomeStack';
import Skeleton from 'react-native-reanimated-skeleton';
import OfflineAvatar from 'app/components/common/OfflineAvatar';
import DefaultMenu from '../../Header/components/DefaultMenu';

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
  questionId: number;
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
  questionId,
}) => {
  const theme = useAppTheme();
  const {navigate} = useNavigation<NavigationProp<HomeStackParamList>>();

  const onUserPress = () => {
    navigate('Profile', {userId, displayBackButton: true});
  };

  return !loading ? (
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
            <DefaultMenu
              iconSize="m"
              isOwner={isOwner ?? false}
              questionId={questionId}
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
  ) : (
    <QuestionItemHeaderSkeleton />
  );
};

export const QuestionItemHeaderSkeleton: FC = () => {
  const theme = useAppTheme();

  return (
    <HStack columnGap="xs" width="100%">
      <Skeleton
        containerStyle={{
          padding: theme.spacing.none,
        }}
        isLoading
        boneColor={theme.colors.skeletonBackground}
        highlightColor={theme.colors.skeleton}
        layout={[
          {
            width: theme.iconSizes.commentAvatar,
            height: theme.iconSizes.commentAvatar,
            borderRadius: theme.borderRadii.pill,
          },
        ]}
      />
      <VStack rowGap="none" flex={1}>
        <HStack alignItems="center" flex={1} justifyContent="space-between">
          <Skeleton
            containerStyle={{
              padding: theme.spacing.none,
            }}
            isLoading
            boneColor={theme.colors.skeletonBackground}
            highlightColor={theme.colors.skeleton}
            layout={[
              {
                width: 100,
                height: theme.textVariants.smaller.fontSize,
                borderRadius: theme.borderRadii.s,
              },
            ]}
          />
        </HStack>
        <Skeleton
          containerStyle={{
            padding: theme.spacing.none,
          }}
          isLoading
          boneColor={theme.colors.skeletonBackground}
          highlightColor={theme.colors.skeleton}
          layout={[
            {
              width: 96,
              height: theme.textVariants.tiny.fontSize,
              borderRadius: theme.borderRadii.s,
            },
          ]}
        />
      </VStack>
    </HStack>
  );
};

export default QuestionItemHeader;
