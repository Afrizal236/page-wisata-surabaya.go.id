import React, { memo } from 'react'
import { Box, BottomNavigation, BottomNavigationAction } from '@mui/material'
import { fontSize } from 'styles/theme'
import { styled } from '@mui/material/styles'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import BerandaIcon from 'public/images/icon/mobile/beranda.svg'
import InformasiIcon from 'public/images/icon/mobile/informasi_publik.svg'
import LayananIcon from 'public/images/icon/mobile/layanan_publik.svg'
import SurabayaIcon from 'public/images/icon/mobile/surabaya.svg'
import schema from 'types/schemas'

interface Props {
  selected: number
  onClick: (e: any, i: number) => any
  onClose: () => any
}

const StyledBox = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  width: '100%',
  zIndex: 99999,
  '& .MuiBottomNavigation-root': {
    height: 'auto',
    '& .MuiButtonBase-root': {
      position: 'relative',
      minWidth: 50,
      paddingLeft: 3,
      paddingRight: 3,
      paddingTop: 10,
      paddingBottom: 10,
      '& .MuiBottomNavigationAction-label': {
        fontWeight: 600,
        color: theme.palette.primary.main,
        paddingTop: 6,
        opacity: 1,
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        width: '100%',
        overflow: 'hidden',
        fontSize: fontSize - 8,
      },
      '& .wrapper-bottom-icon': {
        transform: 'translateY(2px)',
        '& svg path': {
          fill: theme.palette.primary.main,
        },
      },
      '&.Mui-selected': {
        backgroundColor: theme.palette.primary.main,
        '& .MuiBottomNavigationAction-label': {
          color: theme.palette.common.white,
        },
        '& .wrapper-bottom-icon': {
          '& svg path': {
            fill: theme.palette.common.white,
          },
        },
      },
    },
  },
}))

const IconMenu = React.memo(({ index }: { index: number }) => {
  return (
    <Box
      className="wrapper-bottom-icon"
      sx={{
        '& svg': {
          height: 24,
        },
      }}
    >
      {index === 0 ? (
        <BerandaIcon />
      ) : index === 1 ? (
        <SurabayaIcon />
      ) : index === 2 ? (
        <LayananIcon />
      ) : (
        <InformasiIcon />
      )}
    </Box>
  )
})

const BottomNav: React.FunctionComponent<Props> = ({ selected, onClick, onClose }: Props) => {
  const router = useRouter()
  const { data: contents } = useQuery<schema['schemas']['Organization']>(['contents'])
  const menu = React.useMemo(() => contents?.menu || [], [contents])

  const backHome = React.useCallback(() => {
    onClose()
    router.push('/', '/')
  }, [])
  return (
    <StyledBox>
      <BottomNavigation showLabels value={selected != null ? selected + 1 : selected}>
        <BottomNavigationAction
          label={`Beranda`}
          icon={<IconMenu index={0} />}
          onClick={backHome}
        />
        {menu.map((v, i: number) => (
          <BottomNavigationAction
            key={i}
            label={v.title}
            icon={<IconMenu index={i + 1} />}
            onClick={(e) => onClick(e, i)}
          />
        ))}
      </BottomNavigation>
    </StyledBox>
  )
}

export default memo(BottomNav)
