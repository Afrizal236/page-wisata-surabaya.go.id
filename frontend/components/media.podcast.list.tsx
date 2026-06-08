import React, { memo } from 'react'
import { Box, Grid } from '@mui/material'
import { styled } from '@mui/material/styles'
import PodcastItem from 'components/media.podcast.item'
import Element1 from 'public/images/icon/element_1.svg'
import Element3 from 'public/images/icon/element_3.svg'
import Element4 from 'public/images/icon/element_4.svg'
import { BreakpointsContext } from 'contexts/breakpoints'
import schema from 'types/schemas'

interface Props {
  data: schema['schemas']['Article'][]
}

const BoxStyled = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(5),
  position: 'relative',
  '& .wrapper-svg-section3': {
    position: 'absolute',
    top: theme.spacing(3),
    right: `calc(100% + ${theme.spacing(4)})`,
    '& svg': {
      width: 50,
      '& circle': {
        fill: `${theme.palette.secondary.main} !important`,
      },
    },
  },
  '& .wrapper-svg-section4': {
    position: 'absolute',
    top: 0,
    left: `100%`,
    transform: 'translate(-40%, -20%)',
    '& svg': {
      width: theme.spacing(100),
    },
  },
  '& .wrapper-svg-section5': {
    position: 'absolute',
    bottom: 0,
    right: `100%`,
    transform: 'translate(45%, 20%)',
    '& svg': {
      width: theme.spacing(50),
    },
  },
}))

const MediaPodcastList: React.FunctionComponent<Props> = ({ data }: Props) => {
  const { downSm } = React.useContext(BreakpointsContext)
  return (
    <BoxStyled>
      <Box className="wrapper-svg-section4">
        <Element1 />
      </Box>
      <Box className="wrapper-svg-section3">
        <Element3 />
      </Box>
      <Box className="wrapper-svg-section5">
        <Element4 />
      </Box>
      <Grid container spacing={3} alignItems="stretch" position="relative" zIndex={1}>
        {data.map((v, i) => (
          <Grid key={i} item xs={12} sm={i == 0 && !downSm ? 8 : 4}>
            <PodcastItem data={v} isVertical={i == 0 && !downSm ? false : true} />
          </Grid>
        ))}
      </Grid>
    </BoxStyled>
  )
}

MediaPodcastList.defaultProps = {}

export default memo(MediaPodcastList)
