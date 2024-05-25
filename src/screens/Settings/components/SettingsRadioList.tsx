import React, {FC, useState} from 'react';
import SettingsToggleItem, {SettingsToggleItemProps} from './SettingsRadioItem';
import {VStack} from 'app/components/common';

interface SettingsRadioListProps {
  items: SettingsToggleItemProps[];
  defaultIndex?: number;
  disabled?: boolean;
  onValueChange?: (index: number) => void;
}

const SettingsRadioList: FC<SettingsRadioListProps> = ({
  items,
  defaultIndex,
  disabled,
  onValueChange,
}) => {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  return (
    <VStack>
      {items.map((item, index) => (
        <SettingsToggleItem
          key={index}
          disabled={disabled}
          {...item}
          value={selectedItem ? selectedItem === index : defaultIndex === index}
          onValueChange={value => {
            if (value && selectedItem !== index) {
              onValueChange?.(index);
              setSelectedItem(index);
            }
          }}
        />
      ))}
    </VStack>
  );
};

export default SettingsRadioList;
