import React from 'react'
import { Box, Grid, Skeleton } from '@mui/material'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { styled } from '@mui/material/styles'
import Head from 'next/head'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import { StatusCodes } from 'http-status-codes'
import Layout from 'components/layout'
import CarouselContent2 from 'components/carousel.content2'
import Title from 'components/title'
import Pagination from 'components/pagination'
import NewsItem from 'components/news.item'
import { BoxStyled } from 'pages/id/videos/index'
import { borderRadius } from 'styles/theme'
import { fontSizeTitle } from 'components/news.list'
import Element1 from 'public/images/icon/element_1.svg'
import Element3 from 'public/images/icon/element_3.svg'
import Element4 from 'public/images/icon/element_4.svg'
import { BreakpointsContext } from 'contexts/breakpoints'
import { AccessibilityContext } from 'contexts/accessibility'
import { getOrganization } from 'utils/services/organization'
import schema from 'types/schemas'

interface Props {}

export const BoxCarouselStyled = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  '& .main': {
    backgroundColor: 'transparent !important',
    borderRadius: 0,
    '& .slick-slider': {
      overflow: 'hidden',
      '& .slick-list': {
        margin: theme.spacing(0, -2),
        '& .slick-track': {
          '& .slick-slide': {
            margin: theme.spacing(0, 2),
            '& a': {
              display: 'block',
              borderRadius: theme.spacing(borderRadius),
              overflow: 'hidden',
            },
          },
        },
      },
    },
  },
}))

const BoxStyledElement = styled(Box)(({ theme }) => ({
  position: 'relative',
  '& .wrapper-svg-section1': {
    position: 'absolute',
    top: '50%',
    left: '100%',
    transform: 'translate(-40%, -30%)',
    zIndex: -1,
    '& svg': {
      width: theme.spacing(70),
    },
  },
  '& .wrapper-svg-section3': {
    position: 'absolute',
    bottom: 0,
    right: '100%',
    transform: 'translate(-50px, -80%)',
    zIndex: -1,
    '& svg': {
      width: theme.spacing(6),
      '& circle': {
        fill: `${theme.palette.secondary.main} !important`,
      },
    },
  },
  '& .wrapper-svg-section4': {
    position: 'absolute',
    top: 0,
    right: '100%',
    transform: 'translate(50%, -30%)',
    zIndex: -1,
    '& svg': {
      width: theme.spacing(50),
      '& path': {
        stroke: `${theme.palette.secondary.main} !important`,
      },
    },
  },
  '&.negative': {
    '& .wrapper-svg-section1': {
      '& svg': {
        '& circle': {
          stroke: `${theme.palette.common.white} !important`,
        },
      },
    },
  },
  [theme.breakpoints.down('sm')]: {
    '& .wrapper-svg-section1, & .wrapper-svg-section3, & .wrapper-svg-section4': {
      display: 'none',
    },
  },
}))

const Photos: NextPage<Props> = () => {
  const router = useRouter()
  const { downSm } = React.useContext(BreakpointsContext)
  const accessibility = React.useContext(AccessibilityContext)
  const [photos, setPhotos] = React.useState<schema['schemas']['Article'][]>([])
  const [loading, setLoading] = React.useState(true)
  const [count, setCount] = React.useState(null)
  const current = React.useMemo(
    () => (router.query.page ? parseInt(router.query.page as string) : 1),
    [router.query.page]
  )
  const getData = async (pageParams: number) => {
    setLoading(true)
    const fetchData = await fetch(`/api/data/webdisplay?page=${pageParams}&target=infografis`, {
      method: 'GET',
    })
    const results = await fetchData.json()
    console.log('results', results)
    if (fetchData.status === StatusCodes.OK) {
      if (results?.data?.data?.length) {
        setPhotos(results.data.data)
        const totalPage = results.data.total / results.data.records
        setCount(Math.ceil(totalPage))
      } else {
        setPhotos(null)
        setCount(0)
      }
    }
    setLoading(false)
  }
  const handleNextPrev = React.useCallback(
    (p: number) => {
      const page = count ? (p < 1 ? 1 : p) : 1
      router.push(`/id/photos?page=${page}`, `/id/photos?page=${page}`, { shallow: true })
    },
    [count, router.query]
  )
  React.useEffect(() => {
    window.scrollTo(0, 0)
    getData(router.query.page ? parseInt(router.query.page as string) : 1)
  }, [router.query])
  return (
    <React.Fragment>
      <Head>
        <title>Pemerintah Kota Surabaya</title>
        <meta name="description" content="Pemerintah Kota Surabaya" />
      </Head>
      <BoxStyled overflow="hidden">
        <Layout paddingY={2}>
          <BoxStyledElement className={accessibility.css.negative ? 'negative' : ''}>
            <Box className="wrapper-svg-section4">
              <Element4 />
            </Box>
            <Box className="wrapper-svg-section3">
              <Element3 />
            </Box>
            <Box className="wrapper-svg-section1">
              <Element1 />
            </Box>
            <Title text="Foto" />
            {!loading && current === 1 && photos?.length && (
              <BoxCarouselStyled>
                <CarouselContent2
                  data={photos?.slice(0, 6)}
                  slidesToShow={downSm ? 1 : 2}
                  route="photos"
                />
              </BoxCarouselStyled>
            )}
            <Grid container spacing={4}>
              {loading ? (
                <>
                  {[...new Array(9)].map((_v, i) => (
                    <Grid key={i} item xs={12} sm={4}>
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={300}
                        sx={{
                          borderRadius: 4,
                          marginBottom: 4,
                        }}
                      />
                    </Grid>
                  ))}
                </>
              ) : (
                <>
                  {photos?.length > 0 &&
                    photos.map((v, i) => (
                      <Grid
                        key={i}
                        item
                        sm={4}
                        className={`grid-content`}
                        sx={{
                          '& .MuiGrid-container': {
                            '& .MuiGrid-item': {
                              '& .inner': {
                                '& .title': {
                                  fontSize: fontSizeTitle - 5 + accessibility.fontSize,
                                },
                              },
                            },
                          },
                        }}
                      >
                        <NewsItem
                          data={v}
                          gridSpacing={2}
                          withDescription={false}
                          gridImage={12}
                          gridContent={12}
                          truncateTitle={30}
                          withIconSurabaya={true}
                          withPlay={false}
                          route="photos"
                        />
                      </Grid>
                    ))}
                </>
              )}
            </Grid>
            <Box marginTop={5} marginBottom={3}>
              <Pagination
                total={count}
                current={current}
                loading={loading}
                clickNextPrev={handleNextPrev}
              />
            </Box>
          </BoxStyledElement>
        </Layout>
      </BoxStyled>
    </React.Fragment>
  )
}

export const getServerSideProps = async () => {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery(['contents'], async () => await getOrganization())
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

export default Photos
