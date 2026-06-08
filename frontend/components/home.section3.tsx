import React, { memo } from 'react'
import { Grid, Box, Skeleton } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { styled } from '@mui/material/styles'
// import Title from 'components/title'
import NewsContainer from 'components/news.container'
import CarouselContent from 'components/carousel.content'
// import NewsContainer2 from 'components/news.container2'
import { BreakpointsContext } from 'contexts/breakpoints'
import schema from 'types/schemas'

interface Category {
  alias: string
  created_at: string
  description?: string
  id: number
  locale: string
  name: string
  parent_id?: string
  updated_at: string
}

export interface NewsType {
  category?: Category[]
  content?: string
  content_type?: string
  created_at: string
  feature_image: string
  id?: number
  id_lama?: number
  locale?: string
  name?: string
  parent_id?: number
  post_type?: string
  status?: string
  tag?: Category[]
  title: string
  updated_at?: string
  user_id?: number
  viewed_count?: number
}

interface Props { }

const BoxStyled = styled(Box)(({ theme }) => ({
  width: '80%',
  maxWidth: '80%',
  margin: '0 auto',
  '& .MuiGrid-container': {
    position: 'relative',
    zIndex: 1,
  },
  '& .wrapper-svg-section3': {
    position: 'absolute',
    top: theme.spacing(3),
    right: `calc(100% + ${theme.spacing(2)})`,
    '& svg': {
      width: 50,
      '& circle': {
        fill: `${theme.palette.primary.main} !important`,
      },
    },
  },
  [theme.breakpoints.down('sm')]: {
    '& .wrapper-svg-section3': {
      display: 'none',
    },
    '& .slick-arrow': {
      display: 'none',
    },
  },
}))

const HomeSection3: React.FunctionComponent<Props> = () => {
  const router = useRouter()
  const loading = false
  const { downSm } = React.useContext(BreakpointsContext)
  const { data } = useQuery<{ data: schema['schemas']['Article'][] }>(['home_news'])
  const accessibility = React.useContext(require('contexts/accessibility').AccessibilityContext) as { fontSize: number }
  const handleLihatSemua = React.useCallback(() => {
    router.push('/id/berita')
  }, [router])
  return (
    <>
      {data?.data && (
        <BoxStyled sx={{ position: 'relative', borderRadius: 0, p: downSm ? 4 : 7, overflow: 'hidden' }}>
          {/* Top Bar */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <img
                src="/images/icon/icon_batik_coklat_kiri.svg"
                alt="icon_batik"
                style={{ width: 32, height: 32, marginRight: 12, display: 'block' }}
              />
                <Box component="span" sx={(theme) => ({ color: theme.palette.text.primary, fontSize: 28 + accessibility.fontSize * 2, fontWeight: 600, letterSpacing: 1, lineHeight: 1 })}>
                  BERITA TERBARU
                </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <button
                onClick={handleLihatSemua}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: '#fff',
                  color: '#C7A97A',
                  border: 'none',
                  borderRadius: 999,
                  padding: '6px 18px',
                  fontWeight: 500,
                  cursor: 'pointer',
                fontSize: 15 + accessibility.fontSize * 2,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  transition: 'background 0.2s, color 0.2s',
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = '#C7A97A';
                  e.currentTarget.style.color = '#fff';
                  const svg = e.currentTarget.querySelector('svg path');
                  if (svg) svg.setAttribute('fill', '#fff');
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.color = '#C7A97A';
                  const svg = e.currentTarget.querySelector('svg path');
                  if (svg) svg.setAttribute('fill', '#C7A97A');
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ display: 'inline', verticalAlign: 'middle' }}>
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5zm0 12c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-7A2.5 2.5 0 1 0 12 16a2.5 2.5 0 0 0 0-5z" fill="#C7A97A"/>
                </svg>
                Lihat Semua
              </button>
            </Box>
          </Box>
          <Grid container spacing={downSm ? 0 : 4} alignItems="stretch">
            <Grid item xs={12} sm={8}>
              {loading ? (
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={340}
                  sx={{
                    borderRadius: 3,
                  }}
                />
              ) : (
                <>
                  {!!data?.data?.length && (
                    <CarouselContent
                      data={data?.data?.slice(0, 7) || []}
                      slidesToShow={1}
                      gridSpacing={0}
                      truncateTitle={60}
                      fontSizeProps={18 + accessibility.fontSize * 2}
                      withDescription={false}
                      gridImage={12}
                      gridContent={12}
                      truncateDescription={90}
                      withThumbnail={false}
                      route="berita"
                    />
                  )}
                </>
              )}
            </Grid>
          </Grid>
        </BoxStyled>
      )}
    </>
  )
}

HomeSection3.defaultProps = {}

export default memo(HomeSection3)
