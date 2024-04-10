import React, {FC} from 'react';
import {Flex} from 'ui';

import LargeTitleHeader from 'app/components/common/Header/LargeTitleHeader';

const SearchScreen: FC = () => {
  return (
    <Flex>
      <LargeTitleHeader title="Discover" />
      {/* Content */}
    </Flex>
  );
};

export default SearchScreen;
