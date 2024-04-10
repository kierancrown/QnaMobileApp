import React, {FC} from 'react';
import {Center, Flex} from 'ui';

import {Header} from 'app/components/common/Header/CustomHeader';
import FloatTabBar from 'app/components/common/TabBar/FloatTabBar';

const InboxScreen: FC = () => {
  return (
    <Flex>
      <Header title="Inbox" />
      <Center flex={1} px="l">
        <FloatTabBar />
      </Center>
    </Flex>
  );
};

export default InboxScreen;
