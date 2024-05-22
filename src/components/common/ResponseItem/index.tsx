import React from 'react';
import {Text, VStack} from 'ui';
import {supabase} from 'app/lib/supabase';
import {Alert, Platform} from 'react-native';

import Header from 'app/components/common/QuestionItem/components/Header';

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

const ResponseItem: React.FC<ResponseItemProps> = ({
  userId,
  username,
  verified,
  avatarImage,
  timestamp,
  response,
  likes,
  isOwner,
  onDelete,
}) => {
  const deleteAnswer = async (responseId: number) => {
    const {error} = await supabase
      .from('responses')
      .delete()
      .eq('id', responseId);
    if (error) {
      Alert.alert('Error', error.message);
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

export default ResponseItem;

/*
<Pressable
  onLongPress={() => {
    if (item.user_id === user?.id) {
      Alert.alert(
        'Delete Response',
        'Are you sure you want to delete this response?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => deleteAnswer(item.id),
          },
        ],
      );
    }
  }}>
  <Box
    backgroundColor="cardBackground"
    my="xsY"
    px="xs"
    mx="xs"
    py="xsY"
    borderRadius="m">
    <VStack rowGap="xsY">
      <HStack alignItems="center" justifyContent="space-between">
        <Text
          fontWeight="600"
          color={item.user_id === user?.id ? 'brand' : 'cardText'}>
          {item.user_metadata?.username ?? 'Anonymous'}
        </Text>
        <Text color="cardText">
          {dayjs(item.created_at).fromNow()}
        </Text>
      </HStack>
      <Text variant="body">{item.response}</Text>
    </VStack>
  </Box>
</Pressable>
*/
