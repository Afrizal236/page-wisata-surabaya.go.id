import React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { parse } from 'node-html-parser'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import { StatusCodes } from 'http-status-codes'
import replaceAllInserter from 'string.prototype.replaceall'
import { NewsType } from 'components/home.section3'
import Detail from 'components/detail'
import { getDetail } from 'utils/services/news'
import { getOrganization } from 'utils/services/organization'
import schema from 'types/schemas'

interface Props {
  detail: schema['schemas']['Article']
}

const AgendaDetail: NextPage<Props> = ({ detail }: Props) => {
  const [pers, setPers] = React.useState<NewsType[]>([])
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
    const fetchData = await fetch(`/api/data/news?page=1&category=info`, { method: 'GET' })
    const results = await fetchData.json()
    console.log('results', results)
    if (fetchData.status === StatusCodes.OK) {
      if (results?.data?.length) {
        setPers(results.data)
      } else {
        setPers(null)
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
      <Detail
        news={data}
        contents={contents}
        others={pers}
        pageTitle="Agenda Kota"
        route="agenda"
        loadingDetail={false}
        loading={loading}
      />
    </React.Fragment>
  )
}

export const getServerSideProps = async ({ query }) => {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery(['contents'], async () => await getOrganization())
  const { slug } = query
  const detail = await getDetail(slug, 'info')
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

export default AgendaDetail
