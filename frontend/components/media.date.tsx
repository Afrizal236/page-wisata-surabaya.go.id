import React, { memo } from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import whatDayId from 'what-day-id';
import PopperShare from 'components/popper.share';
import { AccessibilityContext } from 'contexts/accessibility';
import useTextToSpeech from 'hooks/useTextToSpeech';

interface Props {
  title?: string;
  date: string;
  others: string;
  justifyContent?: string;
  withText?: boolean;
};

const MediaDate: React.FunctionComponent<Props> = ({
  title,
  date,
  others,
  justifyContent,
  withText,
}: Props) => {
  const accessibility = React.useContext(AccessibilityContext);
  const { textToSpeech } = useTextToSpeech();
  const dateFormat = React.useMemo(() => {
    return whatDayId(new Date(date));
  }, [date]);
  return (
    <Box display="flex" alignItems="center" justifyContent={justifyContent}>
      <Typography
        onMouseEnter={(e) => textToSpeech(e, true)}
        sx={(theme) => ({
          fontSize: `1${accessibility.fontSize}0%`,
          color:
            theme.palette.mode === 'light'
              ? theme.palette.text.secondary
              : theme.palette.text.primary,
        })}
      >
        {withText && `Di unggah : `} {dateFormat} {` | `} {others}
      </Typography>
      <PopperShare title={title} />
    </Box>
  );
};

MediaDate.defaultProps = {
  justifyContent: 'center',
  withText: false,
};

export default memo(MediaDate);