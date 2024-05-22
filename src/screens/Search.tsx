import Input from 'app/components/common/TextInput';
import React, {FC, useRef, useState} from 'react';
import {TextInput} from 'react-native';
import {SafeAreaView, VStack} from 'ui';

const SearchScreen: FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const searchInput = useRef<TextInput>(null);

  return (
    <SafeAreaView>
      <VStack px="s" pt="mY">
        <Input
          placeholder="topics, users, or questions, etc"
          ref={searchInput}
          value={searchTerm}
          onChangeText={setSearchTerm}
          returnKeyType="search"
        />
      </VStack>
    </SafeAreaView>
  );
};

export default SearchScreen;
