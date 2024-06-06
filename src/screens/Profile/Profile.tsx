import React, {FC, useRef} from 'react';
import {
  Box,
  Center,
  Flex,
  Text,
  ActivityLoader,
  Button,
} from 'app/components/common';
import {FlashListWithHeaders} from '@codeherence/react-native-header';
import {RefreshControl} from 'react-native-gesture-handler';
import {useTabBarAnimation} from 'app/context/tabBarContext';
import {useAppTheme} from 'app/styles/theme';
import {useBottomPadding} from 'app/hooks/useBottomPadding';

import HeaderComponent from './components/Header';
import {LargeProfileHeaderComponent} from './components/LargeHeader';
import {RouteProp, useRoute} from '@react-navigation/native';
import {ProfileStackParamList} from 'app/navigation/ProfileStack';
import {useAlert} from 'app/components/AlertsWrapper';

const Profile: FC = () => {
  const {params} = useRoute<RouteProp<ProfileStackParamList>>();

  const theme = useAppTheme();
  const scrollRef = useRef(null);
  const {openAlert} = useAlert();
  const {scrollHandlerWorklet} = useTabBarAnimation({
    scrollToTop: () => {
      if (scrollRef.current) {
        // @ts-ignore
        scrollRef.current.scrollToOffset({offset: 0, animated: true});
      }
    },
  });
  const bottomListPadding = useBottomPadding(theme.spacing.mY);

  return (
    <Flex>
      <FlashListWithHeaders
        HeaderComponent={HeaderComponent}
        LargeHeaderComponent={LargeProfileHeaderComponent}
        data={[]}
        ref={scrollRef}
        keyExtractor={item => item}
        refreshControl={<RefreshControl refreshing={false} />}
        onScrollWorklet={scrollHandlerWorklet}
        ListEmptyComponent={
          <Center flex={1} my="xxxlY" py="xxxlY">
            <Button
              title="Open test alert"
              onPress={() => {
                openAlert({
                  title: 'Test alert',
                  message:
                    'This is a test alert. It has some super long text to show how the alert looks like.',
                  buttons: [
                    {
                      text: 'Cancel',
                      variant: 'destructive',
                      onPress: () => {},
                    },
                    {
                      text: 'OK',
                      onPress: () => {
                        openAlert({
                          title: 'All done',
                          message: 'You have successfully dismissed the alert.',
                          buttons: [
                            {
                              text: 'Dismiss',
                            },
                          ],
                        });
                      },
                    },
                  ],
                });
              }}
            />
            <ActivityLoader size="xl" />
            <Text
              variant="medium"
              my="xlY"
              color="cardText"
              py="xxxlY"
              mt="xxxlY"
              mb="xxxlY">
              Nothing to see here
            </Text>
            <Text
              variant="medium"
              my="xlY"
              color="cardText"
              py="xxxlY"
              mt="xxxlY"
              mb="xxxlY">
              Nothing to see here
            </Text>
          </Center>
        }
        contentContainerStyle={{
          paddingTop: theme.spacing.sY,
          paddingBottom: bottomListPadding,
        }}
        estimatedItemSize={100}
        renderItem={({}) => <Box />}
      />
    </Flex>
  );
};

export default Profile;
