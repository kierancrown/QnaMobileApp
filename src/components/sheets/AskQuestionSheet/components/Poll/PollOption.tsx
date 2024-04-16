import {Text} from 'app/components/common';
import React, {FC, useMemo, useState} from 'react';
import {PollOptionType} from '.';
import Input from 'app/components/common/TextInput';

interface PollOptionProps extends Partial<PollOptionType> {
  newOption?: boolean;
  index: number;
  onOptionRemove?: (index: number) => void;
  onOptionChange?: (index: number, value: string) => void;
  onNewOptionAdd?: (value: string) => void;
}

const POLL_CHAR_LIMIT = 25;

const PollOption: FC<PollOptionProps> = ({
  name,
  index,
  newOption = false,
  onOptionChange,
  onNewOptionAdd,
  onOptionRemove,
}) => {
  const [value, setValue] = useState(name || '');
  const remainingChars = useMemo(() => POLL_CHAR_LIMIT - value.length, [value]);

  const saveOption = () => {
    if (!newOption) {
      if (value.trim().length > 0) {
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
    <Input
      minWidth="100%"
      rightAdornment={<Text variant="small">{remainingChars}</Text>}
      variant="smallInput"
      borderWidth={1}
      maxLength={POLL_CHAR_LIMIT}
      borderColor="inputPlaceholder"
      returnKeyLabel="Save"
      returnKeyType="done"
      placeholder={'Add another option'}
      onEndEditing={saveOption}
      onChangeText={setValue}
      value={value}
    />
  );
};

export default PollOption;
