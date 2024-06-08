import {
  Button,
  Center,
  HStack,
  SafeAreaView,
  Text,
  VStack,
} from 'app/components/common';
import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {SCREEN_HEIGHT} from '@gorhom/bottom-sheet';
import dayjs from 'dayjs';
import {useAppDispatch} from 'app/redux/store';
import {closeAuthSheet} from 'app/redux/slices/authSheetSlice';
import {useUsername} from 'app/hooks/useUsername';
import Username from 'app/components/Username';
import {useSheetNavigationHeight} from '../hooks/useSheetNavigationHeight';

const SuccessScreen: FC = () => {
  const {username, isVerified} = useUsername();
  const dispatch = useAppDispatch();
  const [secondsLeft, setSecondsLeft] = useState(60);
  const autoCloseTimestamp = useMemo(
    () => dayjs(Date.now()).add(5, 'second').valueOf(),
    [],
  );
  useSheetNavigationHeight(260);

  const closeSelf = useCallback(() => dispatch(closeAuthSheet()), [dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft(
        parseInt(
          dayjs(autoCloseTimestamp).diff(dayjs(), 'second', true).toFixed(0),
          10,
        ),
      );
      if (dayjs().isAfter(autoCloseTimestamp)) {
        setSecondsLeft(0);
        clearInterval(interval);
        closeSelf();
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [autoCloseTimestamp, closeSelf]);

  return (
    <SafeAreaView edges={['bottom']} style={{maxHeight: SCREEN_HEIGHT / 2}}>
      <VStack flex={1} pt="mY" px="l" justifyContent="space-between">
        <Center rowGap="mY" flex={1}>
          <HStack
            alignItems="center"
            justifyContent="center"
            columnGap="xs"
            rowGap="xsY"
            flexWrap="wrap">
            <Text variant="markdownH3">Signed in as</Text>
            <Username
              username={username}
              isVerified={isVerified}
              variant="markdownH3"
              color="brand"
              noHighlight
            />
          </HStack>
        </Center>

        <VStack rowGap="mY">
          <Button
            title={secondsLeft > 0 ? `Dismiss in ${secondsLeft}s` : 'Dismiss'}
            onPress={closeSelf}
            minWidth="100%"
            titleVariant="bodyBold"
          />
        </VStack>
      </VStack>
    </SafeAreaView>
  );
};

export default SuccessScreen;
