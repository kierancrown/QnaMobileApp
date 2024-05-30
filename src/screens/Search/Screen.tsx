import {FlashList} from '@shopify/flash-list';
import {useTabBarAnimation, useTabPress} from 'app/context/tabBarContext';
import {useBottomPadding} from 'app/hooks/useBottomPadding';
import {useAppTheme} from 'app/styles/theme';
import React, {FC, useRef, useState} from 'react';
import {Flex, HStack, Text} from 'ui';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RefreshControl} from 'react-native';
import HeaderComponent from './components/Header';

const SearchScreen: FC = () => {
  const scrollRef = useRef(null);
  const theme = useAppTheme();
  const bottomListPadding = useBottomPadding(theme.spacing.mY);
  const [headerHeight, setHeaderHeight] = useState(0);
  const topInset = useSafeAreaInsets().top;
  const [refreshing, setRefreshing] = useState(false);

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
      <HeaderComponent
        onSize={({height}) => {
          setHeaderHeight(height);
        }}
      />
      <FlashList
        ref={scrollRef}
        refreshControl={<RefreshControl refreshing={refreshing} />}
        scrollIndicatorInsets={{top: headerHeight - topInset}}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          setTimeout(() => {
            setRefreshing(false);
          }, 2000);
        }}
        contentContainerStyle={{
          paddingTop: theme.spacing.sY + headerHeight,
          paddingBottom: bottomListPadding,
        }}
        data={[
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
          21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
        ]}
        keyExtractor={item => item.toString()}
        scrollEventThrottle={16}
        onScroll={({nativeEvent}) => {
          scrollHandlerWorklet(nativeEvent);
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
