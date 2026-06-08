import React, { memo } from 'react'
import { Dialog, DialogContent, Box, Grid, IconButton } from '@mui/material'
import _ from 'lodash'
import { styled } from '@mui/material/styles'
import { fontSize, heightHeader } from 'styles/theme'
import HeaderButton from 'components/header.button'
import SearchIcon from 'public/images/icon/close.svg'
import { Menu as MenuType } from 'components/header'
import { BreakpointsContext } from 'contexts/breakpoints'
import { ColorModeContext } from 'contexts/colorMode'
import { AccessibilityContext } from 'contexts/accessibility'

interface Props {
  menu: MenuType[]
  open: boolean
  onClose: () => any
}

const StyledBox = styled(Box)(({ theme }) => ({
  maxWidth: 860,
  margin: `0 auto`,
  padding: theme.spacing(3),
  '& a.MuiButton-root': {
    textDecoration: 'none',
    display: 'block',
    backgroundColor: 'rgba(22, 22, 22, 0)',
    color: theme.palette.text.primary,
    textTransform: 'uppercase',
    width: '100%',
    margin: theme.spacing(1, 0),
    padding: theme.spacing(2, 5, 2, 8),
    textAlign: 'left',
    position: 'relative',
    fontWeight: 700,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    '&.active': {
          backgroundColor: 'rgba(22, 22, 22, 0.9)',
      color: theme.palette.secondary.main,
      '&:hover': {
            backgroundColor: 'rgba(22, 22, 22, 0.9)',
      },
    },
    '& .MuiButton-endIcon': {
      position: 'absolute',
      right: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      marginRight: theme.spacing(1),
      display: 'flex',
      alignItems: 'center',
      '& svg': {
        fontSize: 23,
      },
    },
    '& .MuiButton-startIcon': {
      position: 'absolute',
      left: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      marginLeft: theme.spacing(2.5),
      display: 'flex',
      alignItems: 'center',
      '& .wrapper-svg': {
        transform: 'translateY(5px)',
      },
    },
    '&:hover': {
       backgroundColor: 'rgba(22, 22, 22, 0.8)',
      transform: 'scale(1.03)',
      boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
      transition: 'all 0.2s cubic-bezier(.4,2,.3,1)',
      zIndex: 2,
    },
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0),
    margin: theme.spacing(5, 'auto', 0),
  },
}))

const StyledBoxSvg = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  height: theme.spacing(42),
  width: theme.spacing(42),
  transform: 'translate(0, 45%)',
  zIndex: -1,
  '& svg': {
    height: '100%',
    '& path': {
      stroke: `${theme.palette.secondary.main} !important`,
    },
  },
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}))

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    '& .MuiGrid-container': {
      overflowY: 'auto',
      maxHeight: '65vh',
      '& .MuiGrid-item': {
        '&.hidden': {
          opacity: 0,
          visibility: 'hidden',
          height: 0,
          display: 'none',
        },
      },
    },
  },
}))

const StyledBoxClose = styled(Box)(({ theme }) => ({
    backgroundColor: 'rgba(22, 22, 22, 0.55)',
  borderRadius: '50%',
  boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': {
    height: fontSize + 14,
    '& path': {
          backgroundColor: 'rgba(22, 22, 22, 0.9)',
    },
    '& circle': {
          backgroundColor: 'rgba(22, 22, 22, 0.9)',
    },
  },
}))

const HeaderDialog: React.FunctionComponent<Props> = ({ menu, open, onClose }: Props) => {
  const { downSm } = React.useContext(BreakpointsContext)
  const { mode } = React.useContext(ColorModeContext)
  const accessibility = React.useContext(AccessibilityContext)
  const [child, setChild] = React.useState([])
  const [selected, setSelected] = React.useState(null)
  const handleClick = React.useCallback(
    (i: number) => {
      const chidrenLength = menu[i]['child'] ? menu[i]['child'].length : 0
      if (!chidrenLength) {
        onClose()
      } else {
        setChild(_.orderBy(menu[i]['child'], ['order', 'asc']))
        setSelected(i)
      }
    },
    [menu]
  )
  const handleClose = React.useCallback((backToParent: boolean) => {
    if (!backToParent) {
      onClose()
    }
    setChild([])
    setSelected(null)
  }, [])
  const closeButtonMemoized = React.useMemo(() => {
    return (
      <IconButton
        color="primary"
        onClick={() => handleClose(child.length > 0 && downSm ? true : false)}
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          boxShadow: 5,
          padding: 0,
          '& .wrapper-svg': {
            width: '100%',
            height: fontSize + 14,
            overflow: 'hidden',
          },
          '& .MuiTouchRipple-root': {
            top: -5,
            right: -5,
            bottom: -5,
            left: -5,
          },
        }}
      >
        <StyledBoxClose className="wrapper-svg">
          <SearchIcon />
        </StyledBoxClose>
      </IconButton>
    )
  }, [child, mode])
  return (
    <Dialog
      open={open}
      onClose={() => handleClose(false)}
      scroll="body"
      maxWidth="lg"
      fullWidth
      fullScreen={downSm ? true : false}
      PaperProps={{
        sx: {
          position: 'relative',
          overflow: 'hidden',
          borderRadius: downSm ? 0 : 2,
          backgroundColor: 'rgba(22, 22, 22, 0.55)',
          backgroundImage: 'none',
          minHeight: `calc(100% - ${(downSm ? 70 : heightHeader) * 2}px)`,
          transform: `translateY(${downSm ? 0 : downSm ? 70 : heightHeader}px)`,
          marginBottom: `${(downSm ? 70 : heightHeader) + 24}px`,
          verticalAlign: 'top',
          filter: `grayscale(${accessibility.css.grayscale ? '100%' : '0'})`,
        },
      }}
      BackdropProps={{
        invisible: true,
      }}
    >
      <StyledDialogContent>
        {closeButtonMemoized}
        <StyledBox
          sx={{
            '& a.MuiButton-root': {
              fontSize: fontSize - 2 + accessibility.fontSize,
            },
          }}
        >
          <Grid container spacing={downSm ? 0 : 2}>
            <Grid item xs={12} sm={6} className={child.length > 0 ? 'hidden' : ''}>
              {menu.map((v: any, i: number) => (
                <HeaderButton
                  key={i}
                  title={v.title}
                  url={v.url}
                  icon={v.icon ? v.icon : `${_.snakeCase(v.title)}.svg`}
                  index={i}
                  isSelected={!v.child ? false : v.child.length > 0 && i == selected ? true : false}
                  onClick={handleClick}
                  withChevron={!v.child ? false : v.child.length > 0 ? true : false}
                />
              ))}
            </Grid>
            <Grid item xs={12} sm={6}>
              {child.map((v: any, i: number) => (
                <HeaderButton
                  key={i}
                  title={v.title}
                  url={v.url}
                  icon={v.icon ? v.icon : `${_.snakeCase(v.title)}.svg`}
                  index={i}
                  withChevron={false}
                  onClick={() => handleClose(false)}
                />
              ))}
            </Grid>
          </Grid>
        </StyledBox>
      </StyledDialogContent>
      {/* <StyledBoxSvg className="wrapper-svg2">
        <Element4 />
      </StyledBoxSvg> */}
    </Dialog>
  )
}

HeaderDialog.defaultProps = {}

export default memo(HeaderDialog)
