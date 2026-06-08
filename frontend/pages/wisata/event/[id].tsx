import React from 'react'
import { Box, Typography, Chip, Button, Divider, Alert, CircularProgress, useTheme } from '@mui/material'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { BreakpointsContext } from 'contexts/breakpoints'
import { AccessibilityContext } from 'contexts/accessibility'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PersonIcon from '@mui/icons-material/Person'
import MapIcon from '@mui/icons-material/Map'
import RefreshIcon from '@mui/icons-material/Refresh'
import { getEventDetail, getEvents } from 'utils/services/event'

const EventDetailPage: React.FunctionComponent = () => {
  const router = useRouter()
  const { id } = router.query
  const { downSm } = React.useContext(BreakpointsContext)
  const accessibility = React.useContext(AccessibilityContext)
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'

  const { data, isLoading, isError, error, refetch } = useQuery(
    ['event-detail', id],
    () => getEventDetail(id as string),
    {
      enabled: !!id,
      retry: 1,
      retryDelay: 1000,
    }
  )

  const { data: eventsData } = useQuery(
    ['events-fallback', id],
    () => getEvents(1),
    {
      enabled: !!id && isError,
      retry: 2,
    }
  )

  const event = React.useMemo(() => {
    if (data?.data) {
      return data.data
    }
    
    if (eventsData?.data?.data && id) {
      return eventsData.data.data.find(e => e.id === id)
    }
    
    return null
  }, [data, eventsData, id])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long',
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    return date.toLocaleDateString('id-ID', options)
  }

  const openInGoogleMaps = () => {
    if (event) {
      const url = `https://www.google.com/maps/search/?api=1&query=${event.latitude},${event.longitude}`
      window.open(url, '_blank')
    }
  }

  const handleRefresh = () => {
    refetch()
  }

  return (
    <Box sx={{
      backgroundImage: 'url(/images/bg-batik.svg)', 
      backgroundSize: '100% auto',
      backgroundPosition: 'top center',
      backgroundRepeat: 'repeat-y',
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      mt: '-90px',
      pt: '120px',
      px: downSm ? 2 : 4,
      pb: downSm ? 4 : 8,
      overflow: 'hidden',
    }}>
      <Box sx={{
        width: '100%',
        maxWidth: 1000,
        mx: 'auto',
      }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
          sx={{
            mb: 3,
            color: '#fff',
            fontWeight: 600,
            bgcolor: '#006462',
            px: 3,
            py: 1,
            borderRadius: 999,
            boxShadow: '0 4px 12px rgba(0, 100, 98, 0.3)',
            '&:hover': {
              bgcolor: '#00504E',
              boxShadow: '0 6px 20px rgba(0, 100, 98, 0.4)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          Kembali
        </Button>

        {isLoading ? (
          <Box sx={{
            bgcolor: isDarkMode ? '#1A5555' : 'rgba(255, 255, 255, 0.95)',
            borderRadius: 4,
            p: downSm ? 3 : 5,
            backdropFilter: 'blur(10px)',
            textAlign: 'center',
            boxShadow: isDarkMode ? '0 8px 32px rgba(0, 0, 0, 0.4)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: isDarkMode ? '2px solid rgba(199, 169, 122, 0.3)' : 'none',
          }}>
            <CircularProgress sx={{ color: isDarkMode ? '#C7A97A' : '#006462', mb: 2 }} />
            <Typography sx={{ color: isDarkMode ? '#fff' : 'inherit' }}>Memuat detail event...</Typography>
          </Box>
        ) : !event ? (
          <Box sx={{
            bgcolor: isDarkMode ? '#1A5555' : 'rgba(255, 255, 255, 0.95)',
            borderRadius: 4,
            p: downSm ? 3 : 5,
            backdropFilter: 'blur(10px)',
            boxShadow: isDarkMode ? '0 8px 32px rgba(0, 0, 0, 0.4)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: isDarkMode ? '2px solid rgba(199, 169, 122, 0.3)' : 'none',
          }}>
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                bgcolor: isDarkMode ? 'rgba(211, 47, 47, 0.2)' : undefined,
                color: isDarkMode ? '#fff' : undefined,
                '& .MuiAlert-icon': {
                  color: isDarkMode ? '#ff6b6b' : undefined,
                },
              }}
            >
              <Typography variant="h6" mb={1} sx={{ color: isDarkMode ? '#fff' : 'inherit' }}>
                Event tidak ditemukan
              </Typography>
              <Typography variant="body2" sx={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'inherit' }}>
                {error instanceof Error ? error.message : 'Gagal memuat data event. Periksa koneksi internet Anda.'}
              </Typography>
            </Alert>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                sx={{
                  bgcolor: '#C7A97A',
                  '&:hover': { bgcolor: '#B89968' },
                }}
              >
                Coba Lagi
              </Button>
              <Button
                variant="contained"
                onClick={() => router.back()}
                sx={{
                  bgcolor: '#006462',
                  '&:hover': { bgcolor: '#00504E' },
                }}
              >
                Kembali
              </Button>
              <Button
                variant="outlined"
                onClick={() => router.push('/wisata/events')}
                sx={{
                  borderColor: isDarkMode ? '#C7A97A' : '#006462',
                  color: isDarkMode ? '#C7A97A' : '#006462',
                  '&:hover': {
                    borderColor: isDarkMode ? '#E5C896' : '#00504E',
                    bgcolor: isDarkMode ? 'rgba(199, 169, 122, 0.1)' : 'rgba(0, 100, 98, 0.05)',
                  },
                }}
              >
                Lihat Semua Event
              </Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{
            bgcolor: isDarkMode ? '#1A5555' : 'rgba(255, 255, 255, 0.95)',
            borderRadius: 4,
            overflow: 'hidden',
            backdropFilter: 'blur(10px)',
            boxShadow: isDarkMode ? '0 8px 32px rgba(0, 0, 0, 0.4)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: isDarkMode ? '2px solid rgba(199, 169, 122, 0.3)' : 'none',
          }}>
            {/* Event Image */}
            <Box
              component="img"
              src={event.eventThumbnail}
              alt={event.nameIndonesia}
              sx={{
                width: '100%',
                height: downSm ? 250 : 450,
                objectFit: 'cover',
              }}
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.src = '/images/placeholder-event.jpg'
              }}
            />

            {/* Event Details */}
            <Box sx={{ p: downSm ? 3 : 5 }}>
              {/* Title */}
              <Typography 
                variant="h4" 
                sx={{ 
                  color: isDarkMode ? '#C7A97A' : '#006462',
                  fontSize: downSm ? 24 : 36 + accessibility.fontSize * 2,
                  fontWeight: 700,
                  mb: 2,
                  lineHeight: 1.3,
                }}
              >
                {event.nameIndonesia}
              </Typography>

              {/* Organizer Chip */}
              <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  icon={<PersonIcon sx={{ fontSize: 18 }} />}
                  label={event.organizer}
                  sx={{
                    bgcolor: isDarkMode ? 'rgba(229, 200, 150, 0.2)' : 'rgba(0, 100, 98, 0.1)',
                    color: isDarkMode ? '#E5C896' : '#006462',
                    fontWeight: 600,
                    fontSize: 14,
                    px: 1,
                    py: 2.5,
                    border: isDarkMode ? '1px solid rgba(229, 200, 150, 0.3)' : 'none',
                  }}
                />
              </Box>

              <Divider sx={{ 
                mb: 3,
                borderColor: isDarkMode ? 'rgba(199, 169, 122, 0.3)' : undefined,
              }} />

              {/* Date Section */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: 2, 
                mb: 3, 
                bgcolor: isDarkMode ? 'rgba(199, 169, 122, 0.15)' : 'rgba(199, 169, 122, 0.05)', 
                p: 2.5, 
                borderRadius: 2,
                border: isDarkMode ? '1px solid rgba(199, 169, 122, 0.3)' : 'none',
              }}>
                <CalendarTodayIcon sx={{ fontSize: 28, color: isDarkMode ? '#E5C896' : '#C7A97A', mt: 0.5 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography 
                    sx={{ 
                      color: isDarkMode ? '#fff' : '#006462',
                      fontSize: downSm ? 15 : 17,
                      fontWeight: 700,
                      mb: 1,
                    }}
                  >
                    Tanggal & Waktu Event
                  </Typography>
                  <Typography 
                    sx={{ 
                      color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'text.secondary',
                      fontSize: downSm ? 14 : 16,
                      mb: 0.5,
                    }}
                  >
                    <strong>Mulai:</strong> {formatDate(event.startDate)}
                  </Typography>
                  {event.startDate !== event.endDate && (
                    <Typography 
                      sx={{ 
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'text.secondary',
                        fontSize: downSm ? 14 : 16,
                      }}
                    >
                      <strong>Selesai:</strong> {formatDate(event.endDate)}
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Location Section */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: 2, 
                mb: 3, 
                bgcolor: isDarkMode ? 'rgba(199, 169, 122, 0.15)' : 'rgba(199, 169, 122, 0.05)', 
                p: 2.5, 
                borderRadius: 2,
                border: isDarkMode ? '1px solid rgba(199, 169, 122, 0.3)' : 'none',
              }}>
                <LocationOnIcon sx={{ fontSize: 28, color: isDarkMode ? '#E5C896' : '#C7A97A', mt: 0.5 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography 
                    sx={{ 
                      color: isDarkMode ? '#fff' : '#006462',
                      fontSize: downSm ? 15 : 17,
                      fontWeight: 700,
                      mb: 1,
                    }}
                  >
                    Lokasi Event
                  </Typography>
                  <Typography 
                    sx={{ 
                      color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'text.secondary',
                      fontSize: downSm ? 14 : 16,
                      mb: 2,
                    }}
                  >
                    {event.address}
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<MapIcon />}
                    onClick={openInGoogleMaps}
                    size="small"
                    sx={{
                      borderColor: '#C7A97A',
                      color: '#C7A97A',
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: '#C7A97A',
                        bgcolor: 'rgba(199, 169, 122, 0.1)',
                      },
                    }}
                  >
                    Buka di Google Maps
                  </Button>
                </Box>
              </Box>

              <Divider sx={{ 
                my: 3,
                borderColor: isDarkMode ? 'rgba(199, 169, 122, 0.3)' : undefined,
              }} />

              {/* Description */}
              <Box>
                <Typography 
                  sx={{ 
                    color: isDarkMode ? '#C7A97A' : '#006462',
                    fontSize: downSm ? 17 : 20,
                    fontWeight: 700,
                    mb: 2,
                  }}
                >
                  Deskripsi Event
                </Typography>
                <Typography 
                  sx={{ 
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'text.secondary',
                    fontSize: downSm ? 14 : 16,
                    lineHeight: 1.9,
                    textAlign: 'justify',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {event.descriptionIndonesia}
                </Typography>
              </Box>

              {/* Google Maps Embed */}
              {event.latitude && event.longitude && (
                <Box sx={{ mt: 4 }}>
                  <Typography 
                    sx={{ 
                      color: isDarkMode ? '#C7A97A' : '#006462',
                      fontSize: downSm ? 17 : 20,
                      fontWeight: 700,
                      mb: 2,
                    }}
                  >
                    Peta Lokasi
                  </Typography>
                  <Box 
                    sx={{ 
                      width: '100%', 
                      height: downSm ? 300 : 450,
                      borderRadius: 3,
                      overflow: 'hidden',
                      border: isDarkMode ? '2px solid rgba(199, 169, 122, 0.3)' : '2px solid rgba(0, 100, 98, 0.2)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    }}
                  >
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      style={{ border: 0 }}
                      src={`https://maps.google.com/maps?q=${event.latitude},${event.longitude}&t=m&z=16&output=embed&iwloc=near`}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </Box>
                  <Typography 
                    sx={{ 
                      color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'text.secondary',
                      fontSize: 12,
                      mt: 1,
                      fontStyle: 'italic',
                      textAlign: 'center',
                    }}
                  >
                    📍 {event.address} • Koordinat: {event.latitude}, {event.longitude}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default EventDetailPage