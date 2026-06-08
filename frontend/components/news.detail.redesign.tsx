// CardStyled: adopsi dari Sekilas
const CardStyled = styled(Box)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'rgba(0, 57, 55, 0.85)'
    : 'rgba(255,255,255,0.60)',
  borderRadius: 16,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 4px 24px rgba(0,0,0,0.30)'
    : '0 4px 24px rgba(0,0,0,0.10)',
  padding: theme.spacing(4, 4),
  maxWidth: 1200,
  margin: '32px auto 48px auto',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2, 1),
    maxWidth: '100%',
    margin: '24px auto 32px auto',
  },
}));
import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import schema from 'types/schemas';
import useTextToSpeech from 'hooks/useTextToSpeech';
import { imagePath } from 'components/news.item';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

export interface BeritaDetailProps {
  news: schema['schemas']['Article'];
  contents: string[];
}

const MainContainer = styled(Box)(() => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  minHeight: '100vh',
  overflowX: 'hidden',
  background: 'none',
}));

const ContentSection = styled(Box)(() => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  paddingTop: '5px',
  paddingBottom: '0px',
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '1200px',
  padding: theme.spacing(0, 2),
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
    padding: theme.spacing(0, 1),
  },
}));

const BreadcrumbContainer = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  marginBottom: '4px',
  marginTop: '160px',
}));

const BackButton = styled('button')(() => ({
  padding: 0,
  margin: 0,
  backgroundColor: 'transparent',
  border: 'none',
  outline: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  '&:hover': {
    opacity: 0.8,
  },
}));

const BreadcrumbText = styled(Typography)(({ theme }) => ({
  fontFamily: "'Lato', Arial, sans-serif",
  fontSize: '20px',
  color: theme.palette.mode === 'dark' ? '#fff' : '#006462',
  fontWeight: 800,
  textTransform: 'uppercase',
}));

const TitleText = styled(Typography)(({ theme }) => ({
  fontFamily: "'Roboto', Arial, sans-serif",
  fontSize: '24px',
  color: theme.palette.mode === 'dark' ? theme.palette.text.primary : '#474747',
  fontWeight: 800,
  lineHeight: 1.3,
  marginBottom: '12px',
  marginTop: '20px',
  [theme.breakpoints.down('md')]: {
    fontSize: '20px',
    marginTop: '16px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '18px',
    marginTop: '12px',
  },
}));

const DateText = styled(Typography)(({ theme }) => ({
  fontFamily: "'Roboto', Arial, sans-serif",
  fontSize: '14px',
  color: theme.palette.mode === 'dark' ? '#fff' : '#474747',
  marginBottom: '16px',
  [theme.breakpoints.down('md')]: {
    fontSize: '13px',
    marginBottom: '14px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '12px',
    marginBottom: '12px',
  },
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '490px',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
  marginBottom: '40px',
  marginTop: '20px',
  [theme.breakpoints.down('md')]: {
    height: '360px',
    marginTop: '18px',
  },
  [theme.breakpoints.down('sm')]: {
    height: '240px',
    marginTop: '14px',
  },
}));

const ContentArticle = styled(Box)(({ theme }) => ({
  fontFamily: "'Lato', Arial, sans-serif",
  fontSize: '16px',
  color: theme.palette.mode === 'dark' ? '#fff' : '#474747',
  textAlign: 'justify',
  lineHeight: '2rem',
  marginTop: '20px',
  marginBottom: '50px',
  // Force all nested text to white in dark mode
  ...(theme.palette.mode === 'dark' && {
    '&, & *': {
      color: '#fff !important',
      borderColor: '#fff',
      fontFamily: "'Lato', Arial, sans-serif !important",
    },
    '& a': {
      color: theme.palette.secondary.main + ' !important',
    },
    '& ul li': {
      color: '#fff !important',
      fontFamily: "'Lato', Arial, sans-serif !important",
    },
    '& h1, & h2, & h3, & h4, & h5, & h6': {
      color: '#fff !important',
      fontFamily: "'Lato', Arial, sans-serif !important",
    },
  }),
  '& p': {
    marginTop: 0,
    marginBottom: 0,
    padding: 0,
    color: theme.palette.mode === 'dark' ? '#fff' : '#474747',
    fontFamily: "'Lato', Arial, sans-serif",
    fontSize: '16px',
    lineHeight: '22px',
  },
  '& img': {
    maxWidth: '100%',
    marginBottom: '16px',
  },
  'iframe, video': {
    width: '100%',
  },
  '& .pdf-viewer': {
    margin: '24px 0',
    width: '100%',
  },
  video: {
    height: 'auto',
  },
  '& a': {
    color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : '#006462',
    textDecoration: 'underline',
    wordWrap: 'break-word',
    '&:hover': {
      color: theme.palette.mode === 'dark' ? theme.palette.primary.main : '#2c6f9e',
    },
  },
  '& ul': {
    listStyle: 'disc',
    marginLeft: theme.spacing(3),
    marginBottom: theme.spacing(6),
    '& li': {
      color: theme.palette.mode === 'dark' ? '#fff' : '#006462',
      marginBottom: theme.spacing(1),
      wordWrap: 'break-word',
    },
  },
  '& h1, & h2, & h3, & h4, & h5, & h6': {
    fontFamily: "'Roboto', Arial, sans-serif",
    fontWeight: 600,
    color: theme.palette.mode === 'dark' ? '#fff' : '#222',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
    wordWrap: 'break-word',
  },
  '& h3': {
    fontSize: '20px',
    lineHeight: '24px',
  },
  '& strong, & b': {
    fontWeight: 700,
  },
}));

const BeritaDetail: React.FC<BeritaDetailProps> = ({ news, contents }) => {
  const router = useRouter();
  const { textToSpeech } = useTextToSpeech();
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  // Fungsi untuk generate URL gambar yang benar
  const getImageUrl = (news: schema['schemas']['Article']) => {
    if (!news.feature_image_url) return null;
    
    // Jika URL sudah lengkap (http/https), gunakan langsung
    if (news.feature_image_url.startsWith('http')) {
      return news.feature_image_url;
    }
    
    // Gunakan fungsi imagePath untuk URL relatif
    return imagePath(news.id || 0, news.feature_image_url, false);
  };

  const handleBack = () => {
    router.push('/id/berita');
  };

  // Format tanggal sesuai dengan format yang diinginkan
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
    <MainContainer>
      <ContentSection>
        <ContentWrapper>
          {/* Breadcrumb */}
          <BreadcrumbContainer>
            <BackButton onClick={handleBack} aria-label="Kembali ke daftar berita">
              <Box
                component="img"
                src="/images/icon/nav-prev yellow.svg"
                alt="Kembali"
                sx={{
                  width: '40px',
                  height: '40px',
                  display: 'block',
                  marginRight: '12px',
                }}
              />
            </BackButton>
            <BreadcrumbText>BERITA</BreadcrumbText>
          </BreadcrumbContainer>

          {/* Judul */}
          <TitleText onMouseEnter={(e) => textToSpeech(e, true)}>
            {news.title}
          </TitleText>

          {/* Tanggal */}
          <DateText>
            {formatDate(news.publish_date || '')}
          </DateText>

          {/* Gambar utama */}
          {news.feature_image_url && (
            <ImageContainer>
              <img
                src={getImageUrl(news) || ''}
                alt={news.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
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
                        font-family: 'Roboto', Arial, sans-serif;
                      ">
                        Gambar tidak tersedia
                      </div>
                    `;
                  }
                }}
              />
            </ImageContainer>
          )}

          {/* CardStyled untuk isi berita */}
          <CardStyled>
            <ContentArticle onMouseEnter={() => textToSpeech(news.content || '', false)}>
              {contents.map((item, i) => {
                const isPdf = item && item.substring(0, 5) === '<pdf>';
                if (isPdf) {
                  const tagPdf = /<pdf>(.*?)<\/pdf>/g.exec(item);
                  if (tagPdf && tagPdf.length) {
                    return (
                      <Box key={i} className="pdf-viewer">
                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
                          <Viewer
                            fileUrl={tagPdf[0].replace('<pdf>', '').replace('</pdf>', '')}
                            plugins={[defaultLayoutPluginInstance]}
                          />
                        </Worker>
                      </Box>
                    );
                  }
                }

                return (
                  <div
                    key={i}
                    className="text"
                    dangerouslySetInnerHTML={{ __html: item }}
                  />
                );
              })}
            </ContentArticle>
          </CardStyled>
        </ContentWrapper>
      </ContentSection>
    </MainContainer>
  );
};

export default BeritaDetail;
