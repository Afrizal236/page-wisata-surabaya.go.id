import React, { memo } from 'react';
import {
  Button,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import _ from 'lodash';
import AccessibleIcon from '@mui/icons-material/Accessible';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import FilterBAndWIcon from '@mui/icons-material/FilterBAndW';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import RestoreIcon from '@mui/icons-material/Restore';
import LinkIcon from '@mui/icons-material/Link';
// import { BreakpointsContext } from 'contexts/breakpoints';
import { AccessibilityContext } from 'contexts/accessibility';
import { ColorModeContext } from 'contexts/colorMode';
import { boxShadow, fontSize, heightHeader, yellowColor } from 'styles/theme';
import useTextToSpeech from 'hooks/useTextToSpeech';
import { defaultCss } from 'hooks/useAccessibility';

interface Props {};

const BoxStyled = styled(Box)(({ theme }) => ({
  position: 'fixed',
  left: '100%',
  top: heightHeader + 20,
  zIndex: 9999,
  boxShadow,
  transition: '0.2s ease-in-out',
  minWidth: theme.spacing(28),
  '&.active': {
    transform:'translateX(-100%)',
  },
  '& .inner': {
    position: 'relative',
    '& .icon-button': {
      position: 'absolute',
      right: '100%',
      top: 0,
      borderRadius: 0,
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.background.paper,
      boxShadow,
      padding: theme.spacing(1),
      minWidth: 'auto',
      '&.negative': {
        backgroundColor: theme.palette.common.white,
      },
      '& svg.MuiSvgIcon-root': {
        width: theme.spacing(5),
        height: theme.spacing(5),
      },
    },
    '& .MuiTypography-root': {
      whiteSpace: 'nowrap',
      '&.title': {
        fontWeight: 700,
        fontSize: fontSize + 1,
        padding: theme.spacing(2, 3),
      },
    },
    '& ul.MuiList-root': {
      paddingTop: 0,
      paddingBottom: theme.spacing(2),
      '& li.MuiListItem-root': {
        '& .MuiListItemButton-root': {
          padding: theme.spacing(0.3, 3),
          '& .MuiListItemIcon-root': {
            minWidth: 'auto',
            marginRight: theme.spacing(1),
            '& svg.MuiSvgIcon-root': {
              width: theme.spacing(2.5),
              height: theme.spacing(2.5),
            },
          },
        },
      },
    },
  },
  [theme.breakpoints.down('sm')]: {
    top: heightHeader,
    '& .inner': {
      '& .icon-button': {
        '& svg.MuiSvgIcon-root': {
          width: theme.spacing(3.5),
          height: theme.spacing(3.5),
        },
      },
    },  
  },
}));

const max_accessibility = 5;

const Accessibility: React.FunctionComponent<Props> = () => {
  // const { downSm } = React.useContext(BreakpointsContext);
  const accessibility = React.useContext(AccessibilityContext);
  const { mode, setColorMode } = React.useContext(ColorModeContext);
  const { textToSpeech } = useTextToSpeech();
  const [ open, setOpen ] = React.useState(false);
  const openAccessibility = React.useCallback(() => setOpen(!open), [open]);
  const maxIncrease = React.useMemo(() => accessibility.fontSize == max_accessibility, [accessibility.fontSize]);
  const minIncrease = React.useMemo(() => accessibility.fontSize == 0, [accessibility.fontSize]);
  const setFontSize = React.useCallback((increase: boolean) => {
    if (increase && accessibility.fontSize < max_accessibility) {
      accessibility.setFontSize(accessibility.fontSize + 1);
    };
    if (!increase && accessibility.fontSize > 0) {
      accessibility.setFontSize(accessibility.fontSize - 1);
    };
  }, [accessibility.fontSize]);
  const setCss = React.useCallback((key: 'grayscale' | 'underline' | 'negative') => {
    accessibility.setCss({
      ...accessibility.css,
      [key]: !accessibility.css[key],
    });
    if (key == 'negative' && !accessibility.css.negative) {
      setColorMode('dark');
    };
  }, [accessibility.css]);
  const colorSelected = React.useMemo(() => accessibility.css.negative ? yellowColor : mode == 'light' ? 'primary.main' : 'secondary.main', [accessibility.css, mode]);
  const resetAccessibility = React.useCallback(() => {
    accessibility.setCss(defaultCss);
    accessibility.setFontSize(0);
    accessibility.setSpeech(false);
    setColorMode('light');
  }, []);
  return (
    <BoxStyled
      className={open ? 'active' : ''}
      sx={{
        backgroundColor: 'background.paper',
        filter: `grayscale(${accessibility.css.grayscale ? '100%' : '0'})`,
      }}
      >
        <Box className="inner">
          <Button className={`icon-button ${accessibility.css.negative ? 'negative' : ''}`} onClick={openAccessibility}>
            <AccessibleIcon />
          </Button>
          <Typography className="title" onMouseEnter={(e) => textToSpeech(e, true)}>Accessibility Tools</Typography>
          <Box>
            <List>
              <ListItem disablePadding>
                <ListItemButton
                  disabled={maxIncrease}
                  onClick={() => setFontSize(true)}
                >
                  <ListItemIcon>
                    <ZoomInIcon />
                  </ListItemIcon>
                  <ListItemText onMouseEnter={(e) => textToSpeech(e, true)} primary="Increase Text" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  disabled={minIncrease}
                  onClick={() => setFontSize(false)}
                >
                  <ListItemIcon>
                    <ZoomOutIcon />
                  </ListItemIcon>
                  <ListItemText onMouseEnter={(e) => textToSpeech(e, true)} primary="Decrease Text" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => setCss('grayscale')}
                  sx={accessibility.css.grayscale ? {
                    '& .MuiTypography-root': {
                      fontWeight: 700,
                      color: colorSelected,
                    },
                    '& svg': {
                      color: colorSelected,
                    },
                  } : null}
                >
                  <ListItemIcon>
                    <FilterBAndWIcon />
                  </ListItemIcon>
                  <ListItemText onMouseEnter={(e) => textToSpeech(e, true)} primary="Grayscale"/>
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => setCss('negative')}
                  sx={accessibility.css.negative ? {
                    '& .MuiTypography-root': {
                      fontWeight: 700,
                      color: colorSelected,
                    },
                    '& svg': {
                      color: colorSelected,
                    },
                  } : null}
                >
                  <ListItemIcon>
                    <VisibilityIcon />
                  </ListItemIcon>
                  <ListItemText onMouseEnter={(e) => textToSpeech(e, true)} primary="Negative Contrast" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => setCss('underline')}
                  sx={accessibility.css.underline ? {
                    '& .MuiTypography-root': {
                      fontWeight: 700,
                      color: colorSelected,
                    },
                    '& svg': {
                      color: colorSelected,
                    },
                  } : null}
                >
                  <ListItemIcon>
                    <LinkIcon />
                  </ListItemIcon>
                  <ListItemText onMouseEnter={(e) => textToSpeech(e, true)} primary="Links Underline" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => accessibility.setSpeech(!accessibility.speech)}
                  sx={accessibility.speech ? {
                    '& .MuiTypography-root': {
                      fontWeight: 700,
                      color: colorSelected,
                    },
                    '& svg': {
                      color: colorSelected,
                    },
                  } : null}
                >
                  <ListItemIcon>
                    <RecordVoiceOverIcon />
                  </ListItemIcon>
                  <ListItemText onMouseEnter={(e) => textToSpeech(e, true)} primary="Text to Speech" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={resetAccessibility}>
                  <ListItemIcon>
                    <RestoreIcon />
                  </ListItemIcon>
                  <ListItemText onMouseEnter={(e) => textToSpeech(e, true)} primary="Reset" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Box>
    </BoxStyled>
  );
};

Accessibility.defaultProps = {};

export default memo(Accessibility);