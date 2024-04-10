import React from 'react';
import OutlineIcon from 'app/assets/icons/tabbar/InboxFull.svg';
import FilledIcon from 'app/assets/icons/tabbar/InboxFull.svg';

const InboxFullTabBarIcon = ({
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

export {InboxFullTabBarIcon};
export default InboxFullTabBarIcon;
