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
  // variant to separate layout/styling behavior between hero and thumbnail usage
  variant?: 'main' | 'thumb'
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
        objectFit: 'cover',
        display: 'block',
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
  // Variant-specific tweaks for thumbnails vs main
  '& a.thumb .content-img img': {
    aspectRatio: '16/9',
    borderTopLeftRadius: theme.spacing(3),
    borderTopRightRadius: theme.spacing(3),
  },
  '& a:not(.thumb) .content-img img': {
    aspectRatio: '3/2',
    borderRadius: theme.spacing(borderRadius),
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
  variant,
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
      <Link
        href={`/id/${route}/${data.id ? data.id : '0'}/${data.slug}`}
        className={variant === 'thumb' ? 'thumb' : undefined}
      >
        <Grid container spacing={gridSpacing}>
          <Grid item sm={gridImage}>
            <Box
              position="relative"
              className="content-img"
              sx={{
                '& .wrapper-svg': {
                  width: sizePlay,
                  height: sizePlay,
                },
              }}
            >
              <img
                src={imagePath(data.id || 0, data.feature_image_url || '', isWebdisplay)}
              />
              {/* Logo overlay intentionally omitted for design parity */}
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
          </Grid>
          <Grid item sm={gridContent}>
            <Box className="inner" display="flex" alignItems="flex-start">
              {withIconSurabaya && variant !== 'thumb' && (
                <Box>
                  <Box
                    className="icon-surabaya"
                    sx={{
                      bgcolor: accessibility.css.negative ? `${yellowColor} !important` : null,
                    }}
                  >
                    <Box
                      className="wrapper-svg"
                      sx={{
                        '& svg': {
                          width: `${sizeIcon}px`,
                          height: `${sizeIcon}px`,
                          '& path': accessibility.css.negative
                            ? {
                              fill: 'black !important',
                            }
                            : null,
                        },
                      }}
                    >
                      <SurabayaIcon />
                    </Box>
                  </Box>
                </Box>
              )}
              <Box flexGrow="1">
                <Typography1Styled
                  fontSize={fontSizeTitle + accessibility.fontSize}
                  marginBottom={marginTop}
                  className="title"
                  onMouseEnter={() => textToSpeech(data.title, false)}
                >
                  {truncateText(data.title, truncateTitle)}
                </Typography1Styled>
                {description && withDescription && (
                  <Typography
                    className="description"
                    sx={{
                      fontSize: fontSizeDef + accessibility.fontSize,
                    }}
                  >
                    {description}
                  </Typography>
                )}
                <Typography
                  fontSize={fontSizeDate + accessibility.fontSize}
                  marginTop={marginTop}
                  className="date"
                  onMouseEnter={(e) => textToSpeech(e, true)}
                >
                  {`${whatDayId(new Date(data.publish_date))} | ${timeAgo.format(
                    new Date(data.publish_date)
                  )}`}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
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
  variant: 'main',
}

export default memo(NewsItem)
