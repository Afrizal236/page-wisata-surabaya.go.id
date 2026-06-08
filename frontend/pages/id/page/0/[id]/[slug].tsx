import React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { parse } from 'node-html-parser'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import replaceAllInserter from 'string.prototype.replaceall'
import { AccessibilityContext } from 'contexts/accessibility'
import Layout from 'components/layout'
import PagesTitle from 'components/pages.title'
import Article from 'components/article'
import MediaHeader from 'components/media.header'
import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { getDetail } from 'utils/services/news'
import { getOrganization } from 'utils/services/organization'
import schema from 'types/schemas'

interface Props {
  detail: schema['schemas']['Article']
}

const Pages: NextPage<Props> = ({ detail }: Props) => {
  
  const accessibilityContext = React.useContext(AccessibilityContext)
  
  // const content = React.useMemo(() => detail.content.replace(new RegExp('\\src="../../', 'gm'), `src="https://surabaya.go.id/`), [detail]);
  const content = React.useMemo(() => {
    const replaceData = replaceAllInserter(
      detail.content,
      `src="../../`,
      `src="https://surabaya.go.id/`
    )
    return replaceAllInserter(replaceData, `href="../../`, `href="/../../`)
  }, [detail])
  const contents = React.useMemo(() => {
    const dataContents = []
    const virtualDoc = parse(content)
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
  }, [content])

  // Check if this is the "Sekilas Tentang Surabaya" page
  const isSekilasPage = detail.title?.toLowerCase().includes('sekilas') || 
                       detail.title?.toLowerCase().includes('tentang surabaya')


  if (isSekilasPage) {
    // Use Infografis layout concept for Sekilas page
    // Removed unused: downSm, textToSpeech
    // Styled background like Infografis
    const SekilasBoxStyled = styled(Box)(() => ({
      overflow: 'hidden',
      position: 'relative',
      backgroundImage: 'url(/images/bg-batik.svg)',
      backgroundRepeat: 'repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      width: '100%',
      marginTop: '-180px',
      '&.negative': {
        filter: 'invert(1) hue-rotate(180deg)',
      },
    }))
    // Consistent image row styling
    const ImageContainer = styled(Box)(({ theme }) => ({
      display: 'flex',
      gap: theme.spacing(3),
      justifyContent: 'center',
      marginBottom: theme.spacing(4),
      maxWidth: 2000,
      marginLeft: 'auto',
      marginRight: 'auto',
      [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
        gap: theme.spacing(2),
        alignItems: 'center',
      },
    }))
    const StyledImage = styled(Box)(({ theme }) => ({
      width: '100%',
      maxWidth: '600px',
      height: '340px',
      borderRadius: '12px',
      overflow: 'hidden',
      position: 'relative',
      [theme.breakpoints.up('lg')]: {
        maxWidth: '600px',
        height: '340px',
      },
      [theme.breakpoints.down('sm')]: {
        maxWidth: '100%',
        height: '220px',
      },
    }))
    const CardStyled = styled(Box)(({ theme }) => ({
      background: theme.palette.mode === 'dark'
        ? 'rgba(0, 57, 55, 0.85)'
        : 'rgba(255,255,255,0.60)',
      borderRadius: 16,
      boxShadow: theme.palette.mode === 'dark'
        ? '0 4px 24px rgba(0,0,0,0.30)'
        : '0 4px 24px rgba(0,0,0,0.10)',
      padding: theme.spacing(4, 4),
      maxWidth: 1200,
      margin: '32px auto 48px auto',
      [theme.breakpoints.down('md')]: {
        padding: theme.spacing(2, 1),
        maxWidth: '100%',
        margin: '24px auto 32px auto',
      },
    }))
    const ContentText = styled(Box)(({ theme }) => ({
      maxWidth: 1200,
      width: '100%',
      margin: '0 auto',
      padding: 0,
      [theme.breakpoints.down('md')]: {
        padding: theme.spacing(0, 1),
      },
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(0, 0.5),
      },
      color: theme.palette.mode === 'dark' ? '#fff' : '#222',
      '& p': {
        color: theme.palette.mode === 'dark' ? '#fff' : '#222',
        fontFamily: "'Roboto', Arial, sans-serif",
        fontWeight: 400,
        fontSize: '16px',
        lineHeight: '22px',
        marginTop: 0,
        marginBottom: 0,
        wordWrap: 'break-word',
        textAlign: 'justify',
      },
      '& a': {
        color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : '#006462',
        textDecoration: 'underline',
        wordWrap: 'break-word',
        '&:hover': {
          color: theme.palette.mode === 'dark' ? theme.palette.primary.main : '#2c6f9e',
        },
      },
      '& ul': {
        listStyle: 'disc',
        marginLeft: theme.spacing(3),
        marginBottom: theme.spacing(6),
        '& li': {
          color: theme.palette.mode === 'dark' ? '#fff' : '#006462',
          marginBottom: theme.spacing(1),
          wordWrap: 'break-word',
        },
      },
      '& h1, & h2, & h3, & h4, & h5, & h6': {
        fontFamily: "'Roboto', Arial, sans-serif",
        fontWeight: 600,
        color: theme.palette.mode === 'dark' ? '#fff' : '#222',
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(2),
        wordWrap: 'break-word',
      },
      '& h3': {
        fontSize: '20px',
        lineHeight: '24px',
      },
      '& strong, & b': {
        fontWeight: 700,
      },
    }))

    return (
      <React.Fragment>
        <Head>
          <title>Sekilas Tentang Surabaya - Pemerintah Kota Surabaya</title>
          <meta name="description" content="Sekilas tentang Kota Surabaya dengan narasumber yang terpercaya" />
        </Head>
        <SekilasBoxStyled>
          <Layout paddingY={2}>
            <Box>
              <Box position="relative">
                <Box mb={{ xs: 6, sm: 8, md: 10 }} mt={{ xs: 24, sm: 26, md: 30 }}>
                  <MediaHeader
                    text="SEKILAS TENTANG SURABAYA"
                    description="dengan narasumber yang terpercaya."
                  />
                </Box>
                <ImageContainer>
                  <StyledImage>
                    <img
                      src="/images/sekilas/balai-kota.png"
                      alt="Balai Kota Surabaya"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div style="
                              width: 100%; 
                              height: 100%; 
                              background-color: #f5f5f5; 
                              display: flex; 
                              align-items: center; 
                              justify-content: center; 
                              color: #999;
                              font-family: 'Roboto', Arial, sans-serif;
                            ">
                              Balai Kota Surabaya
                            </div>
                          `;
                        }
                      }}
                    />
                  </StyledImage>
                  <StyledImage>
                    <img
                      src="/images/sekilas/alun-alun-sby.png"
                      alt="Alun-Alun Surabaya"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div style="
                              width: 100%; 
                              height: 100%; 
                              background-color: #f5f5f5; 
                              display: flex; 
                              align-items: center; 
                              justify-content: center; 
                              color: #999;
                              font-family: 'Roboto', Arial, sans-serif;
                            ">
                              Alun-Alun Surabaya
                            </div>
                          `;
                        }
                      }}
                    />
                  </StyledImage>
                </ImageContainer>
                <CardStyled>
                  <ContentText>
                    {detail.content ? (
                      <Box dangerouslySetInnerHTML={{ __html: detail.content }} />
                    ) : (
                      <Typography color="text.secondary" align="center" sx={{ my: 8 }}>
                        Konten tidak tersedia.
                      </Typography>
                    )}
                  </ContentText>
                </CardStyled>
              </Box>
            </Box>
          </Layout>
        </SekilasBoxStyled>
      </React.Fragment>
    )
  }

  // Default layout for other pages
  return (
    <React.Fragment>
      <Head>
        <title>Pemerintah Kota Surabaya</title>
        <meta name="description" content="Pemerintah Kota Surabaya" />
      </Head>
      <Box
        className={accessibilityContext.css.negative ? 'negative' : ''}
        sx={{
        position: 'relative',
        width: '100%',
        backgroundImage: 'url(/images/bg-batik.svg)',
        backgroundRepeat: 'repeat',
        backgroundPosition: 'top center',
        backgroundSize: 'contain',
        overflow: 'hidden',
        minHeight: '100vh',
        mt: '-130px',
        pb: { xs: 4, sm: 6, md: 8 },
      }}
      >
        <Box sx={{ pt: { xs: 6, sm: 8, md: 20 } }}>
          <Layout paddingY={0}>
            <PagesTitle text={detail.title} />
          </Layout>
        </Box>
        <Layout paddingY={0} maxWidth="md">
          <Article contents={contents} paddingY={8} />
        </Layout>
      </Box>
    </React.Fragment>
  )
}

export const getServerSideProps = async ({ query }) => {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery(['contents'], async () => await getOrganization())
  const { slug } = query
  const detail = await getDetail(slug, 'halaman')
  let content = ''
  console.log('ddd', detail)
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

export default Pages
