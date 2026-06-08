import {
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Note: removed unused imports and constants



export const StyledBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.spacing(4),
  boxShadow: '0 2px 16px rgba(0,0,0,0.10)',
  background: theme.palette.background.paper,
  '&.main': {
    background: '#fff',
    borderRadius: theme.spacing(4),
    boxShadow: '0 2px 16px rgba(0,0,0,0.10)',
    padding: 0,
    color: '#222',
    // Rounded corners on the viewport area
    '& .slick-list': {
      borderRadius: theme.spacing(4),
      overflow: 'hidden',
    },
    '& .MuiGrid-container': {
      position: 'relative',
      minHeight: 300,
    },
    '& .MuiGrid-container .MuiGrid-item:first-of-type': {
      flexBasis: '100% !important',
      maxWidth: '100% !important',
    },
    '& .MuiGrid-container .MuiGrid-item:nth-of-type(2)': {
      position: 'absolute',
      inset: 0,
      width: '60%',
      display: 'flex',
      alignItems: 'flex-end',
      padding: theme.spacing(4),
    },
    // Dark-to-transparent overlay on image
    '& .content-img': { position: 'relative' },
    '& .content-img::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: '70%',
      background:
        'linear-gradient(90deg, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.00) 85%)',
      zIndex: 1,
      pointerEvents: 'none',
      borderTopLeftRadius: theme.spacing(4),
      borderBottomLeftRadius: theme.spacing(4),
    },
    // Ensure the image covers full hero height
    '& .content-img img': {
      height: '100%',
      maxHeight: 420,
      objectFit: 'cover',
    },
    // Text styles over the overlay
    '& .inner, & .title, & .description, & .date': {
      position: 'relative',
      zIndex: 2,
    },
    '& .title': {
      color: '#fff',
      textTransform: 'uppercase',
      fontWeight: 800,
      textShadow: '0 2px 6px rgba(0,0,0,0.35)',
    },
    '& .description': {
      color: '#fff',
      opacity: 0.95,
      textShadow: '0 1px 3px rgba(0,0,0,0.25)',
    },
    '& .date': {
      color: '#fff',
      background: '#D2B690',
      display: 'inline-block',
      padding: theme.spacing(0.5, 1.5),
      borderRadius: 999,
    },
    [theme.breakpoints.down('lg')]: {
      '& .MuiGrid-container': { minHeight: 360 },
      '& .MuiGrid-container .MuiGrid-item:nth-of-type(2)': { width: '70%', padding: theme.spacing(3) },
    },
    [theme.breakpoints.down('md')]: {
      '& .MuiGrid-container': { minHeight: 300 },
      '& .MuiGrid-container .MuiGrid-item:nth-of-type(2)': { width: '85%' },
    },
    [theme.breakpoints.down('sm')]: {
      '& .MuiGrid-container': { minHeight: 240 },
      '& .MuiGrid-container .MuiGrid-item:nth-of-type(2)': {
        width: '100%',
        padding: theme.spacing(2),
      },
      '& .content-img::after': { width: '100%' },
    },
  // Hide arrows in the main hero carousel
  '& .slick-arrow': { display: 'none !important' },
  },
  '&.thumb': {
    background: 'transparent',
    borderRadius: 0,
  boxShadow: 'none',
    marginTop: theme.spacing(2),
    padding: 0,
    '& .slick-slider': {
      maxWidth: 1180,
      margin: '0 auto',
      '& .slick-list': {
        borderRadius: 0,
        overflow: 'visible',
        '& .slick-track': {
          display: 'flex',
          alignItems: 'stretch',
          '& .slick-slide': {
            margin: theme.spacing(0, 2, 0, 0),
            height: 'auto',
            '& > div': { height: '100%' },
            // Card-like thumbnails
            '& a': {
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              minHeight: 130,
              border: '3px solid rgba(208, 169, 115, 0.55)',
              borderRadius: theme.spacing(3),
              overflow: 'hidden',
              background: '#fff',
            },
            '& a .content-img': {
              position: 'relative',
              borderTopLeftRadius: theme.spacing(3),
              borderTopRightRadius: theme.spacing(3),
              overflow: 'hidden',
            },
            '& a .content-img img': {
              display: 'block',
              width: '100%',
              borderRadius: `${theme.spacing(3)} ${theme.spacing(3)} 0 0`,
              // More panoramic like the reference
              aspectRatio: '16/9',
            },
            // Top-to-bottom dark gradient only in thumbnails (Pasted Image 2)
            '& a .content-img::after': {
              content: '""',
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              height: '60%',
              background:
                'linear-gradient(180deg, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.08) 70%, rgba(0,0,0,0.00) 100%)',
              pointerEvents: 'none',
              borderTopLeftRadius: theme.spacing(3),
              borderTopRightRadius: theme.spacing(3),
              zIndex: 1,
            },
            // (Logo overlay intentionally removed per design)
            '& a .inner': {
              padding: theme.spacing(2, 2.5),
              minHeight: 120,
            },
            '& a .title': {
              color: '#222',
              fontWeight: 800,
              textTransform: 'uppercase',
              marginTop: theme.spacing(1),
              letterSpacing: 0.3,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            },
            '& a .date': {
              marginTop: theme.spacing(1),
              color: '#7a7a7a',
              display: 'block',
              background: 'transparent',
              padding: 0,
              borderRadius: 0,
              fontWeight: 500,
            },
          },
        },
      },
    },
  // Arrow styles for thumbnail: closer to cards and no background
  '& .slick-arrow': {
    display: 'flex',
    position: 'absolute',
    top: '50%',
    zIndex: 10,
    width: 'auto',
    height: 'auto',
    background: 'transparent',
    boxShadow: 'none',
    transform: 'translateY(-50%)',
  },
  '& .slick-arrow.prev': {
  // Move slightly further left for symmetry with the right arrow
  left: theme.spacing(-1),
  transform: 'translateY(-50%) rotate(180deg)',
  },
  '& .slick-arrow.next': {
    right: theme.spacing(1),
  },
  },
  '&:not(.thumb) .slick-arrow': {
    position: 'absolute',
    top: '50%',
    zIndex: 9,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
    cursor: 'pointer',
    background: '#D2B690',
    boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
    width: theme.spacing(7),
    height: theme.spacing(7),
    transform: 'translateY(-50%)',
    '& .MuiSvgIcon-root': {
      width: theme.spacing(4),
      height: theme.spacing(4),
      color: '#fff',
    },
    '&.next': {
      right: theme.spacing(-1.5),
    },
    '&.prev': {
      left: theme.spacing(-1.5),
      transform: 'translateY(-50%) rotate(180deg)',
    },
  },
  '& .slick-slider': {
    overflow: 'hidden',
    '& .slick-list': {
      '& .slick-track': {
        display: 'flex',
        overflow: 'hidden',
        '& .slick-slide': {
          '& .items': {
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          },
        },
      },
    },
  },
  '&.back-button': {
    '& .slick-arrow': {
      position: 'relative',
      marginRight: theme.spacing(2),
      transform: `translate(0, 0) rotate(180deg)`,
    },
  },
}));