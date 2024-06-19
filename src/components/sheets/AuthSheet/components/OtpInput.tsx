import React, {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useEffect,
} from 'react';
import {BottomSheetTextInput} from '@gorhom/bottom-sheet';
import {Box, Center, HStack, Text} from 'app/components/common';
import {TextInput} from 'react-native-gesture-handler';
import {Pressable} from 'react-native';
import {MeasureSize} from 'app/components/utils/MeasureSize';
import {useAppTheme} from 'app/styles/theme';
import Clipboard from '@react-native-clipboard/clipboard';

interface OtpInputProps {
  codeLength: number;
  onSubmit: (value: string) => void;
}

export interface OtpInputHandle {
  focus: () => void;
  blur: () => void;
}

const OtpInput = forwardRef<OtpInputHandle, OtpInputProps>(
  ({codeLength, onSubmit}, ref) => {
    const theme = useAppTheme();
    const [code, setCode] = useState('');
    const inputRef = useRef<TextInput>(null);
    const [width, setWidth] = useState(0);
    const tileWidth = useMemo(
      () => width / codeLength - theme.spacing.xxs,
      [width, codeLength, theme.spacing.xxs],
    );

    useEffect(() => {
      if (code.length === codeLength) {
        onSubmit(code);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [code]);

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
      },
      blur: () => {
        inputRef.current?.blur();
      },
    }));

    const pasteCode = async () => {
      const val = await Clipboard.getString();
      // Make sure value is a 6 digit number
      if (val.match(/^\d{6}$/)) {
        setCode(val);
      }
    };

    return (
      <MeasureSize onSize={size => setWidth(size.width)}>
        <Box position="absolute" opacity={0} pointerEvents="none">
          <BottomSheetTextInput
            value={code}
            ref={inputRef}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={codeLength}
          />
        </Box>

        <Pressable
          onPress={() => inputRef.current?.focus()}
          onLongPress={pasteCode}>
          <HStack justifyContent="space-between">
            {Array.from({length: codeLength}, (_, index) => (
              <Center
                key={index}
                bg="cardBackground"
                borderWidth={2}
                borderColor={index === code.length ? 'cardText' : 'none'}
                borderRadius="m"
                width={tileWidth}
                py="mY">
                <Text variant="extraLargeInput">{code[index] || ' '}</Text>
              </Center>
            ))}
          </HStack>
        </Pressable>
      </MeasureSize>
    );
  },
);

export default OtpInput;
