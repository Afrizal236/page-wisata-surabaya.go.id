import React, { memo } from 'react'
import { Box, Typography, Button, Grid, Card, CardContent } from '@mui/material'
import { BreakpointsContext } from 'contexts/breakpoints'
import { AccessibilityContext } from 'contexts/accessibility'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus'
import LocationCityIcon from '@mui/icons-material/LocationCity'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import EventContent from 'components/event'
import DestinationContent from 'components/destination'
import HotelContent from 'components/hotel'
import CulinaryContent from 'components/culinary' // âœ… TAMBAHKAN INI

interface Props {}

const WisataContent: React.FunctionComponent<Props> = () => {
  const { downSm } = React.useContext(BreakpointsContext)
  const accessibility = React.useContext(AccessibilityContext)

  const tourismCards = [
    {
      icon: <LocationCityIcon sx={{ fontSize: 48, color: '#C7A97A' }} />,
      title: 'Kota Lama',
      subtitle: 'Ayo Kunjungi Kota Lama Surabaya.',
      description: 'Kota Lama Surabaya adalah warisan sejarah dengan daya tarik arsitektur bangunan kolonial yang megah, jalan-jalan yang sarat sejarah, dan suasana nostalgik yang kental.  Berpusat di jalan Rajawali gugusan bangunan cagar budaya dalam kawasan tersebut merekam sejarah panjang perkembangan Surabaya sebagai kota sejak abad ke-17.  Kawasan Kota Lama Surabaya dibagi menjadi 4 zona; Zona Eropa, Zona Pecinan, Zona Arab, dan Zona Melayu.  Let\'s stroll around Kota Lama Surabaya Beyound Heritage! ',
      buttonText: 'More Information'
    },
    {
      icon: <DirectionsBusIcon sx={{ fontSize: 48, color: '#C7A97A' }} />,
      title: 'Surabaya Sightseeing and City Tour Bus (SSCT)',
      subtitle: '',
      description: 'Surabaya Sightseeing and City Tour (SSCT) adalah salah satu pilihan kegiatan city tour yang tepat jika anda ingin berwisata dengan nyaman di Kota Surabaya. Selama berwisata bersama SSCT anda akan ditemani guide berpengalaman.  City tour yang berlangsung selama kurang lebih 2 hingga 3 jam ini akan memberikan pengalaman baru yang seru dan tak terlupakan.  Selamat berwisata di Surabaya!',
      buttonText: 'More Information'
    },
    {
      icon: <LocalHospitalIcon sx={{ fontSize: 48, color: '#C7A97A' }} />,
      title: 'Perawatan Medis Berkualitas di Surabaya',
      subtitle: '',
      description: 'Nikmati layanan kesehatan terbaik di Surabaya yang didukung rumah sakit berstandar internasional, dokter spesialis berpengalaman, dan teknologi medis terkini.  Proses diagnosis hingga pemulihan Anda akan ditangani secara profesional, memberikan kenyamanan dan rasa aman selama menjalani pengobatan di Kota Pahlawan.',
      buttonText: 'Visit Medical Tourism Surabaya'
    }
  ]

  return (
    <Box sx={{
      width: '100%',
      maxWidth: 1200,
      mx: 'auto',
    }}>
      {/* Header Section - About Surabaya */}
      <Box sx={(theme) => ({
        bgcolor: theme.palette.mode === 'dark' ? '#154E4E' : 'rgba(255, 255, 255, 0.95)',
        borderRadius: downSm ? 3 : 4,
        p: downSm ? 3 : 5,
        mb: downSm ? 3 : 4,
        boxShadow: theme.palette.mode === 'dark' 
          ? '0 8px 32px rgba(0, 0, 0, 0.4)' 
          : '0 8px 32px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        border: theme.palette.mode === 'dark' 
          ? '1px solid rgba(199, 169, 122, 0.2)' 
          : '1px solid rgba(255, 255, 255, 0.18)',
      })}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: downSm ? 2 : 3 }}>
          <img
            src="/images/icon/icon_batik_coklat_kiri.svg"
            alt="icon_batik"
            style={{ width: downSm ? 24 : 32, height: downSm ?  24 : 32, marginRight: downSm ? 8 : 12, display: 'block' }}
          />
          <Typography 
            variant="h4" 
            sx={(theme) => ({ 
              color: theme.palette.mode === 'dark' ? '#C7A97A' : '#006462',
              fontSize: downSm ?  20 : 32 + accessibility.fontSize * 2,
              fontWeight: 700,
              letterSpacing: 1,
            })}
          >
            ABOUT SURABAYA
          </Typography>
        </Box>
        <Typography 
          sx={(theme) => ({ 
            color: theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.85)' 
              : theme.palette.text.secondary,
            fontSize: downSm ? 14 : 17 + accessibility.fontSize,
            lineHeight: 1.8,
            textAlign: downSm ? 'left' : 'justify',
          })}
        >
          The second biggest city in Indonesia, a City of Heroes where fights began and ended yet the heroic spirit lasts.  Enjoy a walk through fascinating historical sites of the past amidst a fast-growing urban tourism a big city has to offer.
        </Typography>
      </Box>

      {/* Private Tour Section */}
      <Box sx={(theme) => ({
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, #154E4E 0%, #0F4545 100%)'
          : 'linear-gradient(135deg, #006462 0%, #00504E 100%)',
        borderRadius: downSm ? 3 : 4,
        p: downSm ? 3 : 4,
        mb: downSm ? 3 : 4,
        boxShadow: theme.palette.mode === 'dark'
          ? '0 8px 32px rgba(0, 0, 0, 0.5)'
          : '0 8px 32px rgba(0, 100, 98, 0.3)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: downSm ? '60%' : '40%',
          height: '100%',
          background: 'url(/images/icon/icon_batik_hijau_kanan.svg) no-repeat',
          backgroundSize: 'contain',
          backgroundPosition: 'right center',
          opacity: 0.1,
        }
      })}>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#fff',
              fontSize: downSm ?  18 : 24 + accessibility.fontSize * 2,
              fontWeight: 700,
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <DirectionsBusIcon sx={{ fontSize: downSm ? 24 : 32 }} />
            PRIVATE TOUR
          </Typography>
          <Typography 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.95)',
              fontSize: downSm ? 13 : 16 + accessibility.fontSize,
              lineHeight: 1.7,
              mb: 2,
            }}
          >
            Kamu punya Grup?  ingin Explore Surabaya bersama Bus SSCT? Kamu bisa booking 24 seat dan pilih destinasi wisata yang ingin kamu tuju... 
          </Typography>
          <Typography 
            sx={{ 
              color: '#C7A97A',
              fontSize: downSm ? 15 : 18 + accessibility. fontSize,
              fontWeight: 600,
              mb: 2,
            }}
          >
            Surabaya Sightseeing & City Tour Bus (SSCT)
          </Typography>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#C7A97A',
              color: '#fff',
              fontWeight: 600,
              px: downSm ? 3 : 4,
              py: downSm ? 1 : 1.5,
              borderRadius: 999,
              textTransform: 'none',
              fontSize: downSm ? 14 : 15,
              '&:hover': {
                bgcolor: '#B89968',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(199, 169, 122, 0.4)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Tanya Admin
          </Button>
        </Box>
      </Box>

      {/* Tourism Cards Grid */}
      <Grid container spacing={downSm ? 2 : 3}>
        {tourismCards.map((card, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={(theme) => ({
              height: '100%',
              bgcolor: theme.palette.mode === 'dark' 
                ? '#1A5555' 
                : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: downSm ? 2 : 3,
              boxShadow: theme.palette.mode === 'dark'
                ? '0 4px 20px rgba(0, 0, 0, 0.4)'
                : '0 4px 20px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s ease',
              border: theme.palette.mode === 'dark'
                ? '1px solid rgba(199, 169, 122, 0.15)'
                : '1px solid rgba(0, 100, 98, 0.1)',
              '&:hover': {
                transform: downSm ? 'translateY(-4px)' : 'translateY(-8px)',
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 12px 40px rgba(199, 169, 122, 0.3)'
                  : '0 12px 40px rgba(0, 100, 98, 0.2)',
                borderColor: '#C7A97A',
              },
            })}>
              <CardContent sx={{ p: downSm ? 2 : 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={(theme) => ({ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mb: 2,
                  p: downSm ? 1.5 : 2,
                  bgcolor: theme.palette.mode === 'dark'
                    ? '#0F3E3E'
                    : 'rgba(0, 100, 98, 0.05)',
                  borderRadius: 2,
                })}>
                  {React.cloneElement(card.icon, { 
                    sx: { fontSize: downSm ? 40 : 48, color: '#C7A97A' } 
                  })}
                </Box>
                <Typography 
                  variant="h6" 
                  sx={(theme) => ({ 
                    color: theme.palette.mode === 'dark' ? '#C7A97A' : '#006462',
                    fontSize: downSm ? 15 : 18 + accessibility.fontSize,
                    fontWeight: 700,
                    mb: 1,
                    textAlign: 'center',
                    minHeight: downSm ? 'auto' : 60,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  })}
                >
                  {card.title}
                </Typography>
                {card.subtitle && (
                  <Typography 
                    sx={{ 
                      color: '#C7A97A',
                      fontSize: downSm ? 12 : 14 + accessibility.fontSize,
                      fontWeight: 600,
                      mb: 2,
                      textAlign: 'center',
                      fontStyle: 'italic',
                    }}
                  >
                    {card.subtitle}
                  </Typography>
                )}
                <Typography 
                  sx={(theme) => ({ 
                    color: theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.8)'
                      : theme.palette.text. secondary,
                    fontSize: downSm ? 12 : 14 + accessibility. fontSize,
                    lineHeight: 1.7,
                    mb: downSm ? 2 : 3,
                    textAlign: 'justify',
                    flex: 1,
                  })}
                >
                  {card.description}
                </Typography>
                <Button
                  variant="outlined"
                  endIcon={<ArrowForwardIcon sx={{ fontSize: downSm ? 16 : 20 }} />}
                  sx={(theme) => ({
                    borderColor: theme.palette.mode === 'dark' ? '#C7A97A' : '#006462',
                    color: theme.palette.mode === 'dark' ? '#C7A97A' : '#006462',
                    fontWeight: 600,
                    py: downSm ? 0.75 : 1,
                    borderRadius: 999,
                    textTransform: 'none',
                    fontSize: downSm ? 12 : 14,
                    '&:hover': {
                      borderColor: '#C7A97A',
                      bgcolor: '#C7A97A',
                      color: '#fff',
                      transform: 'translateX(4px)',
                    },
                    transition: 'all 0.3s ease',
                  })}
                >
                  {card.buttonText}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Event Section */}
      <EventContent />

      {/* Destination Section */}
      <DestinationContent />

      {/* Hotel Section */}
      <HotelContent />

      {/* âœ… TAMBAHKAN: Culinary Section */}
      <CulinaryContent />
    </Box>
  )
}

WisataContent.defaultProps = {}

export default memo(WisataContent)