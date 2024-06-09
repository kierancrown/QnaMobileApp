import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {
  ActivityLoader,
  Box,
  Button,
  Center,
  HStack,
  Text,
  VStack,
} from 'app/components/common';
import React, {FC, useMemo, useState} from 'react';
import {AuthStackParamList} from '../..';
import {useAppTheme} from 'app/styles/theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SCREEN_HEIGHT} from '@gorhom/bottom-sheet';
import {useSheetNavigationHeight} from '../../hooks/useSheetNavigationHeight';
import Input from 'app/components/common/TextInput';
import AtIcon from 'app/assets/icons/at.svg';
import {percentHeight} from 'app/utils/size';
import {MAX_BIO_LENGTH} from 'app/constants';
import Animated, {
  KeyboardState,
  useAnimatedKeyboard,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {Keyboard, Pressable} from 'react-native';
import {FlexStyle} from 'app/helpers/commonStyles';
import {MeasureSize} from 'app/components/utils/MeasureSize';
import {useUsernameCheck} from '../../hooks/useUsernameCheck';

const WelcomeScreen: FC = () => {
  const {
    params: {},
  } = useRoute<RouteProp<AuthStackParamList, 'AuthScreen'>>();
  const theme = useAppTheme();
  const {top: topSafeAreaInset, bottom: bottomSafeAreaInset} =
    useSafeAreaInsets();
  const {navigate} = useNavigation<NavigationProp<AuthStackParamList>>();
  useSheetNavigationHeight(SCREEN_HEIGHT - topSafeAreaInset - theme.spacing.mY);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');

  const charsRemaining = useMemo(() => MAX_BIO_LENGTH - bio.length, [bio]);
  const [settingInformation, setSettingInformation] = useState(false);
  const keyboard = useAnimatedKeyboard();

  const {
    usernameAvailable,
    invalidUsername,
    ignoreResponse,
    loading: checkingUsername,
  } = useUsernameCheck(username);

  // #region Animated Styles
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(
        keyboard.state.value === KeyboardState.OPENING ||
          keyboard.state.value === KeyboardState.OPEN
          ? 0
          : 1,
        {
          duration: 300,
        },
      ),
    };
  }, []);

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(
            keyboard.state.value === KeyboardState.OPENING ||
              keyboard.state.value === KeyboardState.OPEN
              ? -(headerHeight + theme.spacing.mY)
              : 0,
          ),
        },
      ],
    };
  }, [headerHeight]);

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      paddingBottom: withTiming(
        keyboard.state.value === KeyboardState.OPENING ||
          keyboard.state.value === KeyboardState.OPEN
          ? theme.spacing.mY
          : bottomSafeAreaInset,
      ),
    };
  }, []);
  // #endregion

  return (
    <Pressable style={FlexStyle} onPress={() => Keyboard.dismiss()}>
      <Animated.View style={containerAnimatedStyle}>
        <VStack py="mY" px="s" pt="xlY">
          <Animated.View style={headerAnimatedStyle}>
            <MeasureSize onSize={({height}) => setHeaderHeight(height)}>
              <VStack px="s" pb="xxlY" rowGap="xsY">
                <Text variant="header">Let's get started</Text>
                <Text variant="bodyBold">
                  Let people know who you are and a little bit about yourself
                </Text>
              </VStack>
            </MeasureSize>
          </Animated.View>
          <VStack>
            <Input
              value={username}
              leftAdornment={
                checkingUsername ? (
                  <Box
                    width={theme.iconSizes.intermediate}
                    height={theme.iconSizes.intermediate}>
                    <Center
                      position="absolute"
                      width={theme.iconSizes.intermediate}
                      height={theme.iconSizes.intermediate}>
                      <ActivityLoader size={theme.iconSizes.xl} />
                    </Center>
                  </Box>
                ) : (
                  <AtIcon
                    width={theme.iconSizes.intermediate}
                    height={theme.iconSizes.intermediate}
                    color={theme.colors.inputPlaceholder}
                  />
                )
              }
              onChangeText={setUsername}
              maxLength={16}
              placeholder="Username"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!settingInformation}
              clearButton
              onClear={() => setUsername('')}
              insideBottomSheet
            />
            <HStack alignItems="center" py="xsY" px="xs">
              <Text
                variant="small"
                opacity={ignoreResponse || usernameAvailable ? 0 : 0.88}
                color="minusCharLimit">
                {ignoreResponse || usernameAvailable
                  ? ''
                  : invalidUsername
                  ? 'Username invalid, must start with a letter and be between 3 and 16 characters'
                  : 'Username not available'}
              </Text>
            </HStack>
            <Box>
              <Input
                value={bio}
                onChangeText={setBio}
                placeholder="Say a little something about yourself"
                editable={!settingInformation}
                variant="smallInput"
                multiline
                numberOfLines={4}
                minHeight={percentHeight(10)}
                insideBottomSheet
              />
              <Box
                position="absolute"
                right={theme.spacing.xs}
                bottom={theme.spacing.xs}>
                <Text
                  variant="small"
                  color={
                    charsRemaining < 0
                      ? 'minusCharLimit'
                      : charsRemaining < 11
                      ? 'reallyLowCharLimit'
                      : charsRemaining < 21
                      ? 'lowCharLimit'
                      : 'inputPlaceholder'
                  }>
                  {charsRemaining}
                </Text>
              </Box>
            </Box>
          </VStack>
        </VStack>
      </Animated.View>
      <Animated.View style={buttonAnimatedStyle}>
        <VStack px="s">
          <Button
            variant="primary"
            title="Next"
            titleVariant="bodyBold"
            borderRadius="textInput"
            minWidth="100%"
            disabled={
              charsRemaining < 0 ||
              !usernameAvailable ||
              invalidUsername ||
              settingInformation ||
              checkingUsername
            }
          />
        </VStack>
      </Animated.View>
    </Pressable>
  );
};

export default WelcomeScreen;
