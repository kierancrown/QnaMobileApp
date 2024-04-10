import React from 'react';
import OutlineIcon from 'app/assets/icons/tabbar/Inbox.svg';
import FilledIcon from 'app/assets/icons/tabbar/Inbox.svg';

const InboxTabBarIcon = ({
  size,
  focused,
  color,
}: {
  size: number;
  focused: boolean;
  color: string;
}) => {
  return focused ? (
    <FilledIcon width={size} height={size} fill={color} />
  ) : (
    <OutlineIcon width={size} height={size} fill={color} />
  );
};

export {InboxTabBarIcon};
export default InboxTabBarIcon;
