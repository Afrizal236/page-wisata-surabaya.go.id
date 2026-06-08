import React from 'react'
import { Box, Typography, Grid, Card, CardContent, CardMedia, Chip, Button, Pagination, TextField, InputAdornment, FormControl, Select, MenuItem, SelectChangeEvent, useTheme } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { BreakpointsContext } from 'contexts/breakpoints'
import { AccessibilityContext } from 'contexts/accessibility'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import { getEvents, Event, EVENT_CATEGORIES } from 'utils/services/event'

const ITEMS_PER_PAGE = 9

// Helper function untuk format tanggal
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

// Component untuk countdown timer dengan warna konsisten
const CountdownTimer: React.FC<{ startDate: string; downSm?: boolean }> = ({ startDate, downSm }) => {
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
            fontSize: downSm ? 10 : 12,
            fontWeight: 700,
            mb: 1,
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          Dimulai dalam
        </Typography>
        <Box sx={{ display: 'flex', gap: downSm ? 0.5 : 1, justifyContent: 'center' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              sx={{
                color: '#fff',
                fontSize: downSm ? 16 : 22,
                fontWeight: 700,
                fontFamily: 'monospace',
              }}
            >
              {String(timeLeft.days).padStart(2, '0')}
            </Typography>
            <Typography sx={{ color: '#C7A97A', fontSize: downSm ? 8 : 10, fontWeight: 600 }}>
              hari
            </Typography>
          </Box>
          <Typography sx={{ color: '#fff', fontSize: downSm ? 16 : 22, fontWeight: 700, mt: 0.5 }}>:</Typography>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              sx={{
                color: '#fff',
                fontSize: downSm ? 16 : 22,
                fontWeight: 700,
                fontFamily: 'monospace',
              }}
            >
              {String(timeLeft.hours).padStart(2, '0')}
            </Typography>
            <Typography sx={{ color: '#C7A97A', fontSize: downSm ? 8 : 10, fontWeight: 600 }}>
              jam
            </Typography>
          </Box>
          <Typography sx={{ color: '#fff', fontSize: downSm ? 16 : 22, fontWeight: 700, mt: 0.5 }}>:</Typography>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              sx={{
                color: '#fff',
                fontSize: downSm ? 16 : 22,
                fontWeight: 700,
                fontFamily: 'monospace',
              }}
            >
              {String(timeLeft.minutes).padStart(2, '0')}
            </Typography>
            <Typography sx={{ color: '#C7A97A', fontSize: downSm ? 8 : 10, fontWeight: 600 }}>
              menit
            </Typography>
          </Box>
          <Typography sx={{ color: '#fff', fontSize: downSm ? 16 : 22, fontWeight: 700, mt: 0.5 }}>:</Typography>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              sx={{
                color: '#fff',
                fontSize: downSm ? 16 : 22,
                fontWeight: 700,
                fontFamily: 'monospace',
              }}
            >
              {String(timeLeft.seconds).padStart(2, '0')}
            </Typography>
            <Typography sx={{ color: '#C7A97A', fontSize: downSm ? 8 : 10, fontWeight: 600 }}>
              detik
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

const AllEventsPage: React.FunctionComponent = () => {
  const { downSm } = React.useContext(BreakpointsContext)
  const accessibility = React.useContext(AccessibilityContext)
  const router = useRouter()
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'
  const [page, setPage] = React.useState(1)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all')
  const [currentPage, setCurrentPage] = React.useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['all-events', page],
    queryFn: () => getEvents(page),
    retry: 3,
    staleTime: 1000 * 60 * 5,
  })

  // Filter and categorize all events
  const categorizedEvents = React.useMemo(() => {
    if (!data?.data?.data) return { ongoing: [], upcoming: [], past: [] }
    
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    
    let events = data.data.data

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      events = events.filter((event: Event) =>
        event.nameIndonesia.toLowerCase().includes(query) ||
        event.organizer.toLowerCase().includes(query) ||
        event.address.toLowerCase().includes(query) ||
        event.descriptionIndonesia.toLowerCase().includes(query)
      )
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      events = events.filter((event: Event) => {
        try {
          const categories = JSON.parse(event.idKategoriEvent)
          return categories.includes(parseInt(selectedCategory))
        } catch {
          return false
        }
      })
    }

    // Categorize by event status
    const ongoing: Event[] = []
    const upcoming: Event[] = []
    const past: Event[] = []

    events.forEach((event: Event) => {
      const startDate = new Date(event.startDate)
      const endDate = new Date(event.endDate)
      startDate.setHours(0, 0, 0, 0)
      endDate.setHours(23, 59, 59, 999)

      if (now >= startDate && now <= endDate) {
        ongoing.push(event)
      } else if (now < startDate) {
        upcoming.push(event)
      } else {
        past.push(event)
      }
    })

    return { ongoing, upcoming, past }
  }, [data, searchQuery, selectedCategory])

  // Combine and paginate all events
  const allFilteredEvents = React.useMemo(() => {
    return [
      ...categorizedEvents.ongoing,
      ...categorizedEvents.upcoming,
      ...categorizedEvents.past
    ]
  }, [categorizedEvents])

  const totalEvents = allFilteredEvents.length
  const totalPages = Math.ceil(totalEvents / ITEMS_PER_PAGE)

  const paginatedEvents = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return allFilteredEvents.slice(startIndex, endIndex)
  }, [allFilteredEvents, currentPage])

  // Re-categorize paginated events
  const paginatedCategorized = React.useMemo(() => {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    
    const ongoing: Event[] = []
    const upcoming: Event[] = []
    const past: Event[] = []

    paginatedEvents.forEach((event: Event) => {
      const startDate = new Date(event.startDate)
      const endDate = new Date(event.endDate)
      startDate.setHours(0, 0, 0, 0)
      endDate.setHours(23, 59, 59, 999)

      if (now >= startDate && now <= endDate) {
        ongoing.push(event)
      } else if (now < startDate) {
        upcoming.push(event)
      } else {
        past.push(event)
      }
    })

    return { ongoing, upcoming, past }
  }, [paginatedEvents])

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategory])

  // Check if event is upcoming (not started yet)
  const isUpcomingEvent = (startDate: string): boolean => {
    const now = new Date()
    const start = new Date(startDate)
    return start > now
  }

  const handleEventClick = (eventId: string) => {
    router.push(`/wisata/event/${eventId}`)
  }

  const handlePaginationChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value)
    window.scrollTo({ top: 400, behavior: 'smooth' })
  }

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setSelectedCategory(event.target.value)
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
  }

  const renderEventCard = (event: Event, isPast: boolean = false) => (
    <Grid item xs={12} sm={6} md={4} key={event.id}>
      <Card 
        onClick={() => handleEventClick(event.id)}
        sx={{
          height: '100%',
          bgcolor: isPast 
            ? (isDarkMode ? 'rgba(26, 85, 85, 0.5)' : '#E0E0E0')
            : (isDarkMode ? '#1A5555' : '#fff'),
          borderRadius: 3,
          boxShadow: isDarkMode ? '0 4px 20px rgba(0, 0, 0, 0.4)' : '0 4px 20px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          border: isPast 
            ? (isDarkMode ? '2px solid rgba(199, 169, 122, 0.2)' : '2px solid #9E9E9E')
            : (isDarkMode ? '2px solid rgba(199, 169, 122, 0.3)' : '2px solid rgba(0, 100, 98, 0.15)'),
          opacity: isPast ? 0.7 : 1,
          '&:hover': {
            transform: downSm ? 'translateY(-4px)' : 'translateY(-8px)',
            boxShadow: '0 12px 40px rgba(0, 100, 98, 0.25)',
            borderColor: isPast ? '#757575' : '#006462',
            opacity: 1,
          },
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height={downSm ? 180 : 220}
            image={event.eventThumbnail}
            alt={event.nameIndonesia}
            sx={{
              objectFit: 'cover',
              filter: isPast ? 'grayscale(70%)' : 'none',
            }}
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.src = '/images/placeholder-event.jpg'
            }}
          />
          {/* Countdown overlay untuk event yang belum dimulai */}
          {!isPast && isUpcomingEvent(event.startDate) && (
            <CountdownTimer startDate={event.startDate} downSm={downSm} />
          )}
          {/* Badge untuk event yang sudah berakhir */}
          {isPast && (
            <Chip
              label="Sudah Berakhir"
              size="small"
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : '#424242',
                color: '#fff',
                fontWeight: 700,
                fontSize: 11,
                border: isDarkMode ? '2px solid rgba(255, 255, 255, 0.3)' : '2px solid #212121',
              }}
            />
          )}
        </Box>
        <CardContent sx={{ p: downSm ? 2 : 3, bgcolor: isDarkMode ? '#1A5555' : 'transparent' }}>
          {/* Event Title */}
          <Typography 
            variant="h6" 
            sx={{ 
              color: isPast 
                ? (isDarkMode ? 'rgba(255, 255, 255, 0.4)' : '#424242')
                : (isDarkMode ? '#fff' : '#1A1A1A'),
              fontSize: downSm ? 15 : 17 + accessibility.fontSize,
              fontWeight: 700,
              mb: 2,
              minHeight: downSm ? 'auto' : 50,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {event.nameIndonesia}
          </Typography>

          {/* Organizer */}
          <Chip 
            label={event.organizer}
            size="small"
            sx={{
              bgcolor: isPast 
                ? (isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#BDBDBD')
                : (isDarkMode ? 'rgba(229, 200, 150, 0.2)' : 'rgba(199, 169, 122, 0.15)'),
              color: isPast 
                ? (isDarkMode ? 'rgba(255, 255, 255, 0.5)' : '#424242')
                : (isDarkMode ? '#E5C896' : '#8B6E3E'),
              fontWeight: 600,
              fontSize: 11,
              mb: 1.5,
              border: isPast 
                ? (isDarkMode ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #9E9E9E')
                : (isDarkMode ? '1px solid rgba(229, 200, 150, 0.4)' : '1px solid rgba(199, 169, 122, 0.3)'),
            }}
          />

          {/* Date with consistent colors */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            gap: 1, 
            mb: 1.5,
            bgcolor: isPast 
              ? (isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#F5F5F5')
              : (isDarkMode ? 'rgba(199, 169, 122, 0.15)' : 'rgba(0, 100, 98, 0.08)'),
            p: 1.5,
            borderRadius: 2,
            border: isPast 
              ? (isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #BDBDBD')
              : (isDarkMode ? '1px solid rgba(199, 169, 122, 0.3)' : '1px solid rgba(0, 100, 98, 0.2)'),
          }}>
            <CalendarTodayIcon sx={{ 
              fontSize: 18, 
              color: isPast 
                ? (isDarkMode ? 'rgba(255, 255, 255, 0.3)' : '#616161')
                : (isDarkMode ? '#E5C896' : '#C7A97A'), 
              mt: 0.2, 
              flexShrink: 0 
            }} />
            <Typography 
              sx={{ 
                color: isPast 
                  ? (isDarkMode ? 'rgba(255, 255, 255, 0.5)' : '#424242')
                  : (isDarkMode ? '#fff' : '#006462'),
                fontSize: downSm ? 10 : 11,
                lineHeight: 1.5,
                fontWeight: 600,
              }}
            >
              {formatDateTimeRange(event.startDate, event.endDate)}
            </Typography>
          </Box>

          {/* Location with consistent colors */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            gap: 1,
            bgcolor: isPast 
              ? (isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#EEEEEE')
              : (isDarkMode ? 'rgba(199, 169, 122, 0.15)' : 'rgba(0, 100, 98, 0.08)'),
            p: 1.5,
            borderRadius: 2,
            border: isPast 
              ? (isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #BDBDBD')
              : (isDarkMode ? '1px solid rgba(199, 169, 122, 0.3)' : '1px solid rgba(0, 100, 98, 0.2)'),
          }}>
            <LocationOnIcon sx={{ 
              fontSize: 18, 
              color: isPast 
                ? (isDarkMode ? 'rgba(255, 255, 255, 0.3)' : '#616161')
                : (isDarkMode ? '#E5C896' : '#C7A97A'), 
              mt: 0.2, 
              flexShrink: 0 
            }} />
            <Typography 
              sx={{ 
                color: isPast 
                  ? (isDarkMode ? 'rgba(255, 255, 255, 0.5)' : '#424242')
                  : (isDarkMode ? '#fff' : '#006462'),
                fontSize: downSm ? 11 : 12,
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
    </Grid>
  )

  return (
    <Box sx={{
      backgroundImage: 'url(/images/bg-batik.svg)', 
      backgroundSize: '100% auto',
      backgroundPosition: 'top center',
      backgroundRepeat: 'repeat-y',
      minHeight: '100vh',
      width: '100%',
      mt: '-90px',
      pt: '120px',
      px: downSm ? 2 : 4,
      pb: downSm ? 4 : 8,
      overflow: 'hidden',
    }}>
      <Box sx={{
        width: '100%',
        maxWidth: 1200,
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

        {/* Header */}
        <Box sx={{
          bgcolor: isDarkMode ? '#1A5555' : 'rgba(255, 255, 255, 0.98)',
          borderRadius: 4,
          p: downSm ? 3 : 4,
          mb: 4,
          backdropFilter: 'blur(10px)',
          boxShadow: isDarkMode ? '0 8px 32px rgba(0, 0, 0, 0.4)' : '0 8px 32px rgba(0, 0, 0, 0.12)',
          border: isDarkMode ? '2px solid rgba(199, 169, 122, 0.3)' : '2px solid rgba(0, 100, 98, 0.1)',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <img
              src="/images/icon/icon_batik_hijau_kanan.svg"
              alt="icon_batik"
              style={{ width: downSm ? 24 : 32, height: downSm ? 24 : 32, marginRight: downSm ? 8 : 12, display: 'block' }}
            />
            <Typography 
              variant="h4" 
              sx={{ 
                color: isDarkMode ? '#C7A97A' : '#006462',
                fontSize: downSm ? 24 : 36 + accessibility.fontSize * 2,
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              SEMUA EVENT SURABAYA
            </Typography>
          </Box>
          <Typography 
            sx={{ 
              color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : '#666666',
              fontSize: downSm ? 14 : 16,
              mb: 3,
              fontWeight: 500,
            }}
          >
            Temukan berbagai event menarik di Kota Surabaya
          </Typography>

          {/* Search and Filter */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <TextField
                fullWidth
                placeholder="Cari event berdasarkan nama, penyelenggara, atau lokasi..."
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#C7A97A' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 999,
                    bgcolor: '#fff',
                    '&:hover fieldset': {
                      borderColor: '#C7A97A',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#006462',
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    color: '#1A1A1A',
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: '#666666',
                    opacity: 0.7,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <Select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  displayEmpty
                  startAdornment={
                    <InputAdornment position="start">
                      <FilterListIcon sx={{ color: '#C7A97A', ml: 1 }} />
                    </InputAdornment>
                  }
                  sx={{
                    borderRadius: 999,
                    bgcolor: '#fff',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#C7A97A',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#006462',
                    },
                    '& .MuiSelect-select': {
                      color: '#1A1A1A',
                    },
                    '& .MuiMenuItem-root': {
                      color: '#1A1A1A',
                    },
                  }}
                >
                  <MenuItem value="all">Semua Kategori</MenuItem>
                  {Object.entries(EVENT_CATEGORIES).map(([key, value]) => (
                    <MenuItem key={key} value={key}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={1}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleClearFilters}
                sx={{
                  height: '100%',
                  borderRadius: 999,
                  bgcolor: '#C7A97A',
                  color: '#fff',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(199, 169, 122, 0.3)',
                  '&:hover': {
                    bgcolor: '#B89968',
                    boxShadow: '0 6px 20px rgba(199, 169, 122, 0.4)',
                  },
                }}
              >
                Reset
              </Button>
            </Grid>
          </Grid>

          {/* Results Count */}
          {totalEvents > 0 && (
            <Box sx={{ 
              mt: 2, 
              p: 2, 
              bgcolor: isDarkMode ? 'rgba(199, 169, 122, 0.2)' : 'rgba(199, 169, 122, 0.15)', 
              borderRadius: 2, 
              border: `1px solid rgba(199, 169, 122, ${isDarkMode ? '0.4' : '0.3'})` 
            }}>
              <Typography variant="body2" sx={{ color: isDarkMode ? '#E5C896' : '#8B6E3E', fontWeight: 600 }}>
                📊 Menampilkan {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, totalEvents)} dari {totalEvents} event
                {searchQuery && ` untuk "${searchQuery}"`}
                {selectedCategory !== 'all' && ` dalam kategori ${EVENT_CATEGORIES[selectedCategory as keyof typeof EVENT_CATEGORIES]}`}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Events Grid */}
        {isLoading ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 8, 
            bgcolor: isDarkMode ? '#1A5555' : 'rgba(255, 255, 255, 0.95)', 
            borderRadius: 4,
            border: isDarkMode ? '2px solid rgba(199, 169, 122, 0.3)' : 'none',
          }}>
            <Typography sx={{ color: isDarkMode ? '#C7A97A' : '#006462', fontWeight: 600 }}>⏳ Loading events...</Typography>
          </Box>
        ) : totalEvents === 0 ? (
          <Box sx={{
            bgcolor: isDarkMode ? '#1A5555' : 'rgba(255, 255, 255, 0.98)',
            borderRadius: 4,
            p: 6,
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
            boxShadow: isDarkMode ? '0 8px 32px rgba(0, 0, 0, 0.4)' : '0 8px 32px rgba(0, 0, 0, 0.12)',
            border: isDarkMode ? '2px solid rgba(199, 169, 122, 0.3)' : 'none',
          }}>
            <Typography variant="h6" sx={{ color: isDarkMode ? '#fff' : '#666666', mb: 1, fontWeight: 700 }}>
              📭 Tidak ada event yang ditemukan
            </Typography>
            <Typography variant="body2" sx={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#666666', mb: 3 }}>
              Coba ubah kata kunci pencarian atau filter kategori
            </Typography>
            <Button
              variant="contained"
              onClick={handleClearFilters}
              sx={{
                mt: 2,
                bgcolor: '#006462',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: 999,
                '&:hover': { bgcolor: '#00504E' },
              }}
            >
              Reset Filter
            </Button>
          </Box>
        ) : (
          <>
            {/* Sedang Berlangsung */}
            {paginatedCategorized.ongoing.length > 0 && (
              <Box sx={{ mb: 6 }}>
                <Box sx={{
                  bgcolor: 'rgba(0, 100, 98, 0.15)',
                  borderRadius: 3,
                  p: 2.5,
                  mb: 3,
                  border: '2px solid rgba(0, 100, 98, 0.3)',
                  boxShadow: '0 4px 12px rgba(0, 100, 98, 0.2)',
                }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: '#006462',
                      fontSize: downSm ? 20 : 24,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Box sx={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: '50%', 
                      bgcolor: '#006462', 
                      animation: 'pulse 2s infinite',
                      boxShadow: '0 0 8px rgba(0, 100, 98, 0.6)',
                    }} />
                    Sedang Berlangsung ({paginatedCategorized.ongoing.length})
                  </Typography>
                </Box>
                <Grid container spacing={downSm ? 2 : 3}>
                  {paginatedCategorized.ongoing.map(event => renderEventCard(event))}
                </Grid>
              </Box>
            )}

            {/* Akan Datang */}
            {paginatedCategorized.upcoming.length > 0 && (
              <Box sx={{ mb: 6 }}>
                <Box sx={{
                  bgcolor: 'rgba(199, 169, 122, 0.15)',
                  borderRadius: 3,
                  p: 2.5,
                  mb: 3,
                  border: '2px solid rgba(199, 169, 122, 0.3)',
                  boxShadow: '0 4px 12px rgba(199, 169, 122, 0.2)',
                }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: '#8B6E3E',
                      fontSize: downSm ? 20 : 24,
                      fontWeight: 700,
                    }}
                  >
                    Akan Datang ({paginatedCategorized.upcoming.length})
                  </Typography>
                </Box>
                <Grid container spacing={downSm ? 2 : 3}>
                  {paginatedCategorized.upcoming.map(event => renderEventCard(event))}
                </Grid>
              </Box>
            )}

            {/* Sudah Berakhir */}
            {paginatedCategorized.past.length > 0 && (
              <Box sx={{ mb: 6 }}>
                <Box sx={{
                  bgcolor: '#F5F5F5',
                  borderRadius: 3,
                  p: 2.5,
                  mb: 3,
                  border: '2px solid #BDBDBD',
                  boxShadow: '0 4px 12px rgba(158, 158, 158, 0.2)',
                }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: '#616161',
                      fontSize: downSm ? 20 : 24,
                      fontWeight: 700,
                    }}
                  >
                    🕐 Sudah Berakhir ({paginatedCategorized.past.length})
                  </Typography>
                </Box>
                <Grid container spacing={downSm ? 2 : 3}>
                  {paginatedCategorized.past.map(event => renderEventCard(event, true))}
                </Grid>
              </Box>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 4,
                bgcolor: isDarkMode ? '#1A5555' : 'rgba(255, 255, 255, 0.95)',
                borderRadius: 4,
                p: 3,
                boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.08)',
                backdropFilter: 'blur(10px)',
                border: isDarkMode ? '2px solid rgba(199, 169, 122, 0.3)' : 'none',
              }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePaginationChange}
                  color="primary"
                  size={downSm ? "medium" : "large"}
                  sx={{
                    '& .MuiPaginationItem-root': {
                      fontSize: downSm ? 14 : 16,
                      fontWeight: 600,
                      color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#666',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: isDarkMode ? 'rgba(199, 169, 122, 0.2)' : 'rgba(0,100,98,0.1)',
                        transform: 'scale(1.1)',
                      },
                      '&.Mui-selected': {
                        bgcolor: '#006462',
                        color: '#fff',
                        '&:hover': {
                          bgcolor: '#00504E',
                        },
                      },
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Box>

      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
        `}
      </style>
    </Box>
  )
}

export default AllEventsPage