import React from 'react'
import { Box, Grid, Skeleton } from '@mui/material'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import { StatusCodes } from 'http-status-codes'
import Layout from 'components/layout'
import MediaHeader from 'components/media.header'
import Pagination from 'components/pagination'
import InfografisList from 'components/infografis.list'
import { BoxStyled } from 'pages/id/videos/index'
import { AccessibilityContext } from 'contexts/accessibility'
import { getOrganization } from 'utils/services/organization'
import schema from 'types/schemas'

export interface PodcastType {
  image: string
  title: string
  length: string
}

interface Props {}

const Infografis: NextPage<Props> = () => {
  const router = useRouter()
  const accessibility = React.useContext(AccessibilityContext)
  const [infografis, setInfografis] = React.useState<schema['schemas']['Article'][]>([])
  const [loading, setLoading] = React.useState(true)
  const [count, setCount] = React.useState(null)
  const current = React.useMemo(
    () => (router.query.page ? parseInt(router.query.page as string) : 1),
    [router.query.page]
  )
  const getData = async (pageParams: number) => {
    setLoading(true)
    const fetchData = await fetch(`/api/data/news?page=${pageParams}&category=infografis`, {
      method: 'GET',
    })
    const results = await fetchData.json()
    if (fetchData.status === StatusCodes.OK) {
      if (results?.data?.length > 0) {
        setInfografis(results.data)
        const totalPage = results.count / 15
        setCount(Math.ceil(totalPage))
      } else {
        setInfografis(null)
        setCount(0)
      }
    }
    setLoading(false)
  }
  const handleNextPrev = React.useCallback(
    (p: number) => {
      const page = count ? (p < 1 ? 1 : p) : 1
      router.push(`/id/infografis?page=${page}`, `/id/infografis?page=${page}`, { shallow: true })
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
      <BoxStyled
        overflow="hidden"
        className={accessibility.css.negative ? 'negative' : ''}
        sx={{
          position: 'relative',
          backgroundImage: 'url(/images/bg-batik.svg)',
          backgroundRepeat: 'repeat',
          backgroundSize: 'contain',
          overflow: 'hidden',
          minHeight: '100vh',
          mt: '-130px',
        }}
      >
        <Layout paddingY={2}>
          <>
            <Box
              sx={{
                display: 'inline-block',
                backgroundColor: '#006462',
                color: 'common.white',
                borderRadius: 8,
                px: 2,
                py: 1,
                fontWeight: 650,
                fontSize: { xs: 22, sm: 18 },
                letterSpacing: 1,
                boxShadow: 1,
                mb: 4,
                mt: { xs: 6, sm: 8, md: 20 }, // padding atas lebih banyak
              }}
            >
              INFOGRAFIS
            </Box>
            <Box position="relative">
              <MediaHeader
                text="Infografis mengenai Kota Surabaya"
                description="Pemerintah Kota Surabaya"
              />
              <Grid container spacing={4} marginTop={0}>
                {loading ? (
                  <>
                    {[...new Array(6)].map((_v, i) => (
                      <Grid key={i} item xs={12} sm={4}>
                        <Skeleton
                          variant="rectangular"
                          width="100%"
                          height={300}
                          sx={{
                            borderRadius: 4,
                          }}
                        />
                      </Grid>
                    ))}
                  </>
                ) : (
                  <>
                    {infografis &&
                      infografis.length > 0 &&
                      infografis.map((v, i) => (
                          <Grid
                            key={i}
                            item
                            sm={4}
                            xs={12}
                            className="grid-content"
                          >
                            <Box
                              sx={{
                                border: '2px solid #D2B690',
                                borderRadius: 4,
                                boxShadow: '0 2px 8px rgba(0,0,0,0)',
                                background: '#fff',
                                overflow: 'hidden',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                cursor: 'pointer',
                                '&:hover': {
                                  transform: 'translateY(-3px)',
                                  boxShadow: '0 10px 24px rgba(0,0,0,0.18)',
                                },
                              }}
                            >
                              <InfografisList
                                data={v}
                                gridSpacing={2}
                                withDescription={false}
                                gridImage={12}
                                gridContent={12}
                                truncateTitle={30}
                                withIconSurabaya={true}
                                withPlay={false}
                                route="infografis"
                              />
                            </Box>
                          </Grid>
                      ))}
                  </>
                )}
              </Grid>
            </Box>
            <Box marginTop={5} marginBottom={3}>
              <Pagination
                total={count}
                current={current}
                loading={loading}
                clickNextPrev={handleNextPrev}
              />
            </Box>
          </>
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

export default Infografis
import { memo } from 'react'