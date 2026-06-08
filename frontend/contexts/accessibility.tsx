import React from 'react';
import { defaultCss } from 'hooks/useAccessibility';

interface Css {
  grayscale: boolean;
  underline: boolean;
  negative: boolean;
};

interface Data {
  fontSize: number;
  setFontSize: (size: number) => void;
  css: Css;
  setCss: (css: Css) => void;
  speech: boolean;
  setSpeech: (speech: boolean) => void;
};

export const AccessibilityContext = React.createContext<Data>({
  fontSize: 0,
  setFontSize: () => null,
  css: defaultCss,
  setCss: () => null,
  speech: false,
  setSpeech: () => null,
});
