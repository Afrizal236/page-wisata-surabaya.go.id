import React from 'react'
import { Box, Grid, Typography, Skeleton } from '@mui/material'
import type { NextPage } from 'next'
import whatDayId from 'what-day-id'
import TimeAgo from 'javascript-time-ago'
import _ from 'lodash'
import { useRouter } from 'next/router'
import id from 'javascript-time-ago/locale/id'
import { StatusCodes } from 'http-status-codes'
import { styled } from '@mui/material/styles'
import Link from 'next/link'
import Head from 'next/head'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import Layout from 'components/layout'
import CarouselContent2 from 'components/carousel.content2'
import Title from 'components/title'
import NewsList from 'components/news.list'
import Pagination from 'components/pagination'
import { fontSize, borderRadius } from 'styles/theme'
import { fontSizeDateInit } from 'components/news.item'
import { truncateText } from 'utils/truncate'
import { boxShadow } from 'styles/theme'
import Element4 from 'public/images/icon/element_4.svg'
import { getOrganization } from 'utils/services/organization'
import schema from 'types/schemas'

TimeAgo.addLocale(id)
const timeAgo = new TimeAgo('id-ID')

interface Props { }

export const BoxStyled = styled(Box)(({ theme }) => ({
  '& .wrapper-svg-element4': {
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
  '& .wrapper-svg-section1': {
    transform: 'translate(30%, 20%)',
    '& svg': {
      '& circle': {
        stroke: `${theme.palette.primary.main} !important`,
      },
    },
  },
  '& .wrapper-svg-section3': {
    '& svg': {
      '& circle': {
        fill: `${theme.palette.secondary.main} !important`,
      },
    },
  },
  [theme.breakpoints.down('sm')]: {
    '& .wrapper-svg-element4, & .wrapper-svg-section1, & .wrapper-svg-section3': {
      display: 'none',
    },
  },
}))

const Agenda: NextPage<Props> = () => {
  const router = useRouter()
  const [agenda, setAgenda] = React.useState<schema['schemas']['Article'][]>([])
  const [loading, setLoading] = React.useState(true)
  const [count, setCount] = React.useState(null)
  const current = React.useMemo(
    () => (router.query.page ? parseInt(router.query.page as string) : 1),
    [router.query.page]
  )
  const getData = async (pageParams: number) => {
    setLoading(true)
    const fetchData = await fetch(`/api/data/news?page=${pageParams}&category=info`, {
      method: 'GET',
    })
    const results = await fetchData.json()
    if (fetchData.status == StatusCodes.OK) {
      if (results?.data?.length > 0) {
        setAgenda(results.data)
        const totalPage = results.count / 15
        setCount(Math.ceil(totalPage))
      } else {
        setAgenda(null)
        setCount(0)
      }
    }
    setLoading(false)
  }
  const handleNextPrev = React.useCallback(
    (p: number) => {
      const page = count ? (p < 1 ? 1 : p) : 1
      router.push(`/id/agenda?page=${page}`, `/id/agenda?page=${page}`, { shallow: true })
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
      <Box overflow="hidden">
        <Layout paddingY={2}>
          <BoxStyled
            sx={
              current != 1 && {
                '& .news-item-container': {
                  '& .news-item:first-of-type': {
                    marginTop: `0 !important`,
                  },
                },
              }
            }
          >
            <Box className="wrapper-svg-element4">
              <Element4 />
            </Box>
            <Title text="Agenda Kota" />
            {loading ? (
              <>
                {[...new Array(6)].map((_v, i) => (
                  <Skeleton
                    key={i}
                    variant="rectangular"
                    width="100%"
                    height={300}
                    sx={{
                      borderRadius: 4,
                      marginBottom: 4,
                    }}
                  />
                ))}
              </>
            ) : (
              <>
                {agenda && current == 1 && (
                  <Grid container spacing={4} alignItems="stretch">
                    <Grid item xs={12} sm={7}>
                      <CarouselContent2 data={agenda.slice(0, 4)} slidesToShow={1} />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <Box
                        height="100%"
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                      >
                        {agenda.slice(0, 4).map((v, i) => (
                          <Box
                            key={i}
                            marginTop={2}
                            sx={{
                              '& a': {
                                color: 'text.primary',
                                textDecoration: 'none',
                                display: 'block',
                                borderRadius,
                                paddingY: 1.5,
                                paddingX: 2,
                                transition: `all 0.2s ease-in-out`,
                                '&:hover': {
                                  boxShadow,
                                },
                              },
                              '&:first-of-type': {
                                marginTop: 0,
                              },
                            }}
                          >
                            <Link href={`/id/agenda/${v.id}/${_.kebabCase(v.title)}`}>
                              <Typography
                                fontSize={fontSize}
                                textTransform="uppercase"
                                fontWeight={700}
                              >
                                {truncateText(v.title, 60)}
                              </Typography>
                              <Typography fontSize={fontSizeDateInit}>
                                {`${whatDayId(new Date(v.publish_date))} | ${timeAgo.format(
                                  new Date(v.publish_date)
                                )}`}
                              </Typography>
                            </Link>
                          </Box>
                        ))}
                      </Box>
                    </Grid>
                  </Grid>
                )}
                <NewsList
                  data={current == 1 ? agenda.slice(4, agenda.length) : agenda}
                  route="agenda"
                />
                <Box marginTop={5}>
                  <Pagination
                    total={count}
                    current={current}
                    loading={loading}
                    clickNextPrev={handleNextPrev}
                  />
                </Box>
              </>
            )}
          </BoxStyled>
        </Layout>
      </Box>
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

export default Agenda
