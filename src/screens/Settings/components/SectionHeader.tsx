import React, {FC} from 'react';
import {Text, HStack} from 'app/components/common';

interface SectionHeaderProps {
  title: string;
}

const SectionHeader: FC<SectionHeaderProps> = ({title}) => {
  return (
    <HStack
      justifyContent="space-between"
      alignItems="center"
      paddingHorizontal="s"
      paddingVertical="sY">
      <Text variant="body" color="cardText">
        {title}
      </Text>
    </HStack>
  );
};

export default SectionHeader;
