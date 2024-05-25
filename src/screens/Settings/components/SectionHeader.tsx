import React, {FC} from 'react';
import {Text, HStack} from 'app/components/common';
import {Theme} from 'app/styles/theme';

interface SectionHeaderProps {
  title: string;
  color?: keyof Theme['colors'];
}

const SectionHeader: FC<SectionHeaderProps> = ({
  title,
  color = 'foreground',
}) => {
  return (
    <HStack
      justifyContent="space-between"
      alignItems="center"
      paddingHorizontal="s"
      paddingVertical="xsY">
      <Text variant="highlight" color={color}>
        {title}
      </Text>
    </HStack>
  );
};

export default SectionHeader;
