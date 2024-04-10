import React, {FC} from 'react';
import {Flex} from 'ui';

import {Header} from 'app/components/common/Header/CustomHeader';

const InboxScreen: FC = () => {
  return (
    <Flex>
      <Header title="Inbox" />
    </Flex>
  );
};

export default InboxScreen;
