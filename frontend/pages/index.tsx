import React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import { dehydrate, QueryClient } from '@tanstack/react-query'
// import { Menu as MenuType } from 'components/header';
import Layout from 'components/layout'
import Title from 'components/title'
import HomeSection1 from 'components/home.section1'
import HomeSection2 from 'components/home.section2'
import HomeSection3 from 'components/home.section3'
import HomeSection4 from 'components/home.section4'
import HomeSection5 from 'components/home.section5'
import HomeSection6 from 'components/home.section6'
import HomeSection7 from 'components/home.section7'
import { getNews } from 'utils/services/news'
// import { getAgenda } from 'utils/services/agenda'
import { getServices } from 'utils/services/service'
import { getOrganization } from 'utils/services/organization'

export interface News {
  title: string
  description?: string
  image: string
  date: string
}

export interface Service {
  title: string
}

interface Props { }

const BoxStyled1 = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  // backgroundColor handled by _app.index.tsx
  '& .wrapper-svg1, & .wrapper-svg2': {
    position: 'absolute',
    zIndex: 0,
    '& svg': {
      height: '100%',
    },
  },
  '& .wrapper-svg1': {
    height: theme.spacing(75),
    width: theme.spacing(75),
    bottom: 0,
    left: 0,
    transform: 'translate(-55%, 50%)',
    '& svg circle': {
      stroke: `${theme.palette.secondary.main} !important`,
    },
  },
  '& .wrapper-svg2': {
    bottom: 0,
    right: 0,
    height: theme.spacing(50),
    width: theme.spacing(50),
    transform: 'translate(70%, 0)',
    '& svg': {
      '& path': {
        stroke: `${theme.palette.primary.main} !important`,
      },
    },
  },
  '& .box-section4': {
    backgroundColor: theme.palette.background.paper,
  },
  '& .box-inner': {
    position: 'relative',
    zIndex: 0,
    backgroundColor:
      theme.palette.mode == 'dark' ? theme.palette.grey.A100 : theme.palette.primary.main,
    '& .wrapper-svg4, & .wrapper-svg5': {
      position: 'absolute',
      zIndex: 0,
      '& svg': {
        height: '100%',
      },
    },
    '& .wrapper-svg4': {
      height: theme.spacing(75),
      width: theme.spacing(75),
      top: 0,
      right: 0,
      transform: 'translate(55%, -50%)',
      '& svg circle': {
        fill: `${theme.palette.secondary.main} !important`,
      },
    },
    '& .wrapper-svg5': {
      bottom: 0,
      left: 0,
      height: theme.spacing(50),
      width: theme.spacing(50),
      transform: 'translate(-55%, 50%)',
      '& svg path': {
        stroke: `${theme.palette.secondary.main} !important`,
      },
    },
  },
  [theme.breakpoints.down('sm')]: {
    '& .wrapper-svg1, & .wrapper-svg2, & .wrapper-svg4, & .wrapper-svg5': {
      display: 'none',
    },
  },
}))

const Home: NextPage<Props> = () => {
  return (
    <Box sx={(theme) => ({ bgcolor: theme.palette.background.paper, minHeight: '100vh', width: '100%', p: 0, mt: '-90px' })}>
      <Head>
        <title>Pemerintah Kota Surabaya</title>
        <meta name="description" content="Pemerintah Kota Surabaya" />
      </Head>
      {/* Remove margin and padding from header and main content */}
      <Box sx={{ m: 0, p: 0, position: 'relative', zIndex: 1, boxSizing: 'border-box' }}>
        <HomeSection1 />
      </Box>
      <Box sx={{ m: 0, p: 0, boxSizing: 'border-box' }}>
        <HomeSection2 />
      </Box>
      <BoxStyled1 sx={{ m: 0, p: 0, boxSizing: 'border-box' }}>
        <Box sx={{backgroundImage: 'url(/images/bg-batik.svg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', m: 0, p: 0, boxSizing: 'border-box'}}>
          <>
            <HomeSection3 />
            <HomeSection4 />
          </>
        </Box>
        <Box sx={(theme) => ({m:0, p:0, bgcolor: theme.palette.background.paper, boxSizing: 'border-box'})}>
          <HomeSection5 />
        </Box>
        <Box sx={(theme) => ({m:0, p:0,backgroundImage: 'url(/images/bg-batik.svg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', bgcolor: theme.palette.background.paper, boxSizing: 'border-box'})}>
          <HomeSection6 />
        </Box>
        <Box sx={(theme) => ({m:0, p:0, bgcolor: theme.palette.background.paper, boxSizing: 'border-box'})}>
          <HomeSection7 />
        </Box>
      </BoxStyled1>
    </Box>
  )
}

export const getServerSideProps = async () => {
  const queryClient = new QueryClient()
  await Promise.all([
    queryClient.prefetchQuery(['contents'], async () => await getOrganization()),
    queryClient.prefetchQuery(['home_news'], async () => await getNews(1, '', 15, 'berita')),
    queryClient.prefetchQuery(['home_info'], async () => await getNews(1, '', 10, 'info')),
    queryClient.prefetchQuery(['home_services'], async () => await getServices(1, '', 15)),
  ])
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

export default Home
