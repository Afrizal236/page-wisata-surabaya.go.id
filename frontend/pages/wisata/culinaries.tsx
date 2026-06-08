import React from 'react'
import { Box, Typography, Grid, Card, CardContent, CardMedia, Button, TextField, InputAdornment, Pagination, useTheme } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { BreakpointsContext } from 'contexts/breakpoints'
import { AccessibilityContext } from 'contexts/accessibility'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SearchIcon from '@mui/icons-material/Search'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import { getAllCulinaries, Culinary, getCulinaryThumbnail } from 'utils/services/culinary'

const ITEMS_PER_PAGE = 9

const AllCulinariesPage: React.FunctionComponent = () => {
  const { downSm } = React.useContext(BreakpointsContext)
  const accessibility = React.useContext(AccessibilityContext)
  const router = useRouter()
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'
  const [searchQuery, setSearchQuery] = React.useState('')
  const [currentPage, setCurrentPage] = React.useState(1)

  const { data: allCulinaries, isLoading } = useQuery({
    queryKey: ['all-culinaries-list'],
    queryFn: () => getAllCulinaries(),
    retry: 3,
    staleTime: 1000 * 60 * 10,
  })

  // Filter culinaries
  const filteredCulinaries = React.useMemo(() => {
    if (!allCulinaries || allCulinaries.length === 0) return []
    
    let culinaries = allCulinaries

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      culinaries = culinaries.filter((culinary: Culinary) =>
        culinary.name.toLowerCase().includes(query) ||
        culinary.address.toLowerCase().includes(query)
      )
    }

    return culinaries
  }, [allCulinaries, searchQuery])

  // Pagination logic
  const totalPages = Math.ceil(filteredCulinaries.length / ITEMS_PER_PAGE)
  const paginatedCulinaries = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return filteredCulinaries.slice(startIndex, endIndex)
  }, [filteredCulinaries, currentPage])

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const handleCulinaryClick = (culinaryId: string) => {
    router.push(`/wisata/culinary/${culinaryId}`)
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const handleClearFilters = () => {
    setSearchQuery('')
  }

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 400, behavior: 'smooth' })
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
      }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
          sx={{
            mb: 3,
            color: isDarkMode ? '#C7A97A' : '#006462',
            fontWeight: 600,
            bgcolor: isDarkMode ? 'rgba(26, 85, 85, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            px: 3,
            py: 1,
            borderRadius: 999,
            boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
            border: isDarkMode ? '1px solid rgba(199, 169, 122, 0.3)' : 'none',
            '&:hover': {
              bgcolor: isDarkMode ? 'rgba(26, 85, 85, 1)' : 'rgba(0, 100, 98, 0.1)',
              boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.12)',
            },
          }}
        >
          Kembali
        </Button>

        {/* Header */}
        <Box sx={{
          bgcolor: isDarkMode ? '#1A5555' : 'rgba(255, 255, 255, 0.95)',
          borderRadius: 4,
          p: downSm ? 3 : 4,
          mb: 4,
          backdropFilter: 'blur(10px)',
          boxShadow: isDarkMode ? '0 4px 20px rgba(0, 0, 0, 0.4)' : '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: isDarkMode ? '1px solid rgba(199, 169, 122, 0.2)' : 'none',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <img
              src="/images/icon/icon_batik_coklat_kiri.svg"
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
              SEMUA KULINER SURABAYA
            </Typography>
          </Box>
          <Typography 
            sx={{ 
              color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : '#666666',
              fontSize: downSm ? 14 : 16,
              mb: 3,
            }}
          >
            Nikmati kelezatan kuliner khas Surabaya yang menggugah selera
          </Typography>

          {/* Search */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={11}>
              <TextField
                fullWidth
                placeholder="Cari kuliner berdasarkan nama atau lokasi..."
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
                    bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)',
                    '&:hover fieldset': {
                      borderColor: '#C7A97A',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#006462',
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    color: isDarkMode ? '#fff' : '#1A1A1A',
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : '#666666',
                    opacity: 0.7,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={1}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleClearFilters}
                sx={{
                  height: '100%',
                  borderRadius: 999,
                  borderColor: '#C7A97A',
                  color: '#C7A97A',
                  fontWeight: 600,
                  textTransform: 'none',
                  bgcolor: isDarkMode ? 'rgba(199, 169, 122, 0.1)' : 'transparent',
                  '&:hover': {
                    borderColor: isDarkMode ? '#E5C896' : '#006462',
                    bgcolor: isDarkMode ? 'rgba(199, 169, 122, 0.2)' : 'rgba(0, 100, 98, 0.05)',
                  },
                }}
              >
                Reset
              </Button>
            </Grid>
          </Grid>

          {/* Results Count */}
          {filteredCulinaries.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#666666' }}>
                Menampilkan {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredCulinaries.length)} dari {filteredCulinaries.length} kuliner
                {searchQuery && ` untuk "${searchQuery}"`}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Culinaries Grid */}
        {isLoading ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography>Loading culinaries...</Typography>
          </Box>
        ) : filteredCulinaries.length === 0 ? (
          <Box sx={{
            bgcolor: isDarkMode ? '#1A5555' : 'rgba(255, 255, 255, 0.95)',
            borderRadius: 4,
            p: 6,
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
            border: isDarkMode ? '1px solid rgba(199, 169, 122, 0.2)' : 'none',
          }}>
            <Typography variant="h6" sx={{ color: isDarkMode ? '#fff' : '#666666', mb: 1 }}>
              Tidak ada kuliner yang ditemukan
            </Typography>
            <Typography variant="body2" sx={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#666666' }}>
              Coba ubah kata kunci pencarian
            </Typography>
            <Button
              variant="contained"
              onClick={handleClearFilters}
              sx={{
                mt: 2,
                bgcolor: '#006462',
                '&:hover': { bgcolor: '#00504E' },
              }}
            >
              Reset Filter
            </Button>
          </Box>
        ) : (
          <>
            <Grid container spacing={downSm ? 2 : 3}>
              {paginatedCulinaries.map((culinary: Culinary) => (
                <Grid item xs={12} sm={6} md={4} key={culinary.id}>
                  <Card 
                    onClick={() => handleCulinaryClick(culinary.id)}
                    sx={{
                      height: '100%',
                      bgcolor: isDarkMode ? '#1A5555' : 'rgba(255, 255, 255, 0.95)',
                      borderRadius: 3,
                      boxShadow: isDarkMode ? '0 4px 20px rgba(0, 0, 0, 0.4)' : '0 4px 20px rgba(0, 0, 0, 0.08)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      border: `2px solid ${isDarkMode ? 'rgba(199, 169, 122, 0.3)' : 'rgba(0, 100, 98, 0.15)'}`,
                      backdropFilter: 'blur(10px)',
                      '&:hover': {
                        transform: downSm ? 'translateY(-4px)' : 'translateY(-8px)',
                        boxShadow: '0 12px 40px rgba(0, 100, 98, 0.25)',
                        borderColor: '#006462',
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height={downSm ? 180 : 220}
                      image={getCulinaryThumbnail(culinary)}
                      alt={culinary.name}
                      sx={{
                        objectFit: 'cover',
                      }}
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        e.currentTarget.src = '/images/placeholder-culinary.jpg'
                      }}
                    />
                    <CardContent sx={{ p: downSm ? 2 : 3, bgcolor: isDarkMode ? '#1A5555' : 'transparent' }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: isDarkMode ? '#fff' : '#1A1A1A',
                          fontSize: downSm ? 15 : 17 + accessibility.fontSize,
                          fontWeight: 700,
                          mb: 1.5,
                          minHeight: downSm ? 'auto' : 50,
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
                        <RestaurantIcon sx={{ fontSize: 16, color: isDarkMode ? '#E5C896' : '#C7A97A' }} />
                        <Typography sx={{ color: isDarkMode ? '#D4B583' : '#8B6E3E', fontSize: 11, fontWeight: 600 }}>
                          Kuliner Khas Surabaya
                        </Typography>
                      </Box>

                      {/* Location */}
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <LocationOnIcon sx={{ fontSize: 16, color: isDarkMode ? '#E5C896' : '#C7A97A', mt: 0.3 }} />
                        <Typography 
                          sx={{ 
                            color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : '#666666',
                            fontSize: downSm ? 12 : 13,
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
                </Grid>
              ))}
            </Grid>

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
                border: isDarkMode ? '1px solid rgba(199, 169, 122, 0.2)' : 'none',
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
    </Box>
  )
}

export default AllCulinariesPage