import React, { memo } from 'react';
import {
  Container,
} from '@mui/material';
import { Breakpoint } from '@mui/system';

interface Props {
  children?: React.ReactElement;
  paddingY?: number;
  maxWidth?: Breakpoint;
};

const Layout: React.FunctionComponent<Props> = ({ children, paddingY, maxWidth }: Props) => {
  return (
    <Container
      maxWidth={maxWidth}
      disableGutters
      sx={{
        py: 0,
        backgroundColor: 'transparent',
        position: 'relative',
        zIndex: 1,  
      }}
    >
      {children}
    </Container>
  );
};

Layout.defaultProps = {
  paddingY: 5,
  maxWidth: 'lg',
};

export default memo(Layout);