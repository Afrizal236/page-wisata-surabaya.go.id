import React, { memo } from 'react';
import {
  Typography,
} from '@mui/material';
import { fontSize } from 'styles/theme';
import { AccessibilityContext } from 'contexts/accessibility';
import useTextToSpeech from 'hooks/useTextToSpeech';

interface Props {
  src: string;
  text?: string;
  onClick?(): any;
};

const CarouselItem: React.FunctionComponent<Props> = ({
  src,
  text,
  onClick,
}: Props) => {
  const accessibility = React.useContext(AccessibilityContext);
  const { textToSpeech } = useTextToSpeech();
  const handleClick = React.useCallback(() => {
    if (onClick) {
      onClick();
    };
  }, []);
  return (
    <div className="items" onClick={handleClick}>
      <img src={src} />
      {text &&
        <Typography
          onMouseEnter={(e) => textToSpeech(e, true)}
          sx={{
            fontSize: (fontSize + 2) + accessibility.fontSize,
          }}
        >
          {text}
        </Typography>
      }
    </div>
  );
};

CarouselItem.defaultProps = {};

export default memo(CarouselItem);
