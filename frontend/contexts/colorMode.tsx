import React from 'react';
import {
  PaletteMode,
} from '@mui/material';

interface Data {
  mode: PaletteMode;
  setColorMode: (value?: PaletteMode) => void;
};

export const ColorModeContext = React.createContext<Data>({
  mode: 'light',
  setColorMode: () => null,
});
