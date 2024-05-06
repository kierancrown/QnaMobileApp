import React from 'react';
import {LargeHeader, ScalingView} from '@codeherence/react-native-header';
import {RouteProp, useRoute} from '@react-navigation/native';
import {useTheme} from '@shopify/restyle';
import {Button, Center} from 'app/components/common';
import {ProfileStackParamList} from 'app/navigation/ProfileStack';
import {Theme} from 'app/styles/theme';
import {StyleProp, ViewStyle} from 'react-native';
import {SharedValue} from 'react-native-reanimated';
import Avatar from 'app/components/common/Avatar';
import Username from 'app/components/Username';

import AskUserIcon from 'app/assets/icons/actions/AskUserThick.svg';
import useProfile from 'app/hooks/useProfile';

export const LargeProfileHeaderComponent = ({
  scrollY,
}: {
  scrollY: SharedValue<number>;
}) => {
  const {
    params: {userId},
  } = useRoute<RouteProp<ProfileStackParamList, 'Profile'>>();
  const theme = useTheme<Theme>();
  const {username, verified} = useProfile(userId);

  const headerStyle: StyleProp<ViewStyle> = {
    paddingVertical: 0,
    paddingHorizontal: 0,
    marginBottom: theme.spacing.mY,
  };

  const scalingViewStyle: StyleProp<ViewStyle> = {
    flex: 1,
  };

  return (
    <LargeHeader headerStyle={headerStyle}>
      <ScalingView
        translationDirection="none"
        scrollY={scrollY}
        style={scalingViewStyle}>
        <Center rowGap="mY">
          <Avatar userId={userId} size="xxxxl" />
          <Username
            variant="header"
            username={username ?? 'Profile'}
            isVerified={verified}
            noHighlight
          />

          <Button
            marginTop="mY"
            variant="primary"
            onPress={() => {}}
            leftNode={
              <AskUserIcon
                width={theme.iconSizes.m}
                height={theme.iconSizes.m}
                color={theme.colors.foreground}
              />
            }
            borderRadius="pill"
            title="Ask Question"
            width="100%"
          />
        </Center>
      </ScalingView>
    </LargeHeader>
  );
};
