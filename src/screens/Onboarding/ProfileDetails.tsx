import {Flex, SafeAreaView, Text, VStack} from 'ui';
import React from 'react';
import Avatar from 'app/components/common/Avatar';
import {TouchableOpacity} from 'react-native-gesture-handler';

const ProfileDetails = () => {
  return (
    <SafeAreaView>
      <Flex px="m" py="lY">
        <VStack rowGap="xxsY">
          <Text variant="navbarTitle">Complete your profile</Text>
          <Text variant="body">
            Add a profile picture and a username to get started
          </Text>
        </VStack>

        <TouchableOpacity>
          <Avatar size="xxxxl" />
        </TouchableOpacity>
      </Flex>
    </SafeAreaView>
  );
};

export default ProfileDetails;
