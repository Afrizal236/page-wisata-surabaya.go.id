import React from 'react'
import { Box, Grid, Typography } from '@mui/material'
import type { NextPage } from 'next'
import Head from 'next/head'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import TimeAgo from 'javascript-time-ago'
import id from 'javascript-time-ago/locale/id'
import Layout from 'components/layout'
import Title from 'components/title'
import { StatusCodes } from 'http-status-codes'
import { stripHtml } from 'string-strip-html'
import { useRouter } from 'next/router'
import { truncateText } from 'utils/truncate'
import { fontSizeTitle } from 'components/news.list'
import { BoxTextStyled } from 'components/detail'
import MediaDate from 'components/media.date'
import NewsItem from 'components/news.item'
import CarouselPhoto from 'components/carousel.photo'
import { BoxStyled, GridStyled } from 'pages/id/videos/[id]/[slug]'
import { defFontSizeDate } from 'components/carousel.content'
import Article from 'components/article'
import SurabayaIcon from 'public/images/icon/mobile/surabaya.svg'
import Element1 from 'public/images/icon/element_1.svg'
import Element3 from 'public/images/icon/element_3.svg'
import Element4 from 'public/images/icon/element_4.svg'
import { BreakpointsContext } from 'contexts/breakpoints'
import { AccessibilityContext } from 'contexts/accessibility'
import { getDetail } from 'utils/services/webdisplay'
import { fontSize, yellowColor } from 'styles/theme'
import useTextToSpeech from 'hooks/useTextToSpeech'
import { getOrganization } from 'utils/services/organization'
import schema from 'types/schemas'

TimeAgo.addLocale(id)
const timeAgo = new TimeAgo('id-ID')

const sizeIcon = 60

interface Props {
  detail: schema['schemas']['Article']
}

const PhotosDetail: NextPage<Props> = ({ detail }: Props) => {
  console.log('detail', detail)

  const router = useRouter()
  const { downSm } = React.useContext(BreakpointsContext)
  const accessibility = React.useContext(AccessibilityContext)
  const { textToSpeech } = useTextToSpeech()
  const [others, setOthers] = React.useState<schema['schemas']['Article'][]>([])
  const [loading, setLoading] = React.useState(true)
  const dataImg = React.useMemo(() => {
    const opts = {
      ignoreTags: ['img'],
    }
    const results = stripHtml(detail.content, opts)
    const arrImg = results.result.match(/<img.+?\/>/g)
    if (arrImg && arrImg.length > 0) {
      const newArr = arrImg.map((v) =>
        v
          .replace(`src=\"../../`, `src=\"https://webdisplay.surabaya.go.id/`)
          .replace('height="100"', 'height=""')
      )
      return newArr
    }
    return []
  }, [detail])
  const contentStriptags = React.useMemo(() => {
    const opts = {
      onlyStripTags: ['img'],
    }
    const results = stripHtml(detail.content, opts)
    const str = results.result.replace(/<[^/>][^>]*>[\s]*<\/[^>]+>/, '')
    return str
  }, [detail])
  const getData = async () => {
    setLoading(true)
    const fetchData = await fetch(`/api/data/webdisplay?page=1&target=infografis`, {
      method: 'GET',
    })
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
            <Box
              className="wrapper-svg-element4"
              sx={
                accessibility.css.negative && {
                  '& path': {
                    stroke: yellowColor,
                  },
                }
              }
            >
              <Element4 />
            </Box>
            <Title text="Foto" paddingY={3} onBack={() => router.push(`/id/photos`)} />
            <Grid container spacing={4}>
              <Grid item xs={12} sm={9}>
                {dataImg.length > 0 && (
                  <Box marginBottom={4}>
                    <CarouselPhoto data={dataImg} />
                  </Box>
                )}
                <Box className="inner" display="flex" alignItems="flex-start" marginBottom={2}>
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
                      fontSize={
                        (downSm ? fontSizeTitle - 4 : fontSizeTitle) + accessibility.fontSize
                      }
                      fontWeight={900}
                      lineHeight={1.3}
                      textTransform="uppercase"
                      marginBottom={1}
                      onMouseEnter={(e) => textToSpeech(e, true)}
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
                  <Article text={contentStriptags} className="webdisplay" paddingY={2} />
                </BoxTextStyled>
              </Grid>
              <Grid item xs={12} sm={3}>
                {!loading &&
                  others &&
                  others.length > 0 &&
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
                        withPlay={false}
                        route="photos"
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
  const detail = await getDetail(parseInt(id as string), 'infografis')

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

export default PhotosDetail
