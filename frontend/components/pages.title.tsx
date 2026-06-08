import React, { memo } from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { fontSize } from 'styles/theme';
import { BreakpointsContext } from 'contexts/breakpoints';

interface Props {
  text: string;
};

const fontSizeTypo = 24;
const BoxStyled = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  backgroundImage: 'url(/images/Bg-Title-Card.svg)',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundOrigin: 'border-box',
  backgroundClip: 'border-box',
  backgroundColor: 'transparent',
  margin: theme.spacing(12, 0, 0),
  padding: theme.spacing(5),
  borderRadius: theme.spacing(2),
  minHeight: theme.spacing(38),
  '& .MuiTypography-root': {
    fontSize: fontSize + fontSizeTypo,
    textTransform: 'uppercase',
    fontWeight: 700,
    color: theme.palette.common.white,
    '&:before': {
      content: `attr(data-text)`,
      position: 'absolute',
      fontSize: fontSize + (fontSizeTypo * 2),
      textAlign: 'center',
      lineHeight: 1.4,
      top: '50%',
      left: '50%',
      width: '70%',
      transform: 'translate(-50%, -50%)',
      opacity: 0.1,
      fontWeight: 800,
    },
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
    minHeight: 'auto',
    margin: theme.spacing(5, 0, 0),
    '& .MuiTypography-root': {
      fontSize: fontSize + 4,
      '&:before': {
        display: 'none',
      },
    },  
  },
}));

const PagesTitle: React.FunctionComponent<Props> = ({
  text,
}: Props) => {  
  const { downSm } = React.useContext(BreakpointsContext);
  return (
    <BoxStyled>
      <Typography data-text={text}>
        {text}
      </Typography>
    </BoxStyled>
  );
};

PagesTitle.defaultProps = {};

export default memo(PagesTitle);