
"use client";

import React, { memo } from 'react';
import { Box, Skeleton } from '@mui/material';
import { SliderType } from 'components/home.section1';

interface Props {
  data: SliderType[]
  loading: boolean
}



const CarouselMain: React.FunctionComponent<Props> = ({ data, loading }: Props) => {
  // Ambil 4 gambar, fallback skeleton jika loading
  const images = loading
    ? Array(4).fill(null)
    : data.slice(0, 4).map(v => `https://surabaya.go.id/uploads/${v.feature_image}`);

  // Transformasi dan hover sesuai contoh
  const transforms = [
    'rotate(-15deg) translateY(90px) translateX(50px)',
    'rotate(-4deg) translateY(50px) translateX(0px)',
    'rotate(6deg) translateY(55px) translateX(-30px)',
    'rotate(15deg) translateY(95px) translateX(-50px)'
  ];
  const hoverTransforms = [
    'rotate(0deg) scale(1.3) translateY(10px) translateX(18px)',
    'rotate(0deg) scale(1.3) translateY(8px) translateX(-18px)',
    'rotate(0deg) scale(1.3) translateY(8px) translateX(-18px)',
    'rotate(0deg) scale(1.3) translateY(10px) translateX(-18px)'
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 0,
        mt: 2,
        justifyContent: 'center',
        alignItems: 'flex-end',
        position: 'relative',
        zIndex: 2,
        width: '100%',
        minHeight: 320,
      }}
    >
      {images.map((img, idx) => (
        <Box
          key={idx}
          sx={{
            position: 'relative',
            zIndex: 2 + idx,
            mx: idx === 1 || idx === 2 ? -3 : -1,
            transform: transforms[idx],
            boxShadow: '0 8px 24px 0 rgba(0,0,0,0.18)',
            borderRadius: '18px',
            overflow: 'hidden',
            width: 230,
            height: 290,
            background: '#fff',
            border: '8px solid #fff',
            transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s cubic-bezier(0.4,0,0.2,1), z-index 0s',
            '&:hover': {
              transform: hoverTransforms[idx],
              boxShadow: '0 16px 32px 0 rgba(0,0,0,0.22)',
              zIndex: 10,
            }
          }}
        >
          {loading ? (
            <Skeleton variant="rectangular" width="100%" height="100%" />
          ) : (
            <img
              src={img}
              alt={`foto${idx + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}
        </Box>
      ))}
    </Box>
  );
}

CarouselMain.defaultProps = {}

export default memo(CarouselMain)
