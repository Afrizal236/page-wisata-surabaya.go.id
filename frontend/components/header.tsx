import React, { memo } from 'react'
import { Box, AppBar, useScrollTrigger, Slide, Toolbar } from '@mui/material'
import Link from 'next/link'
import { orderBy } from 'lodash'
import { useRouter } from 'next/router'
import { styled } from '@mui/material/styles'
import { useQuery } from '@tanstack/react-query'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { heightHeader } from 'styles/theme'
import { fontSize } from 'styles/theme'
import { BreakpointsContext } from 'contexts/breakpoints'
import ButtonMode from 'components/button.mode'
import { AccessibilityContext } from 'contexts/accessibility'
import HeaderDialog from 'components/header.dialog'
import BottomNav from 'components/bottomNav'
import useTextToSpeech from 'hooks/useTextToSpeech'
import schema from 'types/schemas'

export interface Menu {
  id?: number
  title: string
  url: string
  level?: number
  icon?: string
  child: Menu[]
}

interface Props {
  window?: () => Window
  opacity: number
  children?: React.ReactElement
}

function HideOnScroll(props: Props) {
  const { children, window } = props
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  })
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  )
}

export const Logo = React.memo(() => {
  const router = useRouter()
  const { downSm } = React.useContext(BreakpointsContext)
  const accessibility = React.useContext(AccessibilityContext)
  return (
    <Box
      display="flex"
      alignItems="center"
      onClick={() => router.push('/')}
      sx={{
        cursor: 'pointer',
        filter: `grayscale(${accessibility.css.grayscale ? '100%' : '0'})`,
        padding: '4px 8px',
        borderRadius: '8px',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)',
        },
      }}
    >
      <img 
        src={`/images/logo/logo-navbar.svg`} 
        height={36} 
        style={{
          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))'
        }}
      />
    </Box>
  )
})

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'rgba(22, 22, 22, 0.55)',
  backdropFilter: 'blur(10px)',
  borderRadius: '999px',
  margin: theme.spacing(4, 'auto'), // Auto margin untuk center horizontal
  width: '90%', // Lebar 80%
  left: '50%', // Posisi dari kiri 50%
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  top: theme.spacing(3), // Ubah nilai ini untuk menurunkan navbar
}))

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  '& a': {
    margin: theme.spacing(0, 1.5),
    textDecoration: 'none',
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: 600,
    textTransform: 'uppercase',
    padding: theme.spacing(0.5, 1),
    display: 'flex',
    alignItems: 'center',
    borderRadius: '8px',
    transition: 'all 0.2s ease-in-out',
    position: 'relative',
    '&:hover': {
      color: 'rgba(255, 255, 255, 1)',
      transform: 'translateY(-1px)',
    },
    '&.active': {
      color: 'rgba(255, 255, 255, 1)',
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: '-2px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '60%',
        height: '2px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '1px',
      },
    },
    [theme.breakpoints.down(theme.breakpoints.values.sm + 424)]: {
      // 1024
      margin: theme.spacing(0, 1),
      padding: theme.spacing(0.5, 1),
    },
    [theme.breakpoints.down('md')]: {
      margin: theme.spacing(0, 0.5),
      padding: theme.spacing(0.5),
    },
  },
  '&.negative': {
    // backgroundColor: theme.palette.background.paper,
    '& a': {
      color: theme.palette.text.primary,
      '&.active': {
        color: theme.palette.text.primary,
        '&::after': {
          // backgroundColor: theme.palette.secondary.main,
        },
      },
    },
  },
}))

const Header: React.FunctionComponent<Props> = (props: Props) => {
  const { opacity } = props
  const { data: contents } = useQuery<schema['schemas']['Organization']>(['contents'])
  const { downSm, downMd } = React.useContext(BreakpointsContext)
  const accessibility = React.useContext(AccessibilityContext)
  const { textToSpeech } = useTextToSpeech()
  const menu = React.useMemo(() => contents?.menu || [], [contents])
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState(null)
  const [menuSelected, setMenuSelected] = React.useState([])
  const handleClickMenu = React.useCallback(
    (e: any, i: number) => {
      e.preventDefault()
      setOpen(true)
      setSelected(i)
      setMenuSelected(orderBy(menu[i]['child'], ['order', 'asc']))
    },
    [menu, selected]
  )
  const handleClose = React.useCallback(() => {
    setOpen(false)
    setSelected(null)
  }, [])
  // Dynamic font size for menu links, default 13px
  const menuFontSize = `${13 + accessibility.fontSize}px`;
  return (
    <>
      <HideOnScroll {...props}>
        <AppBarStyled
          elevation={0}
          sx={{
            filter: `grayscale(${accessibility.css.grayscale ? '100%' : '0'})`,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1100,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            paddingLeft={downMd ? 2 : 3}
            paddingRight={downMd ? 2 : 3}
            sx={{
              opacity,
              width: '100%',
              minHeight: 60,
              background: 'transparent',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 160 }}>
              <Logo />
            </Box>
            {!downSm ? (
              <StyledToolbar
                className={accessibility.css.negative ? 'negative' : ''}
                sx={{
                  flex: 1,
                  justifyContent: 'center',
                  minHeight: 60,
                  '& a': {
                    fontSize: menuFontSize,
                    fontWeight: 600,
                    letterSpacing: 0.5,
                    margin: '0 8px',
                  },
                }}
              >
                {menu.map((v: any, i: number) => (
                  <Link
                    key={i}
                    href={v.url}
                    onClick={(e) => handleClickMenu(e, i)}
                    className={selected == i ? 'active' : ''}
                    style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <span onMouseEnter={(e) => textToSpeech(e, true)}>{v.title}</span>
                    <ExpandMoreIcon fontSize="medium" />
                  </Link>
                ))}
                <Box sx={{ marginLeft: 2 }}>
                  <ButtonMode />
                </Box>
              </StyledToolbar>
            ) : (
              <ButtonMode />
            )}
          </Box>
        </AppBarStyled>
      </HideOnScroll>
      {menu.length > 0 && <HeaderDialog menu={menuSelected} open={open} onClose={handleClose} />}
      {downSm && <BottomNav selected={selected} onClick={handleClickMenu} onClose={handleClose} />}
    </>
  )
}

Header.defaultProps = {}

export default memo(Header)
