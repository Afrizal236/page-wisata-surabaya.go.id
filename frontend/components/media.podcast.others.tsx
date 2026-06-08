import React, { memo } from 'react'
import { Box, CardActionArea, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import Link from 'next/link'
import { useRouter } from 'next/router'
import _ from 'lodash'
import Layout from 'components/layout'
import Title from 'components/title'
import { borderRadius, boxShadow } from 'styles/theme'
import { fontSizeTitle } from 'components/news.list'
import Element3 from 'public/images/icon/element_3.svg'
import Element4 from 'public/images/icon/element_4.svg'
import { BreakpointsContext } from 'contexts/breakpoints'
import { ColorModeContext } from 'contexts/colorMode'
import { AccessibilityContext } from 'contexts/accessibility'
import useTextToSpeech from 'hooks/useTextToSpeech'
import schema from 'types/schemas'

interface Props {
  data: schema['schemas']['Article'][]
}

const heightSvg = 50

const BoxStyled = styled(Box)(({ theme }) => ({
  textAlign: 'right',
  '& .content-svg': {
    height: heightSvg,
    overflow: 'hidden',
    position: 'relative',
    transform: `translateX(${heightSvg * 2}px)`,
    '& .wrapper-svg': {
      position: 'absolute',
      top: 0,
      right: 0,
      transform: `translateX(100%) rotate(90deg)`,
      transformOrigin: 'top left',
    },
  },
  '& .wrapper-svg-element4': {
    position: 'absolute',
    bottom: 0,
    left: `100%`,
    transform: 'translate(-50%, 10%)',
    zIndex: -1,
    '& svg': {
      width: theme.spacing(57),
      '& circle': {
        stroke: `${theme.palette.secondary.main} !important`,
      },
    },
  },
  '&.negative': {
    '& .wrapper-svg-element4': {
      '& svg': {
        '& path': {
          stroke: `${theme.palette.common.white} !important`,
        },
      },
    },
  },
  [theme.breakpoints.down('sm')]: {
    '& .content-svg, & .wrapper-svg-element4': {
      display: 'none',
    },
  },
}))

export const ListPodcast = memo(function ListPodcast(props: any) {
  const { mode } = React.useContext(ColorModeContext)
  const { data } = props
  const { downSm } = React.useContext(BreakpointsContext)
  const accessibility = React.useContext(AccessibilityContext)
  const { textToSpeech } = useTextToSpeech()
  return (
    <CardActionArea
      LinkComponent={Link}
      href={`/id/podcasts/${data.id ? data.id : '0'}/${
        data.title ? _.kebabCase(data.title) : 'podcast-post'
      }`}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        borderRadius={borderRadius}
        boxShadow={boxShadow}
        paddingX={downSm ? 3 : 8}
        paddingY={3}
        marginTop={downSm ? 2 : 4}
        sx={{
          backgroundColor: mode == 'dark' ? 'grey.A100' : 'common.white',
          '& img': {
            height: downSm ? 40 : 120,
          },
        }}
      >
        <Box display="flex" alignItems="center">
          <img src={`https://webdisplay.surabaya.go.id${data.feature_image}`} />
          <Typography
            fontSize={(downSm ? fontSizeTitle - 8 : fontSizeTitle) + accessibility.fontSize}
            fontWeight={700}
            lineHeight={1.2}
            textAlign="left"
            marginLeft={downSm ? 2 : 4}
            marginRight={downSm ? 2 : 0}
            textTransform="uppercase"
            onMouseEnter={(e) => textToSpeech(e, true)}
          >
            {data.title}
          </Typography>
        </Box>
      </Box>
    </CardActionArea>
  )
})

const MediaPodcastOthers: React.FunctionComponent<Props> = ({ data }: Props) => {
  const router = useRouter()
  const { downSm } = React.useContext(BreakpointsContext)
  const accessibility = React.useContext(AccessibilityContext)
  return (
    <Box overflow="hidden" paddingBottom={16}>
      <Layout paddingY={0}>
        <BoxStyled className={accessibility.css.negative ? 'negative' : ''}>
          <Box className="wrapper-svg-element4">
            <Element4 />
          </Box>
          <Title
            text="Rekomendasi Untuk Didengarkan"
            buttonText={downSm ? '' : 'lihat semua'}
            onClick={() => router.push(`/id/podcasts`)}
          />
          <Box className="content-svg">
            <Box
              className="wrapper-svg"
              sx={{
                width: `${heightSvg}px`,
              }}
            >
              <Element3 />
            </Box>
          </Box>
          {data.map((v, i) => (
            <ListPodcast data={v} key={i} />
          ))}
        </BoxStyled>
      </Layout>
    </Box>
  )
}

MediaPodcastOthers.defaultProps = {}

export default memo(MediaPodcastOthers)
