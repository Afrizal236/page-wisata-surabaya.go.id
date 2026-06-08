import React, { memo } from 'react';
import {
  Box,
  IconButton,
  Typography,
  LinearProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { default as _ReactPlayer } from 'react-player/lazy';
import { ReactPlayerProps } from "react-player/types/lib";
import Duration from 'utils/duration';
import { fontSizeTitle } from 'components/news.list';
import PlayIcon from 'public/images/icon/play_podcast.svg';
import PauseIcon from 'public/images/icon/pause_podcast.svg';
import PrevIcon from 'public/images/icon/media_prev.svg';
import NextIcon from 'public/images/icon/media_next.svg';
import { BreakpointsContext } from 'contexts/breakpoints';
import { AccessibilityContext } from 'contexts/accessibility';

const ReactPlayer = _ReactPlayer as unknown as React.FC<ReactPlayerProps>;

interface Props {
  url: string;
};

const heightIconPlay = 65;

const BoxStyled = styled(Box)(({ theme }) => ({
  '& .MuiIconButton-root': {
    margin: theme.spacing(0, 2),
    '&.primary': {
      '& svg path': {
        fill: theme.palette.primary.main,
      },
    },
    '&.secondary': {
      padding: 0,
      '& svg path': {
        fill: theme.palette.secondary.main,
      },
    },
  },
  '&.negative': {
    '& .MuiIconButton-root': {
      margin: theme.spacing(0, 2),
      '& svg path': {
        fill: `${theme.palette.common.white} !important`,
      },
    },  
  },
}));

export const IconButtonPlayer = memo(
  function IconButtonPlayer(props: any) {
    const { onPlayPause, size, icon, className } = props;
    return (
      <IconButton
        className={className}
        onClick={onPlayPause}
        sx={{
          '& .wrapper-svg': {
            width: size,
            height: size,
          },
        }}
      >
        <Box
          className="wrapper-svg"
          sx={{
            '& svg': {
              width: `${size}px`,
              height: `${size}px`,
            },
          }}
        >
          {icon}
        </Box>
      </IconButton>
    );
  },
);

const BoxRangeStyled = styled(Box)(({ theme }) => ({
  '& input[type="range"]': {
    width: '100%',
    opacity: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    margin: 0,
    height: 12,
    zIndex: 9,
  },
  '& .MuiLinearProgress-root': {
    height: 12,
    borderRadius: 25,
    width: '100%',
  },
  '& .MuiTypography-root': {
    fontSize: fontSizeTitle,
    fontWeight: 700,
  },
  '&.negative': {
    '& .MuiLinearProgress-root': {
      backgroundColor: theme.palette.grey[600],
      '& .MuiLinearProgress-bar': {
        backgroundColor: theme.palette.common.white,
      },
    },
  },
}));

export const ProgressPlayer = memo(
  function ProgressPlayer(props: any) {
    const { played, duration, onSeekMouseDown, onSeekChange, onSeekMouseUp } = props;
    const accessibility = React.useContext(AccessibilityContext);
    const percentage = React.useMemo(() => {
      const total = ((played / duration) * 100);
      const isFloat = checkFloat(total);
      const totalFixed = isFloat ? parseFloat(total.toFixed(1)) : total;
      return totalFixed;
    }, [played, duration]);  
    return (
      <BoxRangeStyled
        width="100%"
        marginTop={1}
        display="flex"
        alignItems="center"
        className={accessibility.css.negative ? 'negative' : ''}
      >
        <Typography>
          <Duration seconds={Math.floor(played)} />
        </Typography>
        <Box position="relative" marginX={2} flexGrow={1}>
          <LinearProgress variant="determinate" value={percentage} />
          <input
            type="range"
            min={0}
            max={Math.floor(duration)}
            step="any"
            value={Math.floor(played)}
            onMouseDown={onSeekMouseDown}
            onChange={onSeekChange}
            onMouseUp={onSeekMouseUp}
          />
        </Box>
        <Typography>
          <Duration seconds={duration} />
        </Typography>
      </BoxRangeStyled>
    );
  },
);

function checkFloat(n: number) {
  return (n) == n && n % 1 != 0;
};

const ProgressPlayerAudio: React.FunctionComponent<Props> = ({
  url,
}: Props) => {
  const { downSm } = React.useContext(BreakpointsContext);
  const accessibility = React.useContext(AccessibilityContext);
  const mediaRef = React.useRef<ReactPlayerProps>();
  const [ seeking, setSeeking ] = React.useState(false);
  const [ playing, setPlaying ] = React.useState(false);
  const [ played, setPlayed ] = React.useState(0);
  const [ duration, setDuration ] = React.useState(0);
  const handlePlayPause = React.useCallback(() => {
    setPlaying(!playing);
  }, [playing]);
  const handleProgress = React.useCallback((e: any) => {
    if (!seeking) {
      setPlayed(e.playedSeconds);
    };
  }, [seeking]);
  const handleSeekMouseDown = React.useCallback(() => {
    setSeeking(true);
  }, []);
  const handleSeekChange = React.useCallback((e: any) => {
    setPlayed(parseFloat(e.target.value));
  }, []);
  const handleSeekMouseUp = React.useCallback((e: any) => {
    setSeeking(false);
    mediaRef.current.seekTo(parseFloat(e.target.value));
  }, [mediaRef]);
  return (
    <BoxStyled className={accessibility.css.negative ? 'negative' : ''}>
      <ReactPlayer
        ref={mediaRef}
        url={url}
        width={0}
        height={0}
        playing={playing}
        onEnded={() => setPlaying(false)}
        onDuration={(e) => setDuration(e)}
        onProgress={handleProgress}
      />
      <Box display="flex" alignItems="center" flexDirection="column">
        <Box display="flex" alignItems="center" justifyContent="space-around" width="100%" maxWidth={400}>
          <IconButtonPlayer
            onPlayPause={() => null}
            icon={<PrevIcon />}
            size={downSm ? heightIconPlay - 15 : heightIconPlay}
            className="secondary"
          />
          <IconButtonPlayer
            onPlayPause={handlePlayPause}
            icon={playing ? <PauseIcon /> : <PlayIcon /> }
            size={downSm ? heightIconPlay - 15 : heightIconPlay}
            className="primary"
          />
          <IconButtonPlayer
            onPlayPause={() => null}
            icon={<NextIcon />}
            size={downSm ? heightIconPlay - 15 : heightIconPlay}
            className="secondary"
          />
        </Box>
        <ProgressPlayer
          played={played}
          duration={duration}
          onSeekMouseDown={handleSeekMouseDown}
          onSeekChange={handleSeekChange}
          onSeekMouseUp={handleSeekMouseUp}
        />
      </Box>
    </BoxStyled>
  );
};

ProgressPlayerAudio.defaultProps = {};

export default memo(ProgressPlayerAudio);