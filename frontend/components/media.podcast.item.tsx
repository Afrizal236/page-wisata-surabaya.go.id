import React, { memo } from 'react'
import { Box, Typography } from '@mui/material'
import Link from 'next/link'
import _ from 'lodash'
import { styled } from '@mui/material/styles'
import { borderRadius } from 'styles/theme'
// import { fontSizeTitle } from 'components/news.list';
import { boxShadow, fontSize } from 'styles/theme'
import PlayIcon from 'public/images/icon/play_podcast.svg'
import { truncateText } from 'utils/truncate'
import { AccessibilityContext } from 'contexts/accessibility'
import useTextToSpeech from 'hooks/useTextToSpeech'
import schema from 'types/schemas'

interface Props {
  data: schema['schemas']['Article']
  isVertical?: boolean
}

const BoxStyled = styled(Box)(({ theme }) => ({
  borderRadius: theme.spacing(borderRadius),
  backgroundColor:
    theme.palette.mode == 'dark' ? theme.palette.grey.A100 : theme.palette.common.white,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '100%',
  boxShadow,
  '& a': {
    display: 'inline-block',
  },
  '&.negative': {
    '& a': {
      '& svg': {
        '& path': {
          fill: `${theme.palette.common.white} !important`,
        },
      },
    },
  },
}))

const PodcastItem: React.FunctionComponent<Props> = ({ data, isVertical }: Props) => {
  const accessibility = React.useContext(AccessibilityContext)
  const { textToSpeech } = useTextToSpeech()
  return (
    <BoxStyled
      className={accessibility.css.negative ? 'negative' : ''}
      sx={{
        flexDirection: isVertical ? 'column' : 'row',
        paddingX: isVertical ? 3 : 6,
        paddingY: 3,
        '& img': {
          width: '96%',
          maxWidth: 280,
        },
      }}
    >
      <img src={`https://webdisplay.surabaya.go.id${data.feature_image_url}`} />
      <Box
        marginTop={isVertical ? 2 : 0}
        marginLeft={isVertical ? 0 : 4}
        textAlign={isVertical ? 'center' : 'left'}
        flexGrow={isVertical ? 1 : 0}
      >
        <Typography
          fontSize={(isVertical ? fontSize + 3 : fontSize + 6) + accessibility.fontSize}
          fontWeight={isVertical ? 700 : 800}
          lineHeight={1.2}
          marginBottom={2}
          textTransform="uppercase"
          onMouseEnter={() => textToSpeech(data.title, false)}
        >
          {truncateText(data.title, 45)}
        </Typography>
        {/* {!isVertical &&
          <Typography
            marginBottom={2}
            fontWeight={700}
            fontSize={fontSizeTitle}
          >
            {`03:50`}
          </Typography>
        } */}
        <Link
          href={`/id/podcasts/${data.id ? data.id : '0'}/${
            data.title ? _.kebabCase(data.title) : 'podcast-post'
          }`}
        >
          <Box
            className="wrapper-svg"
            sx={{
              '& svg': {
                width: 55,
                height: 55,
              },
            }}
          >
            <PlayIcon />
          </Box>
        </Link>
      </Box>
    </BoxStyled>
  )
}

PodcastItem.defaultProps = {
  isVertical: true,
}

export default memo(PodcastItem)
