import React from 'react';

interface Data {
  down400: boolean;
  downSm: boolean;
  downMd: boolean;
  downLg: boolean;
  downXl: boolean;
};

export const BreakpointsContext = React.createContext<Data>({
  down400: false,
  downSm: false,
  downMd: false,
  downLg: false,
  downXl: false,
});
