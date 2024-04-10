import React from 'react';
import OutlineIcon from 'app/assets/icons/tabbar/Search.svg';
import FilledIcon from 'app/assets/icons/tabbar/Search.svg';

const SearchTabBarIcon = ({
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

export {SearchTabBarIcon};
export default SearchTabBarIcon;
