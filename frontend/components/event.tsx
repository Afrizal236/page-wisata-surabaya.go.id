import React, { memo, useRef } from 'react'
import { Box, Typography, Card, CardContent, CardMedia, Chip, IconButton, Button, Alert, useTheme } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { BreakpointsContext } from 'contexts/breakpoints'
import { AccessibilityContext } from 'contexts/accessibility'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import VisibilityIcon from '@mui/icons-material/Visibility'
import RefreshIcon from '@mui/icons-material/Refresh'
import { getEvents, Event } from 'utils/services/event'

interface Props {}

const formatDateTimeRange = (startDate: string, endDate: string): string => {
  const start = new Date(startDate)
  const end = new Date(endDate)

  const formatDateTime = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${day}/${month}/${year} ${hours}:${minutes}`
  }

  return `${formatDateTime(start)} – ${formatDateTime(end)}`
}

const CountdownTimer: React.FC<{ startDate: string }> = ({ startDate }) => {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'
  
  const [timeLeft, setTimeLeft] = React.useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  React.useEffect(() => {
    const calculateTimeLeft = () => {
      const start = new Date(startDate).getTime()
      const now = new Date().getTime()
      const difference = start - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [startDate])

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: 'rgba(0, 100, 98, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(2px)',
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Typography 
          sx={{ 
            color: '#fff', 
            fontSize: 11, 
            fontWeight: 700, 
            mb: 1, 
            textTransform: 'uppercase', 
            letterSpacing: 1,
          }}
        >
          Dimulai dalam
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              sx={{ 
                color: '#fff', 
                fontSize: 20, 
                fontWeight: 700, 
                fontFamily: 'monospace',
              }}
            >
              {String(timeLeft.days).padStart(2, '0')}
            </Typography>
            <Typography 
              sx={{ 
                color: '#C7A97A', 
                fontSize: 9, 
                fontWeight: 600,
              }}
            >
              hari
            </Typography>
          </Box>
          <Typography 
            sx={{ 
              color: '#fff', 
              fontSize: 20, 
              fontWeight: 700, 
              mt: 0.5,
            }}
          >
            :
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              sx={{ 
                color: '#fff', 
                fontSize: 20, 
                fontWeight: 700, 
                fontFamily: 'monospace',
              }}
            >
              {String(timeLeft.hours).padStart(2, '0')}
            </Typography>
            <Typography 
              sx={{ 
                color: '#C7A97A', 
                fontSize: 9, 
                fontWeight: 600,
              }}
            >
              jam
            </Typography>
          </Box>
          <Typography 
            sx={{ 
              color: '#fff', 
              fontSize: 20, 
              fontWeight: 700, 
              mt: 0.5,
            }}
          >
            :
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              sx={{ 
                color: '#fff', 
                fontSize: 20, 
                fontWeight: 700, 
                fontFamily: 'monospace',
              }}
            >
              {String(timeLeft.minutes).padStart(2, '0')}
            </Typography>
            <Typography 
              sx={{ 
                color: '#C7A97A', 
                fontSize: 9, 
                fontWeight: 600,
              }}
            >
              menit
            </Typography>
          </Box>
          <Typography 
            sx={{ 
              color: '#fff', 
              fontSize: 20, 
              fontWeight: 700, 
              mt: 0.5,
            }}
          >
            :
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              sx={{ 
                color: '#fff', 
                fontSize: 20, 
                fontWeight: 700, 
                fontFamily: 'monospace',
              }}
            >
              {String(timeLeft.seconds).padStart(2, '0')}
            </Typography>
            <Typography 
              sx={{ 
                color: '#C7A97A', 
                fontSize: 9, 
                fontWeight: 600,
              }}
            >
              detik
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

const EventContent: React.FunctionComponent<Props> = () => {
  const { downSm } = React.useContext(BreakpointsContext)
  const accessibility = React.useContext(AccessibilityContext)
  const router = useRouter()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['events'],
    queryFn: () => {
      console.log('🎯 React Query: Starting fetch...')
      return getEvents(1)
    },
    retry: 3,
    retryDelay: 1000,
    staleTime: 1000 * 60 * 5,
  })

  const upcomingEvents = React.useMemo(() => {
    console.log('🔄 Computing upcomingEvents...')
    
    if (!data?.data?.data) {
      console.log('⚠️ No data.data.data available')
      return []
    }

    console.log('📦 Raw events data:', data.data.data.length, 'events')

    const now = new Date()
    now.setHours(0, 0, 0, 0)

    const futureEvents = data.data.data.filter((event: Event) => {
      const endDate = new Date(event.endDate)
      endDate.setHours(0, 0, 0, 0)
      return endDate >= now
    })

    console.log('🔮 Future events:', futureEvents.length, 'events')

    const sorted = futureEvents.sort((a: Event, b: Event) => {
      const dateA = new Date(a.startDate).getTime()
      const dateB = new Date(b.startDate).getTime()
      return dateA - dateB
    })

    const result = sorted.slice(0, 8)
    console.log('🎯 Upcoming events (top 8):', result.length, 'events')
    
    return result
  }, [data])

  const isUpcomingEvent = (startDate: string): boolean => {
    const now = new Date()
    const start = new Date(startDate)
    return start > now
  }

  const handleEventClick = (eventId: string) => {
    router.push(`/wisata/event/${eventId}`)
  }

  const handleViewAll = () => {
    router.push('/wisata/events')
  }

  const handleRetry = () => {
    console.log('🔄 Manual retry triggered')
    refetch()
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = downSm ? 304 : 344
      const newScrollLeft = direction === 'left'
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      })
    }
  }

  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(true)

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  React.useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollPosition)
      checkScrollPosition()
      return () => container.removeEventListener('scroll', checkScrollPosition)
    }
  }, [upcomingEvents])

  // Loading state
  if (isLoading) {
    return (
      <Box sx={{
        width: '100%',
        maxWidth: 1200,
        mx: 'auto',
        mt: downSm ? 3 : 5,
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          mb: downSm ? 3 : 4,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <img
              src="/images/icon/icon_batik_coklat_kiri.svg"
              alt="icon_batik"
              style={{ 
                width: downSm ? 24 : 32, 
                height: downSm ? 24 : 32, 
                marginRight: downSm ? 8 : 12, 
                display: 'block',
              }}
            />
            <Typography 
              variant="h4" 
              sx={{ 
                color: '#006462',
                fontSize: downSm ? 20 : 32 + accessibility.fontSize * 2,
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              EVENT SURABAYA
            </Typography>
          </Box>
        </Box>
        <Box sx={{ 
          textAlign: 'center', 
          py: 4,
          bgcolor: isDarkMode ? '#1A5555' : 'rgba(255, 255, 255, 0.95)',
          borderRadius: 3,
          backdropFilter: 'blur(10px)',
        }}>
          <Typography sx={{ color: '#006462', fontSize: 16 }}>
            ⏳ Memuat event...
          </Typography>
        </Box>
      </Box>
    )
  }

  // Error state
  if (isError) {
    return (
      <Box sx={{
        width: '100%',
        maxWidth: 1200,
        mx: 'auto',
        mt: downSm ? 3 : 5,
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          mb: downSm ? 3 : 4,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <img
              src="/images/icon/icon_batik_coklat_kiri.svg"
              alt="icon_batik"
              style={{ 
                width: downSm ? 24 : 32, 
                height: downSm ? 24 : 32, 
                marginRight: downSm ? 8 : 12, 
                display: 'block',
              }}
            />
            <Typography 
              variant="h4" 
              sx={{ 
                color: '#006462',
                fontSize: downSm ? 20 : 32 + accessibility.fontSize * 2,
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              EVENT SURABAYA
            </Typography>
          </Box>
        </Box>
        <Box sx={{ 
          py: 4,
          bgcolor: isDarkMode ? '#1A5555' : 'rgba(255, 255, 255, 0.95)',
          borderRadius: 3,
          backdropFilter: 'blur(10px)',
          px: 3,
        }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              ⚠️ Gagal memuat event
            </Typography>
            <Typography variant="body2">
              {error instanceof Error ? error.message : 'Terjadi kesalahan saat memuat data event'}
            </Typography>
          </Alert>
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={handleRetry}
              sx={{
                bgcolor: '#006462',
                color: '#fff',
                '&:hover': { 
                  bgcolor: '#00504E',
                },
              }}
            >
              Coba Lagi
            </Button>
          </Box>
        </Box>
      </Box>
    )
  }

  // Empty state
  if (!upcomingEvents || upcomingEvents.length === 0) {
    return null
  }

  return (
    <Box sx={{
      width: '100%',
      maxWidth: 1200,
      mx: 'auto',
      mt: downSm ? 3 : 5,
    }}>
      {/* Header Section */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        mb: downSm ? 3 : 4,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img
            src="/images/icon/icon_batik_coklat_kiri.svg"
            alt="icon_batik"
            style={{ 
              width: downSm ? 24 : 32, 
              height: downSm ? 24 : 32, 
              marginRight: downSm ? 8 : 12, 
              display: 'block',
            }}
          />
          <Typography 
            variant="h4" 
            sx={{ 
              color: '#006462',
              fontSize: downSm ? 20 : 32 + accessibility.fontSize * 2,
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            EVENT SURABAYA
          </Typography>
        </Box>
        
        <Button
          endIcon={<VisibilityIcon />}
          onClick={handleViewAll}
          sx={{
            bgcolor: '#006462',
            color: '#fff',
            border: 'none',
            borderRadius: 999,
            px: 3,
            py: 1,
            fontWeight: 600,
            fontSize: 14,
            boxShadow: '0 4px 12px rgba(0, 100, 98, 0.3)',
            textTransform: 'none',
            '&:hover': {
              bgcolor: '#00504E',
              boxShadow: '0 6px 20px rgba(0, 100, 98, 0.4)',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.2s',
          }}
        >
          Lihat Semua
        </Button>
      </Box>

      {/* Carousel Container */}
      <Box sx={{ position: 'relative' }}>
        {!downSm && (
          <>
            <IconButton
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              sx={{
                position: 'absolute',
                left: -20,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                bgcolor: canScrollLeft ? '#006462' : 'rgba(0, 100, 98, 0.3)',
                color: '#fff',
                '&:hover': {
                  bgcolor: canScrollLeft ? '#00504E' : 'rgba(0, 100, 98, 0.3)',
                  transform: canScrollLeft ? 'translateY(-50%) scale(1.1)' : 'translateY(-50%)',
                },
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                cursor: canScrollLeft ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              sx={{
                position: 'absolute',
                right: -20,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                bgcolor: canScrollRight ? '#006462' : 'rgba(0, 100, 98, 0.3)',
                color: '#fff',
                '&:hover': {
                  bgcolor: canScrollRight ? '#00504E' : 'rgba(0, 100, 98, 0.3)',
                  transform: canScrollRight ? 'translateY(-50%) scale(1.1)' : 'translateY(-50%)',
                },
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                cursor: canScrollRight ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </>
        )}

        <Box
          ref={scrollContainerRef}
          sx={{
            display: 'flex',
            gap: 3,
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            pb: 2,
            '&::-webkit-scrollbar': {
              height: 8,
            },
            '&::-webkit-scrollbar-track': {
              bgcolor: 'rgba(0, 100, 98, 0.1)',
              borderRadius: 4,
            },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: '#006462',
              borderRadius: 4,
              '&:hover': {
                bgcolor: '#00504E',
              },
            },
          }}
        >
          {upcomingEvents.map((event: Event) => (
            <Card 
              key={event.id}
              onClick={() => handleEventClick(event.id)}
              sx={{
                minWidth: downSm ? 280 : 320,
                maxWidth: downSm ? 280 : 320,
                flexShrink: 0,
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                bgcolor: isDarkMode ? '#1A5555' : '#fff',
                border: `2px solid ${isDarkMode ? 'rgba(199, 169, 122, 0.3)' : 'rgba(0, 100, 98, 0.15)'}`,
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 40px rgba(0, 100, 98, 0.25)',
                  borderColor: '#006462',
                },
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height={downSm ? 180 : 200}
                  image={event.eventThumbnail}
                  alt={event.nameIndonesia}
                  sx={{
                    objectFit: 'cover',
                  }}
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    e.currentTarget.src = '/images/placeholder-event.jpg'
                  }}
                />
                {isUpcomingEvent(event.startDate) && (
                  <CountdownTimer startDate={event.startDate} />
                )}
              </Box>
              <CardContent sx={{ p: 3, bgcolor: isDarkMode ? '#1A5555' : '#fff' }}>
                {/* Event Title */}
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: isDarkMode ? '#fff' : '#1A1A1A',
                    fontSize: 17 + accessibility.fontSize,
                    fontWeight: 700,
                    mb: 2,
                    minHeight: 50,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {event.nameIndonesia}
                </Typography>

                {/* Organizer Chip */}
                <Chip 
                  label={event.organizer}
                  size="small"
                  sx={{
                    bgcolor: isDarkMode ? 'rgba(229, 200, 150, 0.2)' : 'rgba(199, 169, 122, 0.15)',
                    color:   isDarkMode ? '#E5C896'          : '#8B6E3E',
                    fontWeight: 600,
                    fontSize: 11,
                    mb: 1.5,
                    border:  isDarkMode ? 'rgba(229, 200, 150, 0.4)' : 'rgba(199, 169, 122, 0.3)',
                  }}
                />

                {/* Date Info Box */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: 1, 
                  mb: 1.5,
                  bgcolor: isDarkMode ? 'rgba(199, 169, 122, 0.15)' : 'rgba(0, 100, 98, 0.08)',
                  p: 1.5,
                  borderRadius: 2,
                  border: `1px solid ${isDarkMode ? 'rgba(199, 169, 122, 0.3)' : 'rgba(0, 100, 98, 0.2)'}`,
                }}>
                  <CalendarTodayIcon 
                    sx={{ 
                      fontSize: 18, 
                      color: '#C7A97A', 
                      mt: 0.2, 
                      flexShrink: 0,
                    }} 
                  />
                  <Typography 
                    sx={{ 
                      color: isDarkMode ? '#fff' : '#006462',
                      fontSize: 11, 
                      lineHeight: 1.5, 
                      fontWeight: 600,
                    }}
                  >
                    {formatDateTimeRange(event.startDate, event.endDate)}
                  </Typography>
                </Box>

                {/* Location Info Box */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: 1,
                  bgcolor: isDarkMode ? 'rgba(199, 169, 122, 0.15)' : 'rgba(0, 100, 98, 0.08)',
                  p: 1.5,
                  borderRadius: 2,
                  border: `1px solid ${isDarkMode ? 'rgba(199, 169, 122, 0.3)' : 'rgba(0, 100, 98, 0.2)'}`,
                }}>
                  <LocationOnIcon 
                    sx={{ 
                      fontSize: 18, 
                      color: '#C7A97A', 
                      mt: 0.2, 
                      flexShrink: 0,
                    }} 
                  />
                  <Typography 
                    sx={{ 
                      color: isDarkMode ? '#fff' : '#006462',
                      fontSize: 12, 
                      fontWeight: 500, 
                      display: '-webkit-box', 
                      WebkitLineClamp: 2, 
                      WebkitBoxOrient: 'vertical', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      lineHeight: 1.4,
                    }}
                  >
                    {event.address}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

EventContent.defaultProps = {}

export default memo(EventContent)