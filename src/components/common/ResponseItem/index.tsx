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
  isOwner,
  onDelete,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
