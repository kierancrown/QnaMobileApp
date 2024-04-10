import React, {FC} from 'react';
import {Flex} from 'ui';

import LargeTitleHeader from 'app/components/common/Header/LargeTitleHeader';

const InboxScreen: FC = () => {
  return (
    <Flex>
      <LargeTitleHeader title="Inbox" />
    </Flex>
  );
};

export default InboxScreen;
