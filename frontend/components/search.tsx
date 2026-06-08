import React, { memo } from 'react'
import { Input, Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useRouter } from 'next/router'
import { fontSize } from 'styles/theme'
import SearchIcon from 'public/images/icon/search_2.svg'
import { AccessibilityContext } from 'contexts/accessibility'

interface Props {
  isFooter?: boolean
}

const heightAfter = 24
const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  borderRadius: theme.spacing(5),
  display: 'flex',
  width: '100%',
}))

const StyledInput = styled(Input)(({ theme }) => ({
  padding: 0,
  marginBottom: -heightAfter,
  position: 'relative',
  '&:before, &:after': {
    display: 'none',
  },
  '& .wrapper-svg': {
    transform: 'translate(calc(-100% + -5px), calc(-50% + 3px))',
    position: 'absolute',
    left: 0,
    top: '50%',
    '& svg': {
      '& path': {
        fill: `${theme.palette.common.white} !important`,
      },
    },
  },
  '&.negative': {
    '& .wrapper-svg': {
      '& svg': {
        '& path': {
          fill: `${theme.palette.common.white} !important`,
        },
      },
    },
  },
  '& input': {
    color: theme.palette.common.white,
    fontWeight: 200,
    padding: 0,
    '&::placeholder': {
      color: theme.palette.common.white,
      opacity: 1,
    },
  },
}))

const Search: React.FunctionComponent<Props> = ({ isFooter }: Props) => {
  const router = useRouter()
  const accessibility = React.useContext(AccessibilityContext)
  const [text, setText] = React.useState('Apa yang sedang anda cari?')
  const iconSearch = React.useMemo(() => {
    return (
      <Box
        className="wrapper-svg"
        sx={{
          '& svg': {
            height: fontSize + 2,
          },
        }}
      >
        <SearchIcon />
      </Box>
    )
  }, [])
  const handleChange = React.useCallback((e: any) => {
    const value = e.target.value
    setText(value)
    if (e.key === 'Enter') {
      console.log('do validate')
      router.push(
        `/id/berita?page=1${value ? `&q=${value}` : ''}`,
        `/id/berita?page=1${value ? `&q=${value}` : ''}`
      )
    }
  }, [])
  return (
    <StyledBox
      sx={{
        paddingTop: isFooter ? 1.2 : 1.7,
        paddingBottom: isFooter ? 1.5 : 2,
        paddingLeft: isFooter ? 6 : 8,
        paddingRight: isFooter ? 3 : 5,
        justifyContent: isFooter ? 'flex-start' : 'center',
        maxWidth: isFooter ? 280 : 440,
      }}
    >
      <Box
        sx={{
          display: 'inline-grid',
          '&:after': {
            content: `'${text}'`,
            visibility: 'hidden',
            whiteSpace: 'pre-wrap',
            height: heightAfter,
            paddingLeft: 3,
          },
        }}
      >
        <StyledInput
          fullWidth
          className={accessibility.css.negative ? 'negative' : ''}
          autoComplete="off"
          placeholder="Apa yang sedang anda cari?"
          startAdornment={iconSearch}
          inputProps={{
            size: 9,
            sx: {
              fontSize: fontSize + accessibility.fontSize + (isFooter ? 0 : 1),
            },
          }}
          onKeyDown={handleChange}
        />
      </Box>
    </StyledBox>
  )
}

Search.defaultProps = {
  isFooter: false,
}

export default memo(Search)
