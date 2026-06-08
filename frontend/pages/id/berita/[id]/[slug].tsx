import React from 'react'
import type { NextPage, GetServerSideProps } from 'next'
import Head from 'next/head'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
// import { uniq } from 'lodash'
import { parse } from 'node-html-parser'
import { StatusCodes } from 'http-status-codes'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import replaceAllInserter from 'string.prototype.replaceall'
import BeritaDetail from 'components/news.detail.redesign'
import BeritaLainnya from 'components/news.others.redesign'
import { getDetail } from 'utils/services/news'
import { getOrganization } from 'utils/services/organization'
import schema from 'types/schemas'

interface Props {
  detail: schema['schemas']['Article']
}

const NewsDetail: NextPage<Props> = ({ detail }: Props) => {
  const router = useRouter()
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
    // const splitPart = '<p class="pdf-viewer"'
    // const split = dataDetail.content.split(splitPart)
    // if (split.length) {
    //   const arrayPdf = []
    //   split.forEach((item) => {
    //     if (item.includes('data-url')) {
    //       const pattern = /data-url="([\s\S]*?)(?=")/g
    //       const result = uniq(item.match(pattern))[0]
    //       arrayPdf.push(result.replace('data-url="', ''))
    //     }
    //   })
    //   arrayPdf.forEach((item) => {
    //     const splitUrl = item.split('/')
    //     const content = `<p class="pdf-viewer" data-url="${item}">[PDF <a href="http://localhost:3002/uploads/${item}">${splitUrl[splitUrl.length - 1]}</a>]</p>`
    //     dataDetail.content = dataDetail.content.replace(content, `<embed class="pdf-viewer" type="application/pdf" src="http://localhost:3002/uploads/${item}"></embed>`)
    //   })
    // }

    return dataDetail
  }, [detail])
  const contents = React.useMemo(() => {
    const dataContents = []
    const virtualDoc = parse(data.content)
    if (virtualDoc?.childNodes?.length) {
      virtualDoc?.childNodes.forEach((node: any) => {
        if (node?.getAttribute && node?.getAttribute('class') === 'pdf-viewer') {
          const urlPdf = `https://surabaya.go.id/uploads/${node?.getAttribute('data-url')}`
          dataContents.push(`<pdf>${urlPdf}</pdf>`)
        } else {
          dataContents.push(node.outerHTML)
        }
      })
    }

    return dataContents
  }, [data])
  const getData = async () => {
    setLoading(true)
    const fetchData = await fetch(`/api/data/news?page=1&category=berita`, { method: 'GET' })
    const results = await fetchData.json()
    if (fetchData.status === StatusCodes.OK) {
      if (results?.data?.length > 0) {
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

  const handleLihatSemua = () => {
    router.push('/id/berita');
  };

  return (
    <React.Fragment>
      <Head>
        <title>{data.title || 'Detail Berita'} - Pemerintah Kota Surabaya</title>
        <meta name="description" content={data.title || "Pemerintah Kota Surabaya"} />
      </Head>
      
      {/* Main Content */}
      <Box
        sx={{
          minHeight: '100vh',
          width: '100%',
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? theme.palette.background.paper : '#fff',
          backgroundImage: 'url("/images/bg-batik.svg")',
          backgroundRepeat: 'repeat',
          backgroundSize: 'cover', // ganti ke 'contain' jika ingin persis infografis
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          mt: { xs: '-90px', md: '-130px' },
        }}
      >
        {/* Berita Detail */}
        <BeritaDetail 
          news={data}
          contents={contents}
        />
        {/* Berita Lainnya */}
        <BeritaLainnya 
          items={news || []}
          onLihatSemua={handleLihatSemua}
        />
      </Box>
    </React.Fragment>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  try {
    const queryClient = new QueryClient()
    await queryClient.prefetchQuery(['contents'], async () => await getOrganization())
    const { slug } = query
    
    if (!slug || typeof slug !== 'string') {
      return {
        redirect: {
          destination: '/id/berita',
          permanent: false,
        },
      }
    }
    
    const detail = await getDetail(slug, 'berita')
    let content = ''

    if (!detail) {
      return {
        redirect: {
          destination: '/id/berita',
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
  } catch (error) {
    console.error('Error in getServerSideProps:', error)
    return {
      redirect: {
        destination: '/id/berita',
        permanent: false,
      },
    }
  }
}

export default NewsDetail
