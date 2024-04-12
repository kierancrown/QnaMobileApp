import {Pressable, TextInput, TextInputProps, TextStyle} from 'react-native';
import {BoxProps, useTheme} from '@shopify/restyle';
import React, {useRef, forwardRef, useImperativeHandle} from 'react';
import {Theme} from 'app/styles/theme';
import Box from './Box';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import HStack from './HStack';

export interface InputProps extends BoxProps<Theme>, Partial<TextInputProps> {
  variant?: keyof Theme['textVariants'];
  color?: keyof Theme['colors'];
  leftAdornment?: React.ReactNode;
  rightAdornment?: React.ReactNode;
}

export interface InputRef {
  focus: () => void;
  blur: () => void;
}

const Input = forwardRef<InputRef, InputProps>((props, ref) => {
  const inputRef = useRef<TextInput>(null);
  const theme = useTheme<Theme>();
  const textVariant = theme.textVariants[props.variant || 'defaultTextInput'];

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

  return (
    <Animated.View style={animatedStyle}>
      <Pressable onPress={focusInput}>
        <HStack
          alignItems="center"
          columnGap="s"
          bg="inputBackground"
          px="s"
          py="sY"
          borderRadius="textInput"
          {...props}>
          {props.leftAdornment && <Box>{props.leftAdornment}</Box>}
          <TextInput
            ref={inputRef}
            style={[inputStyle, textVariant]}
            placeholderTextColor={theme.colors.inputPlaceholder}
            cursorColor={theme.colors.brand}
            selectionColor={theme.colors.brand}
            {...props}
          />
          {props.rightAdornment && <Box>{props.rightAdornment}</Box>}
        </HStack>
      </Pressable>
    </Animated.View>
  );
});

export default Input;
