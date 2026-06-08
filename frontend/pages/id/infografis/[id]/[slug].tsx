import React from 'react'
import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import TimeAgo from 'javascript-time-ago'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import id from 'javascript-time-ago/locale/id'
import replaceAllInserter from 'string.prototype.replaceall'
import { StatusCodes } from 'http-status-codes'
import Layout from 'components/layout'
import Title from 'components/title'
import MediaDate from 'components/media.date'
import { boxShadow, borderRadius } from 'styles/theme'
import { fontSizeTitle } from 'components/news.list'
import InfografisOther from 'components/infografis.other'
import { BoxStyled as BoxNewsStyled } from 'pages/id/videos/index'
import { BreakpointsContext } from 'contexts/breakpoints'
import { AccessibilityContext } from 'contexts/accessibility'
import { getDetail } from 'utils/services/news'
import { getOrganization } from 'utils/services/organization'
import schema from 'types/schemas'

TimeAgo.addLocale(id)
const timeAgo = new TimeAgo('id-ID')

interface Props {
  detail: schema['schemas']['Article']
}

// const dataDownload = [
//   'https://surabaya.go.id/uploads/attachments/2021/12/63029/SEKDA.pdf?1640746495',
//   'https://surabaya.go.id/uploads/attachments/2021/12/63029/SEKDA.pdf?1640746495',
//   'https://surabaya.go.id/uploads/attachments/2021/12/63029/SEKDA.pdf?1640746495',
// ];

// const BoxButtonStyled = styled(Box)(({ theme }) => ({
//   '& a': {
//     textDecoration: 'none',
//     borderRadius: theme.spacing(1),
//     padding: theme.spacing(1.5),
//     marginBottom: theme.spacing(1),
//     overflow: 'hidden',
//     display: 'block',
//     whiteSpace: 'nowrap',
//     textOverflow: 'ellipsis',
//     color: theme.palette.text.primary,
//     fontWeight: 700,
//     '&:hover': {
//       boxShadow,
//     },
//   },
// }));

// const DownloadButton = React.memo(({ link }: any) => {
//   return (
//     <BoxButtonStyled>
//       <Link href={link}>
//         <a target="_blank">{link}</a>
//       </Link>
//     </BoxButtonStyled>
//   );
// });

const BoxStyled = styled(Box)(({ theme }) => ({
  paddingBottom: theme.spacing(5),
  '& .container-text': {
    boxShadow,
    borderRadius: theme.spacing(borderRadius),
    padding: theme.spacing(5),
    overflow: 'hidden',
    backgroundColor:
      theme.palette.mode == 'dark' ? theme.palette.grey.A100 : theme.palette.common.white,
    '& .content': {
      '& img': {
        maxWidth: '100%',
      },
    },
  },
  // Removed decorative wrapper element styles
}))

const BoxStyledOthers = styled(Box)(() => ({
  backgroundColor: 'transparent',
}))

const InfografisDetail: NextPage<Props> = ({ detail }: Props) => {
  const router = useRouter()
  // const { mode } = React.useContext(ColorModeContext)
  const { downSm } = React.useContext(BreakpointsContext)
  const accessibility = React.useContext(AccessibilityContext)
  const [news, setNews] = React.useState<schema['schemas']['Article'][]>([])
  const [loading, setLoading] = React.useState(true)
  const data = React.useMemo(() => {
    const dataDetail = detail
    dataDetail.content = replaceAllInserter(
      dataDetail.content,
      `src="../../`,
      `src="https://surabaya.go.id/`
    )
    dataDetail.content = replaceAllInserter(dataDetail.content, `href="../../`, `href="/../../`)
    return dataDetail
  }, [detail])
  const getData = async () => {
    setLoading(true)
    const fetchData = await fetch(`/api/data/news?page=1&category=info`, { method: 'GET' })
    const results = await fetchData.json()
    console.log('results', results)
    if (fetchData.status === StatusCodes.OK) {
      if (results?.data?.length) {
        setNews(results.data)
      } else {
        setNews(null)
      }
    }
    setLoading(false)
  }
  React.useEffect(() => {
    getData()
  }, [])
  const handleOnClick = React.useCallback(() => router.push(`/id/infografis`, `/id/infografis`), [])
  return (
    <React.Fragment>
      <Head>
        <title>Pemerintah Kota Surabaya</title>
        <meta name="description" content="Pemerintah Kota Surabaya" />
      </Head>
      {/* Page-level background like other pages */}
      <Box
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
          // Add top padding so back button sits below the navbar
          pt: { xs: 6, sm: 8, md: 20 },
        }}
      >
        <BoxStyled overflow="hidden" className={accessibility.css.negative ? 'negative' : ''}>
          <Layout paddingY={2}>
            <>
              <Title text="Infografis" paddingY={3} color="#006462" onBack={() => router.push(`/id/infografis`)} />
              <Box className="container-text">
                <Typography
                  fontSize={(downSm ? fontSizeTitle - 2 : fontSizeTitle) + accessibility.fontSize}
                  fontWeight={900}
                  lineHeight={1.3}
                  textTransform="uppercase"
                  marginBottom={1}
                  sx={(theme) => ({
                    color:
                      theme.palette.mode === 'light'
                        ? theme.palette.text.secondary
                        : theme.palette.text.primary,
                  })}
                >
                  {detail.title}
                </Typography>
                <MediaDate
                  date={detail.publish_date}
                  others={timeAgo.format(new Date(detail.publish_date)) as string}
                  justifyContent="flex-start"
                />
                <Box
                  className="content"
                  marginTop={3}
                  sx={{
                    fontSize: `1${accessibility.fontSize}0%`,
                  }}
                >
                  <div className="text" dangerouslySetInnerHTML={{ __html: data.content }} />
                </Box>
              </Box>
            </>
          </Layout>
        </BoxStyled>
        <BoxStyledOthers marginTop={2} paddingBottom={8}>
          <Layout>
            <>
              {!loading && news && news.length > 0 && (
                <BoxNewsStyled className="container-inner">
                  <InfografisOther
                    data={news.slice(0, 9)}
                    route="infografis"
                    title="INFOGRAFIS LAINNYA"
                    onLihatSemua={handleOnClick}
                  />
                </BoxNewsStyled>
              )}
            </>
          </Layout>
        </BoxStyledOthers>
      </Box>
    </React.Fragment>
  )
}

export const getServerSideProps = async ({ query }) => {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery(['contents'], async () => await getOrganization())
  const { slug } = query
  const detail = await getDetail(slug, 'infografis')
  let content = ''

  if (!detail) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  detail.details?.map((item) => {
    content += item.content
  })
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      detail: {
        ...detail,
        content,
      },
    },
  }
}

export default InfografisDetail
