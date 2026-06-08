import * as React from 'react';

export const defaultCss = {
  grayscale: false,
  underline: false,
  negative: false,
};

const useAccessibility = () => {
  const [ fontSize, setFontSize ] = React.useState(0);
  const [ css, setCss ] = React.useState(defaultCss);
  const [ speech, setSpeech ] = React.useState(false);
  return {
    fontSize,
    setFontSize,
    css,
    setCss,
    speech,
    setSpeech,
  };
};

export default useAccessibility;