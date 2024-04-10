import React from 'react';
import OutlineIcon from 'app/assets/icons/tabbar/Profile.svg';
import FilledIcon from 'app/assets/icons/tabbar/Profile.svg';

const ProfileTabBarIcon = ({
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

export {ProfileTabBarIcon};
export default ProfileTabBarIcon;
