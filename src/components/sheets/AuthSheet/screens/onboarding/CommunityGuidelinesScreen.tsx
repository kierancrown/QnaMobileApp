import {RouteProp, useRoute} from '@react-navigation/native';
import {Box, Button, HStack, Text, VStack} from 'app/components/common';
import React, {FC, useCallback} from 'react';
import {AuthStackParamList} from '../..';
import {useAppTheme} from 'app/styles/theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SCREEN_HEIGHT} from '@gorhom/bottom-sheet';
import {useSheetNavigationHeight} from '../../hooks/useSheetNavigationHeight';
import {Keyboard, Pressable} from 'react-native';
import {FlexStyle} from 'app/helpers/commonStyles';
import {useAppDispatch} from 'app/redux/store';
import {closeAuthSheet} from 'app/redux/slices/authSheetSlice';

import HateSpeechIcon from 'app/assets/community_guidelines/hate-speech.svg';
import GunSlashIcon from 'app/assets/community_guidelines/gun-slash.svg';
import BanIcon from 'app/assets/community_guidelines/ban.svg';

const CommunityGuidelinesScreen: FC = () => {
  const {
    params: {},
  } = useRoute<RouteProp<AuthStackParamList, 'AuthScreen'>>();
  const theme = useAppTheme();
  const {top: topSafeAreaInset, bottom: bottomSafeAreaInset} =
    useSafeAreaInsets();
  useSheetNavigationHeight(SCREEN_HEIGHT - topSafeAreaInset - theme.spacing.mY);
  const dispatch = useAppDispatch();
  const closeSelf = useCallback(() => dispatch(closeAuthSheet()), [dispatch]);

  return (
    <Pressable style={FlexStyle} onPress={() => Keyboard.dismiss()}>
      <VStack py="mY" px="s" pt="xlY" flex={1}>
        <VStack px="s" rowGap="xsY">
          <Text variant="header">Community Guidelines</Text>
        </VStack>

        <VStack
          rowGap="mY"
          overflow="hidden"
          flex={1}
          justifyContent="space-evenly">
          <HStack columnGap="s" alignItems="center" maxWidth="80%">
            <HateSpeechIcon
              width={theme.iconSizes.xxl}
              height={theme.iconSizes.xxl}
            />
            <VStack maxWidth="100%">
              <Text variant="bodyBold">No hate speech or bullying</Text>
              <Text variant="smallBody">
                Treat all members with respect and refrain from harassment to
                maintain a safe and respectful community.
              </Text>
            </VStack>
          </HStack>
          <HStack columnGap="s" alignItems="center" maxWidth="80%">
            <GunSlashIcon
              width={theme.iconSizes.xxl}
              height={theme.iconSizes.xxl}
            />
            <VStack maxWidth="100%">
              <Text variant="bodyBold">No Drugs or Violence</Text>
              <Text variant="smallBody">
                Comply with local laws and avoid posting content about drugs or
                firearms.
              </Text>
            </VStack>
          </HStack>
          <HStack columnGap="s" alignItems="center" maxWidth="80%">
            <BanIcon width={theme.iconSizes.xxl} height={theme.iconSizes.xxl} />
            <VStack maxWidth="100%">
              <Text variant="bodyBold">No Nudity</Text>
              <Text variant="smallBody">
                No nudity or pornographic content.
              </Text>
            </VStack>
          </HStack>
        </VStack>
      </VStack>
      <VStack px="s" rowGap="mY" style={{paddingBottom: bottomSafeAreaInset}}>
        <Box px="xxs">
          <Text variant="smaller" color="cardText">
            To keep the community safe and active, we have some community
            guidelines that you must follow. To agree to these guidelines,
            please click the button below.
          </Text>
        </Box>
        <Button
          variant="primary"
          title="I understand"
          titleVariant="bodyBold"
          borderRadius="textInput"
          minWidth="100%"
          onPress={closeSelf}
        />
      </VStack>
    </Pressable>
  );
};

export default CommunityGuidelinesScreen;
