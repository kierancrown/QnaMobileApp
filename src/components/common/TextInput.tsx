import {Pressable, TextInputProps, TextStyle, TextInput} from 'react-native';
import {BottomSheetTextInput} from '@gorhom/bottom-sheet';
import {BoxProps, useTheme} from '@shopify/restyle';
import React, {useRef, forwardRef, useImperativeHandle, useState} from 'react';
import {Theme} from 'app/styles/theme';
import Box from './Box';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';
import HStack from './HStack';
import Flex from './Flex';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Center from './Center';
import ClearIcon from 'app/assets/icons/CircleCloseSolid.svg';

export interface InputProps extends BoxProps<Theme>, Partial<TextInputProps> {
  variant?: keyof Theme['textVariants'];
  color?: keyof Theme['colors'];
  leftAdornment?: React.ReactNode;
  rightAdornment?: React.ReactNode;
  insideBottomSheet?: boolean;
  clearButton?: boolean;
  onClear?: () => void;
}

export interface InputRef {
  focus: () => void;
  blur: () => void;
}

const Input = forwardRef<InputRef, InputProps>((props, ref) => {
  // @ts-ignore
  const inputRef = useRef<TextInput | BottomSheetTextInput>(null);
  const theme = useTheme<Theme>();
  const textVariant = theme.textVariants[props.variant || 'defaultTextInput'];
  const [focused, setFocused] = useState(false);
  // Omit border radius
  const textInputProps = {
    ...props,
    borderRadius: undefined,
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const blurInput = () => {
    inputRef.current?.blur();
  };

  useImperativeHandle(ref, () => ({
    focus: focusInput,
    blur: blurInput,
  }));

  const animatedStyle = useAnimatedStyle(() => {
    return {};
  }, []);

  const inputStyle: TextStyle = {
    padding: 0,
    margin: 0,
    color: theme.colors[props.color || 'white'],
  };

  const clearButtonAnimatedStyle = useAnimatedStyle(() => {
    const show = focused && props.value && props.value.length > 0;
    return {
      opacity: withTiming(show ? 1 : 0, {duration: 220}),
      transform: [
        {
          translateX: withTiming(show ? 0 : theme.spacing.xs, {duration: 220}),
        },
      ],
    };
  }, [focused, props.value, theme.spacing.xs]);

  return (
    <Animated.View style={animatedStyle}>
      <Pressable onPress={focusInput}>
        <HStack
          alignItems="center"
          columnGap="xs"
          bg="inputBackground"
          px="s"
          py="sY"
          borderRadius="textInput"
          {...props}>
          {props.leftAdornment && <Box>{props.leftAdornment}</Box>}
          <Flex>
            {props.insideBottomSheet ? (
              <BottomSheetTextInput
                ref={inputRef}
                onFocus={() => {
                  setFocused(true);
                }}
                onBlur={() => {
                  setFocused(false);
                }}
                placeholderTextColor={theme.colors.inputPlaceholder}
                {...textInputProps}
                selectionColor={theme.colors.brand}
                cursorColor={theme.colors.brand}
                selectionHandleColor={theme.colors.brand}
                style={[
                  inputStyle,
                  textVariant,
                  // eslint-disable-next-line react-native/no-inline-styles
                  {
                    borderWidth: 0,
                  },
                ]}
              />
            ) : (
              <TextInput
                ref={inputRef}
                onFocus={() => {
                  setFocused(true);
                }}
                onBlur={() => {
                  setFocused(false);
                }}
                placeholderTextColor={theme.colors.inputPlaceholder}
                {...textInputProps}
                selectionColor={theme.colors.brand}
                cursorColor={theme.colors.brand}
                selectionHandleColor={theme.colors.brand}
                style={[
                  inputStyle,
                  textVariant,
                  // eslint-disable-next-line react-native/no-inline-styles
                  {
                    borderWidth: 0,
                  },
                ]}
              />
            )}
          </Flex>
          {props.clearButton === true && (
            <Animated.View style={clearButtonAnimatedStyle}>
              <TouchableOpacity hitSlop={8} onPress={props.onClear}>
                <Center>
                  <ClearIcon
                    width={theme.iconSizes.intermediate}
                    height={theme.iconSizes.intermediate}
                    fill={theme.colors.inputPlaceholder}
                  />
                </Center>
              </TouchableOpacity>
            </Animated.View>
          )}
          {props.rightAdornment && <Box>{props.rightAdornment}</Box>}
        </HStack>
      </Pressable>
    </Animated.View>
  );
});

export default Input;
