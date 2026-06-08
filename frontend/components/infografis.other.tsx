import React, { memo } from 'react'
import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { yellowColor } from 'styles/theme'
import { useRouter } from 'next/router'
import schema from 'types/schemas'
import useTextToSpeech from 'hooks/useTextToSpeech'
import { imagePath } from 'components/infografis.item'

interface Props {
  data: schema['schemas']['Article'][]
  route: string
  title?: string
  onLihatSemua?: () => void
}

// Plain section (no background); keep spacing only
const SectionContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  background: 'transparent',
  overflow: 'hidden',
  padding: theme.spacing(2, 1, 4),
}))

const ContentWrapper = styled(Box)(({ theme }) => ({
  maxWidth: 1200,
  margin: '0 auto',
  padding: theme.spacing(0, 2),
  paddingTop: theme.spacing(2),
  [theme.breakpoints.down('md')]: { padding: theme.spacing(0, 1.5) },
}))

const HeaderContainer = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 30,
}))

const TitleText = styled(Typography)(({ theme }) => ({
  fontSize: 20,
  fontWeight: 800,
  color: '#006462',
  fontFamily: "'Roboto', Arial, sans-serif",
  textTransform: 'uppercase',
}))

const LihatSemuaButton = styled('button')(() => ({
  padding: 0,
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  transition: 'opacity 0.2s',
  '&:hover': { opacity: 0.8 },
}))

const SliderWrapper = styled(Box)(() => ({ display: 'block' }))

const SliderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: '20px',
  margin: '0 auto',
  paddingLeft: '8px',
  paddingRight: '8px',
  width: '100%',
  marginBottom: '24px',
  overflowX: 'auto',
  scrollBehavior: 'smooth',
  paddingBottom: '10px',
  paddingTop: '15px',
  '&::-webkit-scrollbar': { display: 'none' },
  scrollbarWidth: 'none',
  [theme.breakpoints.down('md')]: { gap: '16px', paddingTop: '12px' },
  [theme.breakpoints.down('sm')]: { gap: '12px', paddingTop: '10px' },
}))

const Card = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  borderRadius: '30px',
  border: '3px solid #D2B690',
  cursor: 'pointer',
  transition: 'all 0.3s ease-in-out',
  width: '280px',
  height: '320px',
  boxShadow: '0px 4px 15px 0px #00000033',
  flexShrink: 0,
  backdropFilter: 'blur(10px)',
  '&:hover': {
    backgroundColor: '#006462',
    '& .card-title': { color: 'white' },
    '& .card-date': { color: 'white' },
  },
  [theme.breakpoints.down('md')]: { width: '240px', height: '300px' },
  [theme.breakpoints.down('sm')]: { width: '220px', height: '280px' },
}))

const ImageContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '190px',
  overflow: 'hidden',
  borderRadius: '30px',
  [theme.breakpoints.down('md')]: { height: '160px' },
  [theme.breakpoints.down('sm')]: { height: '140px' },
}))

const TextContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '130px',
  paddingLeft: '16px',
  paddingRight: '16px',
  paddingTop: '20px',
  paddingBottom: '20px',
  gap: '10px',
  [theme.breakpoints.down('md')]: { padding: '16px 14px', height: '140px' },
  [theme.breakpoints.down('sm')]: { padding: '14px 12px', height: '140px' },
}))

const CardTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "'Lato', Arial, sans-serif",
  fontWeight: 800,
  fontSize: '18px',
  color: '#474747',
  width: '100%',
  height: 'auto',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  transition: 'color 0.3s ease-in-out',
  [theme.breakpoints.down('md')]: { fontSize: '16px' },
  [theme.breakpoints.down('sm')]: { fontSize: '14px' },
}))

const CardDate = styled(Typography)(({ theme }) => ({
  fontFamily: "'Lato', Arial, sans-serif",
  fontSize: '13px',
  color: '#474747',
  width: '100%',
  height: 'auto',
  transition: 'color 0.3s ease-in-out',
  [theme.breakpoints.down('md')]: { fontSize: '12px' },
  [theme.breakpoints.down('sm')]: { fontSize: '11px' },
}))

// No nav buttons

const InfografisOther: React.FC<Props> = ({ data, route, title = 'INFOGRAFIS LAINNYA', onLihatSemua }) => {
  const router = useRouter()
  const { textToSpeech } = useTextToSpeech()

  const handleCardClick = (item: schema['schemas']['Article']) => {
    if (item.id && item.slug) router.push(`/id/${route}/${item.id}/${item.slug}`)
  }

  const getImageUrl = (item: schema['schemas']['Article']) => {
    if (!item.feature_image_url) return null
    if (item.feature_image_url.startsWith('http')) return item.feature_image_url
    return imagePath(item.id || 0, item.feature_image_url, false)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const days = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu']
    const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
    const dayName = days[date.getDay()]
    const day = date.getDate()
    const month = months[date.getMonth()]
    const year = date.getFullYear()
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return `${dayName}, ${day} ${month} ${year} | ${diffDays} hari yang lalu`
  }

  return (
    <SectionContainer>
      <ContentWrapper>
        <HeaderContainer>
          <TitleText>{title}</TitleText>
          {onLihatSemua && (
            <LihatSemuaButton onClick={onLihatSemua} aria-label="lihat semua">
              <Box sx={{
                width: '153.05px', height: '39.34px', backgroundColor: '#006462', borderRadius: '20px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px', fontWeight: 'bold', gap: '10px',
              }}>
                <Box component="img" src="/images/icon/nav-view all.svg" alt="lihat semua" sx={{ width: 28, height: 28, display: 'inline-block' }} />
                <span style={{ fontWeight: 700 }}>lihat semua</span>
              </Box>
            </LihatSemuaButton>
          )}
        </HeaderContainer>

        <SliderWrapper>
          <SliderContainer>
            {data?.slice(0, 3).map((item) => (
              <Card key={item.id} onClick={() => handleCardClick(item)}>
                <ImageContainer>
                  {item.feature_image_url ? (
                    <img
                      src={getImageUrl(item) || ''}
                      alt={item.title || ''}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '30px' }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const parent = target.parentElement
                        if (parent) {
                          parent.innerHTML = `
                            <div style="width:100%;height:100%;background-color:#f5f5f5;display:flex;align-items:center;justify-content:center;color:#999;border-radius:30px;font-family:'Lato',Arial,sans-serif;">Gambar tidak tersedia</div>
                          `
                        }
                      }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', borderRadius: '30px', fontFamily: "'Lato', Arial, sans-serif" }}>
                      Gambar tidak tersedia
                    </div>
                  )}
                </ImageContainer>
                <TextContent>
                  <CardTitle className="card-title" onMouseEnter={(e) => textToSpeech(e, true)}>
                    {item.title}
                  </CardTitle>
                  <CardDate className="card-date">{formatDate(item.publish_date || '')}</CardDate>
                </TextContent>
              </Card>
            ))}
          </SliderContainer>
        </SliderWrapper>
      </ContentWrapper>
    </SectionContainer>
  )
}

export default memo(InfografisOther)
