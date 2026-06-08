import React, { useRef, useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import schema from 'types/schemas';
import useTextToSpeech from 'hooks/useTextToSpeech';
import { imagePath } from 'components/news.item';

export interface BeritaLainnyaItem {
  id: string;
  judul: string;
  tanggal: string;
  gambarUrl?: string;
}

interface BeritaLainnyaProps {
  items: schema['schemas']['Article'][];
  onLihatSemua?: () => void;
}

const SectionContainer = styled(Box)(() => ({
  position: 'relative',
  width: '100%',
  background: 'none',
  '& > *': {
    position: 'relative',
    zIndex: 1,
  },
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  maxWidth: '1200px',
  margin: '0 auto',
  padding: theme.spacing(0, 2),
  paddingTop: '48px',
  position: 'relative',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(0, 1),
    paddingTop: '40px',
  },
  [theme.breakpoints.down('sm')]: {
    paddingTop: '32px',
  },
}));

const HeaderContainer = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '30px',
}));

const TitleText = styled(Typography)(({ theme }) => ({
  fontSize: '20px',
  fontWeight: 800,
  color: theme.palette.mode === 'dark' ? '#fff' : '#006462',
  fontFamily: "'Roboto', Arial, sans-serif",
  textTransform: 'uppercase',
}));

const LihatSemuaButton = styled('button')(() => ({
  padding: 0,
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  transition: 'opacity 0.2s',
  '&:hover': {
    opacity: 0.8,
  },
}));

const SliderWrapper = styled(Box)(() => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
}));

const SliderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '20px',
  margin: '0 auto',
  paddingLeft: '8px',
  paddingRight: '8px',
  width: '100%',
  marginBottom: '100px',
  overflowX: 'auto',
  scrollBehavior: 'smooth',
  paddingBottom: '10px',
  paddingTop: '15px',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  scrollbarWidth: 'none',
  [theme.breakpoints.down('md')]: {
    gap: '16px',
    marginBottom: '50px',
    paddingTop: '12px',
  },
  [theme.breakpoints.down('sm')]: {
    gap: '12px',
    paddingTop: '10px',
  },
}));

const NewsCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 57, 55, 0.85)' : 'rgba(255, 255, 255, 0.95)',
  borderRadius: '30px',
  border: `1.5px solid ${theme.palette.mode === 'dark' ? theme.palette.secondary.main : '#D2B690'}`,
  cursor: 'pointer',
  transition: 'all 0.3s ease-in-out',
  width: '372px', // lebih besar agar 3 card saja yang muat di 1200px
  height: '350px',
  boxShadow: theme.palette.mode === 'dark' ? '0px 2px 8px 0px #003937cc' : '0px 2px 8px 0px #00000022',
  flexShrink: 0,
  backdropFilter: 'blur(10px)',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.secondary.main : '#006462',
    '& .card-title': {
      color: theme.palette.mode === 'dark' ? theme.palette.background.paper : 'white',
    },
    '& .card-date': {
      color: theme.palette.mode === 'dark' ? theme.palette.background.paper : 'white',
    },
  },
  [theme.breakpoints.down('md')]: {
    width: '300px',
    height: '280px',
  },
  [theme.breakpoints.down('sm')]: {
    width: '240px',
    height: '210px',
  },
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '220px',
  overflow: 'hidden',
  borderRadius: '30px',
  [theme.breakpoints.down('md')]: {
    height: '180px',
  },
  [theme.breakpoints.down('sm')]: {
    height: '150px',
  },
}));

const TextContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '130px',
  paddingLeft: '16px',
  paddingRight: '16px',
  paddingTop: '20px',
  paddingBottom: '20px',
  gap: '10px',
  [theme.breakpoints.down('md')]: {
    padding: '16px 14px',
    height: '140px',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '14px 12px',
    height: '140px',
  },
}));

const CardTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "'Lato', Arial, sans-serif",
  fontWeight: 800,
  fontSize: '18px',
  color: theme.palette.mode === 'dark' ? '#fff' : '#006462',
  height: 'auto',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  transition: 'color 0.3s ease-in-out',
  [theme.breakpoints.down('md')]: {
    fontSize: '16px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '14px',
  },
}));

const CardDate = styled(Typography)(({ theme }) => ({
  fontFamily: "'Lato', Arial, sans-serif",
  fontSize: '13px',
  color: theme.palette.mode === 'dark' ? '#fff' : '#474747',
  width: '100%',
  height: 'auto',
  transition: 'color 0.3s ease-in-out',
  [theme.breakpoints.down('md')]: {
    fontSize: '12px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '11px',
  },
}));

const NavigationButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '170px',
  width: '41px',
  height: '41px',
  padding: 0,
  margin: 0,
  backgroundColor: 'transparent',
  border: 'none',
  boxShadow: 'none',
  zIndex: 50,
  '&:hover': {
    backgroundColor: 'transparent',
    opacity: 0.8,
  },
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const LeftButton = styled(NavigationButton)(() => ({
  left: '-60px',
}));

const RightButton = styled(NavigationButton)(() => ({
  right: '-55px',
}));

const BeritaLainnya: React.FC<BeritaLainnyaProps> = ({ items, onLihatSemua }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { textToSpeech } = useTextToSpeech();

  const [startIdx, setStartIdx] = useState(0);
  const cardsPerView = 3;
  const cardWidth = 370 + 20; // width + gap (px), harus sama dengan NewsCard dan gap di SliderContainer
  const maxIdx = Math.max(0, items.length - cardsPerView);

  // Scroll otomatis ke card ke-n saat klik next/prev
  const scrollToCard = (idx: number) => {
    if (scrollRef.current) {
      const card = scrollRef.current.children[idx] as HTMLElement;
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      }
    }
  };

  const handlePrev = () => {
    setStartIdx((prev) => {
      const nextIdx = Math.max(0, prev - 1);
      scrollToCard(nextIdx);
      return nextIdx;
    });
  };
  const handleNext = () => {
    setStartIdx((prev) => {
      const nextIdx = Math.min(maxIdx, prev + 1);
      scrollToCard(nextIdx);
      return nextIdx;
    });
  };

  const handleCardClick = (news: schema['schemas']['Article']) => {
    if (news.id && news.slug) {
      router.push(`/id/berita/${news.id}/${news.slug}`);
    }
  };

  // Fungsi untuk generate URL gambar yang benar
  const getImageUrl = (item: schema['schemas']['Article']) => {
    if (!item.feature_image_url) return null;
    
    // Jika URL sudah lengkap (http/https), gunakan langsung
    if (item.feature_image_url.startsWith('http')) {
      return item.feature_image_url;
    }
    
    // Gunakan fungsi imagePath untuk URL relatif
    return imagePath(item.id || 0, item.feature_image_url, false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    // Hitung selisih hari (dummy untuk sekarang)
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return `${dayName}, ${day} ${month} ${year} | ${diffDays} hari yang lalu`;
  };

  return (
    <SectionContainer>
      <ContentWrapper>
        {/* Judul dan tombol lihat semua */}
        <HeaderContainer>
          <TitleText>BERITA LAINNYA</TitleText>
          {onLihatSemua && (
            <LihatSemuaButton onClick={onLihatSemua}>
              <Box
                sx={{
                  width: '153.05px',
                  height: '39.34px',
                  backgroundColor: '#006462',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  gap: '10px',
                }}
              >
                <Box
                  component="img"
                  src="/images/icon/nav-view all.svg"
                  alt="lihat semua"
                  sx={{ width: '28px', height: '28px', display: 'inline-block' }}
                />
                <span style={{ fontWeight: 700 }}>lihat semua</span>
              </Box>
            </LihatSemuaButton>
          )}
        </HeaderContainer>

        {/* Slider wrapper */}
        <SliderWrapper>
          {/* Icon Slide Kiri */}
          <LeftButton onClick={handlePrev} aria-label="Sebelumnya" disabled={startIdx === 0}>
            <Box
              component="img"
              src="/images/icon/nav-prev green.svg"
              alt="Sebelumnya"
              sx={{ width: '41px', height: '41px', display: 'block', opacity: startIdx === 0 ? 0.3 : 1 }}
            />
          </LeftButton>

          {/* List berita */}
          <SliderContainer ref={scrollRef}>
            {items.map((item) => (
              <NewsCard
                key={item.id}
                onClick={() => handleCardClick(item)}
              >
                {/* Gambar */}
                <ImageContainer>
                  {item.feature_image_url ? (
                    <img
                      src={getImageUrl(item) || ''}
                      alt={item.title || ''}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '30px',
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div style="
                              width: 100%; 
                              height: 100%; 
                              background-color: #f5f5f5; 
                              display: flex; 
                              align-items: center; 
                              justify-content: center; 
                              color: #999;
                              border-radius: 30px;
                              font-family: 'Lato', Arial, sans-serif;
                            ">
                              Gambar tidak tersedia
                            </div>
                          `;
                        }
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#f5f5f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#999',
                      borderRadius: '30px',
                      fontFamily: "'Lato', Arial, sans-serif",
                    }}>
                      Gambar tidak tersedia
                    </div>
                  )}
                </ImageContainer>

                {/* Konten Teks */}
                <TextContent>
                  <CardTitle 
                    className="card-title"
                    onMouseEnter={(e) => textToSpeech(e, true)}
                  >
                    {item.title}
                  </CardTitle>
                  <CardDate className="card-date">
                    {formatDate(item.publish_date || '')}
                  </CardDate>
                </TextContent>
              </NewsCard>
            ))}
          </SliderContainer>

          {/* Icon Slide Kanan */}
          <RightButton onClick={handleNext} aria-label="Berikutnya" disabled={startIdx >= maxIdx}>
            <Box
              component="img"
              src="/images/icon/nav-next green.svg"
              alt="Berikutnya"
              sx={{ width: '41px', height: '41px', display: 'block', opacity: startIdx >= maxIdx ? 0.3 : 1 }}
            />
          </RightButton>
        </SliderWrapper>
      </ContentWrapper>
    </SectionContainer>
  );
};

export default BeritaLainnya;
