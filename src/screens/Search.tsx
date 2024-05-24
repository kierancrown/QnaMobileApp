import {FlashList} from '@shopify/flash-list';
import Input from 'app/components/common/TextInput';
import {useTabBarAnimation, useTabPress} from 'app/context/tabBarContext';
import {useBottomPadding} from 'app/hooks/useBottomPadding';
import {useAppTheme} from 'app/styles/theme';
import React, {FC, useRef, useState} from 'react';
import {TextInput} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Center, Flex, HStack, Text} from 'ui';
import {TouchableOpacity} from 'react-native-gesture-handler';

import SearchIcon from 'app/assets/icons/tabbar/Search.svg';
import ClearIcon from 'app/assets/icons/CircleCloseSolid.svg';

const HeaderComponent = () => {
  const theme = useAppTheme();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const searchInput = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);

  return (
    <SafeAreaView edges={['top']}>
      <HStack py="sY" px="xs">
        <Input
          placeholder="topics, users, or questions, etc"
          onFocus={() => {
            setFocused(true);
          }}
          onBlur={() => {
            setFocused(false);
          }}
          leftAdornment={
            <Center>
              <SearchIcon
                width={theme.iconSizes.intermediate}
                height={theme.iconSizes.intermediate}
                fill={theme.colors.inputPlaceholder}
              />
            </Center>
          }
          rightAdornment={
            focused &&
            searchTerm.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setSearchTerm('');
                }}>
                <Center>
                  <ClearIcon
                    width={theme.iconSizes.intermediate}
                    height={theme.iconSizes.intermediate}
                    fill={theme.colors.inputPlaceholder}
                  />
                </Center>
              </TouchableOpacity>
            )
          }
          ref={searchInput}
          value={searchTerm}
          onChangeText={setSearchTerm}
          returnKeyType="search"
          minWidth="100%"
          borderRadius="pill"
          variant="largeInputSemiBold"
        />
      </HStack>
    </SafeAreaView>
  );
};

const SearchScreen: FC = () => {
  const scrollRef = useRef(null);
  const theme = useAppTheme();
  const bottomListPadding = useBottomPadding(theme.spacing.mY);

  useTabPress({
    tabName: 'SearchTab',
    onPress: () => {
      if (scrollRef.current) {
        // @ts-ignore
        scrollRef.current.scrollToOffset({offset: 0, animated: true});
      }
    },
  });

  const {scrollHandlerWorklet} = useTabBarAnimation({
    scrollToTop: () => {
      if (scrollRef.current) {
        // @ts-ignore
        scrollRef.current.scrollToOffset({offset: 0, animated: true});
      }
    },
  });

  return (
    <Flex>
      <HeaderComponent />
      <FlashList
        ref={scrollRef}
        data={[
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
          21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
        ]}
        keyExtractor={item => item.toString()}
        onScroll={e => {
          scrollHandlerWorklet(e.nativeEvent);
        }}
        contentContainerStyle={{
          paddingTop: theme.spacing.sY,
          paddingBottom: bottomListPadding,
        }}
        estimatedItemSize={100}
        renderItem={({item}) => {
          return (
            <HStack py="sY" px="m">
              <Text variant="medium">{item}</Text>
            </HStack>
          );
        }}
      />
    </Flex>
  );
};

export default SearchScreen;
