import React from 'react';
import {SafeAreaView, VStack, Button, Text} from 'app/components/common';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {HomeStackParamList} from 'app/navigation/HomeStack';
import useTopicsFeed from './hooks/useTopicsFeed';
import {supabase} from 'app/lib/supabase';

const TopicsFeedScreen = () => {
  const {goBack} = useNavigation();

  const {
    params: {topic},
  } = useRoute<RouteProp<HomeStackParamList, 'TopicsFeed'>>();
  const {loading, refreshResponses, results} = useTopicsFeed({topic});

  const test = () => {
    supabase
      .rpc('getquestionsfortopic', {topic: topic})
      .then(({data, error}) => {
        console.log(data, error);
      });
  };

  return (
    <SafeAreaView>
      <VStack>
        <Text>Topic: {topic}</Text>
        <Button title="Refresh" onPress={test} />
        <Button title="Go Back" onPress={goBack} />
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          results.map((result, index) => <Text key={index}>{result.id}</Text>)
        )}
      </VStack>
    </SafeAreaView>
  );
};

export default TopicsFeedScreen;
