import React, { memo } from 'react'
import {
  Box,
  Skeleton,
  Grid,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { AccessibilityContext } from 'contexts/accessibility'

interface Props {}

const BoxStyled = styled(Box)(({ theme }) => ({
  width: '95%',
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  marginTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'rgba(0,0,0,0.5)',
  borderRadius: 20,
//   boxShadow: '0 4px 20px rgba(21, 3, 3, 1)',
  marginLeft: 'auto',
  marginRight: 'auto',
  // maxWidth: 1200,
  [theme.breakpoints.up('md')]: {
    paddingLeft: theme.spacing(20),
    paddingRight: theme.spacing(20),
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
}))

// Flip card styles
const FlipCardContainer = styled(Box)(() => ({
  perspective: '1200px',
  width: '100%',
  aspectRatio: '16/9',
  borderRadius: '12px',
  cursor: 'pointer',
  margin: '0 auto',
  position: 'relative',
  height: '100%',
}));

const FlipCardInner = styled(Box)(() => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  transition: 'transform 0.6s cubic-bezier(.25,.8,.25,1)',
  transformStyle: 'preserve-3d',
  borderRadius: '12px',
  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
  '&.flipped': {
    transform: 'rotateY(180deg)',
  },
}));

const FlipCardFace = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  backfaceVisibility: 'hidden',
  borderRadius: '12px',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'transparent',
  color: 'inherit',
  fontSize: 'inherit',
  fontWeight: 'inherit',
  padding: 0,
  textAlign: 'left',
  zIndex: 1,
  transition: 'background 0.3s',
  '&.back': {
    background: 'rgba(0, 100, 98, 0.7)',
    color: '#fff',
    fontSize: '1.2rem',
    fontWeight: 600,
    padding: '2rem',
    textAlign: 'center',
    zIndex: 2,
    transform: 'rotateY(180deg)',
  },
}));

const HomeSection7: React.FunctionComponent<Props> = () => {
  const accessibility = React.useContext(AccessibilityContext)
  const loading = false

  // Sample photos data - replace with actual data from API
    const photos = [
      {
        id: '1',
        title: 'Kegiatan Penanaman Pohon',
        image: '/images/photos/foto_panen_padi.jpg',
        alt: 'Foto kegiatan penanaman pohon bersama masyarakat'
      },
      {
        id: '2',
        title: 'Gotong Royong Lingkungan',
        image: '/images/photos/foto_panen_padi.jpg',
        alt: 'Foto kegiatan gotong royong membersihkan lingkungan'
      },
      {
        id: '3',
        title: 'Acara Budaya Surabaya',
        image: '/images/photos/foto_panen_padi.jpg',
        alt: 'Foto acara budaya khas Surabaya'
      },
      {
        id: '4',
        title: 'Program Pembangunan',
        image: '/images/photos/foto_panen_padi.jpg',
        alt: 'Foto program pembangunan infrastruktur'
      },
      {
        id: '5',
        title: 'Festival Kuliner',
        image: '/images/photos/foto_panen_padi.jpg',
        alt: 'Foto festival kuliner Surabaya'
      },
      {
        id: '6',
        title: 'Pameran Seni',
        image: '/images/photos/foto_panen_padi.jpg',
        alt: 'Foto pameran seni Surabaya'
      },
      {
        id: '7',
        title: 'Lomba Kebersihan',
        image: '/images/photos/foto_panen_padi.jpg',
        alt: 'Foto lomba kebersihan lingkungan'
      },
      {
        id: '8',
        title: 'Pelatihan UMKM',
        image: '/images/photos/foto_panen_padi.jpg',
        alt: 'Foto pelatihan UMKM Surabaya'
      },
    ]

  // handlePhotoClick removed (unused)

  return (
    <BoxStyled
      sx={{
        filter: `grayscale(${accessibility.css.grayscale ? '100%' : '0'})`,
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: { xs: 1, md: 0 }, pb: 0, width: '100%', maxWidth: 1100 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img
            src="/images/icon/icon_batik_hijau_kanan.svg"
            alt="icon_batik"
            style={{ width: 32, height: 32, marginRight: 12, display: 'block' }}
          />
                     <Box component="span" sx={(theme) => ({ color: theme.palette.text.primary, fontSize: 28 + accessibility.fontSize * 2, fontWeight: 600, letterSpacing: 1, lineHeight: 1 })}>
                                                 FOTO
                                               </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#fff',
              color: '#C7A97A',
              border: 'none',
              borderRadius: 999,
              padding: '6px 18px',
              fontWeight: 500,
              cursor: 'pointer',
              fontSize: 15,
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              transition: 'background 0.2s, color 0.2s',
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = '#C7A97A'
              e.currentTarget.style.color = '#fff'
              const svg = e.currentTarget.querySelector('svg path')
              if (svg) svg.setAttribute('fill', '#fff')
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = '#fff'
              e.currentTarget.style.color = '#C7A97A'
              const svg = e.currentTarget.querySelector('svg path')
              if (svg) svg.setAttribute('fill', '#C7A97A')
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ display: 'inline', verticalAlign: 'middle' }}>
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5zm0 12c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-7A2.5 2.5 0 1 0 12 16a2.5 2.5 0 0 0 0-5z" fill="#C7A97A"/>
            </svg>
            Lihat Semua
          </button>
        </Box>
      </Box>
      
      <Box sx={{ px: { xs: 3, md: 2 }, pt: 4, width: '100%', maxWidth: 1100, mx: 'auto', position: 'relative' }}>
        {loading ? (
          <Grid container spacing={2}>
            {[1,2,3,4,5,6,7,8].map((item, idx) => (
              <Grid item xs={12} sm={4} md={
                idx < 3 ? 4 : (idx < 5 ? 6 : 4)
              } key={item}>
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={200}
                  sx={{
                    borderRadius: 3,
                    bgcolor: 'rgba(0, 0, 0, 0.1)',
                  }}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={2}>
            {photos.map((photo, idx) => (
              <Grid item xs={12} sm={4} md={
                idx < 3 ? 4 : (idx < 5 ? 6 : 4)
              } key={photo.id}>
                <FlipCardContainer>
                  <FlipCardHover photo={photo} />
                </FlipCardContainer>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </BoxStyled>
  )
}

// FlipCardHover component
const FlipCardHover = ({ photo }) => {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      style={{ width: '100%', height: '100%' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <FlipCardInner className={hover ? 'flipped' : ''}>
        <FlipCardFace>
          <img
            src={photo.image}
            alt={photo.alt}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { e.currentTarget.src = '/images/placeholder-photo.jpg'; }}
          />
        </FlipCardFace>
        <FlipCardFace className="back">
          {photo.title}
        </FlipCardFace>
      </FlipCardInner>
    </div>
  );
};

HomeSection7.defaultProps = {};

export default memo(HomeSection7);
