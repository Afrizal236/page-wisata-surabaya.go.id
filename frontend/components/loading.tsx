import React, { memo } from 'react';
import {
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Fade from '@mui/material/Fade';

interface Props {
  load: boolean;
};

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  zIndex: 999999,
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: '100%',
  height: '100%',
  '& img': {
    maxWidth: 300,
    width: '65%',
  },
}));

const Loading: React.FunctionComponent<Props> = ({ load }) => {
  return (
    <React.Fragment>
      <Fade
        in={load}
        timeout={{ enter: 0, exit: 500 }}
      >
        <StyledBox
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <img src={`/images/logo/loading.png`} />
        </StyledBox>
      </Fade>
    </React.Fragment>
  );
};

export default memo(Loading);
