import React from 'react'
import { Box, Typography, Grid, Card, CardContent, CardMedia, Rating, Checkbox, FormControlLabel, FormGroup, Button, TextField, InputAdornment, Pagination, useTheme } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { BreakpointsContext } from 'contexts/breakpoints'
import { AccessibilityContext } from 'contexts/accessibility'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import StarIcon from '@mui/icons-material/Star'
import { getAllHotels, Hotel, getHotelThumbnail } from 'utils/services/hotel'

const ITEMS_PER_PAGE = 8

const AllHotelsPage: React.FunctionComponent = () => {
  const { downSm, downMd } = React.useContext(BreakpointsContext)
  const accessibility = React.useContext(AccessibilityContext)
  const router = useRouter()
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'
  
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedStars, setSelectedStars] = React.useState<number[]>([])
  const [isVisible, setIsVisible] = React.useState(false)
  const [currentPage, setCurrentPage] = React.useState(1)

  // Animation on mount
  React.useEffect(() => {
    setIsVisible(true)
  }, [])

  const { data: allHotels, isLoading } = useQuery({
    queryKey: ['all-hotels-list'],
    queryFn: () => getAllHotels(),
    retry: 3,
    staleTime: 1000 * 60 * 10,
  })

  // Filter hotels berdasarkan search dan star rating
  const filteredHotels = React.useMemo(() => {
    if (!allHotels || allHotels.length === 0) return []
    
    let hotels = allHotels

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      hotels = hotels.filter((hotel: Hotel) =>
        hotel.name.toLowerCase().includes(query) ||
        hotel.address.toLowerCase().includes(query) ||
        hotel.description.toLowerCase().includes(query)
      )
    }

    // Filter by star rating - hanya filter jika ada yang dipilih
    if (selectedStars.length > 0) {
      hotels = hotels.filter((hotel: Hotel) =>
        selectedStars.includes(hotel.hotelCategory?.starNumber || 0)
      )
    }

    // Sort by star rating descending
    return hotels.sort((a: Hotel, b: Hotel) => {
      const starsA = a.hotelCategory?.starNumber || 0
      const starsB = b.hotelCategory?.starNumber || 0
      return starsB - starsA
    })
  }, [allHotels, searchQuery, selectedStars])

  // Pagination logic
  const totalPages = Math.ceil(filteredHotels.length / ITEMS_PER_PAGE)
  const paginatedHotels = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return filteredHotels.slice(startIndex, endIndex)
  }, [filteredHotels, currentPage])

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedStars])

  const handleStarToggle = (star: number) => {
    setSelectedStars(prev => {
      if (prev.includes(star)) {
        return prev.filter(s => s !== star)
      } else {
        return [...prev, star].sort()
      }
    })
  }

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page)
    // Scroll to top of hotel list
    window.scrollTo({ top: 400, behavior: 'smooth' })
  }

  const handleHotelClick = (hotelId: string) => {
    router.push(`/wisata/hotel/${hotelId}`)
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

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
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s ease-out',
      }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
          sx={{
            mb: 3,
            color: isDarkMode ? '#C7A97A' : '#006462',
            fontWeight: 600,
            bgcolor: isDarkMode ? '#1A5555' : 'rgba(255, 255, 255, 0.95)',
            px: 3,
            py: 1,
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            transition: 'all 0.3s ease',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 1)',
              boxShadow: '0 6px 20px rgba(0,100,98,0.15)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          Kembali
        </Button>

        {/* Search Bar */}
        <Box sx={{
          bgcolor: isDarkMode ? '#1A5555' : 'rgba(255, 255, 255, 0.95)',
          borderRadius: '10px',
          p: 2,
          mb: 3,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          backdropFilter: 'blur(10px)',
        }}>
          <input
            type="text"
            placeholder="Cari Hotel"
            value={searchQuery}
            onChange={handleSearchChange}
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '18px',
              border: '1px solid #999',
              borderRadius: '10px',
              outline: 'none',
              fontFamily: 'Inter',
              transition: 'all 0.3s ease',
              color: isDarkMode ? '#fff' : '#1A1A1A',
              backgroundColor: '#fff',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#006462'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,100,98,0.1)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#999'
              e.currentTarget.style.boxShadow = 'none'
            }}
          />
        </Box>

        {/* Main Content */}
        <Box sx={{
          display: 'flex',
          flexDirection: downMd ? 'column' : 'row',
          gap: 3,
          px: downSm ? 1 : 2,
        }}>
          {/* Left Sidebar */}
          <Box sx={{
            width: downMd ? '100%' : 280,
            flexShrink: 0,
          }}>
            {/* Peta Surabaya */}
            <Box sx={{
              bgcolor: '#D9D9D9',
              borderRadius: '10px',
              height: 200,
              mb: 3,
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              position: 'relative',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
                transform: 'translateY(-2px)',
              },
            }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126646.60163163107!2d112.6373394!3d-7.2574719!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fbf8381ac47f%3A0x3027a76e352be40!2sSurabaya%2C%20Kota%20SBY%2C%20Jawa%20Timur!5e0!3m2!1sid!2sid!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </Box>

            {/* Filter by Stars */}
            <Box sx={{
              bgcolor: isDarkMode ? '#1A5555' : 'rgba(255, 255, 255, 0.95)',
              borderRadius: '10px',
              p: 2.5,
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0,100,98,0.1)',
            }}>
              <Typography sx={{
                fontSize: 18,
                fontWeight: 600,
                color: isDarkMode ? '#C7A97A' : '#006462',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}>
                <StarIcon sx={{ fontSize: 20, color: '#FFB400' }} />
                Filter Bintang
              </Typography>
              
              <FormGroup>
                {[5, 4, 3, 2, 1].map((star) => (
                  <FormControlLabel
                    key={star}
                    control={
                      <Checkbox
                        checked={selectedStars.includes(star)}
                        onChange={() => handleStarToggle(star)}
                        sx={{
                          color: isDarkMode ? '#E5C896' : '#C7A97A',
                          '&.Mui-checked': {
                            color: isDarkMode ? '#C7A97A' : '#006462',
                          },
                        }}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {[...Array(star)].map((_, i) => (
                          <StarIcon key={i} sx={{ fontSize: 16, color: '#FFB400' }} />
                        ))}
                      </Box>
                    }
                  />
                ))}
              </FormGroup>
            </Box>
          </Box>

          {/* Hotel List */}
          <Box sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}>
            {isLoading ? (
              <Box sx={{
                textAlign: 'center',
                py: 8,
                bgcolor: isDarkMode ? '#1A5555' : 'rgba(255, 255, 255, 0.95)',
                borderRadius: '10px',
              }}>
                <Typography>Loading hotels...</Typography>
              </Box>
            ) : filteredHotels.length === 0 ? (
              <Box sx={{
                bgcolor: isDarkMode ? '#1A5555' : 'rgba(255, 255, 255, 0.95)',
                borderRadius: '10px',
                p: 6,
                textAlign: 'center',
                backdropFilter: 'blur(10px)',
              }}>
                <Typography sx={{ color: '#666', fontSize: 16, mb: 1 }}>
                  Tidak ada hotel yang ditemukan
                </Typography>
                <Typography sx={{ color: '#999', fontSize: 14 }}>
                  Coba ubah filter atau kata kunci pencarian
                </Typography>
              </Box>
            ) : (
              <>
                {paginatedHotels.map((hotel: Hotel, index: number) => (
                <Box
                  key={hotel.id}
                  onClick={() => handleHotelClick(hotel.id)}
                  sx={{
                    display: 'flex',
                    flexDirection: downSm ? 'column' : 'row',
                    bgcolor: isDarkMode ? '#1A5555' : 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0,100,98,0.1)',
                    opacity: 0,
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`,
                    '@keyframes fadeInUp': {
                      from: {
                        opacity: 0,
                        transform: 'translateY(30px)',
                      },
                      to: {
                        opacity: 1,
                        transform: 'translateY(0)',
                      },
                    },
                    '&:hover': {
                      transform: downSm ? 'translateY(-4px)' : 'translateX(8px)',
                      boxShadow: '0 12px 32px rgba(0,100,98,0.2)',
                      borderColor: '#006462',
                      '& .hotel-image': {
                        transform: 'scale(1.05)',
                      },
                    },
                  }}
                >
                  {/* Hotel Image */}
                  <Box sx={{
                    width: downSm ? '100%' : 380,
                    height: downSm ? 200 : 240,
                    flexShrink: 0,
                    bgcolor: '#D9D9D9',
                    overflow: 'hidden',
                    position: 'relative',
                  }}>
                    <img
                      src={getHotelThumbnail(hotel)}
                      alt={hotel.name}
                      className="hotel-image"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        e.currentTarget.src = '/images/placeholder-hotel.jpg'
                      }}
                    />
                    <Box sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      bgcolor: isDarkMode ? 'rgba(26, 85, 85, 0.95)' : 'rgba(255,255,255,0.95)',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      border: isDarkMode ? '1px solid rgba(199, 169, 122, 0.3)' : 'none',
                    }}>
                      {[...Array(hotel.hotelCategory?.starNumber || 0)].map((_, i) => (
                        <StarIcon key={i} sx={{ fontSize: 14, color: '#FFB400' }} />
                      ))}
                    </Box>
                  </Box>

                  {/* Hotel Info */}
                  <Box sx={{
                    flex: 1,
                    p: downSm ? 2.5 : 3,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}>
                    {/* Hotel Name */}
                    <Typography sx={{
                      fontSize: downSm ? 18 : 24,
                      fontWeight: 600,
                      color: isDarkMode ? '#fff' : '#1A1A1A',
                      mb: 1.5,
                      lineHeight: 1.3,
                    }}>
                      {hotel.name}
                    </Typography>

                    {/* Star Rating */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 0.8,
                      mb: 1.5,
                    }}>
                      {[...Array(hotel.hotelCategory?.starNumber || 0)].map((_, i) => (
                        <StarIcon key={i} sx={{ fontSize: 20, color: '#FFB400' }} />
                      ))}
                      <Typography sx={{ 
                        fontSize: 14,
                        fontWeight: 500,
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#666',
                        ml: 0.5,
                      }}>
                        ({hotel.hotelCategory?.starNumberName})
                      </Typography>
                    </Box>

                    {/* Location */}
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1,
                      mb: 2,
                    }}>
                      <LocationOnIcon sx={{ fontSize: 18, color: isDarkMode ? '#E5C896' : '#C7A97A', mt: 0.2 }} />
                      <Typography sx={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: isDarkMode ? '#fff' : '#1A1A1A',
                        lineHeight: 1.5,
                      }}>
                        {hotel.address}
                      </Typography>
                    </Box>

                    {/* Description */}
                    <Typography sx={{
                      fontSize: 14,
                      fontWeight: 400,
                      color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : '#666',
                      lineHeight: 1.6,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {hotel.description || 'Hotel dengan fasilitas lengkap dan pelayanan terbaik untuk kenyamanan menginap Anda.'}
                    </Typography>
                  </Box>
                </Box>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mt: 2,
                  bgcolor: isDarkMode ? '#1A5555' : 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '10px',
                  p: 3,
                  boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.08)',
                  backdropFilter: 'blur(10px)',
                }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    size={downSm ? "medium" : "large"}
                    sx={{
                      '& .MuiPaginationItem-root': {
                        fontSize: downSm ? 14 : 16,
                        fontWeight: 600,
                        color: '#666',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: 'rgba(0,100,98,0.1)',
                          transform: 'scale(1.1)',
                        },
                        '&.Mui-selected': {
                          bgcolor: isDarkMode ? '#C7A97A' : '#006462',
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
        </Box>
      </Box>
    </Box>
  )
}

export default AllHotelsPage