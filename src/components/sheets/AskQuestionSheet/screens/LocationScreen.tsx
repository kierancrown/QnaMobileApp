import {useFocusEffect} from '@react-navigation/native';
import {Center, HStack, Text, VStack} from 'app/components/common';
import Input from 'app/components/common/TextInput';
import {setActionButton} from 'app/redux/slices/askSheetSlice';
import {AppDispatch} from 'app/redux/store';
import React, {FC, useState} from 'react';
import {useDispatch} from 'react-redux';
import Geolocation from '@react-native-community/geolocation';
import {ActivityIndicator} from 'react-native';
import {
  NearGeoLocation,
  useGeoLocationSearch,
} from 'app/hooks/useGeoLocationSearch';
import useMount from 'app/hooks/useMount';

const LocationsScreen: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const {findNearestLocation} = useGeoLocationSearch();
  const [results, setResults] = useState<NearGeoLocation[]>([]);

  useFocusEffect(() => {
    dispatch(setActionButton('back'));
  });

  useMount(() => {
    try {
      Geolocation.getCurrentPosition(info => {
        (async () => {
          console.log(info);
          const data = await findNearestLocation({
            lat: info.coords.latitude,
            long: info.coords.longitude,
          });
          setResults(data);
        })();
      });
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <VStack flex={1} py="mY">
      <VStack flex={1} px="m">
        <Input
          placeholder="Search for a location"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        {results.length === 0 ? (
          <Center flex={1}>
            <HStack alignItems="center" columnGap="xs">
              <ActivityIndicator size="small" />
              <Text>Searching for you...</Text>
            </HStack>
          </Center>
        ) : (
          <VStack flex={1}>
            {results.map(r => (
              <Text key={r.id} variant="headline" my="xxsY">
                {r.name}
              </Text>
            ))}
          </VStack>
        )}
      </VStack>
    </VStack>
  );
};

export default LocationsScreen;
