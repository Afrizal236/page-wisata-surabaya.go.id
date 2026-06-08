import { PaletteMode, createTheme } from '@mui/material';
import { grey } from '@mui/material/colors';

export const fontSize = 16;
export const lineHeight = 1.4;
export const heightHeader = 90;
export const borderRadius = 2;
export const boxShadow = `0 0 20px 20px rgba(0, 0, 0, 0.07)`;
export const boxShadow2 = `0 0 20px 20px ${grey[300]}`;

const theme = createTheme();
const lightColor1 = '#D2B690';
export const yellowColor = '#fdd300';
export const greenSurabaya = '#006462';

export const iconSurabaya = (sizeIcon: number) => ({
  backgroundColor: greenSurabaya,
  width: sizeIcon + 16,
  height: sizeIcon + 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  margin: theme.spacing(1, 1.5, 0, 0),
  overflow: 'hidden',
  '& .wrapper-svg': {
    width: sizeIcon,
    height: sizeIcon,
    '& svg path': {
      fill: theme.palette.common.white,
    },
  }, 
});

const getDesign = (mode: PaletteMode, negative: boolean) => ({
  palette: {
    mode,
    ...(mode == 'light' ? {
      primary: {
        main: lightColor1,
      },
      secondary: {
        main: yellowColor,
      },
      tertiary: {
        main: '#fff',
        },
      text: {
        primary: '#ffffff',
        secondary: '#454444ff',
        tertiary: '#006462',
      },
      divider : '#eaeaea',
      background: {
        paper: greenSurabaya,
        default: '#fff',
      },
      grey: {
        A100: '#eef2f9',
        A200: '#ffffffc1',
      },
    } : {
      primary: {
        main: negative ? '#3b3d4d' : lightColor1,
      },
      secondary: {
        main: negative ? '#191725' : yellowColor,
      },
      text: {
        primary: negative ? yellowColor : '#ffffff',
        secondary: negative ? yellowColor : '#454444ff',
      },
      divider : '#3b3d4d',
      background: {
        paper: '#003937',
        // backgroundImage: 'url(/images/bg-landing-sby.svg)',
      },
      grey: {
        A100: '#003937',
      },
      common: negative ? {
        white: yellowColor,
        black: yellowColor,
      } : {},
    }),
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1152,
      xl: 1536,
    },
  },
  typography: {
    body1: negative ? {
      fontSize,
      color: `${yellowColor} !important`,
    } : {
      fontSize,
    },
    fontFamily: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
      'Apple Color Emoji',
      'Segoe UI Emoji',
      'Segoe UI Symbol',
    ].join(','),
  },
});

export default getDesign;