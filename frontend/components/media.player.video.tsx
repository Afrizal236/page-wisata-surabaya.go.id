import React, { memo } from 'react';
import {
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ReactPlayer from 'react-player';
import { IconButtonPlayer } from 'components/media.player.audio';
import { sizePlay } from 'pages/id/videos/index';
import { borderRadius } from 'styles/theme';
import PlayIcon from 'public/images/icon/play_video.svg';

interface Props {
  url: string;
};

const BoxStyled = styled(Box)(({ theme }) => ({
  position: 'relative',
  '& .box-button': {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  '& .react-player': {
    aspectRatio: `16/9`,
    borderRadius: theme.spacing(borderRadius),
    overflow: 'hidden',
  },
}));

const ProgressPlayerVideo: React.FunctionComponent<Props> = ({
  url,
}: Props) => {
  const mediaRef = React.useRef<ReactPlayer>();
  const [ playing, setPlaying ] = React.useState(false);
  const handlePlayPause = React.useCallback(() => {
    setPlaying(!playing);
  }, [playing]);
  return (
    <BoxStyled>
      <ReactPlayer
        ref={mediaRef}
        url={`/id/videos/${url}`}
        width={`100%`}
        height={`auto`}
        className="react-player"
        playing={playing}
        controls={true}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
      <Box
        className={`box-button ${playing ? 'hidden' : ''}`}
        sx={{
          '&.hidden': {
            visibility: 'hidden',
            opacity: 0,
          },
        }}
      >
        <IconButtonPlayer
          onPlayPause={handlePlayPause}
          icon={<PlayIcon />}
          size={sizePlay}
        />
      </Box>
    </BoxStyled>
  );
};

ProgressPlayerVideo.defaultProps = {};

export default memo(ProgressPlayerVideo);