import {useFocusEffect} from '@react-navigation/native';
import {
  ActivityLoader,
  Box,
  Center,
  Flex,
  HStack,
  Text,
  VStack,
} from 'app/components/common';
import Input from 'app/components/common/TextInput';
import {
  addTopic,
  removeTopic,
  setActionButton,
} from 'app/redux/slices/askSheetSlice';
import {RootState, useAppDispatch} from 'app/redux/store';
import React, {FC, useEffect, useMemo, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {StyleProp, TextInput, ViewStyle} from 'react-native';
import useMount from 'app/hooks/useMount';
import SelectionItem from 'app/components/common/SelectionItem';
import {useAppTheme} from 'app/styles/theme';
import LinearGradient from 'react-native-linear-gradient';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {useDebounceValue} from 'usehooks-ts';
import SearchIcon from 'app/assets/icons/tabbar/Search.svg';
import {supabase} from 'app/lib/supabase';
import {Topic} from 'app/lib/supabase/types';
import {TOPIC_LIMIT} from 'app/constants';
import {useAlert} from 'app/components/AlertsWrapper';

const TopicsScreen: FC = () => {
  const {openAlert} = useAlert();
  const dispatch = useAppDispatch();
  const selectedTopics = useSelector(
    (state: RootState) => state.nonPersistent.askSheet.selectedTopics,
  );
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [results, setResults] = useState<Topic[]>([]);
  const searchInput = useRef<TextInput>(null);
  const theme = useAppTheme();

  const [debouncedSearchTerm] = useDebounceValue(searchTerm, 1000);
  const [initialLoad, setInitialLoad] = useState(true);
  const [loadingResults, setLoadingResults] = useState(false);
  const listHeaderGradientStyles: StyleProp<ViewStyle> = useMemo(
    () => ({
      width: '100%',
      height: theme.spacing.xlY,
    }),
    [theme],
  );

  useFocusEffect(() => {
    dispatch(setActionButton('back'));
  });

  const getPopularTopics = () => {
    try {
      supabase
        .from('topics')
        .select('id, name')
        .limit(20)
        .then(({data, error}) => {
          if (error) {
            openAlert({
              title: 'Error',
              message: 'An error occurred while fetching topics',
            });
            return;
          }
          if (data) {
            setResults(data);
          }
          setInitialLoad(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useMount(getPopularTopics);

  useEffect(() => {
    if (searchTerm.trim().length < 2 || searchTerm.trim() === '') {
      setLoadingResults(false);
      return;
    }
    if (searchTerm.trim() !== debouncedSearchTerm.trim()) {
      setLoadingResults(true);
    }
  }, [debouncedSearchTerm, searchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm.trim().length > 1) {
      (async () => {
        try {
          const {error, data} = await supabase
            .from('topics')
            .select('id, name')
            .ilike('name', `%${debouncedSearchTerm.trim()}%`)
            .limit(20);

          if (error) {
            openAlert({
              title: 'Error',
              message: 'An error occurred while searching for locations',
            });
          } else if (data == null) {
            setResults([]);
            return;
          }

          setResults(data || []);
        } catch (error) {
          setResults([]);
          openAlert({
            title: 'Error',
            message: 'An error occurred while searching for locations',
          });
        } finally {
          setLoadingResults(false);
        }
      })();
    } else {
      getPopularTopics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  return (
    <VStack flex={1}>
      <VStack px="s" pt="mY">
        <Input
          placeholder="Search topics"
          ref={searchInput}
          value={searchTerm}
          onChangeText={setSearchTerm}
          returnKeyType="search"
          insideBottomSheet
          borderRadius="pill"
          clearButton
          leftAdornment={
            <Center>
              {loadingResults ? (
                <Center
                  width={theme.iconSizes.intermediate}
                  height={theme.iconSizes.intermediate}>
                  <ActivityLoader size="s" />
                </Center>
              ) : (
                <SearchIcon
                  width={theme.iconSizes.intermediate}
                  height={theme.iconSizes.intermediate}
                  fill={theme.colors.inputPlaceholder}
                />
              )}
            </Center>
          }
          onClear={() => setSearchTerm('')}
        />
      </VStack>

      <Flex>
        <Box position="absolute" top={0} left={0} right={0} zIndex={10}>
          <LinearGradient
            colors={[theme.colors.mainBackground, theme.colors.none]}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            style={listHeaderGradientStyles}
          />
        </Box>
        {results.length === 0 ? (
          <Center flex={1}>
            {initialLoad ? (
              <HStack alignItems="center" columnGap="xs">
                <ActivityLoader size="xs" />
                <Text>Loading Tags</Text>
              </HStack>
            ) : (
              <Center flex={1}>
                <VStack rowGap="xxsY">
                  <Text textAlign="center" variant="markdownH2">
                    No results found
                  </Text>
                  <Text textAlign="center" variant="body">
                    <Text variant="bodyBold">"{debouncedSearchTerm}"</Text> not
                    found.
                  </Text>
                </VStack>
              </Center>
            )}
          </Center>
        ) : (
          <BottomSheetFlatList
            data={results}
            keyExtractor={item => item.id.toString()}
            keyboardShouldPersistTaps="always"
            contentContainerStyle={{
              paddingVertical: theme.spacing.mY,
            }}
            ListEmptyComponent={
              <Center flex={1}>
                <Text>No results found</Text>
              </Center>
            }
            renderItem={({item}) => {
              const selected = !!selectedTopics.find(i => i.id === item.id);
              return (
                <SelectionItem
                  title={item.name}
                  highlight={false}
                  disabled={selectedTopics.length >= TOPIC_LIMIT && !selected}
                  config={{disablesTouch: false}}
                  selected={selected}
                  onSelected={() => {
                    if (selected) {
                      dispatch(removeTopic(item.id));
                      return;
                    } else if (selectedTopics.length >= TOPIC_LIMIT) {
                      openAlert({
                        title: 'Maximum topics reached',
                        message: `You can only select up to ${TOPIC_LIMIT} topics`,
                      });
                      return;
                    }
                    dispatch(addTopic(item));
                  }}
                />
              );
            }}
          />
        )}
      </Flex>
    </VStack>
  );
};

export default TopicsScreen;
