import {
  NearGeoLocation,
  useGeoLocationSearch,
} from 'app/hooks/useGeoLocationSearch';
import React, {FC, useState} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {Button, Flex, HStack, SafeAreaView, Text} from 'ui';

const SearchScreen: FC = () => {
  const {findNearestLocation} = useGeoLocationSearch();
  const [res, setRes] = useState<NearGeoLocation[]>([]);

  const f = async () => {
    const t = await findNearestLocation({lat: 51.4856124, long: -0.2994634});
    setRes(t);
  };

  return (
    <SafeAreaView>
      <HStack px="m">
        <Button onPress={f} title="Test Loc" />
      </HStack>
      <Flex mt="mY" px="m">
        <ScrollView>
          {res.map(r => (
            <Text key={r.id} variant="headline" my="xxsY">
              {r.name}
            </Text>
          ))}
        </ScrollView>
      </Flex>
    </SafeAreaView>
  );
};

export default SearchScreen;
