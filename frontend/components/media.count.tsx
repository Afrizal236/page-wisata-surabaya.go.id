import React, { memo } from 'react';
import {
  Box,
  Typography,
  Grid,
} from '@mui/material';
import CountUp from 'react-countup';
import { styled } from '@mui/material/styles';
import { fontSize, borderRadius } from 'styles/theme';
import { BreakpointsContext } from 'contexts/breakpoints';

export interface Count {
  text: string;
  total: number;
};

interface Props {
  data: Count[];
};

const BoxStyled = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  overflow: 'hidden',
  maxWidth: 870,
  margin: theme.spacing(5, 'auto', 0),
  padding: theme.spacing(8, 12),
  position: 'relative',
  zIndex: 1,
  '& .items': {
    backgroundColor: theme.palette.common.white,
    borderRadius: theme.spacing(borderRadius - 1),
    padding: theme.spacing(3),
    overflow: 'hidden',
    textAlign: 'center',
    color: theme.palette.primary.main,
    '& .count-up': {
      fontSize: fontSize + 50,
      fontWeight: 800,
      lineHeight: 1,
      marginBottom: theme.spacing(1),
    },
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(5),
  },
}));

const MediaCount: React.FunctionComponent<Props> = ({
  data,
}: Props) => { 
  const { downSm } = React.useContext(BreakpointsContext); 
  return (
    <BoxStyled borderRadius={borderRadius}>
      <Grid container spacing={downSm ? 5 : 12} justifyContent="center">
        {data.map((v, i) => (
          <Grid key={i} item xs={12} sm={6}>
            <Box className="items">
              <CountUp
                start={0}
                end={v.total}
                duration={3}
                useEasing={true}
                className="count-up"
              />
              <Typography variant="subtitle2" fontWeight={700}>
                {v.text}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </BoxStyled>
  );
};

MediaCount.defaultProps = {};

export default memo(MediaCount);