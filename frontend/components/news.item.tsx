import React, { memo } from 'react'
import { Grid, Typography, Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import Link from 'next/link'
import whatDayId from 'what-day-id'
import TimeAgo from 'javascript-time-ago'
import id from 'javascript-time-ago/locale/id'
import { fontSize as fontSizeDef, borderRadius, yellowColor } from 'styles/theme'
import { truncateText } from 'utils/truncate'
import { iconSurabaya } from 'styles/theme'
import PlayIcon from 'public/images/icon/play_video.svg'
import SurabayaIcon from 'public/images/icon/mobile/surabaya.svg'
import { AccessibilityContext } from 'contexts/accessibility'
import useTextToSpeech from 'hooks/useTextToSpeech'
import schema from 'types/schemas'

TimeAgo.addLocale(id)
const timeAgo = new TimeAgo('id-ID')

interface Props {
  data: schema['schemas']['Article']
  gridImage?: number
  gridContent?: number
  gridSpacing?: number
  fontSizeTitle?: number
  fontSizeDate?: number
  truncateTitle?: number
  truncateDescription?: number
  withDescription?: boolean
  withIconSurabaya?: boolean
  withPlay?: boolean
  sizePlay?: number
  route: string
}

export const fontSizeDateInit = fontSizeDef - 2
const sizeIcon = 26

const BoxStyled = styled(Box)(({ theme }) => ({
  height: '100%',
  '& a': {
    textDecoration: 'none',
    color: theme.palette.text.primary,
    backgroundColor:
      theme.palette.mode == 'dark' ? theme.palette.grey.A100 : theme.palette.common.white,
    height: '100%',
    '& .content-img': {
      '& img': {
        width: '100%',
        aspectRatio: '3/2',
        objectFit: 'cover',
        display: 'block',
        borderRadius: theme.spacing(borderRadius),
      },
      '& .wrapper-svg': {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      },
    },
    '& .icon-surabaya': iconSurabaya(sizeIcon),
  },
}))

const Typography1Styled = styled(Typography)(() => ({
  fontWeight: 800,
  textTransform: 'uppercase',
}))

export function imagePath(id: number, url: string, isWebdisplay: boolean = false) {
  const oldUrl = url.includes('pictures/')
  if (oldUrl) return `${isWebdisplay ? 'https://webdisplay.surabaya.go.id' : 'https://surabaya.go.id/uploads/'}${url.replace('/uploads/', '')}`
  return `${isWebdisplay ? 'https://webdisplay.surabaya.go.id' : 'https://surabaya.go.id/uploads/'}images/posts/post_${id}/${url}`
}

const NewsItem: React.FunctionComponent<Props> = ({
  data,
  gridImage,
  gridContent,
  gridSpacing,
  fontSizeTitle,
  fontSizeDate,
  truncateTitle,
  truncateDescription,
  withDescription,
  withIconSurabaya,
  withPlay,
  sizePlay,
  route,
}: Props) => {
  const accessibility = React.useContext(AccessibilityContext)
  const { textToSpeech } = useTextToSpeech()
  const description = React.useMemo(
    () => (withDescription ? truncateText(data.content || '', truncateDescription) : ''),
    [data, truncateDescription]
  )
  const marginTop = React.useMemo(() => (withDescription ? 1.3 : 0.6), [withDescription])
  const isWebdisplay = React.useMemo(() => route == 'videos' || route == 'photos', [route])
  return (
    <BoxStyled>
      <Link href={`/id/${route}/${data.id ? data.id : '0'}/${data.slug}`}>
        <Box position="relative" className="content-img">
          <img
            src={imagePath(data.id || 0, data.feature_image_url || '', isWebdisplay)}
            style={{ width: '100%', aspectRatio: '3/2', objectFit: 'cover', display: 'block', borderRadius: 16 }}
          />
          {/* Overlay info berita */}
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              p: 2.5,
              background: 'linear-gradient(0deg, rgba(0,0,0,0.65) 70%, rgba(0,0,0,0.15) 100%, rgba(0,0,0,0) 100%)',
              color: '#fff',
              borderBottomLeftRadius: 16,
              borderBottomRightRadius: 16,
              zIndex: 2,
            }}
          >
            <Typography1Styled
              fontSize={fontSizeTitle + accessibility.fontSize}
              marginBottom={1.2}
              className="title"
              sx={{ color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.25)' }}
              onMouseEnter={() => textToSpeech(data.title, false)}
            >
              {truncateText(data.title, truncateTitle)}
            </Typography1Styled>
            <Typography
              fontSize={fontSizeDate + accessibility.fontSize}
              marginBottom={0.5}
              className="date"
              sx={{ color: '#fff', opacity: 0.85 }}
              onMouseEnter={(e) => textToSpeech(e, true)}
            >
              {`${whatDayId(new Date(data.publish_date))} | ${timeAgo.format(new Date(data.publish_date))}`}
            </Typography>
            {description && withDescription && (
              <Typography
                className="description"
                sx={{
                  fontSize: fontSizeDef + accessibility.fontSize,
                  color: '#fff',
                  opacity: 0.9,
                  mt: 0.5,
                  textShadow: '0 2px 8px rgba(0,0,0,0.18)'
                }}
              >
                {description}
              </Typography>
            )}
          </Box>
          {withPlay && (
            <Box
              className="wrapper-svg"
              sx={{
                '& svg': {
                  width: `${sizePlay}px`,
                  height: `${sizePlay}px`,
                },
              }}
            >
              <PlayIcon />
            </Box>
          )}
        </Box>
      </Link>
    </BoxStyled>
  )
}

NewsItem.defaultProps = {
  gridImage: 12,
  gridContent: 12,
  gridSpacing: 0,
  fontSizeTitle: fontSizeDef,
  fontSizeDate: fontSizeDateInit,
  truncateTitle: 25,
  truncateDescription: 170,
  withDescription: true,
  withIconSurabaya: false,
  withPlay: false,
  sizePlay: 50,
}

export default memo(NewsItem)
