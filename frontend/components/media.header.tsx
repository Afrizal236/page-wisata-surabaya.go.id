import React, { memo } from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { fontSize, borderRadius } from 'styles/theme';
import { BreakpointsContext } from 'contexts/breakpoints';

interface Props {
  text: string;
  description: string;
};

const BoxStyled = styled(Box)(({ theme }) => ({
  minHeight: 240,
  padding: theme.spacing(3, 10),
  backgroundColor: 'transparent',
  backgroundImage: "url('/images/Bg-Title-Card.svg')",
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start', 
  justifyContent: 'center',
  borderRadius: 8,
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  '& .MuiTypography-root': {
    color: theme.palette.common.white,
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
    minHeight: 'auto',
    backgroundSize: 'contain',
  },
}));

const MediaHeader: React.FunctionComponent<Props> = ({
  text,
  description,
}: Props) => {  
  const { downSm } = React.useContext(BreakpointsContext);
  return (
    <BoxStyled borderRadius={borderRadius}>
      <Typography
        fontSize={fontSize + (downSm ? 10 : 20)}
        lineHeight={1.2}
        marginBottom={1}
        fontWeight={700}
      >
        {text}
      </Typography>
      <Typography>
        {description}
      </Typography>
    </BoxStyled>
  );
};

MediaHeader.defaultProps = {};

export default memo(MediaHeader);