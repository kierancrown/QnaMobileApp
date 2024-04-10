import React from 'react';
import OutlineIcon from 'app/assets/icons/tabbar/Home.svg';
import FilledIcon from 'app/assets/icons/tabbar/Home.svg';

const HomeTabBarIcon = ({
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

export {HomeTabBarIcon};
export default HomeTabBarIcon;
