import {HStack} from 'app/components/common';
import React, {FC, useState} from 'react';
import {PollOptionType} from '.';
import Input from 'app/components/common/TextInput';

interface PollOptionProps extends Partial<PollOptionType> {
  newOption?: boolean;
  index: number;
  onOptionRemove?: (index: number) => void;
  onOptionChange?: (index: number, value: string) => void;
  onNewOptionAdd?: (value: string) => void;
}

const PollOption: FC<PollOptionProps> = ({
  name,
  index,
  newOption = false,
  onOptionChange,
  onNewOptionAdd,
  onOptionRemove,
}) => {
  const [value, setValue] = useState(name || '');

  const saveOption = () => {
    if (!newOption) {
      if (value.trim().length > 0 && value !== name) {
        onOptionChange?.(index, value);
      } else {
        onOptionRemove?.(index);
      }
    } else if (value.trim().length > 0) {
      onNewOptionAdd?.(value);
    }
    setValue('');
  };

  return (
    <HStack px="s">
      <Input
        minWidth="100%"
        variant="smallInput"
        borderWidth={1}
        borderColor="inputPlaceholder"
        returnKeyLabel="Save"
        returnKeyType="done"
        placeholder={newOption ? 'Add another option' : name}
        onEndEditing={saveOption}
        onChangeText={text => setValue(text)}
        value={value}
      />
    </HStack>
  );
};

export default PollOption;
