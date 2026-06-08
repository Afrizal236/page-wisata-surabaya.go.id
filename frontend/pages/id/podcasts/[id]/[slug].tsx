import React from 'react'
import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import type { NextPage } from 'next'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { stripHtml } from 'string-strip-html'
import { StatusCodes } from 'http-status-codes'
import Layout from 'components/layout'
import Title from 'components/title'
// import { PodcastType } from 'pages/podcasts/index';
import ProgressPlayerAudio from 'components/media.player.audio'
import { borderRadius, boxShadow } from 'styles/theme'
import { fontSizeTitle } from 'components/news.list'
import MediaDate from 'components/media.date'
import MediaPodcastOthers from 'components/media.podcast.others'
import Element1 from 'public/images/icon/element_1.svg'
import { BreakpointsContext } from 'contexts/breakpoints'
import { getDetail } from 'utils/services/webdisplay'
import useTextToSpeech from 'hooks/useTextToSpeech'
import { getOrganization } from 'utils/services/organization'
import schema from 'types/schemas'

interface Props {
  detail: schema['schemas']['Article']
}

const BoxStyled = styled(Box)(({ theme }) => ({
  margin: theme.spacing(0),
  '& .main-content': {
    boxShadow,
    borderRadius: theme.spacing(borderRadius),
    padding: theme.spacing(8, 10),
    backgroundColor:
      theme.palette.mode == 'dark' ? theme.palette.grey.A100 : theme.palette.common.white,
    textAlign: 'center',
    '& img': {
      height: 330,
    },
  },
  '& .wrapper-svg-section1': {
    position: 'absolute',
    top: 0,
    right: `100%`,
    transform: 'translate(50%, -40%)',
    zIndex: -1,
    '& svg': {
      width: theme.spacing(80),
      '& circle': {
        stroke: `${theme.palette.secondary.main} !important`,
      },
    },
  },
  [theme.breakpoints.down('sm')]: {
    '& .main-content': {
      padding: theme.spacing(3),
      '& img': {
        height: 'auto',
        width: '100%',
      },
    },
    '& .wrapper-svg-section1': {
      display: 'none',
    },
  },
}))

const PodcastDetail: NextPage<Props> = ({ detail }: Props) => {
  console.log('detail', detail)

  const router = useRouter()
  const { downSm } = React.useContext(BreakpointsContext)
  const { textToSpeech } = useTextToSpeech()
  const [others, setOthers] = React.useState<schema['schemas']['Article'][]>([])
  const [loading, setLoading] = React.useState(true)
  const podcastFile = React.useMemo(() => {
    if (detail) {
      const opts = {
        ignoreTags: ['source'],
      }
      const results = stripHtml(detail.content, opts)
      const arr = results.result.match(/<source.+?\/>/g)

      if (arr && arr.length > 0) {
        const split = arr[0].split('src="')
        const split2 = split[1].split('"')
        return split2[0]
      }
      return
    }
    return
  }, [detail])
  const getData = async () => {
    setLoading(true)
    const fetchData = await fetch(`/api/data/webdisplay?page=1&target=podcasts&limit=8`, {
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
      <BoxStyled>
        <Layout paddingY={2}>
          <>
            <Box className="wrapper-svg-section1">
              <Element1 />
            </Box>
            <Title text="Podcast" paddingY={3} onBack={() => router.push(`/id/podcasts`)} />
            <Box paddingY={6} className="main-content" position="relative" zIndex={1}>
              <img src={`https://webdisplay.surabaya.go.id${detail.feature_image_url}`} />
              <Typography
                fontSize={downSm ? fontSizeTitle - 3 : fontSizeTitle}
                fontWeight={700}
                lineHeight={1.2}
                marginY={3}
                textTransform="uppercase"
                onMouseEnter={(e) => textToSpeech(e, true)}
              >
                {detail.title}
              </Typography>
              {podcastFile && (
                <ProgressPlayerAudio url={`https://webdisplay.surabaya.go.id${podcastFile}`} />
              )}
              <Box paddingTop={3}>
                <MediaDate
                  title={detail.title}
                  date={detail.publish_date}
                  others={`Bagikan`}
                  withText={true}
                />
              </Box>
            </Box>
          </>
        </Layout>
      </BoxStyled>
      {!loading && others && others.length > 0 && <MediaPodcastOthers data={others} />}
    </React.Fragment>
  )
}

export const getServerSideProps = async ({ query }) => {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery(['contents'], async () => await getOrganization())
  const { id } = query
  const detail = await getDetail(parseInt(id as string), 'podcast')

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

export default PodcastDetail
