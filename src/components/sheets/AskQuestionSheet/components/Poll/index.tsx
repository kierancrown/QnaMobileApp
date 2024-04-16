import {Flex, HStack, Text, VStack} from 'app/components/common';
import React, {FC} from 'react';
import PollOption from './PollOption';
import {ScrollView} from 'react-native-gesture-handler';
import {TouchableOpacity} from '@gorhom/bottom-sheet';

export interface PollOptionType {
  name: string;
}

interface PollContainerProps {
  options: PollOptionType[];
  setOptions: (options: PollOptionType[]) => void;
  onRemovePoll?: () => void;
}

const PollContainer: FC<PollContainerProps> = ({
  options,
  setOptions,
  onRemovePoll,
}) => {
  return (
    <VStack rowGap="m" mt="mY" px="s">
      <HStack alignItems="center" px="xxs">
        <Text variant="small" color="cardText">
          Ends in 1 day
        </Text>
        <Flex />
        <TouchableOpacity onPress={onRemovePoll}>
          <Text variant="small" color="cardText">
            Remove Poll
          </Text>
        </TouchableOpacity>
      </HStack>
      <ScrollView>
        <VStack rowGap="xsY">
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
    </VStack>
  );
};

export default PollContainer;
