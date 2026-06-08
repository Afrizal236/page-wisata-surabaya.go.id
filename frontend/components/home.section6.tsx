import React, { memo } from 'react'
import {
  Box,
  Skeleton,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { styled } from '@mui/material/styles'
import CarouselContent from 'components/carousel.content'
import { BreakpointsContext } from 'contexts/breakpoints'
import { AccessibilityContext } from 'contexts/accessibility'
import schema from 'types/schemas'

interface Props {}

const BoxStyled = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  // backgroundColor: theme.palette.background.paper,
  borderRadius: 0,
  padding: theme.spacing(6, 0, 0, 0),
  margin: 0,
  minHeight: 420,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  '& .MuiGrid-container': {
    position: 'relative',
    zIndex: 1,
  },
  [theme.breakpoints.down('sm')]: {
    margin: 0,
    padding: theme.spacing(3, 0, 0, 0),
    '& .slick-arrow': {
      display: 'none',
    },
  },
}))

const HomeSection6: React.FunctionComponent<Props> = () => {
  // List of YouTube video links (updated with user's links)
  const videoLinks = [
    'https://www.youtube.com/embed/k5ofLiNDp_0',
    'https://www.youtube.com/embed/mx-shqeA5b8',
    'https://www.youtube.com/embed/XWu3BXD0U7Q',
  ]
  // State for video meta: title, publish date, thumbnail
  const [videoMeta, setVideoMeta] = React.useState<{title: string, date: string, thumbnail: string}[]>(Array(3).fill({title: '', date: '', thumbnail: ''}))
  React.useEffect(() => {
    async function fetchMeta() {
      const getMeta = async (url: string) => {
        const videoId = url.split('/embed/')[1]
        try {
          const res = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`)
          const data = await res.json()
          // Get thumbnail
          const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
          // Get publish date
          let date = ''
          if (data.upload_date) {
            date = data.upload_date // format: YYYY-MM-DD
          }
          return { title: data.title || 'Video', date, thumbnail }
        } catch {
          return { title: 'Video', date: '', thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` }
        }
      }
      const promises = videoLinks.map(getMeta)
      const results = await Promise.all(promises)
      setVideoMeta(results)
    }
    fetchMeta()
  }, [])
  // Helper to format date as 'Day, DD Month YYYY'
  function formatDate(dateStr: string) {
    if (!dateStr) return ''
    const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
    const days = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu']
    const d = new Date(dateStr)
    const dayName = days[d.getDay()]
    const day = d.getDate()
    const month = months[d.getMonth()]
    const year = d.getFullYear()
    return `${dayName}, ${day} ${month} ${year}`
  }
  // Helper to get 'X hari yang lalu'
  function getTimeAgo(dateStr: string) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    const now = new Date()
    const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
    return `${diff} hari yang lalu`
  }
  const { downSm } = React.useContext(BreakpointsContext)
  const accessibility = React.useContext(AccessibilityContext)
  const loading = false
  const { data } = useQuery<{ data: schema['schemas']['Article'][] }>(['home_videos'])
  
  return (
    <BoxStyled
      sx={{
        filter: `grayscale(${accessibility.css.grayscale ? '100%' : '0'})`,
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: { xs: 1, md: 0 }, pb: 0, width: '100%', maxWidth: 1100 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img
            src="/images/icon/icon_batik_coklat_kiri.svg"
            alt="icon_batik"
            style={{ width: 32, height: 32, marginRight: 12, display: 'block' }}
          />
                    <Box component="span" sx={(theme) => ({ color: theme.palette.text.primary, fontSize: 28 + accessibility.fontSize * 2, fontWeight: 600, letterSpacing: 1, lineHeight: 1 })}>
                                                VIDEO
                                              </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <button
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
              fontSize: 15,
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              transition: 'background 0.2s, color 0.2s',
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = '#C7A97A'
              e.currentTarget.style.color = '#fff'
              const svg = e.currentTarget.querySelector('svg path')
              if (svg) svg.setAttribute('fill', '#fff')
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = '#fff'
              e.currentTarget.style.color = '#C7A97A'
              const svg = e.currentTarget.querySelector('svg path')
              if (svg) svg.setAttribute('fill', '#C7A97A')
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ display: 'inline', verticalAlign: 'middle' }}>
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5zm0 12c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-7A2.5 2.5 0 1 0 12 16a2.5 2.5 0 0 0 0-5z" fill="#C7A97A"/>
            </svg>
            Lihat Semua
          </button>
        </Box>
      </Box>
      <Box sx={{ px: { xs: 3, md: 2 }, pt: 4, width: '100%', maxWidth: 1100, mx: 'auto', position: 'relative' }}>
        {/* 3 YouTube video cards with overlayed title and publish date */}
        <Box display="flex" gap={3} justifyContent="center">
          {videoLinks.map((link, i) => {
            const meta = videoMeta[i] || { title: '', date: '', thumbnail: '' }
            return (
              <Box key={i} sx={{
                width: { xs: '100%', sm: '48%', md: '32%' },
                maxWidth: 340,
                height: 220,
                position: 'relative',
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
                background: '#000',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
              }}>
                {/* Visible YouTube iframe */}
                <iframe
                  width="100%"
                  height="100%"
                  src={link}
                  title={meta.title || `Video ${i + 1}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ display: 'block', border: 0, borderRadius: 'inherit', minHeight: 180, maxHeight: 220 }}
                />
                {/* Overlay for title and date */}
                <Box sx={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  p: 2,
                  background: 'linear-gradient(0deg, rgba(0,0,0,0.7) 80%, rgba(0,0,0,0.2) 100%)',
                  color: '#fff',
                  zIndex: 2,
                }}>
                  <Box sx={{ fontWeight: 700, fontSize: 18, lineHeight: 1.2, mb: 0.5, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {meta.title}
                  </Box>
                  <Box sx={{ fontSize: 14, opacity: 0.9 }}>
                    {meta.date ? `${formatDate(meta.date)} | ${getTimeAgo(meta.date)}` : ''}
                  </Box>
                </Box>
              </Box>
            )
          })}
        </Box>
      </Box>
    </BoxStyled>
  )
}

HomeSection6.defaultProps = {}

export default memo(HomeSection6)
