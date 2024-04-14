import React, {FC} from 'react';
import Flex from './Flex';

interface LayoutProps {
  children: React.ReactNode | React.ReactNode[];
}

const Layout: FC<LayoutProps> = ({children}) => {
  return <Flex>{children}</Flex>;
};

export default Layout;
