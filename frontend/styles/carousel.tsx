import {
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { borderRadius } from 'styles/theme';

const paddingItems = 3;

export const StyledBox = styled(Box)(({ theme }) => ({
  position: 'relative',
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
  '&.small': {
    margin: theme.spacing(3, 0, 3, paddingItems),
    '& .slick-slider': {
      '& .slick-list': {
        marginLeft: theme.spacing(-paddingItems),
        '& .slick-track': {
          '& .slick-slide': {
            margin: theme.spacing(3, 0, 3, paddingItems),
            '& a': {
              display: 'block',
              textDecoration: 'none',
              '& .items': {
                padding: theme.spacing(6, 3, 5),
                border: `1px solid ${theme.palette.primary.main}`,
                borderRadius: theme.spacing(borderRadius),
                '& img': {
                  width: '80%',
                  maxHeight: 160,
                  display: 'block',
                },
                '& .MuiTypography-root': {
                  fontWeight: 800,
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  margin: theme.spacing(2, 0),
                  color: theme.palette.primary.main,
                },
              },
            },
          },
        },
      },
    },
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(3, paddingItems),
    },
  },
  '&.photo': {
    '& .slick-arrow': {
      top: '50%',
      '&.next': {
        right: 10,
        transform: 'translate(0, -50%)',
      },
      '&.prev': {
        left: 10,
        transform: 'translate(0, -50%) rotate(180deg)',
      },
    },
    '& .slick-slider': {
      '& .slick-list': {
        borderRadius: theme.spacing(borderRadius),
        overflow: 'hidden',      
        '& .slick-track': {
          display: 'block',
          '& .slick-slide': {
            float: 'left',
            overflow: 'hidden',      
            '& img': {
              borderRadius: theme.spacing(borderRadius),
              width: '100%',
            },
          },
        },
      },
    },
  },
  '&.content': {
    '& .slick-slider': {
      '& .slick-list': {
        overflow: 'hidden',
        marginLeft: theme.spacing(-2),
        '& .slick-track': {
          '& .slick-slide': {
            margin: theme.spacing(0, 0, 0, 2),
            '& .items': {},
          },
        },
      },
    },
  },
  '& .slick-arrow': {
    position: 'absolute',
    top: '50%',
    zIndex: 9,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
    cursor: 'pointer',
    '& .MuiSvgIcon-root': {
      width: theme.spacing(4),
      height: theme.spacing(4),
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