import React from 'react'
import { Box, Typography, Chip, Button, Divider, Alert, CircularProgress, ImageList, ImageListItem, useTheme } from '@mui/material'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { BreakpointsContext } from 'contexts/breakpoints'
import { AccessibilityContext } from 'contexts/accessibility'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import MapIcon from '@mui/icons-material/Map'
import RefreshIcon from '@mui/icons-material/Refresh'
import CategoryIcon from '@mui/icons-material/Category'
import { getDestinationDetail, getDestinations, getDestinationThumbnail, getDestinationGallery } from 'utils/services/destination'

const DestinationDetailPage: React.FunctionComponent = () => {
  const router = useRouter()
  const { id } = router.query
  const { downSm } = React.useContext(BreakpointsContext)
  const accessibility = React.useContext(AccessibilityContext)
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'

  const { data, isLoading, isError, error, refetch } = useQuery(
    ['destination-detail', id],
    () => getDestinationDetail(id as string),
    {
      enabled: !!id,
      retry: 1,
      retryDelay: 1000,
    }
  )

  const { data: destinationsData } = useQuery(
    ['destinations-fallback', id],
    () => getDestinations(1),
    {
      enabled: !!id && isError,
      retry: 2,
    }
  )

  const destination = React.useMemo(() => {
    if (data?.data) {
      return data.data
    }
    
    if (destinationsData?.data?.data && id) {
      return destinationsData.data.data.find(d => d.id === id)
    }
    
    return null
  }, [data, destinationsData, id])

  const openInGoogleMaps = () => {
    if (destination) {
      const url = `https://www.google.com/maps/search/?api=1&query=${destination.latitude},${destination.longitude}`
      window.open(url, '_blank')
    }
  }

  const handleRefresh = () => {
    refetch()
  }

  const galleryImages = destination ? getDestinationGallery(destination) : []

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
            <Typography sx={{ color: isDarkMode ? '#fff' : 'inherit' }}>Memuat detail destinasi...</Typography>
          </Box>
        ) : !destination ? (
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
                Destinasi tidak ditemukan
              </Typography>
              <Typography variant="body2" sx={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'inherit' }}>
                {error instanceof Error ? error.message : 'Gagal memuat data destinasi. Periksa koneksi internet Anda.'}
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
                onClick={() => router.push('/wisata/destinations')}
                sx={{
                  borderColor: isDarkMode ? '#C7A97A' : '#006462',
                  color: isDarkMode ? '#C7A97A' : '#006462',
                  '&:hover': {
                    borderColor: isDarkMode ? '#E5C896' : '#00504E',
                    bgcolor: isDarkMode ? 'rgba(199, 169, 122, 0.1)' : 'rgba(0, 100, 98, 0.05)',
                  },
                }}
              >
                Lihat Semua Destinasi
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
            {/* Main Image */}
            <Box
              component="img"
              src={getDestinationThumbnail(destination)}
              alt={destination.nameIndonesia}
              sx={{
                width: '100%',
                height: downSm ? 250 : 450,
                objectFit: 'cover',
              }}
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.src = '/images/placeholder-destination.jpg'
              }}
            />

            {/* Content */}
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
                {destination.nameIndonesia}
              </Typography>

              {destination.nameInggris && (
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: isDarkMode ? '#E5C896' : '#C7A97A',
                    fontSize: downSm ? 16 : 20,
                    fontStyle: 'italic',
                    mb: 3,
                  }}
                >
                  {destination.nameInggris}
                </Typography>
              )}

              {/* Categories */}
              <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                <CategoryIcon sx={{ color: isDarkMode ? '#E5C896' : '#C7A97A', fontSize: 20 }} />
                {destination.tourismCategory.map((category) => (
                  <Chip 
                    key={category.id}
                    label={category.name}
                    sx={{
                      bgcolor: isDarkMode ? 'rgba(229, 200, 150, 0.2)' : 'rgba(199, 169, 122, 0.1)',
                      color: isDarkMode ? '#E5C896' : '#C7A97A',
                      fontWeight: 600,
                      fontSize: 13,
                      px: 1,
                      py: 2,
                      border: isDarkMode ? '1px solid rgba(229, 200, 150, 0.3)' : 'none',
                    }}
                  />
                ))}
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
                    }}
                  >
                    {destination.address}
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
                  Deskripsi
                </Typography>
                <Typography 
                  sx={{ 
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'text.secondary',
                    fontSize: downSm ? 14 : 16,
                    lineHeight: 1.9,
                    textAlign: 'justify',
                    whiteSpace: 'pre-line',
                    mb: 3,
                  }}
                >
                  {destination.descriptionIndonesia}
                </Typography>

                {destination.desctiptionInggris && (
                  <>
                    <Typography 
                      sx={{ 
                        color: isDarkMode ? '#E5C896' : '#006462',
                        fontSize: downSm ? 15 : 18,
                        fontWeight: 700,
                        mb: 2,
                        fontStyle: 'italic',
                      }}
                    >
                      English Description
                    </Typography>
                    <Typography 
                      sx={{ 
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.75)' : 'text.secondary',
                        fontSize: downSm ? 13 : 15,
                        lineHeight: 1.9,
                        textAlign: 'justify',
                        whiteSpace: 'pre-line',
                      }}
                    >
                      {destination.desctiptionInggris}
                    </Typography>
                  </>
                )}
              </Box>

              {/* Gallery */}
              {galleryImages.length > 0 && (
                <Box sx={{ mt: 4 }}>
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
                  <ImageList sx={{ width: '100%' }} cols={downSm ? 2 : 3} gap={12}>
                    {galleryImages.map((image) => (
                      <ImageListItem key={image.id}>
                        <img
                          src={image.link}
                          alt={destination.nameIndonesia}
                          loading="lazy"
                          style={{
                            borderRadius: 8,
                            objectFit: 'cover',
                            height: downSm ? 150 : 200,
                            border: isDarkMode ? '2px solid rgba(199, 169, 122, 0.2)' : 'none',
                          }}
                          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                            e.currentTarget.src = '/images/placeholder-destination.jpg'
                          }}
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                </Box>
              )}

              {/* Google Maps Embed */}
              {destination.latitude && destination.longitude && (
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
                      src={`https://maps.google.com/maps?q=${destination.latitude},${destination.longitude}&t=m&z=16&output=embed&iwloc=near`}
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
                    📍 {destination.address} • Koordinat: {destination.latitude}, {destination.longitude}
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

export default DestinationDetailPage