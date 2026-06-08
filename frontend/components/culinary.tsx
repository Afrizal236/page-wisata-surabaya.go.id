import React, { memo, useRef } from 'react'
import { Box, Typography, Card, CardContent, CardMedia, IconButton, Button, Alert, useTheme } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { BreakpointsContext } from 'contexts/breakpoints'
import { AccessibilityContext } from 'contexts/accessibility'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import VisibilityIcon from '@mui/icons-material/Visibility'
import RefreshIcon from '@mui/icons-material/Refresh'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import { getAllCulinaries, Culinary, getCulinaryThumbnail } from 'utils/services/culinary'

interface Props {}

const CulinaryContent: React.FunctionComponent<Props> = () => {
  const { downSm } = React.useContext(BreakpointsContext)
  const accessibility = React.useContext(AccessibilityContext)
  const router = useRouter()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'

  const { data: allCulinaries, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['all-culinaries-homepage'],
    queryFn: () => {
      console.log('🎯 React Query: Starting fetch all culinaries...')
      return getAllCulinaries()
    },
    retry: 3,
    retryDelay: 1000,
    staleTime: 1000 * 60 * 10, // 10 minutes cache
  })

  // Get 8 featured culinaries
  const culinaries = React.useMemo(() => {
    console.log('🔄 Computing featured culinaries...')
    
    if (!allCulinaries || allCulinaries.length === 0) {
      console.log('⚠️ No culinaries available')
      return []
    }
    
    console.log('📦 Total culinaries:', allCulinaries.length)
    
    // Ambil 8 culinary pertama
    const result = allCulinaries.slice(0, 8)
    console.log('🎯 Featured culinaries (top 8):', result.length)
    
    return result
  }, [allCulinaries])

  const handleCulinaryClick = (culinaryId: string) => {
    router.push(`/wisata/culinary/${culinaryId}`)
  }

  const handleViewAll = () => {
    router.push('/wisata/culinaries')
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
  }, [culinaries])

  // Loading state
  if (isLoading) {
    return (
      <Box sx={{
        width: '100%',
        maxWidth: 1200,
        mx: 'auto',
        mt: downSm ? 3 : 5,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: downSm ? 3 : 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <img
              src="/images/icon/icon_batik_coklat_kiri.svg"
              alt="icon_batik"
              style={{ width: downSm ? 24 : 32, height: downSm ? 24 : 32, marginRight: downSm ? 8 : 12, display: 'block' }}
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
              KULINER SURABAYA
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
            ⏳ Memuat kuliner...
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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: downSm ? 3 : 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <img
              src="/images/icon/icon_batik_coklat_kiri.svg"
              alt="icon_batik"
              style={{ width: downSm ? 24 : 32, height: downSm ? 24 : 32, marginRight: downSm ? 8 : 12, display: 'block' }}
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
              KULINER SURABAYA
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
              ⚠️ Gagal memuat kuliner
            </Typography>
            <Typography variant="body2">
              {error instanceof Error ? error.message : 'Terjadi kesalahan saat memuat data kuliner'}
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
  if (culinaries.length === 0) {
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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: downSm ? 3 : 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img
            src="/images/icon/icon_batik_coklat_kiri.svg"
            alt="icon_batik"
            style={{ width: downSm ? 24 : 32, height: downSm ? 24 : 32, marginRight: downSm ? 8 : 12, display: 'block' }}
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
            KULINER SURABAYA
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
          {culinaries.map((culinary: Culinary) => (
            <Card 
              key={culinary.id}
              onClick={() => handleCulinaryClick(culinary.id)}
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
              <CardMedia
                component="img"
                height={downSm ? 180 : 200}
                image={getCulinaryThumbnail(culinary)}
                alt={culinary.name}
                sx={{
                  objectFit: 'cover',
                }}
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.src = '/images/placeholder-culinary.jpg'
                }}
              />
              <CardContent sx={{ p: 3, bgcolor: isDarkMode ? '#1A5555' : '#fff' }}>
                {/* Culinary Title */}
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: isDarkMode ? '#fff' : '#1A1A1A',
                    fontSize: 17 + accessibility.fontSize,
                    fontWeight: 700,
                    mb: 1.5,
                    minHeight: 50,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {culinary.name}
                </Typography>

                {/* Restaurant Icon */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                  <RestaurantIcon sx={{ fontSize: 18, color: '#C7A97A' }} />
                  <Typography sx={{ color: '#C7A97A', fontSize: 12, fontWeight: 600 }}>
                    Kuliner Khas Surabaya
                  </Typography>
                </Box>

                {/* Location */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <LocationOnIcon sx={{ fontSize: 16, color: '#C7A97A', mt: 0.3 }} />
                  <Typography 
                    sx={{ 
                      color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : '#666666',
                      fontSize: 13,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {culinary.address}
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

CulinaryContent.defaultProps = {}

export default memo(CulinaryContent)