import React from 'react'
import { Box, Typography, Button, Alert, CircularProgress, Divider, Grid, useTheme } from '@mui/material'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { BreakpointsContext } from 'contexts/breakpoints'
import { AccessibilityContext } from 'contexts/accessibility'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import MapIcon from '@mui/icons-material/Map'
import RefreshIcon from '@mui/icons-material/Refresh'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import { getCulinaryDetail, getCulinaryGallery } from 'utils/services/culinary'

const CulinaryDetailPage: React.FunctionComponent = () => {
  const router = useRouter()
  const { id } = router.query
  const { downSm } = React.useContext(BreakpointsContext)
  const accessibility = React.useContext(AccessibilityContext)
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'

  const { data, isLoading, isError, error, refetch } = useQuery(
    ['culinary-detail', id],
    () => getCulinaryDetail(id as string),
    {
      enabled: !!id,
      retry: 1,
      retryDelay: 1000,
    }
  )

  const culinary = data?.data

  const openInGoogleMaps = () => {
    if (culinary) {
      const url = `https://www.google.com/maps/search/?api=1&query=${culinary.latitude},${culinary.longitude}`
      window.open(url, '_blank')
    }
  }

  const handleRefresh = () => {
    refetch()
  }

  // Get gallery images
  const galleryImages = React.useMemo(() => {
    if (!culinary) return []
    return getCulinaryGallery(culinary)
  }, [culinary])

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
            <Typography sx={{ color: isDarkMode ? '#fff' : 'inherit' }}>Memuat detail kuliner...</Typography>
          </Box>
        ) : !culinary ? (
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
                Kuliner tidak ditemukan
              </Typography>
              <Typography variant="body2" sx={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'inherit' }}>
                {error instanceof Error ? error.message : 'Gagal memuat data kuliner. Periksa koneksi internet Anda.'}
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
                onClick={() => router.push('/wisata/culinaries')}
                sx={{
                  borderColor: isDarkMode ? '#C7A97A' : '#006462',
                  color: isDarkMode ? '#C7A97A' : '#006462',
                  '&:hover': {
                    borderColor: isDarkMode ? '#E5C896' : '#00504E',
                    bgcolor: isDarkMode ? 'rgba(199, 169, 122, 0.1)' : 'rgba(0, 100, 98, 0.05)',
                  },
                }}
              >
                Lihat Semua Kuliner
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
            {/* Culinary Image */}
            <Box
              component="img"
              src={culinary.culinaryFiles.find(f => f.fileType === 'thumbnail')?.link}
              alt={culinary.name}
              sx={{
                width: '100%',
                height: downSm ? 250 : 450,
                objectFit: 'cover',
              }}
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.src = '/images/placeholder-culinary.jpg'
              }}
            />

            {/* Culinary Details */}
            <Box sx={{ p: downSm ? 3 : 5 }}>
              {/* Title */}
              <Box sx={{ mb: 3 }}>
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
                  {culinary.name}
                </Typography>

                {/* Restaurant Badge */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <RestaurantIcon sx={{ fontSize: 24, color: isDarkMode ? '#E5C896' : '#C7A97A' }} />
                  <Typography sx={{ color: isDarkMode ? '#E5C896' : '#C7A97A', fontSize: 16, fontWeight: 600 }}>
                    Kuliner Khas Surabaya
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ 
                mb: 3,
                borderColor: isDarkMode ? 'rgba(199, 169, 122, 0.3)' : undefined,
              }} />

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
                    Lokasi
                  </Typography>
                  <Typography 
                    sx={{ 
                      color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'text.secondary',
                      fontSize: downSm ? 14 : 16,
                      mb: 2,
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {culinary.address}
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

              {/* Gallery */}
              {galleryImages.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography 
                    sx={{ 
                      color: isDarkMode ? '#C7A97A' : '#006462',
                      fontSize: downSm ? 17 : 20,
                      fontWeight: 700,
                      mb: 2,
                    }}
                  >
                    Galeri Foto
                  </Typography>
                  <Grid container spacing={2}>
                    {galleryImages.map((image, index) => (
                      <Grid item xs={6} md={4} key={image.id}>
                        <Box
                          component="img"
                          src={image.link}
                          alt={`${culinary.name} - Gallery ${index + 1}`}
                          sx={{
                            width: '100%',
                            height: downSm ? 150 : 200,
                            objectFit: 'cover',
                            borderRadius: 2,
                            cursor: 'pointer',
                            transition: 'transform 0.3s ease',
                            border: isDarkMode ? '2px solid rgba(199, 169, 122, 0.2)' : 'none',
                            '&:hover': {
                              transform: 'scale(1.05)',
                              border: isDarkMode ? '2px solid rgba(199, 169, 122, 0.5)' : 'none',
                            },
                          }}
                          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                            e.currentTarget.src = '/images/placeholder-culinary.jpg'
                          }}
                          onClick={() => window.open(image.link, '_blank')}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Google Maps Embed */}
              {culinary.latitude && culinary.longitude && (
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
                      src={`https://maps.google.com/maps?q=${culinary.latitude},${culinary.longitude}&t=m&z=16&output=embed&iwloc=near`}
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
                    📍 {culinary.address.split('\n')[0]} • Koordinat: {culinary.latitude}, {culinary.longitude}
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

export default CulinaryDetailPage