import React from 'react'
import { Box, Grid, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import type { NextPage } from 'next'
import Head from 'next/head'
import TimeAgo from 'javascript-time-ago'
import id from 'javascript-time-ago/locale/id'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { StatusCodes } from 'http-status-codes'
import { stripHtml } from 'string-strip-html'
import replaceAllInserter from 'string.prototype.replaceall'
import Layout from 'components/layout'
import Title from 'components/title'
import { truncateText } from 'utils/truncate'
import { fontSizeTitle } from 'components/news.list'
import { fontSize } from 'styles/theme'
import { BoxTextStyled } from 'components/detail'
// import ProgressPlayerVideo from 'components/media.player.video';
import { iconSurabaya, borderRadius, boxShadow } from 'styles/theme'
import MediaDate from 'components/media.date'
import { defFontSizeDate } from 'components/carousel.content'
import NewsItem from 'components/news.item'
import Article from 'components/article'
import SurabayaIcon from 'public/images/icon/mobile/surabaya.svg'
import Element1 from 'public/images/icon/element_1.svg'
import Element3 from 'public/images/icon/element_3.svg'
// import Element4 from 'public/images/icon/element_4.svg';
import { BreakpointsContext } from 'contexts/breakpoints'
import { AccessibilityContext } from 'contexts/accessibility'
import { getDetail } from 'utils/services/webdisplay'
import useTextToSpeech from 'hooks/useTextToSpeech'
import { getOrganization } from 'utils/services/organization'
import schema from 'types/schemas'

TimeAgo.addLocale(id)
const timeAgo = new TimeAgo('id-ID')

const sizeIcon = 60

interface Props {
  detail: schema['schemas']['Article']
}

export const BoxStyled = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(10),
  '& .icon-surabaya': iconSurabaya(sizeIcon),
  '& .wrapper-svg-element1': {
    position: 'absolute',
    top: 0,
    left: '100%',
    transform: 'translate(-40%, -30%)',
    zIndex: -1,
    '& svg': {
      width: theme.spacing(70),
      '& circle': {
        stroke: `${theme.palette.secondary.main} !important`,
      },
    },
  },
  '& .wrapper-svg-element3': {
    position: 'absolute',
    top: 0,
    right: '100%',
    transform: 'translate(-20px, 170%)',
    zIndex: -1,
    '& svg': {
      width: theme.spacing(6),
      '& circle': {
        fill: `${theme.palette.secondary.main} !important`,
      },
    },
  },
  '& .wrapper-svg-element4': {
    position: 'absolute',
    top: 0,
    right: '100%',
    transform: 'translate(60%, 45%)',
    zIndex: -2,
    '& svg': {
      width: theme.spacing(35),
      '& path': {
        fill: `${theme.palette.secondary.main} !important`,
      },
    },
  },
  [theme.breakpoints.down('sm')]: {
    '& .icon-surabaya': iconSurabaya(sizeIcon - 30),
    '& .wrapper-svg-element1, & .wrapper-svg-element3, & .wrapper-svg-element4': {
      display: 'none',
    },
  },
}))

export const GridStyled = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& a': {
    borderRadius: theme.spacing(borderRadius),
    overflow: 'hidden',
    display: 'block',
    backgroundColor:
      theme.palette.mode == 'dark' ? theme.palette.grey.A100 : theme.palette.common.white,
    transition: `all 0.2s ease-in-out`,
    '&:hover': {
      boxShadow,
    },
    '& .content-img img': {
      borderRadius: `0 !important`,
    },
    '& .inner': {
      padding: theme.spacing(2, 1),
      '& .icon-surabaya': {
        width: 36,
        height: 36,
      },
      '& .title': {
        fontSize: fontSizeTitle - 8,
        fontWeight: 700,
        lineHeight: 1.3,
      },
    },
  },
}))

const VideosDetail: NextPage<Props> = ({ detail }: Props) => {
  console.log('detail', detail)

  const router = useRouter()
  const { downSm } = React.useContext(BreakpointsContext)
  const accessibility = React.useContext(AccessibilityContext)
  const { textToSpeech } = useTextToSpeech()
  const [others, setOthers] = React.useState<schema['schemas']['Article'][]>([])
  const [loading, setLoading] = React.useState(true)
  const contentStriptags = React.useMemo(() => {
    const opts = {
      ignoreTags: ['video', 'source', 'iframe'],
    }
    const results = stripHtml(detail.content, opts)
    console.log('results.result', results.result)

    const text1 = replaceAllInserter(
      results.result,
      `poster="`,
      `poster="https://webdisplay.surabaya.go.id`
    )
    const text2 = replaceAllInserter(
      text1,
      `source src="`,
      `source src="https://webdisplay.surabaya.go.id`
    )
    return text2
  }, [detail])
  const getData = async () => {
    setLoading(true)
    const fetchData = await fetch(`/api/data/webdisplay?page=1&target=videos`, { method: 'GET' })
    const results = await fetchData.json()
    console.log('results', results)
    if (fetchData.status == StatusCodes.OK) {
      if (results && results.data && results.data.data && results.data.data.length > 0) {
        setOthers(results.data.data)
      } else {
        setOthers(null)
      }
    }
    setLoading(false)
  }
  React.useEffect(() => {
    getData()
  }, [])
  return (
    <React.Fragment>
      <Head>
        <title>Pemerintah Kota Surabaya</title>
        <meta name="description" content="Pemerintah Kota Surabaya" />
      </Head>
      <BoxStyled overflow="hidden">
        <Layout paddingY={2}>
          <>
            <Box className="wrapper-svg-element1">
              <Element1 />
            </Box>
            <Box className="wrapper-svg-element3">
              <Element3 />
            </Box>
            {/* <Box className="wrapper-svg-element4">
              <Element4 />
            </Box> */}
            <Title text="Video" paddingY={3} onBack={() => router.push(`/id/videos`)} />
            <Grid container spacing={4}>
              <Grid item sm={9}>
                {/* <Box marginBottom={4}>
                  <ProgressPlayerVideo url={`bantuan_low.mp4`} />
                </Box> */}
                <Box className="inner" display="flex" alignItems="flex-start" marginBottom={3}>
                  <Box>
                    <Box className="icon-surabaya">
                      <Box
                        className="wrapper-svg"
                        sx={{
                          '& svg': {
                            width: `${downSm ? sizeIcon - 30 : sizeIcon}px`,
                            height: `${downSm ? sizeIcon - 30 : sizeIcon}px`,
                          },
                        }}
                      >
                        <SurabayaIcon />
                      </Box>
                    </Box>
                  </Box>
                  <Box flexGrow="1" marginLeft={downSm ? 1 : 2}>
                    <Typography
                      onMouseEnter={(e) => textToSpeech(e, true)}
                      fontSize={
                        (downSm ? fontSizeTitle - 4 : fontSizeTitle) + accessibility.fontSize
                      }
                      fontWeight={900}
                      lineHeight={1.3}
                      textTransform="uppercase"
                      marginBottom={1}
                    >
                      {detail.title}
                    </Typography>
                    <MediaDate
                      title={detail.title}
                      date={detail.publish_date}
                      others={timeAgo.format(new Date(detail.publish_date)) as string}
                      justifyContent="flex-start"
                    />
                  </Box>
                </Box>
                <BoxTextStyled
                  onMouseEnter={() => textToSpeech(truncateText(contentStriptags, 0), false)}
                >
                  <Article text={contentStriptags} paddingY={2} />
                </BoxTextStyled>
              </Grid>
              <Grid item sm={3}>
                {!loading &&
                  others &&
                  others.length > 3 &&
                  others.slice(0, 3).map((v, i) => (
                    <GridStyled
                      key={i}
                      sx={{
                        '& .MuiGrid-container': {
                          '& .MuiGrid-item': {
                            '& .inner': {
                              '& .title': {
                                fontSize: fontSize + accessibility.fontSize,
                              },
                            },
                          },
                        },
                      }}
                    >
                      <NewsItem
                        data={v}
                        gridSpacing={0}
                        withDescription={false}
                        gridImage={12}
                        gridContent={12}
                        truncateTitle={30}
                        fontSizeDate={defFontSizeDate}
                        withIconSurabaya={true}
                        withPlay={true}
                        sizePlay={50}
                        route="videos"
                      />
                    </GridStyled>
                  ))}
              </Grid>
            </Grid>
          </>
        </Layout>
      </BoxStyled>
    </React.Fragment>
  )
}

export const getServerSideProps = async ({ query }) => {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery(['contents'], async () => await getOrganization())
  const { id } = query
  const detail = await getDetail(parseInt(id as string), 'video')

  if (!detail) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      detail,
    },
  }
}

export default VideosDetail
