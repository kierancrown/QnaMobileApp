import {VStack} from 'app/components/common';
import React, {FC, useState} from 'react';
import PollOption from './PollOption';
import {ScrollView} from 'react-native-gesture-handler';

export interface PollOptionType {
  name: string;
}

const PollContainer: FC = () => {
  const [options, setOptions] = useState<PollOptionType[]>([
    {name: 'Yes'},
    {name: 'No'},
  ]);
  return (
    <ScrollView>
      <VStack rowGap="xsY" mt="mY">
        {options.map((option, index) => {
          return (
            <PollOption
              key={option.name}
              index={index}
              name={option.name}
              onOptionChange={(i, value) => {
                const newOptions = [...options];
                newOptions[i] = {name: value};
                setOptions(newOptions);
              }}
              onOptionRemove={i => {
                const newOptions = [...options];
                newOptions.splice(i, 1);
                setOptions(newOptions);
              }}
            />
          );
        })}

        <PollOption
          index={-1}
          newOption
          onNewOptionAdd={value => {
            const newOptions = [...options];
            if (!newOptions.find(option => option.name === value)) {
              newOptions.push({name: value});
              setOptions(newOptions);
            }
          }}
        />
      </VStack>
    </ScrollView>
  );
};

export default PollContainer;
