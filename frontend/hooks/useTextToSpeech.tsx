import * as React from 'react';
import { AccessibilityContext } from 'contexts/accessibility';

declare global {
  interface Window {
    responsiveVoice: any;
  }
};

let responsiveVoice = typeof window != 'undefined' ? window.responsiveVoice : null;

const useTextToSpeech = () => {
  const accessibility = React.useContext(AccessibilityContext);
  // const [ loading, setLoading ] = React.useState(false);
  // function voiceStartCallback() {
  //   setLoading(true);
  // };
  // function voiceEndCallback() {
  //   console.log('finished');
  //   setLoading(false);
  // };
  const textToSpeech = React.useCallback(async (e: any, withEvent: boolean) => {
    if (accessibility.speech) {
      try {
        responsiveVoice.cancel();
        responsiveVoice.enableWindowClickHook();
        const text = withEvent ? e.target.textContent : e;
        // const parameters = {
        //   onstart: voiceStartCallback,
        //   onend: voiceEndCallback,
        // };
        setTimeout(responsiveVoice.speak(text, 'Indonesian Female'), 1500);
      } catch (err) {
        console.info('err', err);
      };
    };
  }, [accessibility]);

  return {
    textToSpeech,
  };
};

export default useTextToSpeech;