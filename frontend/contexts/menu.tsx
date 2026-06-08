import React from 'react';
import { Menu } from 'components/header';

interface Data {
  loading: boolean;
  menu: Menu[];
};

export const MenuContext = React.createContext<Data>({
  loading: true,
  menu: [],
});
