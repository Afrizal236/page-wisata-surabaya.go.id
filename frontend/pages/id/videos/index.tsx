import React from 'react'
import { Box, Grid, Skeleton } from '@mui/material'
import { styled } from '@mui/material/styles'
import type { NextPage } from 'next'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import Head from 'next/head'
import { StatusCodes } from 'http-status-codes'
import { useRouter } from 'next/router'
import Layout from 'components/layout'
import Title from 'components/title'
import Pagination from 'components/pagination'
import NewsItem from 'components/news.item'
import { fontSizeBigger, fontSizeTitle } from 'components/news.list'
import { borderRadius, boxShadow } from 'styles/theme'
import { BreakpointsContext } from 'contexts/breakpoints'
import { AccessibilityContext } from 'contexts/accessibility'
import { getOrganization } from 'utils/services/organization'
import schema from 'types/schemas'

export interface VideoType {
  image: string
  title: string
  date: string
}

interface Props {}

export const sizePlay = 100

export const BoxStyled = styled(Box)(({ theme }) => ({
  position: 'relative',
  '& .grid-content': {
    '& a': {
      display: 'block',
      overflow: 'hidden',
      borderRadius: theme.spacing(borderRadius),
      transition: `all 0.2s ease-in-out`,
      '&:hover': {
        boxShadow,
      },
    },
    '&.first-content': {
      '& .MuiGrid-container': {
        backgroundColor: theme.palette.primary.main,
        overflow: 'hidden',
        '& .MuiGrid-item': {
          '& img': {
            borderRadius: 0,
            aspectRatio: '4/2',
          },
          '&:first-of-type': {
            order: 2,
          },
          '&:last-of-type': {
            order: 1,
            display: 'flex',
            alignItems: 'center',
            width: '100%',
          },
          '& .inner': {
            padding: theme.spacing(4, 8),
            color: theme.palette.common.white,
            '& .title': {
              fontSize: fontSizeBigger,
            },
          },
        },
      },
    },
    '&:not(.first-content)': {
      '& .MuiGrid-container': {
        '& .MuiGrid-item': {
          '& img': {
            borderRadius: 0,
            aspectRatio: '4/2',
          },
          '& .inner': {
            padding: theme.spacing(0, 2, 2),
            backgroundColor:
              theme.palette.mode == 'dark' ? theme.palette.grey.A100 : theme.palette.common.white,
            '& .title': {
              // fontSize: fontSizeTitle - 5,
              fontWeight: 700,
              lineHeight: 1.3,
            },
          },
        },
      },
    },
  },
  '&.container-inner': {
    '& .grid-content': {
      '& a': {
        backgroundColor:
          theme.palette.mode == 'dark'
            ? theme.palette.background.paper
            : theme.palette.common.white,
        '& .MuiGrid-container': {
          '& .MuiGrid-item': {
            '& .inner': {
              backgroundColor:
                theme.palette.mode == 'dark'
                  ? theme.palette.background.paper
                  : theme.palette.common.white,
            },
          },
        },
      },
    },
  },
  '& .wrapper-svg-element1': {
    position: 'absolute',
    bottom: 0,
    right: '100%',
    transform: 'translate(50%, -30%)',
    zIndex: -1,
    '& svg': {
      width: theme.spacing(66),
      '& circle': {
        stroke: `${theme.palette.secondary.main} !important`,
      },
    },
    '&.infografis': {
      '& svg': {
        '& circle': {
          stroke: `${theme.palette.secondary.main} !important`,
        },
      },
    },
  },
  '& .wrapper-svg-element3a': {
    position: 'absolute',
    top: 0,
    right: '100%',
    transform: 'translate(-50px, 220%)',
    zIndex: -1,
    '& svg': {
      width: theme.spacing(6),
    },
  },
  '& .wrapper-svg-element3b': {
    position: 'absolute',
    bottom: 0,
    left: '100%',
    transform: 'translate(30px, -10%)',
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
    left: '100%',
    transform: 'translate(-50%, -30%)',
    zIndex: -1,
    '& svg': {
      width: theme.spacing(50),
    },
    '&.infografis': {
      '& svg': {
        '& path': {
          stroke: `${theme.palette.primary.main} !important`,
        },
      },
    },
  },
  '&.negative': {
    '& .wrapper-svg-element3a': {
      '& svg': {
        '& circle': {
          fill: `${theme.palette.common.white} !important`,
        },
      },
    },
    '& .wrapper-svg-element4': {
      '& svg': {
        '& path': {
          stroke: `${theme.palette.common.white} !important`,
        },
      },
    },
  },
  [theme.breakpoints.down('sm')]: {
    '& .wrapper-svg-element1, & .wrapper-svg-element3a, & .wrapper-svg-element3b, & .wrapper-svg-element4':
      {
        display: 'none',
      },
    '& .grid-content': {
      '&.first-content': {
        '& .MuiGrid-container': {
          '& .MuiGrid-item': {
            '&:first-of-type': {
              order: 1,
            },
            '&:last-of-type': {
              order: 2,
            },
            '& .inner': {
              padding: theme.spacing(3),
              '& .title': {
                fontSize: fontSizeBigger - 14,
              },
              '& .date': {
                fontSize: 11,
              },
            },
          },
        },
      },
      '&:not(.first-content)': {
        '& .MuiGrid-container': {
          '& .MuiGrid-item': {
            '& .inner': {
              '& .title': {
                fontSize: fontSizeBigger - 14,
              },
            },
          },
        },
      },
    },
  },
}))

const Videos: NextPage<Props> = () => {
  const router = useRouter()
  const { downSm } = React.useContext(BreakpointsContext)
  const accessibility = React.useContext(AccessibilityContext)
  const [videos, setVideos] = React.useState<schema['schemas']['Article'][]>([])
  const [loading, setLoading] = React.useState(true)
  const [count, setCount] = React.useState(null)
  const current = React.useMemo(
    () => (router.query.page ? parseInt(router.query.page as string) : 1),
    [router.query.page]
  )
  const getData = async (pageParams: number) => {
    setLoading(true)
    const fetchData = await fetch(`/api/data/webdisplay?page=${pageParams}&target=videos`, {
      method: 'GET',
    })
    const results = await fetchData.json()
    console.log('results', results)
    if (fetchData.status === StatusCodes.OK) {
      if (results?.data?.data?.length > 0) {
        setVideos(results.data.data)
        const totalPage = results.data.total / results.data.records
        setCount(Math.ceil(totalPage))
      } else {
        setVideos(null)
        setCount(0)
      }
    }
    setLoading(false)
  }
  const handleNextPrev = React.useCallback(
    (p: number) => {
      const page = count ? (p < 1 ? 1 : p) : 1
      router.push(`/id/videos?page=${page}`, `/id/videos?page=${page}`, { shallow: true })
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
      <BoxStyled overflow="hidden" className={accessibility.css.negative ? 'negative' : ''}>
        <Layout paddingY={2}>
          <>
           
           
            <Title text="Video" />
            <Box position="relative">
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
                    {!!videos?.length &&
                      videos.map((v, i) => {
                        const isFirst = i == 0 && current == 1
                        return (
                          <Grid
                            key={i}
                            item
                            xs={12}
                            sm={isFirst ? 12 : 4}
                            className={`grid-content ${isFirst ? 'first-content' : ''}`}
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
                              gridSpacing={isFirst ? 0 : 2}
                              withDescription={false}
                              gridImage={isFirst ? 7 : 12}
                              gridContent={isFirst ? 5 : 12}
                              truncateTitle={isFirst ? 50 : 30}
                              withIconSurabaya={!isFirst}
                              withPlay={true}
                              sizePlay={isFirst && !downSm ? sizePlay : 50}
                              route="videos"
                            />
                          </Grid>
                        )
                      })}
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

export default Videos
