import React, { memo } from 'react'
import { Box, Typography, Skeleton } from '@mui/material'
import whatDayId from 'what-day-id'
import TimeAgo from 'javascript-time-ago'
import id from 'javascript-time-ago/locale/id'
import { useRouter } from 'next/router'
import { styled } from '@mui/material/styles'
import { Viewer, Worker } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import Layout from 'components/layout'
import Title from 'components/title'
import { truncateText } from 'utils/truncate'
import { fontSizeTitle } from 'components/news.list'
import { fontSizeDateInit } from 'components/news.item'
import PopperShare from 'components/popper.share'
import CarouselContent from 'components/carousel.content'
import Element1 from 'public/images/icon/element_1.svg'
import Element3 from 'public/images/icon/element_3.svg'
import Element4 from 'public/images/icon/element_4.svg'
import { BreakpointsContext } from 'contexts/breakpoints'
import { AccessibilityContext } from 'contexts/accessibility'
import useTextToSpeech from 'hooks/useTextToSpeech'
import { imagePath } from 'components/news.item'
import schema from 'types/schemas'

import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

TimeAgo.addLocale(id)
const timeAgo = new TimeAgo('id-ID')

interface Props {
  news: schema['schemas']['Article']
  contents: string[]
  others: schema['schemas']['Article'][]
  pageTitle: string
  route: string
  loadingDetail: boolean
  loading: boolean
}

const BoxStyled = styled(Box)(({ theme }) => ({
  margin: theme.spacing(0),
  overflow: 'hidden',
  '& .wrapper-svg-section1': {
    position: 'absolute',
    top: 0,
    right: 0,
    transform: 'translate(60%, -40%)',
    zIndex: -1,
    '& svg': {
      width: theme.spacing(55),
      '& circle': {
        stroke: `${theme.palette.secondary.main} !important`,
      },
    },
  },
  '& .wrapper-svg-section4': {
    position: 'absolute',
    top: 0,
    left: 0,
    transform: 'translate(-110%, -40%)',
    zIndex: -1,
    '& svg': {
      width: theme.spacing(40),
      '& path': {
        stroke: `${theme.palette.secondary.main} !important`,
      },
    },
  },
}))

const BoxStyledCarousel = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.divider,
  overflow: 'hidden',
  '& .slick-arrow': {
    top: '35% !important',
  },
  'p.MuiTypography-root.title': {
    fontWeight: 700,
    marginTop: theme.spacing(1),
  },
  '& .wrapper-svg-others1, .wrapper-svg-others3, .wrapper-svg-others4': {
    position: 'absolute',
    zIndex: -1,
  },
  '& .wrapper-svg-others1': {
    bottom: 0,
    right: '97%',
    width: theme.spacing(45),
    transform: 'translate(0, 60%)',
  },
  '& .wrapper-svg-others3': {
    top: 0,
    left: '100%',
    width: theme.spacing(6),
    transform: 'translate(50px, 0)',
  },
  '& .wrapper-svg-others4': {
    bottom: 0,
    left: '90%',
    width: theme.spacing(30),
    transform: 'translate(0, 40%)',
    '& svg': {
      '& path': {
        stroke: `${theme.palette.secondary.main} !important`,
      },
    },
  },
  [theme.breakpoints.down('sm')]: {
    '& .wrapper-svg-others1, .wrapper-svg-others3, .wrapper-svg-others4': {
      display: 'none',
    },
  },
}))

export const BoxTextStyled = styled(Box)(({ theme }) => ({
  '& p': {
    marginTop: 0,
    marginBottom: 0,
  },
  '& img': {
    maxWidth: '100%',
    marginBottom: theme.spacing(2),
  },
  'iframe, video': {
    width: '100%',
  },
  '& .pdf-viewer': {
    margin: theme.spacing(3, 0),
    width: '100%',
  },
  video: {
    height: 'auto',
  },
}))

export const BoxImgStyled = styled(Box)(() => ({
  '& img': {
    objectFit: 'cover',
    aspectRatio: '16/6',
    width: '100%',
  },
}))

const Detail: React.FunctionComponent<Props> = ({
  news,
  contents,
  others,
  pageTitle,
  route,
  loadingDetail,
  loading,
}: Props) => {
  const router = useRouter()
  const defaultLayoutPluginInstance = defaultLayoutPlugin()
  const { downSm } = React.useContext(BreakpointsContext)
  const accessibility = React.useContext(AccessibilityContext)
  const { textToSpeech } = useTextToSpeech()
  const handleOnClick = React.useCallback(() => router.push(`/id/${route}`, `/id/${route}`), [])
  const contentLength = React.useMemo(() => news.content.length, [news])
  return (
    <>
      <BoxStyled>
        <Layout paddingY={2}>
          <>
            <Box className="wrapper-svg-section1">
              <Element1 />
            </Box>
            <Box className="wrapper-svg-section4">
              <Element4 />
            </Box>
            {loadingDetail ? (
              <>
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
              </>
            ) : (
              <>
                {news && (
                  <>
                    <Title
                      text={pageTitle}
                      paddingY={3}
                      onBack={() => router.push(`/id/${route}`)}
                    />
                    <Typography
                      fontSize={fontSizeTitle + accessibility.fontSize}
                      fontWeight={800}
                      textTransform="uppercase"
                      onMouseEnter={(e) => textToSpeech(e, true)}
                    >
                      {news.title}
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <Typography fontSize={fontSizeDateInit + accessibility.fontSize}>
                        {`${whatDayId(new Date(news.publish_date))} | ${timeAgo.format(
                          new Date(news.publish_date)
                        )}`}
                      </Typography>
                      <PopperShare title={news.title} />
                    </Box>
                    <BoxImgStyled marginY={4}>
                      {news.feature_image_url && (
                        <img src={imagePath(news.id || 0, news.feature_image_url || '', false)} />
                      )}
                    </BoxImgStyled>
                    <BoxTextStyled
                      onMouseEnter={() => textToSpeech(truncateText(news.content, 0), false)}
                      sx={{
                        columnCount: downSm || contentLength < 5000 ? 1 : 2,
                        columnGap: downSm || contentLength < 5000 ? 0 : 3,
                        textAlign: 'justify',
                        fontSize: `1${accessibility.fontSize}0%`,
                      }}
                    >
                      {contents.map((item, i) => {
                        const isPdf = item && item.substring(0, 5) === '<pdf>'
                        if (isPdf) {
                          const tagPdf = /<pdf>(.*?)<\/pdf>/g.exec(item)
                          if (tagPdf.length) {
                            return (
                              <Box key={i} className="pdf-viewer">
                                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
                                  <Viewer
                                    fileUrl={tagPdf[0].replace('<pdf>', '').replace('</pdf>', '')}
                                    plugins={[defaultLayoutPluginInstance]}
                                  />
                                </Worker>
                              </Box>
                            )
                          }
                        }

                        return (
                          <div
                            key={i}
                            className="text"
                            dangerouslySetInnerHTML={{ __html: item }}
                          />
                        )
                      })}
                    </BoxTextStyled>
                  </>
                )}
              </>
            )}
          </>
        </Layout>
      </BoxStyled>
      <BoxStyledCarousel marginTop={5}>
        <Layout>
          <Box paddingBottom={8}>
            <Box className="wrapper-svg-others1">
              <Element1 />
            </Box>
            <Box className="wrapper-svg-others4">
              <Element4 />
            </Box>
            <Title
              text={`${pageTitle} Lainnya`}
              buttonText={downSm ? 'lainnya' : 'lihat semua'}
              onClick={handleOnClick}
            />
            <Box position="relative">
              <Box className="wrapper-svg-others3">
                <Element3 />
              </Box>
              {loading ? (
                <>
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={300}
                    sx={{
                      borderRadius: 3,
                    }}
                  />
                </>
              ) : (
                <>
                  {others?.length > 0 && (
                    <CarouselContent
                      data={others}
                      slidesToShow={downSm ? 1 : 3}
                      withDescription={false}
                      fontSizeProps={fontSizeTitle - 6}
                      route={route}
                      truncateTitle={45}
                    />
                  )}
                </>
              )}
            </Box>
          </Box>
        </Layout>
      </BoxStyledCarousel>
    </>
  )
}

Detail.defaultProps = {}

export default memo(Detail)
