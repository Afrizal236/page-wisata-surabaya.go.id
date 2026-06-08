import React, { memo, useContext } from 'react'
import { Box, Typography, Stack, Container, IconButton, TextField } from '@mui/material'
import { Search } from '@mui/icons-material'
import { styled } from '@mui/material/styles'
import { AccessibilityContext } from 'contexts/accessibility'

interface Props {
  load: boolean
}

const StyledFooter = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(4),  
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  backgroundImage: "url('/images/footer/bg-batik.svg')",
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  transition: 'background 0.3s, color 0.3s',
  '&.negative': {
    backgroundColor: theme.palette.primary.main, // hijau
    '& .MuiTypography-root, & .MuiSvgIcon-root, & .footer-icon, & input, & .MuiInputBase-input': {
      color: '#FFD600', // font tetap kuning
      filter: 'brightness(1.2) sepia(1) hue-rotate(10deg) saturate(8)',
    },
  },
}))

const Footer: React.FunctionComponent<Props> = ({ load }: Props) => {
  const socialMedia = [
  // Masing-masing diarahkan ke akun resmi Sapawarga Surabaya
  { icon: '/images/footer/icon-fb.svg', url: 'https://www.facebook.com/sapawargakotasurabaya?_rdc=2&_rdr#', label: 'Facebook Sapawarga Surabaya' },
  { icon: '/images/footer/icon-x.svg', url: 'https://x.com/SapawargaSby', label: 'Twitter/X Sapawarga Surabaya' },
  { icon: '/images/footer/icon-ig.svg', url: 'https://instagram.com/sapawargasby', label: 'Instagram Sapawarga Surabaya' },
  { icon: '/images/footer/icon-yt.svg', url: 'https://www.youtube.com/user/MediaCenterPemkotSby', label: 'YouTube Sapawarga Surabaya' },
  { icon: '/images/footer/icon-tt.svg', url: 'https://www.tiktok.com/@sapawargasby', label: 'TikTok Sapawarga Surabaya' },
  ]
  const accessibility = useContext(AccessibilityContext)
  return (
    <StyledFooter
      sx={{
        display: load ? 'none' : 'block',
        filter: `grayscale(${accessibility.css.grayscale ? '100%' : '0'})`,
        fontSize: 16 + accessibility.fontSize,
      }}
      className={accessibility.css.negative ? 'negative' : ''}
    >
      <Container maxWidth="xl">
        <Box
          display="flex"
          flexDirection={{ xs: 'column', md: 'row' }}
          justifyContent="center"
          alignItems="flex-start"
          gap={{ xs: 4, md: 18 }}
          pb={2}
        >
          {/* Kiri */}
          <Box flex={1} minWidth={220} maxWidth={340}>
            <Stack spacing={3.5} alignItems="flex-start">
              <Box display="flex" alignItems="center" gap={1}>
                <Box
                  component="img"
                  src="/images/footer/logo-footer.svg"
                  alt="Logo Surabaya"
                  sx={{ height: 40 }}
                  className="footer-logo"
                />
              </Box>
              <Typography variant="caption" sx={{ opacity: 0.85, fontSize: 14 + accessibility.fontSize, lineHeight: 1.2 }}>
                Dikelola oleh Bidang Informasi dan <br /> Komunikasi Publik serta Statistik Dinas <br /> Komunikasi dan Informatika Kota <br />Surabaya
              </Typography>
              <Stack direction="row" spacing={2}>
                {socialMedia.map((item, i) => (
                  <IconButton color="inherit" href={item.url} target="_blank" aria-label={item.label} sx={{ p: 0 }} key={i}>
                    <Box component="img" src={item.icon} alt={item.label} sx={{ width: 28, height: 28 }} className="footer-icon" />
                  </IconButton>
                ))}
              </Stack>
            </Stack>
          </Box>
          {/* Tengah */}
          <Box flex={1} minWidth={220} maxWidth={340}>
            <Stack spacing={4} alignItems="flex-start">
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  component="img"
                  src="/images/footer/icon-phone.svg"
                  alt="Telepon"
                  sx={{ width: 38, height: 38 }}
                  className="footer-icon"
                />
                <Box>
                   <Typography
                    variant="body2"
                    component="a"
                    href="https://wa.me/62315321444"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      fontSize: 14 + accessibility.fontSize,
                      display: 'block',
                      textDecoration: 'none',
                      color: 'inherit',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    (031) 5321444
                  </Typography>
                  <Typography
                    variant="body2"
                    component="a"
                    href="https://wa.me/623199277339"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      fontSize: 14 + accessibility.fontSize,
                      display: 'block',
                      textDecoration: 'none',
                      color: 'inherit',
                      mt: 0.5,
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    (031) 99277339
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  component="img"
                  src="/images/footer/icon-msg.svg"
                  alt="Email"
                  sx={{ width: 38, height: 46 }}
                  className="footer-icon"
                />
                <Box>
                  <Typography
                    variant="body2"
                    component="div"
                    sx={{ fontSize: 14 + accessibility.fontSize, lineHeight: 1.4 }}
                  >
                    <Box
                      component="a"
                      href="mailto:dinkominfo@surabaya.go.id"
                      sx={{
                        color: 'inherit',
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      dinkominfo@surabaya.go.id
                    </Box>
                    <br />
                    <Box
                      component="a"
                      href="mailto:mediacenter@surabaya.go.id"
                      sx={{
                        color: 'inherit',
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      mediacenter@surabaya.go.id
                    </Box>
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" alignItems="flex-start" spacing={2}>
                <Box
                  component="img"
                  src="/images/footer/icon-loc.svg"
                  alt="Lokasi"
                  sx={{ width: 38, height: 46 }}
                  className="footer-icon"
                />
                  <Typography variant="body2" sx={{ fontSize: 14 + accessibility.fontSize }}>
                  Jl. Jimerto No. 25-27, Ketabang, Kec.<br />
                  Genteng, Kota SBY, Jawa Timur 60272
                </Typography>
              </Stack>
            </Stack>
          </Box>
          {/* Kanan */}
          <Box
            flex={1}
            minWidth={180}
            maxWidth={260}
            display="flex"
            flexDirection="column"
            alignItems={{ xs: 'flex-start', md: 'flex-end' }}
            justifyContent="center"
            sx={{ height: '100%' }}
          >
            <Box
              display="flex"
              flexDirection="column"
              alignItems={{ xs: 'flex-start', md: 'flex-end' }}
              justifyContent="center"
              sx={{ height: '100%' }}
            >
              <Box
                component="form"
                sx={{
                  bgcolor: '#D2B690',
                  borderRadius: 10,
                  px: 2,
                  py: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  width: { xs: '100%', md: 260 },
                  mb: 2, 
                }}
              >
                <Search sx={{ color: '#fff', mr: 1 }} />
                <TextField
                  variant="standard"
                  placeholder="Pencarian"
                  InputProps={{
                    disableUnderline: true,
                    style: { color: accessibility.css.negative ? '#FFD600' : '#fff', fontSize: 16 + accessibility.fontSize },
                  }}
                  sx={{ flex: 1 }}
                />
              </Box>
              <Box
                display="flex"
                alignItems="center"
                sx={{ width: { xs: '100%', md: 260 } }}
              >
                <Box
                  component="img"
                  src="/images/footer/icon-cc.svg"
                  alt="Copyright"
                  sx={{ width: 24, height: 24, mr: 1 }}
                  className="footer-icon"
                />
                <Typography variant="body2" color={accessibility.css.negative ? '#FFD600' : '#fff'} sx={{ fontSize: 14 + accessibility.fontSize }}>
                  {`${new Date().getFullYear()} Pemerintah Kota Surabaya`}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </StyledFooter>
  )
}

export default memo(Footer)
