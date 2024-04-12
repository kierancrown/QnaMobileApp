import React, {FC, useEffect, useState} from 'react';
import {Text, Button, VStack, Flex, Center} from 'ui';
import {BottomSheetView} from '@gorhom/bottom-sheet';
import {percentHeight} from 'app/utils/size';
import {openInbox, getEmailClients} from 'react-native-email-link';
import useMount from 'app/hooks/useMount';
import dayjs from 'dayjs';

interface IContentProps {
  onDismiss: () => void;
  sentTimestamp: number;
  onResend: () => void;
  resending: boolean;
}

const Content: FC<IContentProps> = ({sentTimestamp, onResend, resending}) => {
  const [openEmailAvailable, setOpenEmailAvailable] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const resendTimestamp = dayjs(sentTimestamp).add(60, 'second').valueOf();

  useMount(() => {
    getEmailClients().then(clients => {
      if (clients.length > 0) {
        setOpenEmailAvailable(true);
      }
    });
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft(
        parseInt(
          dayjs(resendTimestamp).diff(dayjs(), 'second', true).toFixed(0),
          10,
        ),
      );
      if (dayjs().isAfter(resendTimestamp)) {
        setSecondsLeft(0);
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [resendTimestamp]);

  return (
    <BottomSheetView style={{minHeight: percentHeight(40)}}>
      <VStack flex={1} px="l" py="mY" alignItems="center">
        <Center flex={1} px="m" py="mY" rowGap="xs">
          <Text variant="header" textAlign="center">
            Check your inbox
          </Text>
          <Flex />
          <Text variant="body" textAlign="center">
            We've sent you a magic link to your email. Tap the link to sign in.
          </Text>
          <Flex />
          <VStack rowGap="mY" alignItems="center">
            {openEmailAvailable && (
              <Button title="Open Email App" onPress={openInbox} />
            )}
            <Button
              title={
                resending
                  ? 'Sending new magic link'
                  : secondsLeft <= 0
                  ? 'Resend Email'
                  : `Resend in ${secondsLeft}s`
              }
              onPress={onResend}
              disabled={secondsLeft !== 0}
              loading={resending}
              variant="text"
            />
          </VStack>
        </Center>
      </VStack>
    </BottomSheetView>
  );
};

export default Content;
