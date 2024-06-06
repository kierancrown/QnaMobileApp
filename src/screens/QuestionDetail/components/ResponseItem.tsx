import React, {FC} from 'react';
import {Box, Text, VStack} from 'ui';
import {supabase} from 'app/lib/supabase';
import {Platform} from 'react-native';

import Header from './QuestionDetails/components/Header';
import Skeleton from 'react-native-reanimated-skeleton';
import {useAppTheme} from 'app/styles/theme';
import {useAlert} from 'app/components/AlertsWrapper';

interface ResponseItemProps {
  userId: string;
  username: string;
  verified: boolean;
  avatarImage: {
    uri?: string;
    blurhash?: string;
  };
  timestamp: string;
  response: string;
  likes: number;
  isOwner?: boolean;

  onDelete?: (id: string) => void;
}

export const ESTIMATED_RESPONSE_ITEM_HEIGHT = 80;

const ResponseItem: FC<ResponseItemProps> = ({
  userId,
  username,
  verified,
  avatarImage,
  timestamp,
  response,
  isOwner,
  onDelete,
}) => {
  const {openAlert} = useAlert();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const deleteAnswer = async (responseId: number) => {
    const {error} = await supabase
      .from('responses')
      .delete()
      .eq('id', responseId);
    if (error) {
      openAlert({
        title: 'Error',
        message: error.message,
      });
    } else {
      onDelete?.(responseId.toString());
    }
  };

  return (
    <VStack
      rowGap="xsY"
      px="s"
      py="xsY"
      my="xxsY"
      mx={Platform.select({
        ios: 'xs',
        android: 's',
      })}
      borderRadius="l"
      backgroundColor="cardBackground">
      <Header
        userId={userId}
        username={username}
        verified={verified}
        avatarImage={avatarImage}
        timestamp={timestamp}
        isOwner={isOwner}
        size="small"
      />
      <Text variant="smallBody">{response}</Text>
    </VStack>
  );
};

export const ResponseItemSkeleton: FC = () => {
  const theme = useAppTheme();

  return (
    <Box
      borderRadius="l"
      overflow="hidden"
      my="xxsY"
      mx={Platform.select({
        ios: 'xs',
        android: 's',
      })}
      bg="cardBackground"
      height={ESTIMATED_RESPONSE_ITEM_HEIGHT}>
      <Skeleton
        containerStyle={{
          padding: theme.spacing.none,
        }}
        isLoading
        boneColor={theme.colors.skeletonBackground}
        highlightColor={theme.colors.skeleton}
        layout={[
          {
            key: 'card',
            width: '100%',
            height: '100%',
          },
        ]}
      />
    </Box>
  );
};

export default ResponseItem;
