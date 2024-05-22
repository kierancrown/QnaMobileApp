import React from 'react';
import {HStack, Text, VStack} from 'ui';
import Avatar from '../../Avatar';
import {FC} from 'react';
import useProfile from 'app/hooks/useProfile';
import Username from 'app/components/Username';
import dayjs from 'dayjs';

import PopoverMenu from 'app/components/common/PopoverMenu';

import ElipsisIcon from 'app/assets/icons/actions/ellipsis.svg';
import {menuItems} from 'app/screens/QuestionDetail/components/Header';
import {useAppTheme} from 'app/styles/theme';

interface QuestionItemHeaderProps {
  userId: string;
  timestamp: string;
  isOwner?: boolean;
}

const QuestionItemHeader: FC<QuestionItemHeaderProps> = ({
  userId,
  timestamp,
  isOwner,
}) => {
  const theme = useAppTheme();
  const {username, verified} = useProfile(userId);

  return (
    <HStack columnGap="xs" width="100%">
      <Avatar userId={userId} size="xl" />
      <VStack rowGap="xxxsY" flex={1}>
        <HStack alignItems="center" flex={1} justifyContent="space-between">
          <Username
            variant="headline"
            username={username ?? 'Profile'}
            isVerified={verified}
            noHighlight
          />
          <PopoverMenu
            accessibilityLabel="Open Question Options"
            accessibilityRole="button"
            accessibilityHint="Report or hide this question"
            triggerComponent={
              <ElipsisIcon
                width={theme.iconSizes.m}
                height={theme.iconSizes.m}
              />
            }
            items={menuItems(isOwner ?? false, theme)}
          />
        </HStack>
        <Text variant="headline" color="cardText">
          {dayjs(timestamp).fromNow(false)}
        </Text>
      </VStack>
    </HStack>
  );
};

export default QuestionItemHeader;
